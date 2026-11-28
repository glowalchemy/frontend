/**
 * Single source of truth for the homepage FAQ.
 *
 * Consumed by BOTH the visible FAQ accordion on the homepage AND the
 * FAQPage JSON-LD structured data (via config/seo.js), so the two can
 * never drift apart.
 */
export const HOME_FAQS = [
  {
    question: 'Is GlowAlchemy Care a cosmetic manufacturer in India?',
    answer:
      'Yes. GlowAlchemy Care provides cosmetic product development and manufacturing solutions and also operates its own beauty product brand.',
  },
  {
    question: 'Do you provide third-party cosmetic manufacturing?',
    answer:
      'Yes. GlowAlchemy Care offers third-party manufacturing solutions for businesses looking to develop and manufacture beauty products under their own brands.',
  },
  {
    question: 'Do you offer private label cosmetic manufacturing?',
    answer:
      'Yes. Private label manufacturing can help businesses launch beauty products under their own brand name based on available product and formulation options.',
  },
  {
    question: 'Can you develop custom cosmetic formulations?',
    answer:
      'Yes. GlowAlchemy Care supports custom formulation requirements depending on the product category, formulation specifications and project requirements.',
  },
  {
    question: 'What types of products can you manufacture?',
    answer:
      'Our product categories include haircare and beauty/personal-care products such as shampoo, conditioner, hair oil, hair masks and related products. Available manufacturing options depend on the product and project requirements.',
  },
  {
    question: 'Can startups work with GlowAlchemy Care?',
    answer:
      'Yes. Our services are designed to support both emerging and established beauty businesses.',
  },
  {
    question: 'Does GlowAlchemy Care sell its own products?',
    answer:
      'Yes. GlowAlchemy Care operates its own beauty brand and sells products directly to customers.',
  },
  {
    question: 'How can I start a cosmetic manufacturing project?',
    answer:
      'Contact GlowAlchemy Care with your product requirements. Our team can discuss the product category, formulation, packaging and manufacturing requirements for your project.',
  },
];

export default HOME_FAQS;
