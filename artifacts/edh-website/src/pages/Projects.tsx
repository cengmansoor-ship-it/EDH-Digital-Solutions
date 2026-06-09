import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ExternalLink, Search, Code2, Layers } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useListProjects } from "@workspace/api-client-react";

interface DbProject {
  id: number;
  title: string;
  description: string;
  category: string;
  deployUrl: string | null;
  imageUrl: string | null;
  tags: string[];
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay }}>
      {children}
    </motion.div>
  );
}

function ProjectCard({ project, index }: { project: DbProject; index: number }) {
  return (
    <FadeIn delay={index * 0.07}>
      <motion.div
        whileHover={{ y: -5 }}
        className="bg-card border border-border/50 rounded-2xl overflow-hidden group h-full flex flex-col transition-shadow hover:shadow-[0_8px_32px_rgba(0,240,255,0.08)] hover:border-primary/30"
      >
        <div className="h-36 bg-gradient-to-br from-primary/10 via-secondary to-background flex items-center justify-center flex-shrink-0 relative overflow-hidden px-6">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
          <div className="flex items-center gap-3 z-10">
            <div className="bg-primary/10 border border-primary/20 p-3 rounded-xl">
              <Code2 size={28} className="text-primary" />
            </div>
            <div>
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest block">{project.category}</span>
              <span className="text-sm font-semibold text-foreground line-clamp-1">{project.title}</span>
            </div>
          </div>
          {project.featured && (
            <div className="absolute top-3 right-3 text-xs text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full font-medium">
              Featured
            </div>
          )}
        </div>

        <div className="p-5 flex flex-col flex-1">
          <h3 className="font-display font-semibold text-base mb-2 line-clamp-2 leading-snug">{project.title}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-1 line-clamp-3">{project.description}</p>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.tags.slice(0, 5).map((tag) => (
              <span key={tag} className="text-xs bg-secondary px-2 py-0.5 rounded text-muted-foreground">{tag}</span>
            ))}
          </div>

          <div className="flex items-center gap-3 pt-1">
            {project.deployUrl ? (
              <a
                href={project.deployUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Live Demo <ExternalLink size={13} />
              </a>
            ) : (
              <span className="text-xs text-muted-foreground">No live link</span>
            )}
          </div>
        </div>
      </motion.div>
    </FadeIn>
  );
}

export default function Projects() {
  const { data: projects = [], isLoading, isError } = useListProjects();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const typedProjects = projects as DbProject[];
  const categories = ["All", ...Array.from(new Set(typedProjects.map((p) => p.category).filter(Boolean))).sort()];
  const filtered = typedProjects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4 md:px-6">

        <FadeIn>
          <div className="text-center mb-16">
            <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">Our Portfolio</p>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Our Projects</h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Real solutions built for clients across Afghanistan, Egypt, Indonesia, Thailand, and beyond.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <div className="relative flex-1 max-w-sm">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 rounded-full"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    activeCategory === cat
                      ? "bg-primary text-primary-foreground shadow-[0_0_12px_rgba(0,240,255,0.3)]"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </FadeIn>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-card border border-border/50 rounded-2xl overflow-hidden animate-pulse">
                <div className="h-36 bg-secondary" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-secondary rounded w-3/4" />
                  <div className="h-12 bg-secondary rounded" />
                  <div className="flex gap-2">
                    <div className="h-5 bg-secondary rounded w-16" />
                    <div className="h-5 bg-secondary rounded w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-20">
            <Layers size={48} className="mx-auto mb-4 text-muted-foreground/40" />
            <p className="text-muted-foreground">Could not load projects right now. Please try again.</p>
          </div>
        ) : typedProjects.length === 0 ? (
          <div className="text-center py-20">
            <Layers size={48} className="mx-auto mb-4 text-muted-foreground/20" />
            <p className="text-muted-foreground mb-1">No projects yet.</p>
            <p className="text-sm text-muted-foreground/60">Add projects from the Admin panel to showcase your work here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>
        )}

        {!isLoading && !isError && filtered.length === 0 && typedProjects.length > 0 && (
          <div className="text-center py-20 text-muted-foreground">No projects match your search.</div>
        )}
      </div>
    </div>
  );
}
