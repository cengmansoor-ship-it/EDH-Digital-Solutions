import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Globe, Smartphone, Brain, Cloud, Palette, ShieldCheck, TrendingUp, Plug, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useListServices, getListServicesQueryKey } from "@workspace/api-client-react";

const iconMap: Record<string, React.ReactNode> = {
  Globe: <Globe size={32} />,
  Smartphone: <Smartphone size={32} />,
  Brain: <Brain size={32} />,
  Cloud: <Cloud size={32} />,
  Palette: <Palette size={32} />,
  ShieldCheck: <ShieldCheck size={32} />,
  TrendingUp: <TrendingUp size={32} />,
  Plug: <Plug size={32} />,
};

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay }}>
      {children}
    </motion.div>
  );
}

const process = [
  { step: "01", title: "Plan", desc: "We work closely with you to understand your goals, map user journeys, and architect the right solution." },
  { step: "02", title: "Build", desc: "Our engineers build with precision — clean code, scalable architecture, and modern best practices." },
  { step: "03", title: "Test", desc: "Every release goes through rigorous automated and manual QA — zero tolerance for production bugs." },
  { step: "04", title: "Launch", desc: "We handle deployment, monitoring, and post-launch support so your product stays live and performant." },
];

export default function Services() {
  const { data: services = [], isLoading } = useListServices({ query: { queryKey: getListServicesQueryKey() } });

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4 md:px-6">
        <FadeIn>
          <div className="text-center mb-16">
            <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">What We Offer</p>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Our Services</h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              From concept to code to deployment — we cover the full spectrum of digital product development.
            </p>
          </div>
        </FadeIn>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-card border border-border/50 rounded-2xl p-6 animate-pulse space-y-4">
                <div className="w-12 h-12 bg-secondary rounded-xl" />
                <div className="h-5 bg-secondary rounded w-2/3" />
                <div className="h-16 bg-secondary rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
            {services.map((service, i) => (
              <FadeIn key={service.id} delay={i * 0.08}>
                <motion.div
                  whileHover={{ y: -5, boxShadow: "0 0 30px rgba(0,240,255,0.1)" }}
                  data-testid={`card-service-${service.id}`}
                  className="bg-card border border-border/50 rounded-2xl p-6 group transition-all h-full"
                >
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-5 group-hover:bg-primary/20 transition-colors">
                    {iconMap[service.icon] ?? <Globe size={32} />}
                  </div>
                  <h3 className="font-display font-semibold text-xl mb-3">{service.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{service.description}</p>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        )}

        {/* Process */}
        <FadeIn>
          <div className="text-center mb-16">
            <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">How We Work</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold">Plan • Build • Test • Launch</h2>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {process.map((step, i) => (
            <FadeIn key={step.step} delay={i * 0.1}>
              <div className="relative">
                <div className="bg-card border border-border/50 rounded-2xl p-6">
                  <span className="text-4xl font-display font-bold text-primary/20">{step.step}</span>
                  <h3 className="font-display font-semibold text-xl mt-2 mb-3">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
                </div>
                {i < process.length - 1 && (
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
            <h2 className="text-3xl font-display font-bold mb-3">Ready to Start?</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">Tell us about your project and we'll craft the right approach for you.</p>
            <Link href="/contact">
              <Button size="lg" className="bg-primary text-primary-foreground rounded-full px-10 shadow-[0_0_20px_rgba(0,240,255,0.3)] font-semibold">
                Let&apos;s Build Your Digital Solution <ArrowRight size={18} className="ml-2" />
              </Button>
            </Link>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
