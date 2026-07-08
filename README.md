# Delta FluvAI — Marketing Site

Single-page marketing site for Delta FluvAI (AI automation consulting).
React 19 + TypeScript + Vite + Tailwind CSS 4 + GSAP + Framer Motion + lucide-react.

Design system: near-monochrome dark (`bg`/`surface`/`stroke`/`muted` tokens in
[src/index.css](src/index.css)) with an electric-blue accent gradient, Inter
for body text and Instrument Serif italic for display accents.

## Commands

```sh
npm install
npm run dev      # dev server on http://localhost:5173
npm run build    # type-check + production build to dist/
npm run preview  # serve the production build
```

## Hero reveal — how it works

The hero ([src/components/Hero.tsx](src/components/Hero.tsx)) stacks three
cover-fitted layers and drives two feathered radial-gradient CSS masks
(defined in [src/index.css](src/index.css)) from a `requestAnimationFrame`
loop:

1. **Base** — static river delta photo (`public/hero-delta.jpg`), always visible.
2. **Morph video** (`public/hero-reveal.mp4`) — revealed inside a soft circle
   that eases after the cursor (lagged lerp, not a snap).
3. **Brain end-state** (`public/hero-brain.jpg`) — a smaller, softer circle at
   the centre of the reveal whose opacity and radius track the video's own
   morph progress.

Because the innermost layer always shows the *finished* transformation and the
video mid-morph sits between it and the untouched base image, the effect reads
as the transformation radiating outward from the exact point under the cursor.

Other behaviours:

- **Boomerang loop** — the shipped mp4 is pre-rendered forward-then-reverse
  (12s total), so `loop` never shows a cut.
- **Idle / touch** — with no pointer (page load, touch devices) the reveal
  drifts along a slow Lissajous path; touch-drag takes over directly and the
  drift resumes after ~4s idle.
- **`prefers-reduced-motion`** — no video, no animation loop; a fixed CSS-only
  reveal of the brain image is shown instead.
- **Performance** — video is muted/`playsInline`, pauses via
  IntersectionObserver whenever the hero leaves the viewport, and has a
  first-frame poster (`public/hero-poster.jpg`) for slow connections.
- **Zoom-drift compensation** — the Kling-generated source clip has a baked-in
  camera creep (~1%/s, ~6% total, measured via SSIM scale-sweep against the
  source stills). The static layers are counter-scaled in sync with playback
  progress (`CLIP_ZOOM_TOTAL` in Hero.tsx) so features stay aligned across the
  feathered reveal edge. If the clip is ever regenerated without the creep,
  set `CLIP_ZOOM_TOTAL` to `0`.

## Replacing the hero assets

The files in `public/` were derived from the source assets (kept out of the
repo — they live one directory up) with ffmpeg:

```sh
# base + end-state stills (from ~100MB source PNGs)
ffmpeg -i "River Delta.png" -vf "scale=2560:-2" -q:v 3 public/hero-delta.jpg
ffmpeg -i "CGI-brain.png"   -vf "scale=2560:-2" -q:v 3 public/hero-brain.jpg

# boomerang loop (forward + reversed, from the one-way 6s morph clip)
ffmpeg -i "transition video.mp4" -filter_complex \
  "[0:v]scale=1920:-2,split[a][b];[b]reverse[r];[a][r]concat=n=2:v=1[v]" \
  -map "[v]" -an -c:v libx264 -crf 22 -pix_fmt yuv420p -movflags +faststart \
  public/hero-reveal.mp4

# poster frame
ffmpeg -i "transition video.mp4" -vf "select=eq(n\,0),scale=1600:-2" \
  -frames:v 1 -q:v 4 public/hero-poster.jpg
```

When final assets arrive, regenerate with the same commands. The base image,
video, and brain still must be crops of the *same scene* (same framing/aspect)
or the reveal edge will visibly misalign.

## Placeholder content to finalize

- Contact form ([src/components/Contact.tsx](src/components/Contact.tsx)) —
  currently front-end only; wire the `onSubmit` to a form backend or replace
  the button with a booking link. Update `hello@deltafluvai.com`.
- Case-study cards in [src/components/Work.tsx](src/components/Work.tsx) are
  representative examples; swap in real engagements when available.
- Stats in [src/components/Problem.tsx](src/components/Problem.tsx) are
  industry-typical placeholders.
