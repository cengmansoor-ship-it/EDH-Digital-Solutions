import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Monitor, Code2, Bot, Brain, BarChart3, Palette, Server,
  ShieldCheck, TrendingUp, Layers, ArrowRight, ChevronDown, Check,
} from "lucide-react";
import { Link as WouterLink } from "wouter";
import { Button } from "@/components/ui/button";

const SERVICES = [
  {
    id: 1,
    icon: Monitor,
    title: "Remote NOC & Network Operations Support",
    description:
      "At EDH Technology, we provide reliable Remote NOC and Network Operations Support for businesses that need stable, monitored, and well-managed IT infrastructure. Our team supports network monitoring, incident response, system availability, troubleshooting, escalation handling, and remote technical operations. We help companies maintain smooth operations by identifying issues early, reducing downtime, and supporting IT teams with professional remote network operations assistance.",
    benefits: [
      "Remote Network Monitoring",
      "Incident Response Support",
      "Improved System Availability",
      "Professional NOC Experience",
      "Cost-Effective Remote Support",
    ],
    color: "from-blue-500/10 to-cyan-500/5",
    accent: "#00b4d8",
  },
  {
    id: 2,
    icon: Code2,
    title: "Custom Software & Business Management Systems",
    description:
      "We design and develop custom software solutions and business management systems tailored to your specific operational needs. Whether you need an ERP, CRM, inventory management system, or a bespoke internal tool, our team builds scalable, secure, and user-friendly platforms that streamline your business processes and drive measurable efficiency gains.",
    benefits: [
      "Fully Tailored to Your Workflow",
      "Scalable & Future-Proof Architecture",
      "Secure Role-Based Access Control",
      "Integrated Reporting & Analytics",
      "Ongoing Maintenance & Support",
    ],
    color: "from-violet-500/10 to-purple-500/5",
    accent: "#7c3aed",
  },
  {
    id: 3,
    icon: Bot,
    title: "AI Chatbot Development",
    description:
      "We build intelligent, conversational AI chatbots that automate customer support, lead generation, FAQs, and internal workflows. Our chatbots are trained on your business data, integrate with your existing systems, and can be deployed across websites, mobile apps, and messaging platforms — delivering 24/7 automated assistance that feels natural and effective.",
    benefits: [
      "24/7 Automated Customer Support",
      "Natural Language Understanding",
      "Multi-Platform Deployment",
      "Custom Training on Your Data",
      "Seamless CRM & API Integration",
    ],
    color: "from-emerald-500/10 to-teal-500/5",
    accent: "#10b981",
  },
  {
    id: 4,
    icon: Brain,
    title: "ChatGPT & AI Integration",
    description:
      "We help businesses integrate the power of ChatGPT and other leading AI models directly into their products, platforms, and workflows. From AI-powered content generation and smart search to document analysis and intelligent automation, we make advanced AI practical, affordable, and impactful for your specific use case.",
    benefits: [
      "OpenAI & GPT-4 Integration",
      "AI-Powered Content Generation",
      "Smart Document Analysis",
      "Workflow Automation with AI",
      "Replaceable API Architecture",
    ],
    color: "from-amber-500/10 to-orange-500/5",
    accent: "#f59e0b",
  },
  {
    id: 5,
    icon: BarChart3,
    title: "Big Data Analytics",
    description:
      "Turn your raw data into actionable business intelligence. Our Big Data Analytics services include data pipeline engineering, real-time dashboards, predictive modelling, and reporting systems that give your leadership team the insights they need to make faster, smarter decisions — at any scale.",
    benefits: [
      "Real-Time Analytics Dashboards",
      "Predictive & Prescriptive Modelling",
      "Data Pipeline Engineering",
      "Business Intelligence Reporting",
      "Scalable Cloud Data Infrastructure",
    ],
    color: "from-sky-500/10 to-blue-500/5",
    accent: "#0ea5e9",
  },
  {
    id: 6,
    icon: Palette,
    title: "UI/UX Design",
    description:
      "Great software starts with great design. Our UI/UX team creates human-centred experiences through deep user research, wireframing, prototyping, and polished high-fidelity interfaces. We build design systems that scale and deliver consistent, accessible experiences across web and mobile — aligned with your brand identity.",
    benefits: [
      "User Research & Journey Mapping",
      "Wireframes & Interactive Prototypes",
      "Scalable Design Systems",
      "Responsive & Mobile-First Design",
      "Accessibility (WCAG) Compliance",
    ],
    color: "from-pink-500/10 to-rose-500/5",
    accent: "#ec4899",
  },
  {
    id: 7,
    icon: Server,
    title: "DevOps & Deployment Support",
    description:
      "We accelerate your delivery pipeline with modern DevOps practices — CI/CD automation, containerisation with Docker and Kubernetes, infrastructure as code, cloud deployment on AWS/Azure/GCP, and proactive monitoring. Our goal is faster, more reliable releases with zero-downtime deployments.",
    benefits: [
      "CI/CD Pipeline Automation",
      "Docker & Kubernetes Deployment",
      "Infrastructure as Code (Terraform)",
      "Multi-Cloud Support (AWS/Azure/GCP)",
      "24/7 Monitoring & Alerting",
    ],
    color: "from-slate-500/10 to-gray-500/5",
    accent: "#64748b",
  },
  {
    id: 8,
    icon: ShieldCheck,
    title: "QA Testing & Bug Fixing",
    description:
      "We ensure your software is robust, reliable, and ready for production. Our QA engineers design and execute comprehensive test strategies — functional, regression, performance, and security testing — using both automated frameworks and manual review. We identify and fix bugs before your users do.",
    benefits: [
      "Automated Test Suite Development",
      "Manual Exploratory Testing",
      "Performance & Load Testing",
      "Security & Vulnerability Testing",
      "Detailed Bug Reports & Fixes",
    ],
    color: "from-green-500/10 to-emerald-500/5",
    accent: "#22c55e",
  },
  {
    id: 9,
    icon: TrendingUp,
    title: "Digital Marketing Support",
    description:
      "We support your growth with data-driven digital marketing strategies — SEO optimisation, content marketing, social media management, email campaigns, and paid advertising. Our team helps you reach the right audience, build brand authority, and convert traffic into loyal customers.",
    benefits: [
      "SEO & Search Visibility",
      "Social Media Management",
      "Email Marketing Campaigns",
      "Paid Advertising (Google/Meta)",
      "Analytics & Performance Reporting",
    ],
    color: "from-orange-500/10 to-amber-500/5",
    accent: "#f97316",
  },
  {
    id: 10,
    icon: Layers,
    title: "Creative Design & Content Support",
    description:
      "From brand identity and logo design to marketing materials, social media graphics, and video content — our creative team produces visually compelling assets that communicate your brand message with impact. We combine design excellence with strategic thinking to make your brand stand out.",
    benefits: [
      "Brand Identity & Logo Design",
      "Marketing & Print Collateral",
      "Social Media Visual Content",
      "Motion Graphics & Video Editing",
      "Content Strategy & Copywriting",
    ],
    color: "from-fuchsia-500/10 to-pink-500/5",
    accent: "#a855f7",
  },
];

