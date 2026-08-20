# QuoteCraft AI 報價智造

> Turn one sentence into a quote that is ready to win the work.

QuoteCraft AI is an AI quotation generator for designers, consultants, photographers, engineering teams, and independent professionals. Start from an industry template, generate an editable quotation draft, apply a visual style, complete customer and company information, and export the result as a PDF or high-resolution PNG.

## Languages

[繁體中文（預設）](README.md) · [简体中文](README.zh-CN.md) · English

## Features

| Feature | Description |
| --- | --- |
| AI quotation draft | Describe a project in natural language and generate a practical starting point from an industry template. |
| Editable quotation | Edit the customer name, date, payment terms, company address, tax ID, contact information, Logo, and line items. |
| Smart calculations | Support quantity, unit price, discount, and tax rate, with live subtotal, discount, tax, and tax-inclusive total calculations. |
| 20 visual styles | Manage colors, typography, density, radius, shadow, and document-header settings through JSON parameters. |
| Favorite styles | Save frequently used layouts in the browser for quick reuse. |
| Document export | Export the current quotation preview as a PDF or high-resolution PNG. |
| Draft storage | Save an unfinished quotation locally and continue editing it later. |

## Technical overview

The project uses React 19, TypeScript, Vite, Tailwind CSS 4, shadcn/ui, and Lucide React. Industry templates and starter quotation items are stored in `client/src/data/quote-data.json`. The 20 layout styles are stored in `client/src/data/quote-styles.json`. Drafts and favorite styles currently use browser `localStorage`, so the frontend can work without a backend database.

| Path | Purpose |
| --- | --- |
| `client/src/App.tsx` | React application entry point and routing. |
| `client/src/pages/Home.tsx` | Brand homepage, quotation workspace, and live preview. |
| `client/src/data/quote-data.json` | Industry and starter quotation data. |
| `client/src/data/quote-styles.json` | Parameters for the 20 reusable visual styles. |
| `client/src/index.css` | Global Paperwork Atelier design system. |
| `.github/workflows/deploy-pages.yml` | Automated GitHub Pages build and deployment workflow. |

## Local development

Install Node.js 22 or a compatible version, together with pnpm. Then run:

```bash
pnpm install
pnpm dev
```

When the development server starts, open the local URL shown in the terminal. To run type checking and a production build:

```bash
pnpm check
pnpm build
```

## GitHub Pages

The repository includes a GitHub Actions workflow. When code is pushed to the `main` branch, the workflow installs dependencies, builds the Vite application, and deploys the Pages artifact. Because GitHub Pages serves the project from a repository subpath, Vite uses `/quote-craft-ai/` as its base path in the Actions environment.

To enable Pages, open `Settings → Pages` in the GitHub repository and select **GitHub Actions** as the build source. If the repository remains private, Pages availability depends on the GitHub account plan and organization policy. If Pages cannot be enabled, use a public repository or Manus built-in hosting instead.

## Data and privacy

Quotation drafts, Logo Data URLs, and favorite styles are currently stored only in the local storage of the user’s current browser. The frontend does not automatically synchronize this data to the cloud. Clearing site data may remove these records. For production use, consider adding accounts, cloud storage, access control, and a backup strategy.

## License

No license has been selected for this project yet. Before public distribution or third-party use, add an appropriate LICENSE file and define the brand usage policy.

## Author

Manus AI
