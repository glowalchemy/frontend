import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaBox,
  FaFlask,
  FaHandshake,
  FaTruck,
  FaIndustry,
  FaStore,
  FaUsers,
  FaGlobeAmericas,
  FaRocket,
  FaCheckCircle,
  FaLeaf,
  FaEye,
  FaBullseye,
  FaTags,
  FaBalanceScale,
  FaPalette,
  FaChevronDown,
  FaArrowRight,
} from 'react-icons/fa';
import { HOME_FAQS } from '../../data/homeFaqs';

/**
 * SEO-focused manufacturing content sections for the homepage.
 * Rendered below the shopping sections so banners, product rails and the
 * store experience stay primary. All copy is visible content — nothing is
 * hidden from users or search engines.
 */

const SectionShell = ({ id, children, tone = 'white' }) => (
  <section id={id} className={tone === 'muted' ? 'bg-glowalchemy-ivory' : 'bg-glowalchemy-white'}>
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14 md:py-16">
      {children}
    </div>
  </section>
);

const SectionTitle = ({ children, light = false }) => (
  <h2
    className={`text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4 sm:mb-6 ${
      light ? 'text-white' : 'text-brand-ink'
    }`}
  >
    {children}
  </h2>
);

const Card = ({ children, className = '' }) => (
  <div
    className={`bg-white rounded-2xl border border-glowalchemy-sand p-5 sm:p-6 hover:shadow-lg transition-shadow ${className}`}
  >
    {children}
  </div>
);

const IconBadge = ({ icon: Icon }) => (
  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-glowalchemy-ivory border border-glowalchemy-sand text-glowalchemy-terracotta mb-4">
    <Icon className="text-lg" aria-hidden="true" />
  </span>
);

/* ---------------- Section 3 — Introduction ---------------- */

const Introduction = () => (
  <SectionShell>
    <div className="max-w-3xl mx-auto text-center">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-ink mb-4 sm:mb-6">
        A Cosmetic Manufacturer in India Built for Growing Brands
      </h2>
      <p className="text-base sm:text-lg text-brand-muted leading-relaxed mb-4">
        Glow Alchemy Care is a cosmetic manufacturer in India that does two things well. We make
        and sell our own range of beauty and skincare products, and we manufacture for other
        brands through third-party and private label manufacturing.
      </p>
      <p className="text-base sm:text-lg text-brand-muted leading-relaxed mb-4">
        Because we run our own brand, we know what it takes to take a product from idea to
        shelf. The formulation has to work, the packaging has to look right, and every batch has
        to be consistent. We bring that experience to every brand we manufacture for.
      </p>
      <p className="text-base sm:text-lg text-brand-muted leading-relaxed">
        Looking for the best cosmetic manufacturers in India? The right partner is one that is
        open about quality, flexible on order size, and clear on timelines. That is how we work.
      </p>
    </div>

    <div className="mt-10 sm:mt-12 grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 max-w-4xl mx-auto">
      <Card className="text-center">
        <IconBadge icon={FaEye} />
        <h3 className="text-lg sm:text-xl font-bold text-brand-ink mb-2">Our Vision</h3>
        <p className="text-sm sm:text-base text-brand-muted leading-relaxed">
          To build a beauty brand India loves and a manufacturing partner brands grow with, with
          quality and care in everything we make.
        </p>
      </Card>
      <Card className="text-center">
        <IconBadge icon={FaBullseye} />
        <h3 className="text-lg sm:text-xl font-bold text-brand-ink mb-2">Our Mission</h3>
        <ul className="text-sm sm:text-base text-brand-muted leading-relaxed space-y-1.5 text-left">
          <li className="flex gap-2">
            <FaCheckCircle className="text-glowalchemy-terracotta mt-1 flex-shrink-0" aria-hidden="true" />
            Support quality-focused cosmetic manufacturing in India.
          </li>
          <li className="flex gap-2">
            <FaCheckCircle className="text-glowalchemy-terracotta mt-1 flex-shrink-0" aria-hidden="true" />
            Help beauty brands launch their products with confidence.
          </li>
          <li className="flex gap-2">
            <FaCheckCircle className="text-glowalchemy-terracotta mt-1 flex-shrink-0" aria-hidden="true" />
            Maintain consistent quality and clear communication.
          </li>
          <li className="flex gap-2">
            <FaCheckCircle className="text-glowalchemy-terracotta mt-1 flex-shrink-0" aria-hidden="true" />
            Develop our own beauty brand to the same standards.
          </li>
        </ul>
      </Card>
    </div>
  </SectionShell>
);

