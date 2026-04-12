// import React from 'react';
// import { motion } from 'motion/react';

// export const Process = () => {
//   const processSteps = [
//     { title: 'Consultation', desc: 'We start with a personalized consultation to understand your unique style, preferences, and beauty goals.' },
//     { title: 'Customization', desc: 'Based on our consultation, I create a tailored beauty plan that highlights your natural features and enhances your confidence.' },
//     { title: 'Experience', desc: 'On the day of your event, I provide a luxurious and relaxing beauty experience, ensuring you look and feel your best.' },
//     { title: 'Aftercare', desc: 'I offer personalized aftercare tips and support to help you maintain your stunning look long after the event.' }
//   ];

//   return (
//     <section className="py-32 bg-luxury-cream/50">
//       <div className="max-w-7xl mx-auto px-6">
//         <div className="text-center mb-24 space-y-4">
//           <p className="text-luxury-gold text-xs tracking-[0.4em] uppercase">The Journey</p>
//           <h2 className="text-5xl font-serif italic">Our Signature Process</h2>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
//           {processSteps.map((step, i) => (
//             <motion.div 
//               key={i}
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ delay: i * 0.1 }}
//               className="relative group text-center sm:text-left"
//             >
//               <div className="text-7xl sm:text-8xl font-serif italic text-luxury-gold/10 absolute -top-8 sm:-top-12 left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0 group-hover:text-luxury-gold/20 transition-colors">
//                 0{i + 1}
//               </div>
//               <div className="relative z-10 space-y-4">
//                 <h3 className="text-xl font-serif italic pt-4">{step.title}</h3>
//                 <p className="text-sm text-luxury-ink/60 leading-relaxed font-light">
//                   {step.desc}
//                 </p>
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };
