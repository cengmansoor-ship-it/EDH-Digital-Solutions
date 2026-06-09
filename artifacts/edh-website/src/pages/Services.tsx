import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Monitor, Code2, Bot, Brain, BarChart3, Palette, Server,
  ShieldCheck, TrendingUp, Layers, Globe, Smartphone, Cloud,
  Database, Lock, Zap, ArrowRight, ChevronDown, type LucideIcon,
} from "lucide-react";
import { Link as WouterLink } from "wouter";
import { Button } from "@/components/ui/button";
import { useListServices } from "@workspace/api-client-react";

const ICON_MAP: Record<string, LucideIcon> = {
  Monitor, Code2, Bot, Brain, BarChart3, Palette, Server, ShieldCheck,
  TrendingUp, Layers, Globe, Smartphone, Cloud, Database, Lock, Zap,
};

const ACCENTS = [
  "#00b4d8", "#7c3aed", "#10b981", "#f59e0b",
  "#0ea5e9", "#ec4899", "#64748b", "#22c55e",
  "#f97316", "#a855f7", "#06b6d4", "#ef4444",
];

const GRADIENTS = [
  "from-blue-500/10 to-cyan-500/5",
  "from-violet-500/10 to-purple-500/5",
  "from-emerald-500/10 to-teal-500/5",
  "from-amber-500/10 to-orange-500/5",
  "from-sky-500/10 to-blue-500/5",
  "from-pink-500/10 to-rose-500/5",
  "from-slate-500/10 to-gray-500/5",
  "from-green-500/10 to-emerald-500/5",
  "from-orange-500/10 to-amber-500/5",
  "from-fuchsia-500/10 to-pink-500/5",
  "from-cyan-500/10 to-teal-500/5",
  "from-red-500/10 to-orange-500/5",
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

interface ServiceCardProps {
  title: string;
  description: string;
  icon: string;
  index: number;
}

function ServiceCard({ title, description, icon, index }: ServiceCardProps) {
  const [expanded, setExpanded] = useState(false);
  const accent = ACCENTS[index % ACCENTS.length];
  const gradient = GRADIENTS[index % GRADIENTS.length];
  const Icon: LucideIcon = ICON_MAP[icon] ?? Globe;

  return (
    <FadeIn delay={index * 0.06}>
      <motion.div
        whileHover={{ y: -4 }}
        className="bg-card border border-border/50 rounded-2xl overflow-hidden group transition-shadow hover:shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:border-primary/20 h-full flex flex-col"
      >
        <div
          className="h-1 w-full"
          style={{ background: `linear-gradient(to right, ${accent}88, ${accent}22)` }}
        />
        <div className="p-6 flex flex-col flex-1">
          <div className="flex items-start gap-4 mb-4">
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}
              style={{ border: `1px solid ${accent}33` }}
            >
              <Icon size={22} style={{ color: accent }} />
            </div>
            <h2 className="font-display font-semibold text-base leading-snug mt-1">{title}</h2>
          </div>

          <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-1">{description}</p>

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
                  <p className="text-sm text-muted-foreground italic">Contact us to learn more about this service and get a custom quote.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between pt-1">
            <button
              onClick={() => setExpanded(!expanded)}
              className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
              style={{ color: accent }}
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
  const { data: services = [], isLoading } = useListServices();

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4 md:px-6">

        <FadeIn>
          <div className="text-center mb-6">
            <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">What We Offer</p>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Our Services</h1>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <p className="text-muted-foreground text-center max-w-3xl mx-auto mb-16 leading-relaxed text-base">
            At EDH Technology, we provide professional digital solutions for businesses, startups, and organizations that want to build, improve, and scale their online presence. Our team combines technical expertise, creative thinking, and real project experience to deliver reliable, modern, and business‑focused services. We focus on practical solutions, clean communication, transparent workflow, and long‑term client satisfaction.
          </p>
        </FadeIn>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-24">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-card border border-border/50 rounded-2xl p-6 animate-pulse">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary flex-shrink-0" />
                  <div className="h-5 bg-secondary rounded w-3/4 mt-1" />
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-secondary rounded w-full" />
                  <div className="h-3 bg-secondary rounded w-5/6" />
                  <div className="h-3 bg-secondary rounded w-4/6" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-24">
            {(services as Array<{ id: number; title: string; description: string; icon: string; order: number }>)
              .sort((a, b) => a.order - b.order)
              .map((service, i) => (
                <ServiceCard
                  key={service.id}
                  title={service.title}
                  description={service.description}
                  icon={service.icon}
                  index={i}
                />
              ))}
          </div>
        )}

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
