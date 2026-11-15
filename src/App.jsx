import { useState } from 'react';
import { supabase } from './supabase';

const DISCORD_INVITE_URL = 'https://discord.gg/3HtT9KPBZY';
// Stitch-hosted image URLs can expire — swap for a file in /public (e.g. "/logo.png") before launch.
const LOGO_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBnIZZqlRbYW1ZzbaNKCTCr2LbrUPAzqtmuThFPLBERBq-Hx5na0DJHRrfhdUv-zU6OnPhdTmTCh0SBeib-duI1Vfu5JzHBRLaWQ2laYbXf8OuA4jou_kfdj9Zq5mdcgDDy3cNd13Yl36M-EQWLP8aWw8raB7pZxrbpTu3v6Ym70VCU1K0BBoC_3VXkzoXDWoXUrLydhWB97PAhxaunciT3g4g5kM0FdTOGX0SA9Ku-CUXvhyyHPBXw';

const TIMEZONES = [
  ['EST', 'North America: Eastern (EST / UTC-5)'],
  ['CST', 'North America: Central (CST / UTC-6)'],
  ['PST', 'North America: Pacific (PST / UTC-8)'],
  ['GMT', 'United Kingdom / West Africa (GMT / UTC+0)'],
  ['CET', 'Central Europe (CET / UTC+1)'],
  ['EAT', 'East Africa (EAT / UTC+3)'],
  ['IST', 'India Standard Time (IST / UTC+5:30)'],
  ['AEST', 'Australia Eastern (AEST / UTC+10)'],
  ['OTHER', 'Other / Worldwide Flexible'],
];

const TIERS = [
  {
    id: 'beginner',
    range: '100 – 1000 ELO',
    icon: 'visibility',
    title: 'Beginner Tier',
    tagline: 'Foundations & Board Vision',
    blurb:
      'Eliminate piece blunders entirely. Instill natural board vision, tactical instincts, and uncompromising basic king defense.',
    callout: {
      icon: 'priority_high',
      label: 'Zero opening theory:',
      text: 'We exclusively reinforce central command, rapid minor development, and immediate castling.',
    },
    weights: [
      { label: 'Principles & Fundamentals', pct: 40, bar: 'bg-primary' },
      { label: 'Tactics & Tactical Patterns (Pins, Forks, Skewers)', pct: 40, bar: 'bg-secondary' },
      { label: 'Basic Endgames (K+Q, K+R Mates, Pawn Promotion)', pct: 20, bar: 'bg-secondary-fixed-dim' },
    ],
    checklist: [
      'Defending unprotected hanging pieces',
      'Discovered check & clearance motifs',
      'King + Rook box-method execution',
    ],
    cta: 'Enroll in Foundations',
  },
  {
    id: 'intermediate',
    featured: true,
    range: '1000 – 1800 ELO',
    icon: 'psychology',
    title: 'Intermediate Tier',
    tagline: 'Discipline & Structure',
    blurb:
      'Move past chaotic skirmishes into premeditated positional strategy, clean calculation trees, and harmonious pawn skeletons.',
    callout: {
      icon: 'schema',
      label: 'Structured Repertoires:',
      text: 'Learn 1 solid White setup and 2 adaptable Black defenses without excessive memorization.',
    },
    weights: [
      { label: 'Tactics & Calculation Trees', pct: 40, bar: 'bg-primary' },
      { label: 'Strategy & Positional Play', pct: 30, bar: 'bg-primary-container' },
      { label: 'Endgame Techniques', pct: 20, bar: 'bg-secondary' },
      { label: 'Opening Architecture', pct: 10, bar: 'bg-secondary-fixed-dim' },
    ],
    checklist: [
      'Prophylaxis: What does the opponent want?',
      'Isolani, Carlsbad & Backward pawn play',
      'Lucena and Philidor positions drilled',
    ],
    cta: 'Join Intermediate Cohort',
  },
  {
    id: 'advanced',
    range: '1900+ ELO',
    badge: '♛ Master Track',
    icon: 'military_tech',
    title: 'Advanced Coaching',
    tagline: 'Mastery, Nuance & Deep Strategy',
    blurb:
      'Refine your chess at a high level through advanced training tailored to your individual strengths, weaknesses, and competitive goals.',
    callout: {
      icon: 'verified',
      label: 'Best Suited For:',
      text: 'Experienced players who want to seriously refine their game and prepare for competitive chess.',
    },
    includes: [
      ['menu_book', 'Advanced Opening Repertoire', 'Developing & refining a personalized, sharp opening arsenal'],
      ['schema', 'Mastering Positional Chess', 'Pawn structures, piece dynamics, and prophylactic control'],
      ['flag', 'Advanced Endgame Mastery', 'Complex conversion technique and theoretical king & pawn / rook endings'],
      ['bolt', 'Advanced Tactical Training', 'Deep calculation trees, candidate selection, and acute blunder prevention'],
      ['analytics', 'In-Depth Strengths & Weaknesses Analysis', 'Comprehensive profiling of your psychological & decision-making trends'],
      ['rate_review', 'Detailed Game Reviews & Master PGNs', 'Post-mortem classical reviews with unassisted engine annotations'],
      ['auto_stories', 'Curated Literature & Study Packs', 'Hand-picked chess classics and master-level problem sets'],
      ['trophy', 'Tournament Prep & Competitive Guidance', 'OTB clock management, round preparation, and psychological resilience'],
    ],
    cta: 'Apply for Advanced Mentorship',
  },
];