/* ---------------- Section 4 — Two Ways ---------------- */

const TwoWays = () => (
  <SectionShell tone="muted">
    <SectionTitle>Two Ways to Work With Glow Alchemy Care</SectionTitle>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 max-w-3xl mx-auto">
      <Card className="text-center flex flex-col">
        <IconBadge icon={FaStore} />
        <h3 className="text-lg sm:text-xl font-bold text-brand-ink mb-2">Shop Our Brand</h3>
        <p className="text-sm sm:text-base text-brand-muted leading-relaxed mb-5 flex-1">
          Discover Glow Alchemy Care products made with care in India.
        </p>
        <Link
          to="/ProductListing"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-glowalchemy-terracotta text-white rounded-lg font-semibold hover:bg-glowalchemy-charcoal transition-colors"
        >
          Shop Now <FaArrowRight className="text-sm" aria-hidden="true" />
        </Link>
      </Card>
      <Card className="text-center flex flex-col">
        <IconBadge icon={FaIndustry} />
        <h3 className="text-lg sm:text-xl font-bold text-brand-ink mb-2">Manufacture Your Brand</h3>
        <p className="text-sm sm:text-base text-brand-muted leading-relaxed mb-5 flex-1">
          Launch or expand your own cosmetic line with our third-party manufacturing solutions.
        </p>
        <Link
          to="/services"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-glowalchemy-terracotta text-glowalchemy-terracotta rounded-lg font-semibold hover:bg-glowalchemy-ivory transition-colors"
        >
          Explore Manufacturing Services <FaArrowRight className="text-sm" aria-hidden="true" />
        </Link>
      </Card>
    </div>
  </SectionShell>
);

/* ---------------- Section 5 — Third-Party Manufacturing ---------------- */

const TPM_SERVICES = [
  {
    icon: FaTags,
    title: 'Private Label Cosmetics',
    copy: 'Choose from ready formulations and add your brand name, label and packaging.',
    to: '/services/private-labeling',
    link: 'Private Labeling',
  },
  {
    icon: FaFlask,
    title: 'Custom Formulation',
    copy: 'A formula developed for your brand, skin type focus or ingredient preference.',
    to: '/contact',
    link: 'Request a Quote',
  },
  {
    icon: FaBalanceScale,
    title: 'Contract Manufacturing',
    copy: 'Bulk production to your specifications and approved samples.',
    to: '/services/contract-manufacturing',
    link: 'Contract Manufacturing',
  },
  {
    icon: FaBox,
    title: 'Packaging and Labelling Support',
    copy: 'Bottles, jars, tubes, boxes and label design help.',
    to: '/services',
    link: 'Our Services',
  },
  {
    icon: FaRocket,
    title: 'Startup-Friendly Orders',
    copy: 'Discuss available order quantities based on your product and project requirements.',
    to: '/contact',
    link: 'Discuss Your Project',
  },
];

const ThirdPartyManufacturing = () => (
  <SectionShell>
    <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-12">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-ink mb-4">
        Third-Party Cosmetic Manufacturing in India
      </h2>
      <p className="text-base sm:text-lg text-brand-muted leading-relaxed">
        Whether you are a new brand or an established one, our third-party cosmetic manufacturing
        service lets you sell high-quality products under your own name without building a
        factory. We handle the making; you focus on branding and sales.
      </p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
      {TPM_SERVICES.map((service) => {
        const Icon = service.icon;
        return (
          <Card key={service.title} className="flex flex-col">
            <IconBadge icon={Icon} />
            <h3 className="text-base sm:text-lg font-bold text-brand-ink mb-2">{service.title}</h3>
            <p className="text-sm text-brand-muted leading-relaxed mb-4 flex-1">{service.copy}</p>
            <Link
              to={service.to}
              className="inline-flex items-center gap-2 text-sm font-semibold text-glowalchemy-terracotta hover:text-glowalchemy-charcoal transition-colors"
            >
              {service.link} <FaArrowRight className="text-xs" aria-hidden="true" />
            </Link>
          </Card>
        );
      })}
      <Card className="flex flex-col justify-center items-center text-center bg-glowalchemy-ivory">
        <h3 className="text-base sm:text-lg font-bold text-brand-ink mb-3">Ready to Start?</h3>
        <Link
          to="/contact"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-glowalchemy-terracotta text-white rounded-lg font-semibold hover:bg-glowalchemy-charcoal transition-colors"
        >
          Request a Manufacturing Quote <FaArrowRight className="text-sm" aria-hidden="true" />
        </Link>
      </Card>
    </div>
  </SectionShell>
);

