# EventList

A toast-style event list. Events slide in from the right and stack at the bottom-right of the screen. Each toast shows for 45 seconds then fades out — the remaining toasts smoothly reshift to fill the gap. Up to 5 are shown at once; extras queue up and appear as slots open.

## Behaviour

- **Slide in** from the right when an event arrives
- **Stack** bottom to top — newest events at the bottom
- **Max 5 visible** at once; additional events queue and appear as older ones expire
- **45-second timer** per toast, shown as a shrinking progress bar
- **Fade out** when the timer expires, then the height collapses so the remaining toasts slide up smoothly

## Configuration

Edit the `CONFIG` block at the top of `EventList.js`:

| Option | Default | Description |
|--------|---------|-------------|
| `maxToasts` | `5` | Maximum toasts visible at once |
| `toastDuration` | `45000` | How long each toast stays visible (ms) |
| `eventColors` | *(see JS)* | Left-border and progress bar colour per event type |

## Customisation

- **Position** — change `bottom` and `right` on `#toast-stack` to reposition the stack
- **Width** — change `width: 340px` on `#toast-stack`
- **Stack direction** — to have newest at the top instead, change `flex-direction: column` to `flex-direction: column-reverse` and prepend toasts instead of appending them
- **Icons** — edit the `EVENT_ICONS` object in `EventList.js`
- **Event text** — edit the `switch` block in `formatEvent()`

## How to use

Paste into Streamlabs:
- Everything inside `<body>` → **Custom HTML**
- `EventList.css` contents → **Custom CSS**
- `EventList.js` contents → **Custom JS**

No external libraries required.