const Icon = ({ name, className = '' }) => (
  <span className={`material-symbols-outlined ${className}`}>{name}</span>
);

/* ------------------------------------------------------------------ Header */
function Header() {
  const links = [
    ['Curriculum', '#curriculum-breakdown'],
    ['Coaching Tiers', '#curriculum-breakdown'],
    ['Philosophy', '#philosophy'],
  ];
  return (
    <header className="fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(56,35,20,0.06)]">
      <div className="h-20 max-w-[1280px] mx-auto px-6 lg:px-margin flex items-center justify-between">
        <a href="#" className="flex items-center gap-4">
          <img alt="KD Knights Logo" className="h-9 w-9 object-contain" src={LOGO_URL} />
          <span className="font-headline-sm text-headline-sm text-primary tracking-tight">KD Knights Academy</span>
        </a>
        <nav className="hidden md:flex items-center gap-8">
          {links.map(([label, href]) => (
            <a key={label} href={href} className="font-label-lg text-label-lg text-on-surface-variant hover:text-on-surface transition-colors">
              {label}
            </a>
          ))}
        </nav>
        <a
          href="#register"
          className="inline-flex items-center justify-center px-space-lg py-space-sm bg-primary-container text-on-primary font-label-md text-label-md rounded-lg shadow-[0_2px_0_#382314] hover:bg-primary transition-all active:translate-y-[1px]"
        >
          Start Training
        </a>
      </div>
    </header>
  );
}

