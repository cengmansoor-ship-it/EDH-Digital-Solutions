import { Router, type IRouter } from "express";

const router: IRouter = Router();

interface GitHubRepo {
  name: string;
  description: string | null;
  language: string | null;
  homepage: string | null;
  html_url: string;
  topics: string[];
  stargazers_count: number;
  updated_at: string;
}

interface GitHubProject {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  githubUrl: string;
  deployUrl: string | null;
  language: string | null;
  stars: number;
  updatedAt: string;
}

let cache: { data: GitHubProject[]; ts: number } | null = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function deriveCategory(language: string | null, topics: string[], description: string): string {
  const langLower = (language ?? "").toLowerCase();
  const topicsLower = topics.map((s) => s.toLowerCase()).join(" ");
  const descLower = description.toLowerCase();

  const mobileSignals = ["flutter", "dart", "react native", "react-native", "mobile", "android", "ios", "expo"];
  if (mobileSignals.some((s) => langLower.includes(s) || topicsLower.includes(s) || descLower.includes(s))) return "Mobile";

  const aiSignals = [" ai ", "machine learning", "machine-learning", "tensorflow", "pytorch", "chatgpt", "openai", "nlp", "deep learning"];
  if (aiSignals.some((s) => descLower.includes(s) || topicsLower.includes(s))) return "AI";

  const cloudSignals = ["devops", "docker", "kubernetes", "cloud", "aws", "azure", "gcp"];
  if (cloudSignals.some((s) => topicsLower.includes(s) || descLower.includes(s))) return "Cloud";

  return "Web";
}

function deriveTags(language: string | null, topics: string[], description: string): string[] {
  const tags: string[] = [];
  if (language) tags.push(language);

  const descLower = (description ?? "").toLowerCase();

  const techMap: [string, string][] = [
    ["react native", "React Native"],
    ["react", "React"],
    ["node.js", "Node.js"],
    ["express", "Express.js"],
    ["mongodb", "MongoDB"],
    ["mysql", "MySQL"],
    ["typescript", "TypeScript"],
    ["javascript", "JavaScript"],
    ["flutter", "Flutter"],
    ["firebase", "Firebase"],
    ["tailwind", "Tailwind CSS"],
    ["docker", "Docker"],
    ["jwt", "JWT Auth"],
    ["php", "PHP"],
    ["postgresql", "PostgreSQL"],
  ];

  for (const [key, label] of techMap) {
    if (descLower.includes(key) && !tags.includes(label)) {
      tags.push(label);
    }
  }

  for (const topic of topics) {
    const label = topic.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    if (!tags.includes(label)) tags.push(label);
  }

  return tags.slice(0, 5);
}

function humanizeName(name: string): string {
  return name.replace(/-/g, " ").replace(/_/g, " ");
}

router.get("/github-projects", async (_req, res): Promise<void> => {
  if (cache && Date.now() - cache.ts < CACHE_TTL) {
    res.json(cache.data);
    return;
  }

  try {
    const response = await fetch(
      "https://api.github.com/orgs/EDH-Technalogy/repos?per_page=30&sort=updated",
      {
        headers: {
          Accept: "application/vnd.github+json",
          "User-Agent": "EDH-Technology-Website",
        },
      }
    );

    if (!response.ok) {
      res.status(502).json({ error: "Failed to fetch from GitHub" });
      return;
    }

    const repos: GitHubRepo[] = await response.json() as GitHubRepo[];

    const projects: GitHubProject[] = repos
      .filter((r) => !r.name.toLowerCase().includes("edh-technology-website") && !r.name.toLowerCase().includes(".github"))
      .map((r) => ({
        id: r.name,
        title: humanizeName(r.name),
        description: r.description ?? "A project by EDH Technology.",
        category: deriveCategory(r.language, r.topics, r.description ?? ""),
        tags: deriveTags(r.language, r.topics, r.description ?? ""),
        githubUrl: r.html_url,
        deployUrl: r.homepage || null,
        language: r.language,
        stars: r.stargazers_count,
        updatedAt: r.updated_at,
      }));

    cache = { data: projects, ts: Date.now() };
    res.json(projects);
  } catch (err) {
    res.status(502).json({ error: "GitHub API unavailable" });
  }
});

export default router;
