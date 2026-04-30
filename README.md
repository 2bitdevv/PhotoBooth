# PhotoBoot by 2bit

A pastel-themed web photobooth built with Next.js, TypeScript, Zustand, TailwindCSS, and Canvas rendering.

Users can:
- choose strip layouts
- capture or upload photos
- customize frame colors and stickers
- generate and download the final strip
- leave star-based feedback after download

---

## Features

- Multi-step photobooth flow (`WELCOME` -> `LAYOUT_SELECT` -> `CAPTURE` -> `CUSTOMIZE` -> `RESULT`)
- Live camera capture with countdown timer
- Upload mode for manual image selection
- Filter presets (No Filter, B&W, Sepia, etc.)
- Canvas-based strip generation with:
  - frame presets
  - rounded / circle / heart photo masks
  - draggable SVG stickers
  - final merged export
- QR-based temporary download link (`/api/strip`)
- Contact form with real email sending (SMTP via Gmail)
- Post-download review modal (star rating + optional comment)
- Review duplicate prevention on same device (localStorage flag)

---

## Tech Stack

- Next.js (App Router)
- React + TypeScript
- TailwindCSS
- Zustand
- Framer Motion
- Nodemailer

---

## Project Structure

```txt
src/
  app/
    api/
      contact/route.ts        # contact email API
      reviews/route.ts        # review submission API
      strip/route.ts          # upload generated strip (temp cache)
      strip/[id]/route.ts     # fetch strip by id
    contact/page.tsx          # contact UI
    faq/page.tsx
    privacy-policy/page.tsx
    layout.tsx
    page.tsx
  components/
    BoothFlow.tsx
    WelcomeScreen.tsx
    LayoutSelector.tsx
    CaptureScreen.tsx
    CustomizeScreen.tsx
    ResultScreen.tsx
    NavBar.tsx
  lib/
    canvas.ts                 # strip render pipeline
    framePresets.ts
    stickerAssets.ts
    layouts.ts
    filters.ts
    stripCache.ts
  store/
    useBoothStore.ts
```

---

## Local Development

Install dependencies:

```bash
npm install
```

Run dev server:

```bash
npm run dev
```

Open `http://localhost:3000`

---

## Environment Variables

Create `.env.local` in project root:

```env
SMTP_USER=example@gmail.com
SMTP_PASS=your_google_app_password
CONTACT_RECEIVER_EMAIL=example@gmail.com
```

> Use Google **App Password**, not your normal Gmail password.

`.env.local` should stay local and must not be committed.

---

## Email Setup (Gmail SMTP)

1. Enable 2-Step Verification on the Google account.
2. Generate an App Password in Google Security.
3. Put that value in `SMTP_PASS`.
4. Restart server after env changes.

If SMTP is missing, API currently returns success fallback (`queued: false`) so UI does not hard fail.

---

## API Endpoints

- `POST /api/contact`
  - payload: `{ firstName, lastName, email, subject, message }`
  - sends email to `CONTACT_RECEIVER_EMAIL`

- `POST /api/reviews`
  - payload: `{ rating, comment }`
  - sends review email to `CONTACT_RECEIVER_EMAIL`

- `POST /api/strip`
  - payload: `{ dataUrl }`
  - returns `{ id }` for temporary image cache

- `GET /api/strip/:id`
  - returns generated strip image by id

---

## Build & Deploy

Build:

```bash
npm run build
```

Start:

```bash
npm run start
```

For Vercel:
1. Add Environment Variables in Project Settings.
2. Redeploy after env changes.

---

## Git Safety Checklist

Before push:

```bash
git status
git ls-files .env.local
git diff --name-only --cached
```

Expected:
- clean working tree (or intentional changes)
- `.env.local` not listed/tracked