/* -------------------------------------------------------------------- Hero */
function Hero() {
  const metrics = [
    ['+280', 'Avg. 6-Month Rating Gain'],
    ['100%', 'Tactile PGN Reviews'],
    ['1:1', 'Direct Coach Dialogue'],
  ];
  return (
    <section className="relative w-full overflow-hidden bg-surface py-space-xl lg:py-24">
      <div className="absolute inset-0 opacity-40 pointer-events-none bg-[radial-gradient(#dbc39c_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-secondary-fixed/50 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-20 w-80 h-80 rounded-full bg-primary-fixed/40 blur-2xl pointer-events-none" />
      <div className="relative max-w-[1280px] mx-auto px-6 lg:px-margin">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center">
          <div className="lg:col-span-7 flex flex-col gap-space-md z-10">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container text-primary font-label-md text-label-md shadow-sm">
                <Icon name="verified" className="text-[16px]" /> Private & Group Chess Mentorship
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-on-surface-variant font-label-md text-label-md">
                <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim" /> Rated for all levels (100 – 1900+)
              </span>
            </div>
            <div className="space-y-3">
              <h1 className="font-display-hero text-display-hero-mobile md:text-display-hero text-primary tracking-tight">
                Master the Craft of Every Move
              </h1>
              <p className="font-headline-md text-headline-md text-secondary italic">Intensity. Consistency. Results.</p>
            </div>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl leading-relaxed">
              Welcome to the KD Knights sanctuary. We discard clinical, automated algorithms in favor of deliberate, tactile study.
              Our mentorship transforms hesitant casual players into principled, razor-sharp tacticians through personalized
              repertoire development and rigorous classical masterclasses.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <a
                href="#register"
                className="inline-flex items-center justify-center gap-2 px-space-xl py-4 bg-primary text-on-primary font-label-lg text-label-lg rounded-xl shadow-[0_4px_0_#2a1700] hover:bg-primary-container hover:shadow-[0_2px_0_#2a1700] active:translate-y-1 transition-all"
              >
                Start Training <Icon name="arrow_forward" className="text-[20px]" />
              </a>
              <a
                href="#curriculum-breakdown"
                className="inline-flex items-center justify-center gap-2 px-space-lg py-4 bg-secondary-container text-primary font-label-lg text-label-lg rounded-xl hover:bg-secondary-fixed transition-colors"
              >
                <Icon name="menu_book" className="text-[20px]" /> Explore Tiers
              </a>
            </div>
            <div className="pt-6 grid grid-cols-3 gap-4 max-w-lg">
              {metrics.map(([value, label]) => (
                <div key={label} className="p-3 bg-surface-container rounded-lg">
                  <span className="block font-headline-sm text-headline-sm text-primary">{value}</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[420px] aspect-square p-6 rounded-2xl bg-surface-container-high shadow-xl flex flex-col items-center justify-center text-center">
              <div className="absolute inset-4 rounded-xl bg-secondary-container/40" />
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-52 h-52 sm:w-64 sm:h-64 rounded-full p-2 bg-gradient-to-b from-primary-fixed to-secondary-fixed shadow-md flex items-center justify-center">
                  <img alt="KD Knights Crest" className="w-full h-full object-contain rounded-full" src={LOGO_URL} />
                </div>
                <div className="mt-6 px-6 py-3 bg-primary text-on-primary rounded-xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] flex items-center gap-3">
                  <Icon name="military_tech" className="text-secondary-fixed text-[24px]" />
                  <div className="text-left">
                    <span className="block font-label-md text-label-md text-secondary-fixed tracking-wide uppercase">Academy Creed</span>
                    <span className="font-headline-sm text-headline-sm leading-tight text-on-primary">Discipline Over Guesswork</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------- Philosophy ribbon */
function PhilosophyRibbon() {
  return (
    <section id="philosophy" className="w-full bg-primary-container text-on-primary py-space-lg shadow-inner">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-margin flex flex-wrap items-center gap-3">
        <Icon name="sports_score" className="text-secondary-fixed text-[28px]" />
        <span className="font-title-md text-title-md text-on-primary">The Classical Approach:</span>
        <span className="font-body-md text-body-md text-on-primary-container">
          We teach you how to evaluate before calculating. Intuition is cultivated, not memorized.
        </span>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- TierCards */
function TierCard({ tier, onSelect }) {
  const { featured } = tier;
  return (
    <div
      className={`flex flex-col rounded-2xl p-space-lg relative ${
        featured
          ? 'shadow-xl lg:-translate-y-3 bg-gradient-to-b from-surface to-secondary-container/20'
          : 'bg-surface shadow-sm hover:shadow-md transition-shadow'
      }`}
    >
      {featured && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-secondary-fixed font-label-sm text-label-sm shadow-md uppercase tracking-wider font-bold whitespace-nowrap">
          Most Popular Cohort
        </div>
      )}

      <div className={`flex items-center justify-between mb-4 ${featured ? 'mt-2' : ''}`}>
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`px-3 py-1 rounded-full font-label-sm text-label-sm uppercase tracking-wider ${
              featured ? 'bg-secondary-container text-primary font-semibold' : 'bg-surface-container-highest text-on-surface-variant'
            }`}
          >
            {tier.range}
          </span>
          {tier.badge && (
            <span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold">
              {tier.badge}
            </span>
          )}
        </div>
        <Icon name={tier.icon} className={`${featured ? 'text-primary' : 'text-secondary'} text-[24px]`} />
      </div>

      <h3 className="font-headline-md text-headline-md text-primary">{tier.title}</h3>
      <p className={`font-label-lg text-label-lg mb-4 ${featured ? 'text-primary font-semibold' : 'text-secondary'}`}>{tier.tagline}</p>
      <p className="font-body-sm text-body-sm text-on-surface-variant mb-6">{tier.blurb}</p>

      <div className={`mb-6 p-3 rounded-xl ${featured ? 'bg-secondary-container text-on-secondary-container' : 'bg-secondary-fixed/50 text-on-secondary-fixed'}`}>
        <div className="flex items-start gap-2">
          <Icon name={tier.callout.icon} className="text-primary text-[18px] shrink-0 mt-0.5" />
          <p className="font-label-sm text-label-sm">
            <strong className="font-semibold text-primary">{tier.callout.label}</strong> {tier.callout.text}
          </p>
        </div>
      </div>

      {tier.weights && (
        <>
          <div className="space-y-4 mb-8">
            <span className="font-label-md text-label-md text-primary block uppercase tracking-wide">Curriculum Weight</span>
            {tier.weights.map((w) => (
              <div key={w.label}>
                <div className="flex justify-between gap-3 font-label-sm text-label-sm mb-1 text-on-surface">
                  <span>{w.label}</span>
                  <span className="font-bold text-primary">{w.pct}%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-surface-container overflow-hidden">
                  <div className={`h-full rounded-full ${w.bar}`} style={{ width: `${w.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
          <ul className="space-y-2.5 mb-8 text-on-surface-variant font-body-sm text-body-sm mt-auto">
            {tier.checklist.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <Icon name="check_circle" className="text-primary text-[18px]" /> {item}
              </li>
            ))}
          </ul>
        </>
      )}

      {tier.includes && (
        <div className="space-y-2 mb-6">
          <span className="font-label-md text-label-md text-primary block uppercase tracking-wide">What's Included in the Curriculum</span>
          <div className="grid grid-cols-1 gap-2">
            {tier.includes.map(([icon, title, desc]) => (
              <div key={title} className="flex items-start gap-2.5 p-2 rounded-lg bg-surface-container/60">
                <Icon name={icon} className="text-primary text-[18px] shrink-0 mt-0.5" />
                <div>
                  <span className="font-label-sm text-label-sm text-primary font-bold block">{title}</span>
                  <span className="font-body-sm text-[13px] text-on-surface-variant">{desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <a
        href="#register"
        onClick={() => onSelect(tier.id)}
        className={`w-full text-center font-label-md text-label-md transition-all mt-auto ${
          featured
            ? 'py-3.5 bg-primary text-on-primary rounded-xl shadow-[0_3px_0_#2a1700] hover:bg-primary-container active:translate-y-0.5'
            : 'py-3 bg-surface-container hover:bg-secondary-fixed text-primary rounded-lg'
        }`}
      >
        {tier.cta}
      </a>
    </div>
  );
}

function TierCards({ onSelect }) {
  return (
    <section id="curriculum-breakdown" className="w-full py-space-xl lg:py-28 bg-surface-container-low">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-margin">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm uppercase tracking-wider">
            Systematic Progression
          </div>
          <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary tracking-tight">
            Tailored Coaching Tiers
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Every rating milestone demands a completely distinct curriculum. Choose the cohort formulated to shatter your current
            plateau with structured, verifiable milestones.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {TIERS.map((tier) => (
            <TierCard key={tier.id} tier={tier} onSelect={onSelect} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------- Mentorship spotlight */
function Spotlight() {
  const points = [
    ['cognition', 'Calm Thought Discipline', 'Replace panic with a 3-step candidate move habit: Checks, Captures, Threats.'],
    ['forum', 'Live Guild Voice Review', 'Weekly interactive parlor calls where students defend their moves against fellow club members.'],
  ];
  return (
    <section className="w-full py-space-xl lg:py-24 bg-surface">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-margin grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center">
        <div className="lg:col-span-6 p-6 bg-surface-container rounded-2xl shadow-lg">
          <div className="flex items-center justify-between pb-4 border-b border-outline-variant/30 mb-4">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-error" />
              <span className="w-3 h-3 rounded-full bg-secondary" />
              <span className="w-3 h-3 rounded-full bg-primary-container" />
              <span className="font-label-sm text-label-sm text-on-surface-variant ml-2">Parlor Analysis Board #04</span>
            </div>
            <span className="font-label-sm text-label-sm text-secondary-fixed-dim bg-primary px-2.5 py-0.5 rounded">Live Drill</span>
          </div>
          <div className="bg-surface-container-lowest p-4 rounded-xl shadow-inner space-y-3 font-body-sm text-body-sm">
            <div className="flex items-center justify-between pb-2 border-b border-surface-container">
              <span className="text-on-surface-variant font-mono">18. ... Nd4!?</span>
              <span className="text-primary font-semibold">Central Outpost Infiltration</span>
            </div>
            <div className="p-3 bg-secondary-container/40 rounded-lg">
              <p className="font-label-sm text-label-sm text-primary font-bold mb-1">Coach Note:</p>
              <p className="text-on-surface-variant leading-relaxed">
                “Notice Black relinquishes the f5 diagonal in order to cement an octopus knight on d4. White’s bishop pair is
                neutralized instantly because the pawn on e3 cannot push.”
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2 text-on-surface-variant">
              <Icon name="lightbulb" className="text-[18px] text-primary" />
              <span>Alternative: 18. ... exf4 leaves isolated pawn weakness on d5.</span>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between p-3 bg-surface rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-secondary-container flex items-center justify-center text-primary font-bold">DK</div>
              <div>
                <span className="block font-label-md text-label-md text-on-surface">David K. (Student)</span>
                <span className="text-on-surface-variant font-body-sm text-body-sm" style={{ fontVariantNumeric: 'tabular-nums' }}>
                  1140 → 1510 Rapid (+370)
                </span>
              </div>
            </div>
            <Icon name="trending_up" className="text-primary text-[22px]" />
          </div>
        </div>

        <div className="lg:col-span-6 flex flex-col gap-space-md">
          <span className="font-label-md text-label-md text-secondary uppercase tracking-widest">Tactile Mentorship</span>
          <h2 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-primary tracking-tight">
            We don’t memorize moves. We teach you how to look at the board.
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            Many players are overwhelmed by modern engine evaluations and endlessly complex opening encyclopedias. At KD Knights, we
            anchor your thinking in time-tested Russian School pedagogy and deliberate endgame reverse-engineering.
          </p>
          <div className="space-y-4 pt-2">
            {points.map(([icon, title, desc]) => (
              <div key={title} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-secondary-fixed flex items-center justify-center shrink-0 text-primary">
                  <Icon name={icon} />
                </div>
                <div>
                  <h4 className="font-title-md text-title-md text-primary">{title}</h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------- RegistrationForm */
const inputClass =
  'w-full px-4 py-3 bg-surface-container-lowest text-on-surface rounded-xl shadow-sm placeholder:text-outline-variant focus:outline-none focus:ring-2 focus:ring-primary/40 font-body-md text-body-md disabled:opacity-60';

function RegistrationForm({ tier, setTier }) {
  // Controlled form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState('');
  const [timezone, setTimezone] = useState('');
  // Submission state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [redirecting, setRedirecting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return; // guard against double-submits
    setLoading(true);
    setError('');

    try {
      // No .select() chained on purpose: the anon role is INSERT-only under RLS,
      // so asking for the row back would fail with a permissions error.
      const { error: insertError } = await supabase.from('students').insert([
        {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          rating: rating.trim(),
          timezone,
          tier,
        },
      ]);

      if (insertError) throw insertError;

      // Success → send them straight to Discord onboarding.
      setRedirecting(true);
      window.location.href = DISCORD_INVITE_URL;
    } catch (err) {
      console.error('Registration failed:', err);
      setError('Something went wrong saving your registration. Please check your connection and try again.');
      setLoading(false);
    }
  };

  const tierOptions = [
    ['beginner', 'Beginner', '100 – 1000 ELO'],
    ['intermediate', 'Intermediate', '1000 – 1800'],
    ['advanced', 'Advanced', '1900+'],
  ];

  return (
    <section id="register" className="w-full py-space-xl lg:py-28 bg-surface-container-low">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-margin">
        <div className="max-w-3xl mx-auto bg-surface rounded-2xl shadow-xl p-8 sm:p-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary via-secondary to-primary-container" />

          <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container text-primary font-label-sm text-label-sm uppercase tracking-wider mb-2">
              <Icon name="how_to_reg" className="text-[16px]" /> Enrollment Application
            </div>
            <h2 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-primary tracking-tight">
              Begin Your Journey with KD Knights
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Take your seat at the mahogany table. Tell us about your current chess journey and your rating target. We will match you
              to your coach and Discord cohort within 24 hours.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" aria-busy={loading}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="block font-label-md text-label-md text-primary">
                  Full Name or Preferred Handle <span className="text-error">*</span>
                </label>
                <input id="name" type="text" required autoComplete="name" disabled={loading} className={inputClass}
                  placeholder="e.g. Magnus Carlsen" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="block font-label-md text-label-md text-primary">
                  Email Address <span className="text-error">*</span>
                </label>
                <input id="email" type="email" required autoComplete="email" disabled={loading} className={inputClass}
                  placeholder="magnus@studyparlor.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="rating" className="block font-label-md text-label-md text-primary">
                  Current Lichess / Chess.com Rating <span className="text-error">*</span>
                </label>
                <input id="rating" type="text" required disabled={loading} className={inputClass}
                  placeholder="e.g. 1350 Blitz or Rapid" value={rating} onChange={(e) => setRating(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label htmlFor="timezone" className="block font-label-md text-label-md text-primary">
                  Preferred Timezone <span className="text-error">*</span>
                </label>
                <select id="timezone" required disabled={loading} className={inputClass}
                  value={timezone} onChange={(e) => setTimezone(e.target.value)}>
                  <option value="" disabled>Select your region / timezone</option>
                  {TIMEZONES.map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
            </div>

            <fieldset className="space-y-3 pt-2" disabled={loading}>
              <legend className="block font-label-md text-label-md text-primary mb-3">Target Coaching Tier</legend>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {tierOptions.map(([value, label, sub]) => {
                  const active = tier === value;
                  return (
                    <label key={value}
                      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
                        active ? 'bg-secondary-container' : 'bg-surface-container hover:bg-secondary-fixed/40'
                      }`}>
                      <input type="radio" name="coaching_tier" value={value} checked={active}
                        onChange={() => setTier(value)} className="w-4 h-4 accent-primary" />
                      <div>
                        <span className={`block font-label-md text-label-md ${active ? 'text-primary font-bold' : 'text-on-surface'}`}>{label}</span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">{sub}</span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            {error && (
              <div role="alert" className="flex items-start gap-2 p-3 rounded-xl bg-error-container text-on-error-container font-body-sm text-body-sm">
                <Icon name="error" className="text-[18px] shrink-0 mt-0.5" /> {error}
              </div>
            )}

            <div className="pt-4">
              <button type="submit" disabled={loading}
                className="w-full py-4 bg-primary text-on-primary font-headline-sm text-headline-sm rounded-xl shadow-[0_4px_0_#2a1700] hover:bg-primary-container active:translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed disabled:active:translate-y-0">
                {loading ? (
                  <>
                    <span className="w-5 h-5 rounded-full border-2 border-on-primary/40 border-t-on-primary animate-spin" />
                    <span>Saving your seat…</span>
                  </>
                ) : (
                  <>
                    <Icon name="forum" className="text-[24px]" />
                    <span>Register & Join the Discord</span>
                  </>
                )}
              </button>
            </div>

            <div className="pt-2 text-center flex items-center justify-center gap-2 text-on-surface-variant">
              <Icon name="verified_user" className="text-primary text-[18px]" />
              <span className="font-body-sm text-body-sm">
                Weekly group analysis sessions, 1-on-1 feedback, and active community Discord access included.
              </span>
            </div>
          </form>

          {/* Shown for the instant between a successful insert and the browser navigating to Discord */}
          {redirecting && (
            <div className="absolute inset-0 bg-surface/95 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-secondary-container text-primary flex items-center justify-center">
                <Icon name="check_circle" className="text-[36px]" />
              </div>
              <h3 className="font-headline-md text-headline-md text-primary">Your Chair Is Reserved</h3>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
                Taking you to the KD Knights Discord…{' '}
                <a href={DISCORD_INVITE_URL} className="text-primary underline">Click here if nothing happens.</a>
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ Footer */
function Footer() {
  const clubs = ['Chess.com Club', 'Lichess Study Circle', 'Weekly Blitz Arena', 'FIDE Tournament Prep'];
  return (
    <footer className="w-full bg-surface-container-high border-t border-outline-variant/30 py-space-xl">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-margin">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter mb-space-xl">
          <div className="md:col-span-5 flex flex-col gap-space-sm">
            <div className="flex items-center gap-3">
              <img alt="KD Knights Logo" className="h-8 w-8 object-contain" src={LOGO_URL} />
              <span className="font-headline-sm text-headline-sm text-primary">KD Knights Academy</span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant max-w-sm mt-space-xs">
              Cultivating master-level intuition and tactical discipline through classical chess mentorship, tactile study methods,
              and modern grandmaster theory.
            </p>
          </div>
          <div className="md:col-span-3 flex flex-col gap-space-sm">
            <span className="font-label-md text-label-md text-primary uppercase tracking-wider">Community & Clubs</span>
            <ul className="flex flex-col gap-space-xs">
              {clubs.map((c) => (
                <li key={c} className="font-body-sm text-body-sm text-on-surface-variant">{c}</li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-4 flex flex-col gap-space-sm bg-secondary-container/60 p-space-lg rounded-xl shadow-[0_2px_6px_-1px_rgba(56,35,20,0.06)]">
            <span className="font-title-md text-title-md text-primary">Join the Parlor Discord</span>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Connect daily with resident coaches, post game PGNs for critique, and attend Sunday masterclasses.
            </p>
            <div className="pt-space-xs">
              <a href={DISCORD_INVITE_URL} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-space-md py-space-sm bg-primary text-on-primary font-label-md text-label-md rounded-lg shadow-[0_2px_0_#382314] hover:bg-primary-container transition-all active:translate-y-[1px]">
                <Icon name="forum" className="text-[18px]" /> Enter Guild Discord
              </a>
            </div>
          </div>
        </div>
        <div className="pt-space-lg border-t border-outline-variant/30">
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            © {new Date().getFullYear()} KD Knights Academy. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

/* --------------------------------------------------------------------- App */
export default function App() {
  // Lifted so a tier card's CTA can pre-select the tier in the form below.
  const [tier, setTier] = useState('intermediate');

  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface antialiased">
      <Header />
      <main className="w-full pt-20">
        <Hero />
        <PhilosophyRibbon />
        <TierCards onSelect={setTier} />
        <Spotlight />
        <RegistrationForm tier={tier} setTier={setTier} />
      </main>
      <Footer />
    </div>
  );
}
