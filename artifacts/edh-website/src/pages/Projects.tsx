import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ExternalLink, Search } from "lucide-react";
import { useListProjects, getListProjectsQueryKey } from "@workspace/api-client-react";
import { Input } from "@/components/ui/input";
import edhLogo from "@assets/EDH_technalogy_Logo_01_1780917940904.png";

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay }}>
      {children}
    </motion.div>
  );
}

export default function Projects() {
  const { data: projects = [], isLoading } = useListProjects({ query: { queryKey: getListProjectsQueryKey() } });
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", ...Array.from(new Set(projects.map((p) => p.category)))];
  const filtered = projects.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4 md:px-6">
        <FadeIn>
          <div className="text-center mb-16">
            <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">Our Portfolio</p>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Projects</h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Explore our full portfolio of delivered solutions — from MVPs to enterprise platforms across industries.
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
                data-testid="input-search-projects"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  data-testid={`filter-${cat}`}
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
                <div className="h-44 bg-secondary" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-secondary rounded w-1/3" />
                  <div className="h-5 bg-secondary rounded w-3/4" />
                  <div className="h-12 bg-secondary rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((project, i) => (
              <FadeIn key={project.id} delay={i * 0.07}>
                <motion.div
                  whileHover={{ y: -4 }}
                  data-testid={`card-project-${project.id}`}
                  className="bg-card border border-border/50 rounded-2xl overflow-hidden group h-full flex flex-col"
                  style={{ userSelect: "none" }}
                >
                  <div className="h-44 bg-gradient-to-br from-primary/10 to-secondary flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                    {project.featured && (
                      <span className="absolute top-3 right-3 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-medium">Featured</span>
                    )}
                    <div className="bg-white/10 p-3 rounded-xl">
                      <img src={edhLogo} alt="EDH Technology" className="h-8 w-auto opacity-40" />
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1" style={{ userSelect: "none", pointerEvents: "auto" }}>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium inline-block w-fit">{project.category}</span>
                    <h3 className="font-display font-semibold text-lg mt-2 mb-2">{project.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-1">{project.description}</p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.tags.map((tag) => (
                        <span key={tag} className="text-xs bg-secondary px-2 py-0.5 rounded text-muted-foreground">{tag}</span>
                      ))}
                    </div>
                    {project.deployUrl && (
                      <a
                        href={project.deployUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-primary text-sm font-medium hover:underline"
                        data-testid={`link-deploy-${project.id}`}
                      >
                        View Live Demo <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        )}

        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            No projects found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}
