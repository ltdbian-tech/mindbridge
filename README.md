# MindBridge

A futuristic, cinematic, free mental health sanctuary built to help people in crisis find immediate support, coping tools, and hope. Designed to feel like stepping into a calm, living space — with particle effects, glassmorphism, and interactive tools. Built to be hosted entirely for free on GitHub Pages.

## What It Provides

- **Immediate Crisis Help** — A dedicated page with emergency numbers, chat services, and text lines organized by country.
- **Interactive Coping Tools** — Cinematic guided breathing with orbital visuals, 5-4-3-2-1 grounding, mood check-in with personalized guidance, distraction spinner, self-care checklists, and affirmation cards.
- **Hope Wall** — Read messages of hope from others who've been where you are. Leave your own. Write letters to your future self. Discover random "reasons to live."
- **Personal Safety Plan** — A private, printable safety plan creator. No data leaves the browser.
- **Global Resource Directory** — Curated, up-to-date helplines for the US, UK, Canada, Australia, India, and more.

## Privacy First

- No accounts required
- No tracking or analytics
- No data collection
- The safety plan form never sends information to any server
- Everything is client-side and anonymous

## How to Deploy to GitHub Pages (Free Hosting)

### Method 1: GitHub Actions (Recommended — Auto Deploy)

1. **Create a new GitHub repository**
   - Go to [github.com/new](https://github.com/new)
   - Name it `mindbridge`
   - Make it **Public**
   - Click **Create repository**

2. **Upload all files**
   - On your repo page, click **"uploading an existing file"**
   - Drag and drop the **entire folder contents** (all HTML, CSS, JS, and `.github` folder)
   - Make sure `.github/workflows/deploy.yml` is included
   - Click **Commit changes**

3. **Enable GitHub Actions + Pages**
   - Go to **Settings** → **Pages**
   - Under **Source**, select **GitHub Actions**
   - The workflow will run automatically and deploy your site

4. **Your site is live**
   - URL: `https://yourusername.github.io/mindbridge`
   - The `.github/workflows/deploy.yml` handles all future updates automatically when you push changes

### Method 2: Manual Branch Deploy (No Actions)

1. **Create a new GitHub repository** (Public)
2. **Upload all files** via the web interface
3. Go to **Settings** → **Pages**
4. Under **Source**, select **Deploy from a branch**
5. Choose **main** branch, **/(root)** folder
6. Click **Save**
7. Wait 1-2 minutes for `https://yourusername.github.io/mindbridge`

### Files to Upload (17 total)

| File | Purpose |
|------|---------|
| `index.html` | Homepage with triage, tools, categories |
| `help-now.html` | Immediate crisis help |
| `tools.html` | Breathing, grounding, spinner, mood check |
| `hope-wall.html` | Messages of hope + future self letters |
| `timer.html` | 15-minute crisis delay timer |
| `safety-plan.html` | Printable safety plan |
| `validate.html` | Interactive pain validation |
| `one-more-day.html` | Pledge tracker with streaks |
| `help-a-friend.html` | Scripts for supporting someone suicidal |
| `what-to-expect.html` | Demystifying crisis services |
| `after-care.html` | Post-crisis: therapy, peer support, rebuilding |
| `resources.html` | Crisis lines for 15+ countries |
| `style.css` | All styles (dark/light themes, cards, animations) |
| `app.js` | All JavaScript (breathing, timer, triage, widgets, PWA) |
| `manifest.json` | PWA manifest (installable app) |
| `sw.js` | Service worker (offline support) |
| `.github/workflows/deploy.yml` | Auto-deployment workflow |

### Update the Manifest Start URL

Before deploying, update `manifest.json` line 5:

```json
"start_url": "/mindbridge/",
```

Change `/mindbridge/` to match your repo name (e.g., `/` if using custom domain, or `/your-repo-name/`).

## Custom Domain (Optional & Free)

If you want a custom domain instead of `github.io`:
1. Buy a domain from a registrar (or use a free subdomain service)
2. In your repo's **Settings → Pages**, enter your custom domain
3. Add a `CNAME` file to your repository containing just your domain name
4. Configure DNS with your registrar (GitHub provides instructions)

## Updating the Site

To make changes later:
1. Edit any `.html` or `.css` file locally
2. Re-upload to GitHub (or use GitHub's online editor)
3. Changes go live within a minute

## Disclaimer

MindBridge is a community resource, not a substitute for professional mental health care. If you or someone you know is in immediate danger, call your local emergency number.

## License

This project is open source. Use it, share it, and adapt it freely to help others.