const PROCESS = [
  { step: "01", title: "Plan", desc: "We work closely with you to understand your goals, map user journeys, and architect the right solution." },
  { step: "02", title: "Build", desc: "Our engineers build with precision — clean code, scalable architecture, and modern best practices." },
  { step: "03", title: "Test", desc: "Every release goes through rigorous automated and manual QA — zero tolerance for production bugs." },
  { step: "04", title: "Launch", desc: "We handle deployment, monitoring, and post-launch support so your product stays live and performant." },
];

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );
}

function ServiceCard({ service, index }: { service: typeof SERVICES[0]; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = service.icon;

  return (
    <FadeIn delay={index * 0.06}>
      <motion.div
        whileHover={{ y: -4 }}
        className="bg-card border border-border/50 rounded-2xl overflow-hidden group transition-shadow hover:shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:border-primary/20 h-full flex flex-col"
      >
        {/* Top accent bar */}
        <div
          className={`h-1 w-full bg-gradient-to-r`}
          style={{ background: `linear-gradient(to right, ${service.accent}88, ${service.accent}22)` }}
        />

        <div className="p-6 flex flex-col flex-1">
          {/* Icon + title */}
          <div className="flex items-start gap-4 mb-4">
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}
              style={{ border: `1px solid ${service.accent}33` }}
            >
              <Icon size={22} style={{ color: service.accent }} />
            </div>
            <h2 className="font-display font-semibold text-base leading-snug mt-1">
              {service.title}
            </h2>
          </div>

          {/* Description */}
          <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-1">
            {service.description}
          </p>

          {/* Benefits */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="border-t border-border/40 pt-4 mb-4">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Key Benefits</p>
                  <ul className="space-y-2">
                    {service.benefits.map((b) => (
                      <li key={b} className="flex items-center gap-2 text-sm">
                        <Check size={13} style={{ color: service.accent }} className="flex-shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions */}
          <div className="flex items-center justify-between pt-1">
            <button
              onClick={() => setExpanded(!expanded)}
              aria-label={expanded ? "Collapse details" : "Learn more"}
              className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
              style={{ color: service.accent }}
            >
              {expanded ? "Show less" : "Learn more"}
              <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown size={15} />
              </motion.span>
            </button>
            <WouterLink href="/contact">
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                Get a quote <ArrowRight size={12} />
              </span>
            </WouterLink>
          </div>
        </div>
      </motion.div>
    </FadeIn>
  );
}

export default function Services() {
  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4 md:px-6">

        {/* Header */}
        <FadeIn>
          <div className="text-center mb-6">
            <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">What We Offer</p>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Our Services</h1>
          </div>
        </FadeIn>

        {/* Intro paragraph (exact wording) */}
        <FadeIn delay={0.1}>
          <p className="text-muted-foreground text-center max-w-3xl mx-auto mb-16 leading-relaxed text-base">
            At EDH Technology, we provide professional digital solutions for businesses, startups, and organizations that want to build, improve, and scale their online presence. Our team combines technical expertise, creative thinking, and real project experience to deliver reliable, modern, and business‑focused services. We focus on practical solutions, clean communication, transparent workflow, and long‑term client satisfaction.
          </p>
        </FadeIn>

        {/* Services grid — 2 col desktop, 1 col mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-24">
          {SERVICES.map((service, i) => (
            <ServiceCard key={service.id} service={service} index={i} />
          ))}
        </div>

        {/* Process */}
        <FadeIn>
          <div className="text-center mb-12">
            <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">How We Work</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold">Plan • Build • Test • Launch</h2>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {PROCESS.map((step, i) => (
            <FadeIn key={step.step} delay={i * 0.1}>
              <div className="relative">
                <div className="bg-card border border-border/50 rounded-2xl p-6 h-full">
                  <span className="text-4xl font-display font-bold text-primary/20">{step.step}</span>
                  <h3 className="font-display font-semibold text-xl mt-2 mb-3">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
                </div>
                {i < PROCESS.length - 1 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-3 z-10 text-primary/30">
                    <ArrowRight size={20} />
                  </div>
                )}
              </div>
            </FadeIn>
          ))}
        </div>

        {/* CTA */}
        <FadeIn>
          <div className="bg-gradient-to-r from-primary/10 to-secondary/30 border border-border/50 rounded-3xl p-10 text-center">
            <h2 className="text-3xl font-display font-bold mb-3">Ready to Get Started?</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Tell us about your project and we'll craft the right approach for you — no obligation, just a conversation.
            </p>
            <WouterLink href="/contact">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground rounded-full px-10 shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:shadow-[0_0_35px_rgba(0,240,255,0.5)] font-semibold transition-all"
              >
                Let&apos;s Build Your Digital Solution <ArrowRight size={18} className="ml-2" />
              </Button>
            </WouterLink>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
