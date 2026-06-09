import { useRef } from "react";
import { Link } from "wouter";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Globe, Smartphone, Brain, Cloud, Palette, ShieldCheck, TrendingUp, Plug, ExternalLink, MapPin, Mail, Phone, ChevronRight, Monitor, Code2, Bot, BarChart3, Server, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useListServices, useListProjects, useSubmitContact, getListServicesQueryKey } from "@workspace/api-client-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import edhLogo from "@assets/EDH_technalogy_Logo_01_1780917940904.png";

const iconMap: Record<string, React.ReactNode> = {
  Globe: <Globe size={28} />,
  Smartphone: <Smartphone size={28} />,
  Brain: <Brain size={28} />,
  Cloud: <Cloud size={28} />,
  Palette: <Palette size={28} />,
  ShieldCheck: <ShieldCheck size={28} />,
  TrendingUp: <TrendingUp size={28} />,
  Plug: <Plug size={28} />,
  Monitor: <Monitor size={28} />,
  Code2: <Code2 size={28} />,
  Bot: <Bot size={28} />,
  BarChart3: <BarChart3 size={28} />,
  Server: <Server size={28} />,
  Layers: <Layers size={28} />,
};

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  subject: z.string().min(2, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactForm = z.infer<typeof contactSchema>;

function FadeInSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

const locations = [
  { country: "Afghanistan", city: "Kandahar", flag: "🇦🇫", desc: "Remote freelancing team serving Central Asia" },
  { country: "Egypt", city: "Remote", flag: "🇪🇬", desc: "Remote freelancing team for Middle East & North Africa" },
  { country: "Indonesia", city: "Remote", flag: "🇮🇩", desc: "Remote freelancing team for Southeast Asia" },
  { country: "Thailand", city: "Remote", flag: "🇹🇭", desc: "Remote freelancing team for regional delivery" },
];

const stats = [
  { value: "8+", label: "Years of Experience" },
  { value: "120+", label: "Projects Delivered" },
  { value: "4", label: "Countries" },
  { value: "50+", label: "Happy Clients" },
];

interface DbProject {
  id: number;
  title: string;
  description: string;
  category: string;
  tags: string[];
  deployUrl: string | null;
  featured: boolean;
}

export default function Home() {
  const { data: dbProjects = [] } = useListProjects();
  const { data: services = [] } = useListServices({ query: { queryKey: getListServicesQueryKey() } });
  const submitContact = useSubmitContact();
  const { toast } = useToast();

  const form = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });

  const allProjects = dbProjects as DbProject[];
  const featuredProjects = (allProjects.filter(p => p.featured).length > 0
    ? allProjects.filter(p => p.featured)
    : allProjects
  ).slice(0, 3);
  const displayServices = (services as Array<{ id: number; title: string; description: string; icon: string; order: number }>)
    .sort((a, b) => a.order - b.order)
    .slice(0, 6);

  const onSubmit = async (data: ContactForm) => {
    try {
      await submitContact.mutateAsync({ data });
      toast({ title: "Message sent!", description: "We'll get back to you within 24 hours." });
      form.reset();
    } catch {
      toast({ title: "Error", description: "Failed to send message. Please try again.", variant: "destructive" });
    }
  };

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/20" />
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent"
              style={{ left: `${(i + 1) * 5}%`, height: "100%" }}
              animate={{ opacity: [0, 0.5, 0] }}
              transition={{ duration: 3 + i * 0.2, repeat: Infinity, delay: i * 0.3 }}
            />
          ))}
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={`dot-${i}`}
              className="absolute w-1 h-1 rounded-full bg-primary/40"
              style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
              animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
              transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 4 }}
            />
          ))}
        </div>

        <div className="relative z-10 container mx-auto px-4 md:px-6 text-center pt-24">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-8 text-sm text-primary font-medium">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Plan &bull; Build &bull; Test &bull; Launch
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-tight mb-6"
          >
            Let&apos;s Build Your
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400">
              Digital Solution
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            EDH Technology is an international freelancing software agency delivering world-class web, mobile, and AI solutions remotely for companies across Afghanistan, Egypt, Indonesia, Thailand, and beyond.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link href="/contact">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:shadow-[0_0_35px_rgba(0,240,255,0.5)] transition-all rounded-full px-8 font-semibold text-base">
                Start Your Project <ArrowRight size={18} className="ml-2" />
              </Button>
            </Link>
            <Link href="/projects">
              <Button size="lg" variant="outline" className="border-border/60 hover:border-primary/50 rounded-full px-8 font-semibold text-base">
                View Our Work
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 max-w-2xl mx-auto"
          >
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl md:text-4xl font-display font-bold text-primary">{s.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground"
        >
          <ChevronRight size={24} className="rotate-90 opacity-40" />
        </motion.div>
      </section>

      {/* Services */}
      <section className="py-24 bg-secondary/10">
        <div className="container mx-auto px-4 md:px-6">
          <FadeInSection>
            <div className="text-center mb-16">
              <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">What We Do</p>
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">Our Services</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">End-to-end digital solutions from strategy through delivery — we partner with you at every stage.</p>
            </div>
          </FadeInSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(displayServices as Array<{ id: number; title: string; description: string; icon: string }>).map((service, i) => (
              <FadeInSection key={service.id} delay={i * 0.08}>
                <motion.div
                  whileHover={{ y: -4, boxShadow: "0 0 25px rgba(0,240,255,0.12)" }}
                  className="bg-card border border-border/50 rounded-2xl p-6 cursor-pointer transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:bg-primary/20 transition-colors">
                    {iconMap[service.icon] ?? <Globe size={28} />}
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-2">{service.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{service.description}</p>
                </motion.div>
              </FadeInSection>
            ))}
          </div>

          <FadeInSection delay={0.3}>
            <div className="text-center mt-12">
              <Link href="/services">
                <Button variant="outline" className="border-primary/30 hover:border-primary rounded-full px-8">
                  View All Services <ArrowRight size={16} className="ml-2" />
                </Button>
              </Link>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-24">
        <div className="container mx-auto px-4 md:px-6">
          <FadeInSection>
            <div className="text-center mb-16">
              <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">Our Work</p>
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">Featured Projects</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">A selection of our most impactful builds across industries and geographies.</p>
            </div>
          </FadeInSection>

          {featuredProjects.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>Projects coming soon — check back after we load our portfolio.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProjects.map((project, i) => (
                <FadeInSection key={project.id} delay={i * 0.1}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="bg-card border border-border/50 rounded-2xl overflow-hidden group"
                  >
                    <div className="h-40 bg-gradient-to-br from-primary/10 to-secondary flex items-center justify-center">
                      <div className="bg-white/10 p-3 rounded-xl">
                        <img src={edhLogo} alt="EDH Technology" className="h-8 w-auto opacity-40" />
                      </div>
                    </div>
                    <div className="p-5">
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">{project.category}</span>
                      <h3 className="font-display font-semibold text-lg mt-2 mb-2">{project.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-3 line-clamp-2">{project.description}</p>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {project.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="text-xs bg-secondary px-2 py-0.5 rounded text-muted-foreground">{tag}</span>
                        ))}
                      </div>
                      {project.deployUrl && (
                        <a href={project.deployUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-primary text-sm font-medium hover:underline">
                          Live Demo <ExternalLink size={13} />
                        </a>
                      )}
                    </div>
                  </motion.div>
                </FadeInSection>
              ))}
            </div>
          )}

          <FadeInSection delay={0.3}>
            <div className="text-center mt-12">
              <Link href="/projects">
                <Button variant="outline" className="border-primary/30 hover:border-primary rounded-full px-8">
                  View All Projects <ArrowRight size={16} className="ml-2" />
                </Button>
              </Link>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Locations */}
      <section className="py-24 bg-secondary/10">
        <div className="container mx-auto px-4 md:px-6">
          <FadeInSection>
            <div className="text-center mb-16">
              <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">Global Presence</p>
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">Our Global Reach</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">Remote freelancing teams operating across four countries — serving clients in every time zone.</p>
            </div>
          </FadeInSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {locations.map((loc, i) => (
              <FadeInSection key={loc.country} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -4, borderColor: "hsl(183, 100%, 45%, 0.4)" }}
                  className="bg-card border border-border/50 rounded-2xl p-6 text-center"
                >
                  <div className="text-4xl mb-3">{loc.flag}</div>
                  <div className="flex items-center justify-center gap-1.5 text-muted-foreground text-sm mb-1">
                    <MapPin size={12} className="text-primary" />
                    {loc.city}
                  </div>
                  <h3 className="font-display font-semibold text-xl mb-2">{loc.country}</h3>
                  <p className="text-muted-foreground text-sm">{loc.desc}</p>
                </motion.div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose EDH */}
      <section className="py-24">
        <div className="container mx-auto px-4 md:px-6">
          <FadeInSection>
            <div className="text-center mb-16">
              <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">Why EDH Technology</p>
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">Built for Results, Not Just Deliverables</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">We don't just write code — we solve business problems, ship on time, and stick around for the long haul.</p>
            </div>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Globe,
                title: "Remote-First, Global Team",
                desc: "Our distributed teams across Afghanistan, Egypt, Indonesia, and Thailand work asynchronously across every time zone — so your project never waits.",
                color: "text-cyan-400", bg: "bg-cyan-400/10",
              },
              {
                icon: ShieldCheck,
                title: "End-to-End Delivery",
                desc: "We own the full lifecycle: Plan → Build → Test → Launch. One team, one workflow, zero hand-off chaos.",
                color: "text-green-400", bg: "bg-green-400/10",
              },
              {
                icon: Brain,
                title: "AI-Native Development",
                desc: "From chatbots to GPT integrations and big data analytics — AI isn't a bolt-on for us, it's baked into how we build.",
                color: "text-violet-400", bg: "bg-violet-400/10",
              },
              {
                icon: TrendingUp,
                title: "Transparent & Agile",
                desc: "Weekly updates, clear milestones, and open communication channels. You always know exactly where your project stands.",
                color: "text-amber-400", bg: "bg-amber-400/10",
              },
              {
                icon: Layers,
                title: "Cost-Effective for Any Scale",
                desc: "Whether you're a startup or an established enterprise, our remote model delivers senior talent at a fraction of the in-house cost.",
                color: "text-pink-400", bg: "bg-pink-400/10",
              },
              {
                icon: Code2,
                title: "Long-Term Partnership",
                desc: "We don't disappear after launch. Maintenance, scaling, feature additions — we're your ongoing tech partner.",
                color: "text-sky-400", bg: "bg-sky-400/10",
              },
            ].map((item, i) => (
              <FadeInSection key={item.title} delay={i * 0.08}>
                <motion.div
                  whileHover={{ y: -4, boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}
                  className="bg-card border border-border/50 rounded-2xl p-6 group h-full"
                >
                  <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon size={22} className={item.color} />
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-24 bg-secondary/10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <FadeInSection>
              <div className="text-center mb-16">
                <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">Get In Touch</p>
                <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">Start Your Project</h2>
                <p className="text-muted-foreground max-w-xl mx-auto">Ready to build something great? Tell us about your project and we'll respond within 24 hours.</p>
              </div>
            </FadeInSection>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <FadeInSection delay={0.1}>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
                      <Mail size={18} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm mb-1">Email</p>
                      <a href="mailto:info@edhtechnalogy.com" className="text-muted-foreground text-sm hover:text-primary transition-colors">info@edhtechnalogy.com</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
                      <Phone size={18} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm mb-1">Phone</p>
                      <a href="tel:+93704243811" className="text-muted-foreground text-sm hover:text-primary transition-colors">+93 704 243 811</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
                      <Globe size={18} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm mb-1">Freelancing Presence</p>
                      <p className="text-muted-foreground text-sm">Afghanistan, Egypt, Indonesia, Thailand</p>
                    </div>
                  </div>
                </div>
              </FadeInSection>

              <FadeInSection delay={0.2} >
                <div className="md:col-span-2">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField control={form.control} name="name" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl><Input placeholder="Your name" {...field} data-testid="input-name" /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="email" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl><Input placeholder="your@email.com" {...field} data-testid="input-email" /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                      </div>
                      <FormField control={form.control} name="subject" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject</FormLabel>
                          <FormControl><Input placeholder="Project inquiry" {...field} data-testid="input-subject" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="message" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl><Textarea placeholder="Tell us about your project..." rows={4} {...field} data-testid="input-message" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <Button type="submit" disabled={submitContact.isPending} className="w-full bg-primary text-primary-foreground rounded-full font-semibold shadow-[0_0_15px_rgba(0,240,255,0.2)]" data-testid="button-submit-contact">
                        {submitContact.isPending ? "Sending..." : "Send Message"}
                      </Button>
                    </form>
                  </Form>
                </div>
              </FadeInSection>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 bg-gradient-to-r from-primary/10 via-secondary/20 to-primary/10 border-y border-border/30">
        <FadeInSection>
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">Join 50+ clients who trust EDH Technology to build their most important digital products.</p>
            <Link href="/contact">
              <Button size="lg" className="bg-primary text-primary-foreground rounded-full px-10 shadow-[0_0_25px_rgba(0,240,255,0.35)] hover:shadow-[0_0_40px_rgba(0,240,255,0.55)] font-semibold text-base transition-all">
                Let&apos;s Build Together <ArrowRight size={18} className="ml-2" />
              </Button>
            </Link>
          </div>
        </FadeInSection>
      </section>
    </div>
  );
}
