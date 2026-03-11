"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  animate,
} from "framer-motion";
import { ArrowUpRight, Mail, Play, Sparkles, X, ChevronRight } from "lucide-react";

type Project = {
  id: number;
  title: string;
  description: string;
  category: string;
  poster: string;
  video: string;
};

const projects: Project[] = [
  {
    id: 1,
    title: "Nebula Launch Film",
    description: "Cinematic brand trailer built for a SaaS product launch.",
    category: "Film",
    poster: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
    video: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  },
  {
    id: 2,
    title: "Modern Creator Landing",
    description: "Conversion-focused portfolio website for a digital creator.",
    category: "Web",
    poster: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=1200&q=80",
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    id: 3,
    title: "Pulse Reels Campaign",
    description: "Short-form vertical edits optimized for social engagement.",
    category: "Social",
    poster: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    video: "https://www.w3schools.com/html/movie.mp4",
  },
  {
    id: 4,
    title: "Aerial Story Sequence",
    description: "Travel film cut with smooth transitions and color grading.",
    category: "Film",
    poster: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=1200&q=80",
    video: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  },
  {
    id: 5,
    title: "Event Teaser Edit",
    description: "Fast-paced teaser with motion typography and sound design.",
    category: "Film",
    poster: "https://images.unsplash.com/photo-1470229538611-16ba8c7ffbd7?auto=format&fit=crop&w=1200&q=80",
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    id: 6,
    title: "Studio Identity Site",
    description: "Minimal site experience with interactive visual storytelling.",
    category: "Web",
    poster: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80",
    video: "https://www.w3schools.com/html/movie.mp4",
  },
  {
    id: 7,
    title: "Luxury Product Edit",
    description: "Premium product showcase using macro visuals and light FX.",
    category: "Social",
    poster: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    video: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  },
  {
    id: 8,
    title: "Creator Intro Film",
    description: "Personal brand intro designed to increase booking inquiries.",
    category: "Film",
    poster: "https://images.unsplash.com/photo-1491897554428-130a60dd4757?auto=format&fit=crop&w=1200&q=80",
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    id: 9,
    title: "Interactive Brand Page",
    description: "Futuristic website with smooth sections and rich motion.",
    category: "Web",
    poster: "https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?auto=format&fit=crop&w=1200&q=80",
    video: "https://www.w3schools.com/html/movie.mp4",
  },
  {
    id: 10,
    title: "Social Story Edit Pack",
    description: "Batch storytelling edits crafted for daily posting cadence.",
    category: "Social",
    poster: "https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=1200&q=80",
    video: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  },
];

const testimonials = [
  {
    quote: "He made our brand look premium in both web and video. The final result converted immediately.",
    author: "Samantha R.",
    role: "Founder, Flux Atelier",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80",
    stars: 5,
  },
  {
    quote: "Fast delivery, exceptional taste, and clean execution. Exactly the creative partner we needed.",
    author: "Daniel K.",
    role: "Marketing Lead, Nova Labs",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80",
    stars: 5,
  },
  {
    quote: "Our launch video and landing page finally feel cohesive. Clients mention it on every call.",
    author: "Amelia J.",
    role: "Brand Strategist",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&q=80",
    stars: 5,
  },
];

const stats = [
  { label: "Projects Delivered", value: 130, suffix: "+" },
  { label: "Happy Clients", value: 94, suffix: "%" },
  { label: "Awards & Features", value: 18, suffix: "" },
  { label: "Years of Craft", value: 6, suffix: "+" },
];

const processSteps = [
  { num: "01", title: "Discovery", desc: "Deep dive into your brand goals, audience, and vision." },
  { num: "02", title: "Concept", desc: "Mood boards, storyboards, and creative direction lock-in." },
  { num: "03", title: "Production", desc: "Pixel-perfect execution with premium tools and technique." },
  { num: "04", title: "Delivery", desc: "Fast turnaround, revisions included, files ready to launch." },
];

const marqueeItems = [
  "Video Editing", "Web Design", "Motion Graphics", "Brand Films",
  "Creative Direction", "Social Content", "UI/UX Design", "Visual Storytelling",
];