/* ---------------- Section 6 — Our Own Brand ---------------- */

const OwnBrand = () => (
  <SectionShell tone="muted">
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-center">
        <div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-ink mb-4">
            Glow Alchemy Care: Our Own Beauty Brand
          </h2>
          <p className="text-base sm:text-lg text-brand-muted leading-relaxed mb-4">
            Glow Alchemy Care is our own brand, made in India for people who want simple,
            effective beauty care. Because the same team that manufactures for other brands makes
            our products, they go through the same quality checks.
          </p>
          <Link
            to="/ProductListing"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-glowalchemy-terracotta text-white rounded-lg font-semibold hover:bg-glowalchemy-charcoal transition-colors"
          >
            Shop Best Sellers <FaArrowRight className="text-sm" aria-hidden="true" />
          </Link>
        </div>
        <div className="hidden lg:flex h-40 w-40 items-center justify-center rounded-full bg-glowalchemy-white border border-glowalchemy-sand">
          <FaLeaf className="text-5xl text-glowalchemy-terracotta" aria-hidden="true" />
        </div>
      </div>
    </div>
  </SectionShell>
);

/* ---------------- Section 7 — Why Choose Us ---------------- */

const WHY_US = [
  {
    icon: FaHandshake,
    title: 'Brand and manufacturer in one',
    copy: 'We understand both the making and the selling.',
  },
  {
    icon: FaBalanceScale,
    title: 'Flexible order sizes',
    copy: 'Discuss available order quantities based on your requirements.',
  },
  {
    icon: FaFlask,
    title: 'Formulation support',
    copy: 'Help choosing ingredients, textures and claims.',
  },
  {
    icon: FaCheckCircle,
    title: 'Quality at every step',
    copy: 'Raw material checks, batch testing and clear records.',
  },
  {
    icon: FaPalette,
    title: 'Packaging help',
    copy: 'Guidance on containers, labels and compliant label text.',
  },
];

const WhyChooseUs = () => (
  <SectionShell>
    <SectionTitle>Why Brands Choose Glow Alchemy Care as Their Cosmetic Manufacturer</SectionTitle>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
      {WHY_US.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.title}>
            <IconBadge icon={Icon} />
            <h3 className="text-base sm:text-lg font-bold text-brand-ink mb-2">{item.title}</h3>
            <p className="text-sm text-brand-muted leading-relaxed">{item.copy}</p>
          </Card>
        );
      })}
    </div>
  </SectionShell>
);

/* ---------------- Section 8 — How It Works ---------------- */

const STEPS = [
  { title: 'Share Your Idea', copy: 'Tell us the product type, target customer and budget.' },
  { title: 'Choose a Formula', copy: 'Pick a ready formulation or request a custom one.' },
  { title: 'Approve Samples', copy: 'Test, give feedback and we refine.' },
  { title: 'Pick Packaging and Labels', copy: 'We help with options and label details.' },
  { title: 'Production', copy: 'We manufacture your approved batch under quality checks.' },
  { title: 'Delivery', copy: 'We pack and dispatch finished products to you.' },
];

const HowItWorks = () => (
  <SectionShell tone="muted">
    <SectionTitle>How Third-Party Cosmetic Manufacturing Works With Us</SectionTitle>
    <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
      {STEPS.map((step, index) => (
        <li key={step.title}>
          <Card className="h-full">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-glowalchemy-terracotta text-white font-bold text-sm mb-4">
              {index + 1}
            </span>
            <h3 className="text-base sm:text-lg font-bold text-brand-ink mb-2">{step.title}</h3>
            <p className="text-sm text-brand-muted leading-relaxed">{step.copy}</p>
          </Card>
        </li>
      ))}
    </ol>
  </SectionShell>
);

