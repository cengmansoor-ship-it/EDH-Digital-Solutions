import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Mail, Phone, Globe, ArrowRight, MessageCircle } from "lucide-react";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSubmitContact } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  subject: z.string().min(2, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});
type FormData = z.infer<typeof schema>;

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay }}>
      {children}
    </motion.div>
  );
}

const locations = [
  { country: "Afghanistan", city: "Kandahar", flag: "🇦🇫" },
  { country: "Egypt", city: "Dakahlia", flag: "🇪🇬" },
  { country: "Indonesia", city: "Remote", flag: "🇮🇩" },
  { country: "Thailand", city: "Bangkok", flag: "🇹🇭" },
];

const socialLinks = [
  { Icon: Facebook, label: "Facebook", href: "https://www.facebook.com/edhtechnalogy" },
  { Icon: Instagram, label: "Instagram", href: "https://www.instagram.com/edh_technalogy" },
  { Icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/company/122913941/" },
];

export default function Contact() {
  const submitContact = useSubmitContact();
  const { toast } = useToast();
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await submitContact.mutateAsync({ data });
      toast({ title: "Message sent!", description: "We'll get back to you within 24 hours." });
      form.reset();
    } catch {
      toast({ title: "Error", description: "Failed to send message. Please try again.", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4 md:px-6">
        <FadeIn>
          <div className="text-center mb-16">
            <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">Reach Out</p>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Contact Us</h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Ready to start your next project? Have a question? Our remote freelancing teams across four countries are ready to help.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 max-w-5xl mx-auto items-start">
          {/* Left column: contact info */}
          <div className="lg:col-span-2">
            <FadeIn delay={0.1}>
              <div className="space-y-8">
                <div>
                  <h2 className="font-display font-semibold text-xl mb-5">Contact Info</h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                        <Mail size={18} />
                      </div>
                      <div>
                        <p className="font-semibold text-sm mb-0.5">Email</p>
                        <a href="mailto:cengmansoor@gmail.com" className="text-muted-foreground text-sm hover:text-primary transition-colors block">
                          cengmansoor@gmail.com
                        </a>
                        <a href="mailto:info@edhtechnalogy.com" className="text-muted-foreground text-sm hover:text-primary transition-colors block">
                          info@edhtechnalogy.com
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                        <Phone size={18} />
                      </div>
                      <div>
                        <p className="font-semibold text-sm mb-0.5">Phone</p>
                        <a href="tel:+93704243811" className="text-muted-foreground text-sm hover:text-primary transition-colors block">
                          +93 704 243 811
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                        <MessageCircle size={18} />
                      </div>
                      <div>
                        <p className="font-semibold text-sm mb-0.5">WhatsApp</p>
                        <a
                          href="https://wa.me/93711389331"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground text-sm hover:text-primary transition-colors block"
                        >
                          +93 711 389 331
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                        <Globe size={18} />
                      </div>
                      <div>
                        <p className="font-semibold text-sm mb-0.5">Website</p>
                        <p className="text-muted-foreground text-sm">www.edhtechnalogy.com</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-display font-semibold text-lg mb-4">Freelancing Presence</h3>
                  <div className="space-y-3">
                    {locations.map((loc) => (
                      <div key={loc.country} className="flex items-center gap-3 text-sm">
                        <span className="text-xl">{loc.flag}</span>
                        <span className="font-medium">{loc.country}</span>
                        <span className="text-muted-foreground">— {loc.city}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-display font-semibold text-lg mb-4">Follow Us</h3>
                  <div className="flex gap-3">
                    {socialLinks.map(({ Icon, label, href }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200"
                      >
                        <Icon size={18} />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Right column: contact form */}
          <div className="lg:col-span-3">
            <FadeIn delay={0.2}>
              <div className="bg-card border border-border/50 rounded-2xl p-6 md:p-8">
                <h2 className="font-display font-semibold text-xl mb-6">Send a Message</h2>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
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
                        <FormControl><Input placeholder="How can we help?" {...field} data-testid="input-subject" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="message" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Tell us about your project, timeline, and budget..." rows={5} {...field} data-testid="input-message" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <Button
                      type="submit"
                      disabled={submitContact.isPending}
                      className="w-full bg-primary text-primary-foreground rounded-full font-semibold shadow-[0_0_15px_rgba(0,240,255,0.2)] hover:shadow-[0_0_25px_rgba(0,240,255,0.4)] transition-all"
                      data-testid="button-submit"
                    >
                      {submitContact.isPending ? "Sending..." : (
                        <>Send Message <ArrowRight size={16} className="ml-2" /></>
                      )}
                    </Button>
                  </form>
                </Form>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </div>
  );
}