// Animated counter hook
function useCounter(target: number, inView: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, target, {
      duration: 2,
      ease: "easeOut",
      onUpdate: (v) => setCount(Math.floor(v)),
    });
    return controls.stop;
  }, [inView, target]);
  return count;
}

// 3D tilt card
function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 200, damping: 20 });
  const springY = useSpring(rotateY, { stiffness: 200, damping: 20 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    rotateX.set(-y * 10);
    rotateY.set(x * 10);
  };

  const handleLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ rotateX: springX, rotateY: springY, transformPerspective: 1000 }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {children}
    </motion.div>
  );
}

// Stat counter card
function StatCard({ stat }: { stat: typeof stats[0] }) {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const count = useCounter(stat.value, inView);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setInView(true); }, { threshold: 0.4 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="stat-card">
      <span className="stat-number">{count}{stat.suffix}</span>
      <span className="stat-label">{stat.label}</span>
    </div>
  );
}

export default function Home() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [mouse, setMouse] = useState({ x: -200, y: -200 });
  const [filter, setFilter] = useState("All");
  const videoRefs = useRef<Record<number, HTMLVideoElement | null>>({});
  const timeouts = useRef<Record<number, number>>({});
  const { scrollYProgress } = useScroll();
  const heroParallax = useTransform(scrollYProgress, [0, 0.4], ["0%", "28%"]);
  const progressBar = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const particles = useMemo(
    () =>
      Array.from({ length: 28 }, (_, idx) => ({
        id: idx,
        top: `${(idx * 37) % 100}%`,
        left: `${(idx * 23) % 100}%`,
        delay: `${(idx % 8) * 0.7}s`,
        duration: `${7 + (idx % 5)}s`,
        size: idx % 3 === 0 ? 8 : idx % 3 === 1 ? 5 : 4,
      })),
    [],
  );

  // Doubled marquee items for seamless loop
  const allMarquee = [...marqueeItems, ...marqueeItems];

  const categories = ["All", "Film", "Web", "Social"];
  const filtered = filter === "All" ? projects : projects.filter((p) => p.category === filter);

  useEffect(() => {
    const handlePointer = (event: PointerEvent) => setMouse({ x: event.clientX, y: event.clientY });
    window.addEventListener("pointermove", handlePointer);
    return () => window.removeEventListener("pointermove", handlePointer);
  }, []);

  useEffect(() => {
    document.body.style.overflow = selectedProject ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [selectedProject]);

  const handleVideoEnter = (id: number) => {
    const el = videoRefs.current[id];
    if (!el) return;
    window.clearTimeout(timeouts.current[id]);
    el.currentTime = 0;
    el.muted = true;
    el.play().catch(() => null);
    timeouts.current[id] = window.setTimeout(() => {
      el.pause();
      el.currentTime = 0;
    }, 5000);
  };

  const handleVideoLeave = (id: number) => {
    const el = videoRefs.current[id];
    if (!el) return;
    window.clearTimeout(timeouts.current[id]);
    el.pause();
    el.currentTime = 0;
  };

  return (
    <main className="portfolio-page">
      {/* Scroll progress bar */}
      <motion.div className="scroll-progress" style={{ width: progressBar }} />

      {/* Custom cursor */}
      <motion.div
        className="cursor-glow"
        animate={{ x: mouse.x - 120, y: mouse.y - 120 }}
        transition={{ type: "spring", stiffness: 120, damping: 20, mass: 0.15 }}
      />

      {/* Ambient background */}
      <div className="ambient-bg">
        <div className="blob blob-one" />
        <div className="blob blob-two" />
        <div className="blob blob-three" />
        <div className="blob blob-four" />
        <div className="glow-line glow-line-one" />
        <div className="glow-line glow-line-two" />
        <div className="glow-line glow-line-three" />
        {/* Orbiting rings */}
        <div className="orbit-ring orbit-ring-one" />
        <div className="orbit-ring orbit-ring-two" />
        <div className="orbit-ring orbit-ring-three" />
        {/* Floating geometric shapes */}
        <div className="geo-shape geo-triangle" />
        <div className="geo-shape geo-diamond" />
        <div className="geo-shape geo-circle" />
        <div className="geo-shape geo-square" />
        {particles.map((p) => (
          <span
            key={p.id}
            className="particle"
            style={{
              top: p.top,
              left: p.left,
              animationDelay: p.delay,
              animationDuration: p.duration,
              width: p.size,
              height: p.size,
            }}
          />
        ))}
        {/* Morphing SVG blob */}
        <svg className="morph-svg" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="morphGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#e8d8ff" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#c8e8ff" stopOpacity="0" />
            </radialGradient>
          </defs>
          <path fill="url(#morphGrad)" className="morph-path">
            <animate
              attributeName="d"
              dur="12s"
              repeatCount="indefinite"
              values="
                M250,80 C350,80 420,150 420,250 C420,350 350,420 250,420 C150,420 80,350 80,250 C80,150 150,80 250,80 Z;
                M270,70 C380,90 430,170 410,270 C390,370 310,430 210,410 C110,390 70,310 90,210 C110,110 160,50 270,70 Z;
                M240,90 C340,60 430,140 440,250 C450,360 370,440 260,430 C150,420 60,350 70,240 C80,130 140,120 240,90 Z;
                M250,80 C350,80 420,150 420,250 C420,350 350,420 250,420 C150,420 80,350 80,250 C80,150 150,80 250,80 Z
              "
            />
          </path>
        </svg>
      </div>

      {/* Sticky nav */}
      <header className="site-nav">
        <a href="#home" className="brand">Aether<span className="brand-dot">.</span></a>
        <nav>
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a href="#process">Process</a>
          <a href="#contact">Contact</a>
        </nav>
        <a href="#contact" className="nav-cta">Hire Me</a>
      </header>

      {/* ── HERO ── */}
      <section id="home" className="hero section-shell">
        <motion.div style={{ y: heroParallax }} className="hero-content">
          <motion.p
            className="eyebrow"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Sparkles size={14} /> Creative Developer & Video Editor
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1 }}
          >
            Designing websites &amp;{" "}
            <span className="hero-gradient-text">cinematic videos</span> that clients remember.
          </motion.h1>
          <motion.p
            className="hero-copy"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
          >
            I help brands stand out through immersive web experiences and high-end visual edits
            that drive trust and inquiries.
          </motion.p>
          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3 }}
          >
            <a href="#work" className="btn btn-primary">View My Work</a>
            <a href="#contact" className="btn btn-secondary">
              Let&apos;s Build Something <ChevronRight size={15} />
            </a>
          </motion.div>
        </motion.div>

        {/* Hero floating cards */}
        <motion.div
          className="hero-float-card hero-float-card-1"
          initial={{ opacity: 0, x: 60, y: -20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 1.1, delay: 0.6 }}
        >
          <span className="float-dot" />
          <div>
            <p className="float-card-title">Latest Project</p>
            <p className="float-card-sub">Social Story Edit Pack</p>
          </div>
        </motion.div>
        <motion.div
          className="hero-float-card hero-float-card-2"
          initial={{ opacity: 0, x: 60, y: 20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 1.1, delay: 0.75 }}
        >
          <span className="float-check">✓</span>
          <div>
            <p className="float-card-title">Available for work</p>
            <p className="float-card-sub">Starting April 2026</p>
          </div>
        </motion.div>
      </section>

      {/* ── MARQUEE TICKER ── */}
      <div className="marquee-wrap">
        <div className="marquee-track">
          {allMarquee.map((item, i) => (
            <span key={i} className="marquee-item">
              {item} <span className="marquee-dot">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── STATS ── */}
      <section className="section-shell stats-section">
        <div className="stats-grid">
          {stats.map((s) => <StatCard key={s.label} stat={s} />)}
        </div>
      </section>

      {/* ── PORTFOLIO ── */}
      <section id="work" className="section-shell">
        <motion.div
          className="section-heading"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.6 }}
        >
          <p>Portfolio</p>
          <h2>Selected Work</h2>
        </motion.div>

        {/* Filter tabs */}
        <div className="filter-tabs">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-btn ${filter === cat ? "active" : ""}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <AnimatePresence mode="popLayout">
          <div className="portfolio-grid">
            {filtered.map((project, idx) => (
              <motion.article
                className="project-card"
                key={project.id}
                layout
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.45, delay: idx * 0.04 }}
                onMouseEnter={() => handleVideoEnter(project.id)}
                onMouseLeave={() => handleVideoLeave(project.id)}
              >
                <button
                  className="project-media"
                  onClick={() => setSelectedProject(project)}
                  aria-label={project.title}
                >
                  <video
                    ref={(el) => { videoRefs.current[project.id] = el; }}
                    preload="metadata"
                    poster={project.poster}
                    src={project.video}
                    muted
                    loop
                    playsInline
                  />
                  <span className="project-category-badge">{project.category}</span>
                  <span className="play-chip">
                    <Play size={13} /> Preview
                  </span>
                  <div className="project-overlay">
                    <span className="overlay-play-btn">
                      <Play size={22} />
                    </span>
                  </div>
                </button>
                <div className="project-info">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <button className="project-link-btn" onClick={() => setSelectedProject(project)}>
                    Watch Film <ArrowUpRight size={14} />
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        </AnimatePresence>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className="section-shell about-section">
        <motion.div
          className="about-left"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65 }}
        >
          <p className="section-kicker">About Me</p>
          <h2>A creative freelancer blending code, story &amp; motion.</h2>
          <p className="section-copy">
            I partner with founders, creators, and modern brands to craft memorable web
            experiences and visually rich edits. My process combines strategy, design taste,
            and technical execution for results that look premium and perform.
          </p>
          <p className="section-copy" style={{ marginTop: "1rem" }}>
            Whether it&apos;s a launch film, a conversion site, or a full brand identity — I treat
            every project as a story worth telling beautifully.
          </p>
          <a href="#contact" className="btn btn-primary" style={{ marginTop: "1.8rem" }}>
            Work With Me
          </a>
        </motion.div>

        <motion.div
          className="about-right"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65, delay: 0.1 }}
        >
          {/* Animated portrait/visual card */}
          <TiltCard className="about-visual-card">
            <div className="about-visual-inner">
              <div className="about-avatar-ring">
                <div className="about-avatar-pulse" />
                <img
                  src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80"
                  alt="Creative freelancer portrait"
                  className="about-avatar"
                />
              </div>
              <div className="about-card-badges">
                <span className="badge badge-lavender">✦ UI / UX</span>
                <span className="badge badge-blue">▶ Film Edit</span>
                <span className="badge badge-pink">◈ Motion</span>
              </div>
              <div className="about-card-glow" />
            </div>
          </TiltCard>

          {/* Floating mini stat cards around portrait */}
          <motion.div
            className="about-mini-card"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="mini-card-emoji">🏆</span>
            <div>
              <p className="mini-card-title">18 Awards</p>
              <p className="mini-card-sub">& Features</p>
            </div>
          </motion.div>
          <motion.div
            className="about-mini-card about-mini-card-2"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
          >
            <span className="mini-card-emoji">⚡</span>
            <div>
              <p className="mini-card-title">48h Delivery</p>
              <p className="mini-card-sub">Rush available</p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── PROCESS ── */}
      <section id="process" className="section-shell">
        <motion.div
          className="section-heading"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.6 }}
        >
          <p>How It Works</p>
          <h2>My Creative Process</h2>
        </motion.div>
        <div className="process-grid">
          {processSteps.map((step, idx) => (
            <motion.div
              key={step.num}
              className="process-card"
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <span className="process-num">{step.num}</span>
              <h3 className="process-title">{step.title}</h3>
              <p className="process-desc">{step.desc}</p>
              {idx < processSteps.length - 1 && <span className="process-connector" />}
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── REEL STRIP ── */}
      <div className="reel-strip">
        <div className="reel-track">
          {[...projects, ...projects].map((p, i) => (
            <div key={i} className="reel-frame">
              <img src={p.poster} alt={p.title} />
            </div>
          ))}
        </div>
      </div>

      {/* ── TESTIMONIALS ── */}
      <section className="section-shell">
        <motion.div
          className="section-heading"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.6 }}
        >
          <p>Testimonials</p>
          <h2>What Clients Say</h2>
        </motion.div>
        <div className="testimonials-grid">
          {testimonials.map((item, idx) => (
            <motion.blockquote
              key={item.author}
              className="testimonial-card"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <div className="testimonial-stars">
                {"★".repeat(item.stars)}
              </div>
              <p>&ldquo;{item.quote}&rdquo;</p>
              <footer>
                <img src={item.avatar} alt={item.author} className="testimonial-avatar" />
                <div>
                  <strong>{item.author}</strong>
                  <span>{item.role}</span>
                </div>
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className="section-shell contact-section">
        <motion.div
          className="contact-copy"
          initial={{ opacity: 0, x: -28 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <p className="section-kicker">Contact</p>
          <h2>Let&apos;s create something people can&apos;t ignore.</h2>
          <p className="contact-sub">
            Whether you have a project in mind or just want to explore what&apos;s possible — I&apos;d love to hear from you.
          </p>
          <a href="mailto:hello@aetherstudio.co" className="contact-email-link">
            <Mail size={16} /> hello@aetherstudio.co
          </a>
          <div className="socials">
            <a href="#" className="social-pill" aria-label="Instagram">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              Instagram
            </a>
            <a href="#" className="social-pill" aria-label="Behance">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.051-1.658-5.051-5.001 0-3.44 2.015-5.068 5.061-5.068 2.943 0 4.651 1.595 5.061 4.001.135.763.194 2.047.063 3.068h-7.298c.068 1.773 1.35 2.15 2.569 2.15 1.354 0 2.014-.644 2.366-1.319l2.33.169zm-7.12-3.5h4.382c.132-1.162-.538-1.945-2.057-1.945-1.465 0-2.193.808-2.325 1.945zm-11.806 5.5h-3.8v-14h3.8c1.4 0 2.5 1.1 2.5 2.5v.167c0 .833-.5 1.583-1.167 2 .834.417 1.5 1.25 1.5 2.167v.167c0 1.666-1.167 2.999-2.833 2.999zm-1-8.499c.667 0 1.2-.533 1.2-1.199v-.167c0-.666-.533-1.2-1.2-1.2h-1.8v2.566h1.8zm.2 5.032c.833 0 1.4-.6 1.4-1.399v-.167c0-.8-.567-1.399-1.4-1.399h-2v2.965h2z"/></svg>
              Behance
            </a>
            <a href="#" className="social-pill" aria-label="LinkedIn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              LinkedIn
            </a>
          </div>
        </motion.div>

        <motion.form
          className="contact-form"
          initial={{ opacity: 0, x: 28 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="name">Name</label>
              <input id="name" name="name" placeholder="Your name" required />
            </div>
            <div className="form-field">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" name="email" placeholder="you@brand.com" required />
            </div>
          </div>
          <div className="form-field">
            <label htmlFor="service">Service Needed</label>
            <select id="service" name="service">
              <option>Video Editing</option>
              <option>Website Design</option>
              <option>Motion Graphics</option>
              <option>Full Brand Package</option>
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="message">Project Brief</label>
            <textarea id="message" name="message" placeholder="Tell me what you're building..." rows={4} required />
          </div>
          <button type="submit" className="btn btn-primary btn-full">
            <Mail size={16} /> Send Inquiry
          </button>
        </motion.form>
      </section>

      {/* ── FOOTER ── */}
      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <span className="brand">Aether<span className="brand-dot">.</span></span>
            <p>Crafted for standout brands. Available worldwide.</p>
          </div>
          <div className="footer-links">
            <a href="#work">Work</a>
            <a href="#about">About</a>
            <a href="#process">Process</a>
            <a href="#contact">Contact</a>
          </div>
          <div className="footer-right">
            <p>© {new Date().getFullYear()} Aether Studio.</p>
            <a href="#home">Back to top <ArrowUpRight size={13} /></a>
          </div>
        </div>
      </footer>

      {/* ── VIDEO MODAL ── */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="video-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              className="video-modal-inner"
              initial={{ y: 24, opacity: 0, scale: 0.97 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 14, opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.28 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <div>
                  <span className="modal-category">{selectedProject.category}</span>
                  <h3>{selectedProject.title}</h3>
                </div>
                <button className="modal-close" onClick={() => setSelectedProject(null)} aria-label="Close">
                  <X size={18} />
                </button>
              </div>
              <video src={selectedProject.video} controls autoPlay playsInline poster={selectedProject.poster} />
              <p className="modal-desc">{selectedProject.description}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
