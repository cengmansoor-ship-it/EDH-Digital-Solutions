import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Edit, LogOut, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useListProjects, useCreateProject, useDeleteProject, useUpdateProject, useListServices, useCreateService, useDeleteService, useUpdateService, useListContacts, useDeleteContact, getListProjectsQueryKey, getListServicesQueryKey, getListContactsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import edhLogo from "@assets/EDH_technalogy_Logo_01_1780917940904.png";

const ADMIN_PASSWORD = "edh-admin-2024";

type Tab = "projects" | "services" | "contacts" | "social";

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [tab, setTab] = useState<Tab>("projects");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Projects state
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState<number | null>(null);
  const [projectForm, setProjectForm] = useState({ title: "", description: "", category: "", deployUrl: "", tags: "", featured: false });

  // Services state
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingService, setEditingService] = useState<number | null>(null);
  const [serviceForm, setServiceForm] = useState({ title: "", description: "", icon: "Globe", order: 0 });

  // Social links (localStorage)
  const [socialLinks, setSocialLinks] = useState({
    facebook: localStorage.getItem("social_facebook") || "https://www.facebook.com/edhtechnalogy",
    instagram: localStorage.getItem("social_instagram") || "https://www.instagram.com/edh_technalogy",
    linkedin: localStorage.getItem("social_linkedin") || "https://www.linkedin.com/company/122913941/",
  });

  const { data: projects = [] } = useListProjects({ query: { queryKey: getListProjectsQueryKey() } });
  const { data: services = [] } = useListServices({ query: { queryKey: getListServicesQueryKey() } });
  const { data: contacts = [] } = useListContacts({ query: { queryKey: getListContactsQueryKey() } });

  const createProject = useCreateProject();
  const deleteProject = useDeleteProject();
  const updateProject = useUpdateProject();
  const createService = useCreateService();
  const deleteService = useDeleteService();
  const updateService = useUpdateService();
  const deleteContact = useDeleteContact();

  const login = () => {
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
    } else {
      toast({ title: "Wrong password", variant: "destructive" });
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
          <div className="bg-card border border-border/50 rounded-2xl p-8 text-center space-y-6">
            <div className="bg-white p-3 rounded-xl inline-block">
              <img src={edhLogo} alt="EDH Technology" className="h-10 w-auto" />
            </div>
            <div>
              <h1 className="font-display font-bold text-2xl mb-1">Admin Portal</h1>
              <p className="text-muted-foreground text-sm">Enter your admin password to continue</p>
            </div>
            <div className="space-y-3">
              <Input
                type="password"
                placeholder="Admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && login()}
                data-testid="input-admin-password"
              />
              <Button onClick={login} className="w-full bg-primary text-primary-foreground rounded-full" data-testid="button-admin-login">
                Sign In
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "projects", label: "Projects" },
    { id: "services", label: "Services" },
    { id: "contacts", label: "Contacts" },
    { id: "social", label: "Social Links" },
  ];

  const handleSaveProject = async () => {
    try {
      const data = { ...projectForm, tags: projectForm.tags.split(",").map((t) => t.trim()).filter(Boolean) };
      if (editingProject) {
        await updateProject.mutateAsync({ id: editingProject, data });
        toast({ title: "Project updated" });
      } else {
        await createProject.mutateAsync({ data });
        toast({ title: "Project added" });
      }
      queryClient.invalidateQueries({ queryKey: getListProjectsQueryKey() });
      setProjectForm({ title: "", description: "", category: "", deployUrl: "", tags: "", featured: false });
      setShowProjectForm(false);
      setEditingProject(null);
    } catch {
      toast({ title: "Error saving project", variant: "destructive" });
    }
  };

  const handleDeleteProject = async (id: number) => {
    try {
      await deleteProject.mutateAsync({ id });
      queryClient.invalidateQueries({ queryKey: getListProjectsQueryKey() });
      toast({ title: "Project deleted" });
    } catch {
      toast({ title: "Error deleting project", variant: "destructive" });
    }
  };

  const handleSaveService = async () => {
    try {
      if (editingService) {
        await updateService.mutateAsync({ id: editingService, data: serviceForm });
        toast({ title: "Service updated" });
      } else {
        await createService.mutateAsync({ data: serviceForm });
        toast({ title: "Service added" });
      }
      queryClient.invalidateQueries({ queryKey: getListServicesQueryKey() });
      setServiceForm({ title: "", description: "", icon: "Globe", order: 0 });
      setShowServiceForm(false);
      setEditingService(null);
    } catch {
      toast({ title: "Error saving service", variant: "destructive" });
    }
  };

  const handleDeleteService = async (id: number) => {
    try {
      await deleteService.mutateAsync({ id });
      queryClient.invalidateQueries({ queryKey: getListServicesQueryKey() });
      toast({ title: "Service deleted" });
    } catch {
      toast({ title: "Error deleting service", variant: "destructive" });
    }
  };

  const handleDeleteContact = async (id: number) => {
    try {
      await deleteContact.mutateAsync({ id });
      queryClient.invalidateQueries({ queryKey: getListContactsQueryKey() });
      toast({ title: "Contact deleted" });
    } catch {
      toast({ title: "Error deleting contact", variant: "destructive" });
    }
  };

  const handleSaveSocial = () => {
    Object.entries(socialLinks).forEach(([key, val]) => localStorage.setItem(`social_${key}`, val));
    toast({ title: "Social links saved" });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Admin header */}
      <header className="bg-card border-b border-border/50 sticky top-0 z-40">
        <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white p-1.5 rounded-md">
              <img src={edhLogo} alt="EDH Technology" className="h-7 w-auto" />
            </div>
            <span className="font-display font-bold">Admin Portal</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setAuthenticated(false)} className="text-muted-foreground hover:text-foreground gap-2">
            <LogOut size={16} /> Sign Out
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 md:px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              data-testid={`tab-${t.id}`}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                tab === t.id ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Projects tab */}
        {tab === "projects" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-semibold text-xl">Projects ({projects.length})</h2>
              <Button onClick={() => { setShowProjectForm(true); setEditingProject(null); setProjectForm({ title: "", description: "", category: "", deployUrl: "", tags: "", featured: false }); }} size="sm" className="bg-primary text-primary-foreground rounded-full gap-1.5">
                <Plus size={14} /> Add Project
              </Button>
            </div>

            {showProjectForm && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border/50 rounded-2xl p-6 mb-6 space-y-4">
                <h3 className="font-semibold">{editingProject ? "Edit" : "New"} Project</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input placeholder="Title" value={projectForm.title} onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })} data-testid="input-project-title" />
                  <Input placeholder="Category" value={projectForm.category} onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })} data-testid="input-project-category" />
                </div>
                <Textarea placeholder="Description" value={projectForm.description} onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })} rows={3} data-testid="input-project-description" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input placeholder="Deploy URL (optional)" value={projectForm.deployUrl} onChange={(e) => setProjectForm({ ...projectForm, deployUrl: e.target.value })} data-testid="input-project-url" />
                  <Input placeholder="Tags (comma separated)" value={projectForm.tags} onChange={(e) => setProjectForm({ ...projectForm, tags: e.target.value })} data-testid="input-project-tags" />
                </div>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={projectForm.featured} onChange={(e) => setProjectForm({ ...projectForm, featured: e.target.checked })} />
                  Featured project
                </label>
                <div className="flex gap-3">
                  <Button onClick={handleSaveProject} disabled={createProject.isPending || updateProject.isPending} className="bg-primary text-primary-foreground rounded-full" data-testid="button-save-project">Save</Button>
                  <Button variant="outline" onClick={() => { setShowProjectForm(false); setEditingProject(null); }} className="rounded-full">Cancel</Button>
                </div>
              </motion.div>
            )}

            <div className="space-y-3">
              {(projects as Array<{ id: number; title: string; description: string; category: string; deployUrl: string | null; tags: string[]; featured: boolean }>).map((p) => (
                <div key={p.id} data-testid={`row-project-${p.id}`} className="bg-card border border-border/50 rounded-xl px-5 py-4 flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{p.title}</span>
                      {p.featured && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Featured</span>}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{p.description}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span>{p.category}</span>
                      {p.deployUrl && <a href={p.deployUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1"><Eye size={11} /> Live</a>}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button variant="ghost" size="sm" onClick={() => { setEditingProject(p.id); setProjectForm({ title: p.title, description: p.description, category: p.category, deployUrl: p.deployUrl ?? "", tags: p.tags.join(", "), featured: p.featured }); setShowProjectForm(true); }} data-testid={`button-edit-project-${p.id}`}>
                      <Edit size={14} />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteProject(p.id)} className="text-destructive hover:text-destructive" data-testid={`button-delete-project-${p.id}`}>
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Services tab */}
        {tab === "services" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-semibold text-xl">Services ({services.length})</h2>
              <Button onClick={() => { setShowServiceForm(true); setEditingService(null); setServiceForm({ title: "", description: "", icon: "Globe", order: 0 }); }} size="sm" className="bg-primary text-primary-foreground rounded-full gap-1.5">
                <Plus size={14} /> Add Service
              </Button>
            </div>

            {showServiceForm && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border/50 rounded-2xl p-6 mb-6 space-y-4">
                <h3 className="font-semibold">{editingService ? "Edit" : "New"} Service</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input placeholder="Title" value={serviceForm.title} onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })} data-testid="input-service-title" />
                  <Input placeholder="Icon name (Globe, Brain, Smartphone...)" value={serviceForm.icon} onChange={(e) => setServiceForm({ ...serviceForm, icon: e.target.value })} data-testid="input-service-icon" />
                </div>
                <Textarea placeholder="Description" value={serviceForm.description} onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })} rows={3} data-testid="input-service-description" />
                <Input type="number" placeholder="Order" value={serviceForm.order} onChange={(e) => setServiceForm({ ...serviceForm, order: Number(e.target.value) })} data-testid="input-service-order" />
                <div className="flex gap-3">
                  <Button onClick={handleSaveService} disabled={createService.isPending || updateService.isPending} className="bg-primary text-primary-foreground rounded-full" data-testid="button-save-service">Save</Button>
                  <Button variant="outline" onClick={() => { setShowServiceForm(false); setEditingService(null); }} className="rounded-full">Cancel</Button>
                </div>
              </motion.div>
            )}

            <div className="space-y-3">
              {(services as Array<{ id: number; title: string; description: string; icon: string; order: number }>).map((s) => (
                <div key={s.id} data-testid={`row-service-${s.id}`} className="bg-card border border-border/50 rounded-xl px-5 py-4 flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{s.title}</span>
                      <span className="text-xs text-muted-foreground">icon: {s.icon}</span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">{s.description}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button variant="ghost" size="sm" onClick={() => { setEditingService(s.id); setServiceForm({ title: s.title, description: s.description, icon: s.icon, order: s.order }); setShowServiceForm(true); }} data-testid={`button-edit-service-${s.id}`}>
                      <Edit size={14} />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteService(s.id)} className="text-destructive hover:text-destructive" data-testid={`button-delete-service-${s.id}`}>
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contacts tab */}
        {tab === "contacts" && (
          <div>
            <h2 className="font-display font-semibold text-xl mb-6">Contact Submissions ({contacts.length})</h2>
            {contacts.length === 0 ? (
              <p className="text-muted-foreground text-center py-16">No contact submissions yet.</p>
            ) : (
              <div className="space-y-4">
                {(contacts as Array<{ id: number; name: string; email: string; subject: string; message: string; createdAt: string }>).map((c) => (
                  <div key={c.id} data-testid={`row-contact-${c.id}`} className="bg-card border border-border/50 rounded-xl p-5">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <span className="font-medium">{c.name}</span>
                        <span className="text-muted-foreground text-sm ml-3">{c.email}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs text-muted-foreground">{new Date(c.createdAt).toLocaleDateString()}</span>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteContact(c.id)} className="text-destructive hover:text-destructive" data-testid={`button-delete-contact-${c.id}`}>
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-primary mb-1">{c.subject}</p>
                    <p className="text-sm text-muted-foreground">{c.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Social Links tab */}
        {tab === "social" && (
          <div>
            <h2 className="font-display font-semibold text-xl mb-6">Social Media Links</h2>
            <div className="bg-card border border-border/50 rounded-2xl p-6 max-w-lg space-y-4">
              {(["facebook", "instagram", "linkedin"] as const).map((key) => (
                <div key={key}>
                  <label className="text-sm font-medium capitalize mb-1.5 block">{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                  <Input
                    placeholder={`https://www.${key}.com/your-handle`}
                    value={socialLinks[key]}
                    onChange={(e) => setSocialLinks({ ...socialLinks, [key]: e.target.value })}
                    data-testid={`input-social-${key}`}
                  />
                </div>
              ))}
              <Button onClick={handleSaveSocial} className="bg-primary text-primary-foreground rounded-full w-full" data-testid="button-save-social">
                Save Social Links
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
