# EventAlert

Displays stream events as on-screen alerts, one at a time. Each alert slides up, holds for a configurable duration, then fades out. Multiple events are queued and shown in order.

## Supported events

| Event | Display |
|-------|---------|
| Follow | "{name} just followed!" |
| Subscription | "{name} just subscribed!" / "{months} months" / gifted variant |
| Donation | "{name} donated {formattedAmount}!" + message |
| Bits | "{name} cheered {amount} bits!" + message |
| Raid | "{name} raided with {raiders} viewers!" |
| Host | "{name} hosted with {viewers} viewers!" |
| Super Chat | "{name} super chatted {amount}!" + message |
| Merch | "{name} bought merch!" + message |

## Configuration

Edit the `CONFIG` block at the top of `EventAlert.js`:

| Option | Default | Description |
|--------|---------|-------------|
| `alertDuration` | `6000` | How long each alert stays visible (ms) |
| `queueInterval` | `500` | How often the queue checks for new events when idle (ms) |
| `transitionDuration` | `400` | Enter/exit transition length — keep in sync with the CSS `transition` value |

## Customisation

- **Icons** — edit the `EVENT_ICONS` object in `EventAlert.js` to change the emoji for each event type
- **Messages** — edit the `switch` block in `formatEvent()` to change what text is shown
- **Styling** — override colours, fonts, size, and position in the `/* Write custom CSS below */` section of `EventAlert.css`
- **Position** — change `bottom: 40px` and `left: 50%` on `#alert-wrap` to reposition the alert

## How to use

Paste into Streamlabs:
- Everything inside `<body>` → **Custom HTML**
- `EventAlert.css` contents → **Custom CSS**
- `EventAlert.js` contents → **Custom JS**

No external libraries required.
