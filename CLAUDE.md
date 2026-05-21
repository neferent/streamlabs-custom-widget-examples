# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Repo Is

A collection of finished, ready-to-use examples for Streamlabs' **Custom Widget** — a widget type that accepts 100% custom HTML, CSS, and JS with no restrictions on structure or behaviour. Unlike other Streamlabs widgets, the Custom Widget has no built-in rendering layer; everything is authored from scratch.

Examples are intended to be learned from and adapted, not used as blank templates. Each one is a complete, working widget.

## How to Preview

Open the project folder in [Phoenix Code](https://phcode.io/) and use its built-in live preview. Stream events (`onEventReceived`, etc.) will not fire locally — only layout and CSS animations can be verified this way.

Use `document.dispatchEvent()` calls in the browser console to simulate events during local development. See the fake event shapes below.

Target browser: Chrome/Chromium only (OBS Studio and Streamlabs Desktop embed a Chromium-based browser source).

## Repo Structure

Each example lives in its own top-level directory:

```
ExampleName/
  ExampleName.html   — full HTML file (wrap in <html> for local preview)
  ExampleName.css    — styles
  ExampleName.js     — widget logic
  readme.md          — what it does, tokens used, configurable options
```

In Streamlabs, paste:
- Everything inside `<body>` → Custom HTML field
- Contents of the `.css` file → Custom CSS field
- Contents of the `.js` file → Custom JS field

## Custom Widget Event Model

Custom Widgets use `document.addEventListener` for all Streamlabs events. jQuery is **not** pre-loaded — include it yourself via a `<script>` tag if needed, or use vanilla JS.

### Core events

```js
document.addEventListener('onLoad', (e) => {
  // e.detail — widget settings from the Streamlabs Fields tab (fieldData)
});

document.addEventListener('onEventReceived', (e) => {
  const { type, ...rest } = e.detail;
  // type: 'follow', 'subscription', 'donation', 'bits', 'raid', 'host', 'superchat', etc.
});
```

### Full event object shape

The full object passed to `onEventReceived` looks like this (donation example):

```js
{
  detail: {
    _id: "2f7552cde8652a52a92d987c3efee6a5",
    type: "donation",
    from: "John",
    name: "John",
    amount: 63,
    formattedAmount: "$63.00",
    currency: "USD",
    donationCurrency: "USD",
    message: "This is a test donation for $63.00.",
    isTest: true,
    createdAt: "2021-10-06 22:50:38",
    hash: "donation:John:This is a test donation for $63.00.:63:",
    payload: {
      _id: "2f7552cde8652a52a92d987c3efee6a5",
      amount: 63,
      currency: "USD",
      formatted_amount: "$63.00",
      from: "John",
      from_user_id: 1,
      isTest: true,
      message: "This is a test donation for $63.00.",
      name: "neferent",
      priority: 10,
      to: { name: "neferent" },
    },
    alert_status: 1,
    priority: 10,
    read: false,
    repeat: false,
    skipAlert: false,
    // ... additional internal Streamlabs fields
  }
}
```

### Platform-specific event shapes

```js
// Twitch follow — minimal shape
detail: {
  name: "username",
  type: "follow",
}

// YouTube Super Chat
detail: {
  type: "superchat",
  name: "username",
  from: "username",
  amount: 25000000,       // raw units
  displayString: "$25",
  formattedAmount: "$25.00",
  currency: "USD",
  message: "Super chat message here.",
  platform: "youtube_account",
  isTest: true,
  // ...
}
```

### Event types — full reference

All events arrive via `onEventReceived`. Filter on `obj.detail.type`. Common shared fields on every event:

```
name          — display name of the user triggering the event (same as `from`)
from          — same as name
isTest        — boolean, true when fired from the Streamlabs test button
createdAt     — ISO datetime string e.g. '2026-05-20 14:32:00'
createdAtTimestamp — Unix ms timestamp
platform      — 'twitch_account' | 'youtube_account' | 'facebook_account' | ...
```

---

#### `follow`
```js
{
  type: 'follow',
  name: 'username',
}
```

---

#### `subscription`

New sub, resub, and gifted subs all share `type: 'subscription'`. Distinguish them with `gifted` and `months`:

```js
// New subscription
{
  type:    'subscription',
  name:    'username',
  months:  1,
  message: '',           // subscriber's share message, may be empty
  gifted:  false,
}

// Resub
{
  type:    'subscription',
  name:    'username',
  months:  14,           // cumulative months subscribed
  message: 'Love this stream!',
  gifted:  false,
}

// Gifted sub (gifter sent a sub to name)
{
  type:    'subscription',
  name:    'recipient',  // person who received the gift
  gifter:  'gifter',     // person who sent the gift
  months:  1,
  message: '',
  gifted:  true,
}

// Gift bomb — gifter sends multiple subs at once (one event per recipient + one summary)
// The summary event has:
{
  type:    'subscription',
  name:    'gifter',
  gifter:  'gifter',
  amount:  10,           // number of subs gifted in the bomb
  gifted:  true,
}
```

---

#### `donation`

Streamlabs tip (platform-agnostic — covers StreamElements, PayPal integrations, etc.):

```js
{
  type:            'donation',
  name:            'username',
  amount:          15,            // raw number — may be 0 on real donations (bug), always use formattedAmount for display
  formattedAmount: '$15.00',      // always use this for display
  currency:        'USD',
  message:         'Great stream!',
}
```

---

#### `bits`

Twitch Bits / Cheers:

```js
{
  type:    'bits',
  name:    'username',
  amount:  500,          // number of bits
  message: 'cheer500 PogChamp',
}
```

---

#### `raid`

```js
{
  type:    'raid',
  name:    'username',   // raiding streamer
  raiders: 250,          // viewer count
}
```

---

#### `host`

```js
{
  type:      'host',
  name:      'username',
  viewers:   120,
  host_type: 'auto' | 'manual' | '',
}
```

---

#### `superchat`

YouTube Super Chat:

```js
{
  type:            'superchat',
  name:            'username',
  amount:          25000000,     // raw units (YouTube internal)
  displayString:   '$25',        // short formatted
  formattedAmount: '$25.00',
  currency:        'USD',
  message:         'Super chat message',
}
```

---

#### `merch`

Streamlabs Merch store purchase:

```js
{
  type:    'merch',
  name:    'username',
  message: 'Enjoy!',
  product: 'T-Shirt',
}
```

---

#### `loyalty_store_redemption`

Streamlabs Loyalty Store (channel points-style):

```js
{
  type:    'loyalty_store_redemption',
  name:    'username',
  message: 'item name',
}
```

---

#### Charity platforms

Tiltify, Donordrive, ExtraLife, Justgiving, Twitch Charity all produce a `donation`-shaped event but with a `platform` field indicating the source:

```js
{
  type:            'donation',
  name:            'username',
  amount:          50,
  formattedAmount: '$50.00',
  currency:        'USD',
  message:         'For the kids!',
  platform:        'tiltify' | 'donordrive' | 'extra_life' | 'justgiving' | 'twitch_charity',
}
```

---

#### Facebook

```js
// Facebook Star (equivalent to Bits)
{ type: 'stars',   name: 'username', amount: 100 }

// Facebook Support (subscription)
{ type: 'support', name: 'username', months: 3 }

// Facebook Like / Follow / Share — name only
{ type: 'like' | 'follow' | 'share', name: 'username' }
```

---

#### Trovo / Picarto

```js
// Trovo sub / spell
{ type: 'subscription', name: 'username', months: 1, platform: 'trovo_account' }

// Picarto sub
{ type: 'subscription', name: 'username', months: 1, platform: 'picarto_account' }
```

---

### Fake event dispatches for local testing

Copy into the browser console while previewing in Phoenix Code:

```js
// Follow
document.dispatchEvent(new CustomEvent('onEventReceived', { detail: {
  type: 'follow', name: 'TestUser', from: 'TestUser', isTest: true,
}}));

// Subscription (new)
document.dispatchEvent(new CustomEvent('onEventReceived', { detail: {
  type: 'subscription', name: 'TestUser', from: 'TestUser',
  months: 1, message: '', gifted: false, isTest: true,
}}));

// Subscription (resub)
document.dispatchEvent(new CustomEvent('onEventReceived', { detail: {
  type: 'subscription', name: 'TestUser', from: 'TestUser',
  months: 14, message: 'Love this stream!', gifted: false, isTest: true,
}}));

// Gifted sub
document.dispatchEvent(new CustomEvent('onEventReceived', { detail: {
  type: 'subscription', name: 'Recipient', from: 'Recipient',
  gifter: 'TestUser', months: 1, gifted: true, isTest: true,
}}));

// Donation
document.dispatchEvent(new CustomEvent('onEventReceived', { detail: {
  type: 'donation', name: 'TestUser', from: 'TestUser',
  amount: 25, formattedAmount: '$25.00', currency: 'USD',
  message: 'Great stream!', isTest: true,
}}));

// Bits
document.dispatchEvent(new CustomEvent('onEventReceived', { detail: {
  type: 'bits', name: 'TestUser', from: 'TestUser',
  amount: 500, message: 'cheer500 PogChamp', isTest: true,
}}));

// Raid
document.dispatchEvent(new CustomEvent('onEventReceived', { detail: {
  type: 'raid', name: 'TestUser', from: 'TestUser',
  raiders: 250, isTest: true,
}}));

// Super Chat
document.dispatchEvent(new CustomEvent('onEventReceived', { detail: {
  type: 'superchat', name: 'TestUser', from: 'TestUser',
  amount: 25000000, displayString: '$25', formattedAmount: '$25.00',
  currency: 'USD', message: 'Great stream!', isTest: true,
}}));

// Twitch chat message
document.dispatchEvent(new CustomEvent('onEventReceived', { detail: {
  type: 'chatmessage', command: 'PRIVMSG',
  from: 'testuser', body: '!death',
  owner: false, subscriber: false, userType: 'mod',
  tags: { 'display-name': 'TestUser', 'mod': '1', 'color': '#FF0000' },
  isTest: true,
}}));
```

Supported platforms: Twitch, YouTube, Facebook, Trovo, Picarto, Tiltify, ExtraLife, Donordrive, Treatstream, Patreon, Justgiving, and any future platforms Streamlabs adds.

### Chat messages (Twitch)

Chat messages arrive as a separate event type injected by Streamlabs. Filter on `command === 'PRIVMSG'` and `type === 'chatmessage'`:

```js
document.addEventListener('onEventReceived', (obj) => {
  const d = obj.detail;
  if (d.command !== 'PRIVMSG' || d.type !== 'chatmessage') return;

  const username = d.from;               // lowercase, e.g. 'neferent'
  const message  = d.body;              // message text
  const isMod    = d.tags['mod'] === '1';
  const isOwner  = d.owner === true;
});
```

Full chat event shape (`obj.detail`):

```js
{
  type:      'chatmessage',
  command:   'PRIVMSG',
  from:      'neferent',              // lowercase username
  body:      'This is a chat message',
  owner:     true,                    // boolean — true if channel owner/broadcaster
  subscriber: true,                   // boolean
  userType:  'user',                  // 'user' | 'mod' | 'vip'
  platform:  'twitch_account',
  messageId: '8358e808-...',
  tags: {
    'display-name': 'neferent',       // display name (preserves capitalisation)
    'color':        '#1957B3',        // chat colour, empty string if unset
    'mod':          '0',              // '1' if moderator, '0' if not — string, not boolean
    'subscriber':   '1',             // '1' if subscriber — string, not boolean
    'badges':       'broadcaster/1,subscriber/3012',
    'badge-info':   'subscriber/92',
    'emotes':       '',
    'user-id':      '145237373',
    'id':           '8358e808-...',   // same as messageId
    'first-msg':    '0',
    'returning-chatter': '0',
    'room-id':      '145237373',
    // ...other standard Twitch IRC tags
  },
  // rarely needed:
  payload: { raw: '...', prefix: '...', params: ['#neferent'], crlf: '...' },
}
```

Note: `tags.mod` is the string `'1'`/`'0'`, not a boolean. Use `d.tags['mod'] === '1'` to check.

---

## Patterns

### Re-dispatching events

Rather than one catch-all listener that handles every event type, a cleaner pattern is to normalise and re-dispatch events as typed custom events:

```js
document.addEventListener('onEventReceived', (obj) => {
  if (obj.detail.type === 'host' && obj.detail.platform === 'twitch_account') {
    window.dispatchEvent(new CustomEvent('twitchHost', {
      detail: {
        type: 'host',
        name: obj.detail.from,
        viewers: obj.detail.viewers,
        hostType: obj.detail.host_type,
      }
    }));
  }
});

window.addEventListener('twitchHost', (obj) => {
  if (obj.detail.viewers >= 1000) {
    playBigHostAlert(obj.detail);
  } else {
    playSmallHostAlert(obj.detail);
  }
});
```

### Building a queue

**The Custom Widget has no built-in queue.** Unlike the AlertBox widget, events arrive in real time as they happen — simultaneously and not necessarily in order. If multiple events fire at once, they will all trigger at the same time without waiting for each other.

Build a simple queue by pushing events into an array and draining it with a `reduce()` inside a `Promise` chain:

```js
const eventArray = [];
const queueDuration = 5000; // ms to display each event
const queueInterval = 1000; // ms between queue checks
let eventQueueRunning = false;

function forEachInEventArray(arr, fn) {
  return arr.reduce((promise, thisEvent) => {
    return promise.then(() => fn(thisEvent));
  }, Promise.resolve());
}

function runEventItem(thisEvent) {
  return new Promise((resolve) => {
    eventQueueRunning = true;
    showEvent(thisEvent); // your display logic here
    setTimeout(() => {
      eventArray.shift();
      resolve();
    }, queueDuration);
  });
}

setInterval(() => {
  if (!eventQueueRunning) {
    forEachInEventArray(eventArray, runEventItem).then(() => {
      eventQueueRunning = false;
    });
  }
}, queueInterval);

document.addEventListener('onEventReceived', (obj) => {
  eventArray.push(obj);
});
```

### Loading external libraries

If you need a CDN library, guard against events firing before the library has loaded:

```js
const scripts = [
  'https://cdnjs.cloudflare.com/ajax/libs/velocity/1.5.0/velocity.min.js',
];

let fetchedStatus = {};
scripts.forEach(script => (fetchedStatus[script] = false));

function ensureDependencies() {
  return new Promise((resolve, reject) => {
    if (Object.values(fetchedStatus).every(s => s)) {
      resolve();
    } else {
      Promise.all(scripts.map(getScriptPromise)).then(resolve).catch(reject);
    }
  });
}

function getScriptPromise(script) {
  return new Promise((resolve, reject) => {
    $.getScript(script).done(() => {
      fetchedStatus[script] = true;
      resolve();
    }).fail(() => reject(`script failed to load: ${script}`));
  });
}

ensureDependencies().then(() => {
  // safe to use the library here
  document.addEventListener('onEventReceived', (obj) => {
    // handle events
  });
});
```

Unlike the AlertBox widget sandbox, the Custom Widget **does** allow external CDN script loading.

## Tokens / field data

Widget settings defined in the Custom Widget's Fields tab are injected as `{token}` placeholders in the HTML at runtime, and are also available in JS via `onLoad`:

```js
document.addEventListener('onLoad', (e) => {
  const settings = e.detail.fieldData;
  // settings.my_field_name, etc.
});
```
