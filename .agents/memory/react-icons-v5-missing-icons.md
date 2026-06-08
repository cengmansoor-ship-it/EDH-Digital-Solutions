---
name: react-icons v5 missing social icons
description: react-icons v5 dropped SiLinkedin and others; use lucide-react equivalents
---

react-icons `^5.x` does NOT export `SiLinkedin`. It also dropped some other social icons.

**Rule:** For LinkedIn, GitHub, Twitter/X, Facebook social icons — use lucide-react: `Linkedin`, `Github`, `Twitter`, `Facebook`.

**Why:** react-icons v5 removed several Simple Icons that previously existed in v4 (SiLinkedin, SiTwitter were renamed/removed). The vite dev server throws a runtime error immediately on import: "does not provide an export named 'SiLinkedin'".

**How to apply:** Whenever adding social media icons to any component in this project, import from `lucide-react` instead of `react-icons/si`. `SiGithub`, `SiFacebook`, `SiX` still exist in v5 but avoid mixing to keep it consistent.
