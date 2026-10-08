import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebaseAppletConfig from '../../firebase-applet-config.json';

export const isCustomProject = Boolean(import.meta.env.VITE_FIREBASE_PROJECT_ID);

const rawDatabaseId = import.meta.env.VITE_FIREBASE_DATABASE_ID;
const databaseId = rawDatabaseId 
  ? rawDatabaseId 
  : (isCustomProject ? undefined : firebaseAppletConfig.firestoreDatabaseId);

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || firebaseAppletConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || firebaseAppletConfig.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || firebaseAppletConfig.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || firebaseAppletConfig.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseAppletConfig.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || firebaseAppletConfig.appId,
  firestoreDatabaseId: databaseId,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

export let isDatabaseMissing = false;
const dbListeners = new Set<(missing: boolean) => void>();

export function subscribeDatabaseStatus(listener: (missing: boolean) => void) {
  dbListeners.add(listener);
  listener(isDatabaseMissing);
  return () => {
    dbListeners.delete(listener);
  };
}

function markDatabaseMissing() {
  if (!isDatabaseMissing) {
    isDatabaseMissing = true;
    dbListeners.forEach((l) => l(true));
  }
}

export let isPermissionDenied = false;
const permListeners = new Set<(denied: boolean) => void>();

export function subscribePermissionStatus(listener: (denied: boolean) => void) {
  permListeners.add(listener);
  listener(isPermissionDenied);
  return () => {
    permListeners.delete(listener);
  };
}

export function markPermissionDenied() {
  if (!isPermissionDenied) {
    isPermissionDenied = true;
    permListeners.forEach((l) => l(true));
  }
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errMsg = error instanceof Error ? error.message : String(error);
  
  // Gracefully handle database not created yet in Firebase Console
  if (errMsg.includes('(default)') || errMsg.includes('not found') || errMsg.includes('Database')) {
    markDatabaseMissing();
    console.warn(`[Firestore Notice] Database not yet created on project "${firebaseConfig.projectId}". Create database in Firebase Console to enable persistent live sync.`);
    return;
  }

  // Gracefully handle permission denied rules in Firebase Console
  if (errMsg.toLowerCase().includes('permission') || errMsg.toLowerCase().includes('insufficient')) {
    markPermissionDenied();
  }

  const errInfo: FirestoreErrorInfo = {
    error: errMsg,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  };
  console.warn('Firestore Operation Notice: ', JSON.stringify(errInfo));
}
