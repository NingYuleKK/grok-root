# Bach Voice Theatre v0.2

一句话：一个用复调训练注意力的五分钟小乐器。

## Run

```bash
cd /Users/kk/Desktop/LitchCodex/outputs/bach-voice-theatre-v02
python3 -m http.server 4182
```

Open:

```text
http://localhost:4182
```

## What Is In This Prototype

- Unified entrance for `Fugue`, `Prelude`, and `846 Gate`.
- Modes:
  - `Play`: DFJK judgement, score, combo, rank.
  - `Follow`: wider judgement, no rank pressure.
  - `Listen`: no input; Vox and ghost voices complete the piece.
- Fugue:
  - Soprano / Alto / Bass selection.
  - Ghost octopi carry the other voices.
  - Subject entries glow through topology lines and octopus labels.
  - Picardy ending makes all voices solid in gold.
- Prelude:
  - Moto perpetuo opening.
  - Presto "hands off, just watch".
  - Adagio star note.
  - Allegro return and Picardy light.
- 846 Gate:
  - A gentle BWV 846 C-major prelude chapter.
  - Built as a breathing entrance rather than a harder stage.
  - One playable `Breath line`; ghost octopi hold inner pulse and bass ground.
  - `INHALE / EXHALE / HOME` section cues.
- Counterpoint Ticket:
  - Mode, voice, Perfect/Good/Miss, max combo, accuracy, stable measure, drift motif.
  - Template-based music observation, not fabricated GPT commentary.
- Latency calibration:
  - Four-tick average saved to localStorage as `bvt.latency`.
- Robust visual clock:
  - Uses AudioContext clock when running.
  - Falls back to wall clock if browser automation or policy suspends audio.

## Source Files

- `index.html`: app shell and overlays.
- `styles.css`: theatre layout, responsive design, octopus/ticket styling.
- `app.js`: score data, audio, chart, theatre, input, receipt, calibration.

## Suggested Next Pass

- Replace oscillator pluck with a better harpsichord voice while keeping realtime scheduling.
- Add a "quiet start" consent screen if some browsers still suspend audio.
- Make topology lines more staff-like: not notation, but a clearer trace of voice contour.
- Store recent Counterpoint Tickets locally as a tiny practice journal.
- Give 846 Gate an even softer visual treatment for sleep / recovery use.
- Keep the three product constraints: no leaderboard, no streak grind, no forced sharing.
