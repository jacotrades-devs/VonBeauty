import React from 'react';
import { Star } from 'lucide-react';

export const Testimonials = () => {
  const testimonials = [
    {
      quote: "Gooodmorningggg mother thankyouu sa makeup sobrang ganda talga 🥹🤍, Sana pag ikakasal akoo nag mamakeup kapa wahahaha... Congrats pala mom",
      author: "Sheela Reniedo",
      role: "Client",
      image: "https://i.pinimg.com/736x/df/93/58/df935859be8accbcc15d559365d55570.jpg"
    },
    {
      quote: "Hello sir. Just wanted to thank you for the amazing make up yesterday. Ang fresh tignan. Dami rin po nakaappreciate ng look ko kahapon. Thank you po ulit 🥰",
      author: "Client",
      role: "Private Client",
      image: "https://i.pinimg.com/736x/df/93/58/df935859be8accbcc15d559365d55570.jpg"
    },
    {
      quote: "Ate wil, thank you pati sa anak u very satisfied ang gawa nya pati si dainnielle nagandahan ❤️. Sa Graduation daw ulit pa make up ulit kay kuya von niya 😊 sabi nya saken mama magpabook kana kay kuya von for graduation, Thank you again ate will ❤️",
      author: "Elena Wright",
      role: "Client",
      image: "https://i.pinimg.com/736x/df/93/58/df935859be8accbcc15d559365d55570.jpg"
    }
  ];

  return (
    <section id="testimonials" className="py-32 bg-white overflow-hidden">
      <div className="text-center mb-24 px-6">
        <Star className="text-luxury-gold mx-auto mb-6" size={32} fill="currentColor" />
        <h2 className="text-5xl font-serif italic">Trusted by Clients</h2>
      </div>

      <div className="relative overflow-hidden">
        <div className="marquee-track gap-8 px-4">
          {[...testimonials, ...testimonials].map((t, i) => (
            <div 
              key={i}
              className="w-[300px] sm:w-[400px] md:w-[450px] bg-luxury-cream/30 p-6 sm:p-10 rounded-3xl border border-luxury-ink/5 flex flex-col justify-between"
            >
              <div className="space-y-6 sm:space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-luxury-gold/20">
                    <img 
                      src={t.image} 
                      className="w-full h-full object-cover" 
                      alt={t.author}
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm tracking-[0.2em] uppercase font-semibold text-luxury-ink">{t.author}</p>
                    <p className="text-[9px] sm:text-[10px] tracking-widest uppercase text-luxury-gold mt-1">{t.role}</p>
                  </div>
                </div>
                <p className="text-lg sm:text-xl font-serif italic leading-relaxed text-luxury-ink/80">
                  "{t.quote}"
                </p>
              </div>
              <div className="mt-6 sm:mt-8 flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={10} className="text-luxury-gold" fill="currentColor" />
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {/* Gradient Overlays for smooth fade */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
      </div>
    </section>
  );
};
