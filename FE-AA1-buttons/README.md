# FE-AA1: Buttons with a Brain 🧠

A production-grade, highly accessible, and portable `<StatefulButton />` React component built with Vite, React, and TypeScript. All visuals and motion are driven by GPU-accelerated CSS custom properties and a single `data-state` attribute.

---

## 🎯 Component Overview & Props

The component is completely self-contained in `src/components/StatefulButton.tsx` and `src/components/StatefulButton.css`, ready to be copied directly into any design system (such as the Vitals capstone).

### Props

| Prop | Type | Description |
| :--- | :--- | :--- |
| `idleLabel` | `string` | Label displayed during idle state (e.g. `"Send message"`) |
| `busyLabel` | `string` | Label displayed during loading state (e.g. `"Sending..."`) |
| `doneLabel` | `string` | Label displayed during success state (e.g. `"Sent!"`) |
| `retryLabel` | `string` | Label displayed during error state (e.g. `"Retry"`) |
| `onAction` | `() => Promise<void>` | Async action triggered on button click |
| `disabled?` | `boolean` | Optional flag to disable the button |

### States

Driven by a single `data-state` attribute (`idle`, `loading`, `success`, `error`) alongside native pseudo-states (`:hover`, `:active`, `:focus-visible`, `[aria-disabled="true"]`).

---

## ⏱️ Motion & Duration Choices

All transitions strictly animate `transform` and `opacity` to avoid layout calculations and repaints:

- **Hover (`160ms cubic-bezier(.2, .8, .2, 1)`)**: Snappy tactile lift and shadow bloom.
- **Press (`90ms ease`)**: Immediate tactile contraction on pointer down.
- **Label Swap (`280ms cubic-bezier(.2, .8, .2, 1)`)**: Smooth upward slide and cross-fade between face layers.
- **Colour Cross-Fade (`240ms cubic-bezier(.4, 0, .2, 1)`)**: Background colour layers cross-fade smoothly using `opacity` transitions.
- **Check Pop (`420ms cubic-bezier(.34, 1.56, .64, 1)`)**: Springy overshoot pop animation for the success checkmark.
- **Shake (`360ms ease-out`)**: Single horizontal shake powered by the Web Animations API (`element.animate`).
- **Success Hold (`1800ms`)**: Remains in success state for 1.8 seconds before smoothly returning to idle.

---

## 📐 The Deliberate Deviation: Fixed Width vs. Animated Width

**Why width is not animated:**
Animating width triggers browser layout recalculation (reflow) on every frame, which can cause frame drops and jarring shifts to adjacent content. 

**Our Solution:**
All 4 face layers (`idle`, `loading`, `success`, `error`) are stacked in the same CSS Grid cell (`grid-area: 1 / 1`). Because all faces participate in CSS Grid track sizing, the button naturally and statically sizes itself to the widest possible label with zero layout shift, zero JavaScript measurement, and zero reflow during state transitions.

---

## ♿ Accessibility & Reduced Motion

- **Semantic HTML**: Real `<button type="button">`.
- **Focus Preservation**: Uses `aria-disabled` instead of the HTML `disabled` attribute so focus is never lost when disabled or loading.
- **Screen Reader Announcements**: Live region (`aria-live="polite" aria-atomic="true"`) announces state transitions ("Sending...", "Sent!", "Retry. Action failed.").
- **`prefers-reduced-motion: reduce` Support**:
  - Removes all `translate`, `scale`, and `shake` transforms.
  - Shortens all fades to `120ms`.
  - Replaces spinner rotation with a gentle opacity pulse so visual feedback is never lost.
  - Skips the Web Animations API shake.

---

## 🚀 Local Development

### 1. Install dependencies
```bash
cd FE-AA1-buttons
npm install
```

### 2. Start local dev server
```bash
npm run dev
```

### 3. Build for production
```bash
npm run build
```

### 4. Preview production build
```bash
npm run preview
```

---

## 🌐 How to Deploy for a Live URL

### Option 1: Deploy to Vercel (Recommended)

1. Push your repository to GitHub.
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your `Flyrank-Assignments` repository.
4. In the project configuration:
   - **Root Directory**: Click "Edit" and select `FE-AA1-buttons`.
   - **Framework Preset**: Vite (automatically detected).
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **"Deploy"**. Vercel will build and give you a live production URL (e.g. `https://fe-aa1-buttons.vercel.app`).

---

### Option 2: Deploy to GitHub Pages

1. In `FE-AA1-buttons/package.json`, add the `gh-pages` package:
   ```bash
   npm install --save-dev gh-pages
   ```
2. In `FE-AA1-buttons/package.json`, add deploy scripts:
   ```json
   "scripts": {
     "dev": "vite",
     "build": "tsc -b && vite build",
     "preview": "vite preview",
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```
3. Ensure `vite.config.ts` has `base: './'` (already configured).
4. Run:
   ```bash
   npm run deploy
   ```
5. In your GitHub repository settings under **Settings > Pages**, select the `gh-pages` branch as the source.
