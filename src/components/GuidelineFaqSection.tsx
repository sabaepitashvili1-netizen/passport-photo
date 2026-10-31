import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, Check, AlertCircle } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
  tag: string;
}

const FAQS: FaqItem[] = [
  {
    question: 'What clothing should I wear for my passport photo?',
    answer: 'Wear normal everyday clothing or smart-casual attire with a dark or distinct collar (e.g., navy blue, black, charcoal, or deep jewel tones) that contrasts sharply against the white background. Avoid white or light cream shirts as they blend into the background. Uniforms, camouflage patterns, and military attire are strictly prohibited by government regulations.',
    tag: 'Attire & Dress Code',
  },
  {
    question: 'Are eyeglasses allowed in passport and visa photos?',
    answer: 'No. The U.S. Department of State and the vast majority of international passport authorities (ICAO) banned eyeglasses in official passport photos in 2016. Even non-prescription glasses or anti-glare lenses are not permitted because reflections and frame rims interfere with airport automated e-Gate biometric scanners.',
    tag: 'Eyewear & Glare',
  },
  {
    question: 'Can I smile in my biometric photo?',
    answer: 'You should maintain a neutral facial expression with both eyes open, looking directly into the camera, and mouth closed. A natural, unexaggerated expression allows facial recognition algorithms to accurately measure the distance between your facial landmarks (eyes, nose, chin).',
    tag: 'Facial Expression',
  },
  {
    question: 'Are religious head coverings permitted (e.g. Hijab, Turban, Yarmulke)?',
    answer: 'Yes! Head coverings worn for religious or medical reasons are fully permitted. The covering must not obscure any portion of your face from the bottom of your chin to the top of your forehead, and both edges of your face must be completely visible without casting shadows onto the skin.',
    tag: 'Headwear & Religious Attire',
  },
  {
    question: 'How do I print the 4×6" photo sheet at CVS, Walgreens, or Walmart for $0.38?',
    answer: 'Download our 4×6" sheet (which contains 4 or 6 identical photos). Save it to your phone or USB drive. When ordering at CVS, Walgreens, Boots, or Walmart, select "Standard 4×6 Photo Print" (not "Passport Photo Service"). Pharmacy kiosks usually charge $0.35–$0.45 for a 4×6 print, compared to $16.99 for passport desk services!',
    tag: 'Printing & Pharmacy Kiosks',
  },
  {
    question: 'Does this service work for infant, baby, and toddler passport photos?',
    answer: 'Yes! Lay your baby flat on a white sheet or blanket on the bed or floor, stand directly above them, and ensure both ears and eyes are visible with mouth closed. Upload the photo into our studio, and our zoom & alignment tools will frame the child’s face to meet the 50%–69% rule effortlessly.',
    tag: 'Children & Infants',
  },
];

export const GuidelineFaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="bg-white rounded-xl border border-[#3C2F80]/15 shadow-sm p-6 sm:p-8 flex flex-col gap-6">
      
      <div className="flex items-center gap-3 border-b border-[#3C2F80]/10 pb-4">
        <div className="w-10 h-10 rounded-lg bg-[#FAF8FF] border border-[#3C2F80]/15 flex items-center justify-center text-[#5D3BE0]">
          <HelpCircle className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-serif font-bold text-xl text-[#261569]">
            Official Biometric Photo Advice & Embassy Guidelines
          </h2>
          <p className="text-xs text-[#5C5577] font-sans">
            Essential rules to ensure your photo passes biometric inspection on the first submission
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className={`rounded-xl border transition-all ${
                isOpen
                  ? 'border-[#5D3BE0] bg-[#FAF8FF] shadow-xs'
                  : 'border-slate-200 bg-white hover:border-[#5D3BE0]/40'
              }`}
            >
              <button
                onClick={() => toggle(idx)}
                className="w-full p-4 flex items-start justify-between gap-3 text-left"
              >
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#5D3BE0] block mb-1">
                    {faq.tag}
                  </span>
                  <h3 className="font-serif font-semibold text-sm text-[#261569] leading-snug">
                    {faq.question}
                  </h3>
                </div>
                <div className="p-1 rounded-md text-[#797582] group-hover:text-[#261569] shrink-0 mt-0.5">
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {isOpen && (
                <div className="px-4 pb-4 pt-1 text-xs text-[#484551] leading-relaxed border-t border-[#3C2F80]/5">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