/* ---------------- Section 9 — Who We Work With ---------------- */

const AUDIENCES = [
  { icon: FaRocket, title: 'Beauty Startups', copy: 'Launch your first skincare, haircare or beauty product.' },
  { icon: FaStore, title: 'D2C Brands', copy: 'Build and expand your online beauty product portfolio.' },
  { icon: FaIndustry, title: 'Established Beauty Brands', copy: 'Add new products and increase your manufacturing capacity.' },
  { icon: FaTruck, title: 'Retailers & Distributors', copy: 'Develop private label products for your customer base.' },
  { icon: FaUsers, title: 'Salons & Professionals', copy: 'Create products aligned with your professional beauty business.' },
  { icon: FaGlobeAmericas, title: 'International Brands', copy: 'Explore manufacturing partnerships for beauty products intended for international markets.' },
];

const WhoWeWorkWith = () => (
  <SectionShell>
    <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-12">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-ink mb-4">
        Cosmetic Manufacturing Solutions for Growing Brands
      </h2>
      <p className="text-base sm:text-lg text-brand-muted leading-relaxed">
        Our manufacturing services can support:
      </p>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
      {AUDIENCES.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.title}>
            <IconBadge icon={Icon} />
            <h3 className="text-base sm:text-lg font-bold text-brand-ink mb-2">{item.title}</h3>
            <p className="text-sm text-brand-muted leading-relaxed">{item.copy}</p>
          </Card>
        );
      })}
    </div>
  </SectionShell>
);

/* ---------------- Section 10 — FAQ ---------------- */

const Faq = () => (
  <SectionShell tone="muted">
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-brand-ink mb-8 sm:mb-10">
        Frequently Asked Questions About Cosmetic Manufacturing
      </h2>
      <div className="space-y-3 sm:space-y-4">
        {HOME_FAQS.map((faq) => (
          <details
            key={faq.question}
            className="group bg-white rounded-xl border border-glowalchemy-sand px-5 sm:px-6"
          >
            <summary className="flex cursor-pointer items-center justify-between gap-4 py-4 text-sm sm:text-base font-semibold text-brand-ink list-none [&::-webkit-details-marker]:hidden">
              {faq.question}
              <FaChevronDown
                className="flex-shrink-0 text-glowalchemy-terracotta transition-transform duration-300 group-open:rotate-180"
                aria-hidden="true"
              />
            </summary>
            <p className="pb-5 text-sm sm:text-base text-brand-muted leading-relaxed">{faq.answer}</p>
          </details>
        ))}
      </div>
    </div>
  </SectionShell>
);

/* ---------------- Section 11 — Final CTA ---------------- */

const FinalCta = () => (
  <SectionShell>
    <div className="max-w-3xl mx-auto text-center bg-gradient-to-br from-brand-primary to-brand-primary-active rounded-2xl p-6 sm:p-10 md:p-12 text-white">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
        Your Beauty Brand Starts With the Right Manufacturing Partner
      </h2>
      <p className="text-base sm:text-lg text-white/85 mb-2 font-medium">Develop. Manufacture. Launch. Grow.</p>
      <p className="text-sm sm:text-base text-white/75 leading-relaxed mb-8">
        GlowAlchemy Care combines its beauty product experience with cosmetic manufacturing
        services to help businesses bring products to market with confidence.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
        <Link
          to="/contact"
          className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 bg-white text-brand-primary rounded-lg font-semibold hover:bg-glowalchemy-ivory transition-colors"
        >
          Request a Manufacturing Quote <FaArrowRight className="text-sm" aria-hidden="true" />
        </Link>
        <Link
          to="/ProductListing"
          className="inline-flex items-center justify-center px-6 sm:px-8 py-3 border-2 border-white/70 text-white rounded-lg font-semibold hover:bg-white/10 transition-colors"
        >
          Shop GlowAlchemy Care
        </Link>
      </div>
    </div>
  </SectionShell>
);

/* ---------------- Composed export ---------------- */

const HomepageManufacturing = () => (
  <>
    <Introduction />
    <TwoWays />
    <ThirdPartyManufacturing />
    <OwnBrand />
    <WhyChooseUs />
    <HowItWorks />
    <WhoWeWorkWith />
    <Faq />
    <FinalCta />
  </>
);

export default HomepageManufacturing;
