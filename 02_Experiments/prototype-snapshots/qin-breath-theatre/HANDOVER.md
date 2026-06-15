# 弦外 Qin Breath Theatre v0.2

一句话：一个先训练古琴气口，再逐步显影减字谱和手法的小剧场。

## Run

```bash
cd /Users/kk/Desktop/LitchCodex/outputs/qin-breath-theatre
python3 -m http.server 4196
```

Open:

```text
http://localhost:4196
```

## What Is In This Prototype

- Two short guqin-inspired study phrases:
  - `仙翁操`: default beginner phrase based on the common opening-training idea of alternating open-string `仙` and stopped-string `翁`.
  - `一弦入山`: slow entry with scattered tone, harmonic, pressed tone, slide, and a return.
  - `良宵影`: a slightly more night-like phrase with lighter harmonics and slower collecting.
- Modes:
  - `随`: beginner breath game. The system chooses string, hui, and technique; the player holds and releases Space near the breath cue.
  - `听`: autoplay, no pressure.
  - `谱`: advanced mode with string, hui, harmonic, slide, and jianzipu decomposition.
- Interaction:
  - In `随`: hold Space or press/touch the qin surface, release to sound. Timing and breath length drive `清 / 稳 / 浮 / 沉 / 涩 / 断气`.
  - In `谱`: number keys select strings, Space plucks, H triggers harmonic, arrow keys slide; click/tap/drag works on the qin body.
- Music model:
  - Synthetic guqin-ish plucks via Web Audio oscillators, breath noise, lowpass decay, stereo body, and delay.
  - `Qi` meter rewards space and punishes dense, anxious actions.
  - Cues are judged by timing, string, action, hui drift, and current qi.
- Visual model:
  - Canvas-rendered guqin body, seven strings, hui dots, hand ring, cue rings, sliding ink trails, and faint mountain layers.
  - No image assets required; the primary visual is generated in canvas for portability.
- Completion artifact:
  - `琴札` summarizes `清 / 稳 / 涩 / 浮 / 沉 / 气` and gives a short practice observation.

## Product Cut In v0.2

- Default `随` mode no longer exposes all five guqin dimensions at once.
- Plain-language cue text appears first: `拨一弦`, `让音走远`, `收回一弦`.
- Jianzipu remains available in `谱` mode: `散一`, `泛七四`, `上七六至六四`.
- During performance, the settings panel collapses so the stage reads more like a qin table than a control dashboard.

## Xianweng Cao Note

- `仙翁操` is intentionally a slow practice-game adaptation, not a complete lineage-specific score.
- The cue design follows the beginner-piece framing and the `仙-翁` open/stopped relationship described in John Thompson's Xian Weng Cao notes and transcription, with extra spacing added for breath timing.
- The follow-mode timing window is wider for this piece because the goal is recognition and settling, not testing.

## Source Files

- `index.html`: app shell and overlays.
- `styles.css`: responsive theatre layout and visual system.
- `app.js`: chart data, audio synthesis, input handling, cue judging, canvas rendering.

## Suggested Next Pass

- Ask a real guqin player to tune the physical metaphors:
  - Whether `清 / 稳 / 涩 / 断气` feels right.
  - Whether `按音走手` should score less on timing and more on post-pluck motion.
  - Whether `泛音` should require a lighter, more precise hui touch.
- Add a real beginner piece adapter after the core feeling is right.
- Replace the Web Audio voice with sampled guqin notes while keeping real-time pitch bend for slides.
- Build a real jianzipu parser layer: action, string, hui, left-hand ornament, and phrase breath.
