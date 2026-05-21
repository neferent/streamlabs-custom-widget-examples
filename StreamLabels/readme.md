# StreamLabels

A persistent stats bar that tracks session data in real time — last follow, last sub, last tip, largest tip, total tips, last bits, and last raid. Values update instantly when an event comes in and reset when the widget reloads.

## What it looks like

A full-width bar pinned to the bottom of the widget. Each stat shows a small label above a value, separated by dividers. When a value updates it flashes orange briefly.

## Stats

| Key | Label | Shows |
|-----|-------|-------|
| `lastFollow` | Last Follow | Follower name |
| `lastSub` | Last Sub | Subscriber name, months, or gifter |
| `lastDonation` | Last Tip | Amount and name |
| `largestDonation` | Largest Tip | Highest single donation this session |
| `totalDonations` | Total Tips | Running donation total this session |
| `lastBits` | Last Bits | Bit amount and name |
| `lastRaid` | Last Raid | Raider name and viewer count |

## Configuration

Edit the `CONFIG.stats` array in `StreamLabels.js` to control which stats appear and in what order. Remove any entry you don't want, or reorder them by moving the objects.

```js
stats: [
  { key: 'lastFollow',   label: 'Last Follow' },
  { key: 'lastDonation', label: 'Last Tip'    },
  // remove or add entries here
],
```

## Customisation

- **Bar height** — change `height: 48px` on `#labels-bar` in the CSS
- **Position** — default is pinned to the bottom. Change `bottom: 0` to `top: 0` for a top bar, or set a fixed pixel position
- **Flash colour** — change `color: #f97316` in the `@keyframes flash` rule
- **Empty placeholder** — change `emptyValue` in `CONFIG`
- **Value format** — edit the `formatters` object in `StreamLabels.js`

## Adding a custom stat

1. Add a key to `state` in `StreamLabels.js`
2. Add a formatter function for that key in `formatters`
3. Add an entry to `CONFIG.stats` with the matching key and a label
4. Set `state.yourKey` and call `updateStat('yourKey')` inside the appropriate `switch` case in the event listener

## Notes

- No queue used — values update immediately on each event
- All session totals reset when the widget reloads
- No external libraries required
