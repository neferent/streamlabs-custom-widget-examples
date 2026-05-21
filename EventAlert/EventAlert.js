// ─── CONFIG ───────────────────────────────────────────────────────────────────
const CONFIG = {
  // How long each alert stays visible (ms).
  alertDuration: 6000,

  // How often the queue checks for new events when idle (ms).
  queueInterval: 500,

  // How long the enter/exit transition takes (ms). Keep in sync with CSS transition.
  transitionDuration: 400,
};
// ─── END CONFIG ───────────────────────────────────────────────────────────────


// ─── Event formatting ─────────────────────────────────────────────────────────
// Returns { icon, title, message } for any event type.
// Add or edit cases here to customise what each event shows.

const EVENT_ICONS = {
  follow:       '🫶',
  subscription: '⭐',
  donation:     '💰',
  bits:         '💎',
  raid:         '⚔️',
  host:         '📡',
  superchat:    '💬',
  merch:        '🛍️',
};

function formatEvent(detail) {
  const {
    type, name,
    amount, formattedAmount, displayString,
    message, months, gifted, gifter,
    raiders, viewers,
  } = detail;

  const icon = EVENT_ICONS[type] || '🔔';
  let title   = name;
  let msg     = '';

  switch (type) {
    case 'follow':
      title = `${name} just followed!`;
      break;

    case 'subscription':
      if (gifted) {
        title = `${gifter} gifted a sub to ${name}!`;
      } else if (months > 1) {
        title = `${name} subscribed for ${months} months!`;
      } else {
        title = `${name} just subscribed!`;
      }
      msg = message || '';
      break;

    case 'donation':
      title = `${name} donated ${formattedAmount}!`;
      msg   = message || '';
      break;

    case 'bits':
      title = `${name} cheered ${amount} bits!`;
      msg   = message || '';
      break;

    case 'raid':
      title = `${name} raided with ${raiders} viewers!`;
      break;

    case 'host':
      title = `${name} hosted with ${viewers} viewers!`;
      break;

    case 'superchat':
      title = `${name} super chatted ${displayString || formattedAmount}!`;
      msg   = message || '';
      break;

    case 'merch':
      title = `${name} bought merch!`;
      msg   = message || '';
      break;

    default:
      title = `${name}`;
  }

  return { icon, title, message: msg };
}


// ─── Display ──────────────────────────────────────────────────────────────────

function showAlert(detail) {
  return new Promise((resolve) => {
    const { icon, title, message } = formatEvent(detail);
    const wrap    = document.getElementById('alert-wrap');
    const msgEl   = document.getElementById('alert-message');

    document.getElementById('alert-icon').textContent  = icon;
    document.getElementById('alert-title').textContent = title;
    msgEl.textContent    = message;
    msgEl.style.display  = message ? 'block' : 'none';

    // Enter
    wrap.classList.add('visible');

    setTimeout(() => {
      // Exit
      wrap.classList.remove('visible');
      setTimeout(() => {
        eventArray.shift();
        resolve();
      }, CONFIG.transitionDuration);
    }, CONFIG.alertDuration);
  });
}


// ─── Queue ────────────────────────────────────────────────────────────────────
// Events fire in real time and can arrive simultaneously — the queue ensures
// they display one at a time, in order.

const eventArray = [];
let eventQueueRunning = false;

function forEachInEventArray(arr, fn) {
  return arr.reduce((promise, event) => {
    return promise.then(() => fn(event));
  }, Promise.resolve());
}

function runEventItem(event) {
  return new Promise((resolve) => {
    Promise.resolve().then(() => {
      eventQueueRunning = true;
      showAlert(event.detail).then(resolve);
    });
  });
}

setInterval(() => {
  if (!eventQueueRunning) {
    forEachInEventArray(eventArray, runEventItem).then(() => {
      eventQueueRunning = false;
    });
  }
}, CONFIG.queueInterval);


// ─── Event listener ───────────────────────────────────────────────────────────

document.addEventListener('onEventReceived', (obj) => {
  eventArray.push(obj);
});
