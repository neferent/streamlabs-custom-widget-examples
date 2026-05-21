# HypeMeter

A vertical bar widget that visually tracks stream activity in real time. It fills up as events come in (follows, subs, donations, raids, etc.) and slowly drains when the stream goes quiet.

## How it works

- Each event adds a fixed amount of hype (0–100 scale).
- Hype decays by 1 per second when no events arrive.
- Three visual states with color and glow shifts:
  - **Warm** (≥33): green label, flame icon fades in
  - **Hot** (≥66): yellow label
  - **HYPE** (≥90): red/orange label pulses, flame bounces, bar glows orange

## Hype contributions per event type

| Event | Hype added |
|-------|-----------|
| Follow | +8 |
| New subscription | +8 |
| Resub | +6 |
| Gifted sub (single) | +10 |
| Gift bomb (≥5 subs) | +20 |
| Donation / Tip < $10 | +7 |
| Donation / Tip ≥ $10 | +12 |
| Bits < 1000 | +5 |
| Bits ≥ 1000 | +12 |
| Raid < 10 viewers | +10 |
| Raid ≥ 10 viewers | +20 |
| Superchat | +10 |
| Host ≥ 10 viewers | +10 |
| Merch / loyalty / other | +6 |

Chat messages are intentionally ignored — they would inflate hype on every line of chat.

## Streamlabs setup

1. Add a **Custom Widget** in Streamlabs.
2. Paste the contents of `HypeMeter.html` `<body>` into **Custom HTML**.
3. Paste `HypeMeter.css` into **Custom CSS**.
4. Paste `HypeMeter.js` into **Custom JS**.
5. Size the widget to ~60×280px and position it at the edge of your scene.

## Local preview / testing

Open `HypeMeter.html` in Phoenix Code and use its live preview. Paste these into the browser console to simulate events:

```js
// Follow (+8)
document.dispatchEvent(new CustomEvent('onEventReceived', { detail: { type: 'follow', name: 'TestUser', isTest: true }}));

// New sub (+8)
document.dispatchEvent(new CustomEvent('onEventReceived', { detail: { type: 'subscription', name: 'TestUser', months: 1, gifted: false, isTest: true }}));

// Resub (+6)
document.dispatchEvent(new CustomEvent('onEventReceived', { detail: { type: 'subscription', name: 'TestUser', months: 14, gifted: false, isTest: true }}));

// Gift bomb of 10 (+20)
document.dispatchEvent(new CustomEvent('onEventReceived', { detail: { type: 'subscription', name: 'TestUser', gifted: true, amount: 10, isTest: true }}));

// Large donation (+12)
document.dispatchEvent(new CustomEvent('onEventReceived', { detail: { type: 'donation', name: 'TestUser', amount: 50, formattedAmount: '$50.00', isTest: true }}));

// Big raid (+20)
document.dispatchEvent(new CustomEvent('onEventReceived', { detail: { type: 'raid', name: 'RaidBoss', raiders: 250, isTest: true }}));

// Big bits (+12)
document.dispatchEvent(new CustomEvent('onEventReceived', { detail: { type: 'bits', name: 'TestUser', amount: 2000, isTest: true }}));
```
