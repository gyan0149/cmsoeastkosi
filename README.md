# CM SoE UPG Govt +2 School Astkosi, Bhalukpatra – website

Website of CM School of Excellence, Astkosi, Bhalukpatra (Block Dumaria, District Purbi Singhbhum, Jharkhand), U-DISE 20180409703.

Built with React + TypeScript + Vite + Tailwind, deployed to GitHub Pages.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build
```

## Where things live

| Path | What it is |
|------|------------|
| `src/data/schools.ts` | The school's details (`SCHOOL_LIST`) and optional extras (`EXTRAS`: established year, teachers, PIN code, map pin, photos, history, landmarks). |
| `src/data/common.ts` | Government links, schemes, admission guidelines, subjects. |
| `src/pages/` | The site's pages. Sections without real data show "Coming soon". |
| `public/images/` | Photos. |

## Deploy

Every push to `main` deploys to GitHub Pages (`.github/workflows/deploy.yml`).
Without a custom domain the site is served at `https://<user>.github.io/<repo>/`.
Once `public/CNAME` holds the domain (e.g. `cmsoeastkosi.in`), the site is built for the domain root.
