// ─── CONFIG ───────────────────────────────────────────────────────────────────
const CONFIG = {
  // Maximum number of toasts visible at once.
  maxToasts: 5,

  // How long each toast stays visible (ms).
  toastDuration: 45000,

  // Left-border and progress bar color per event type.
  eventColors: {
    follow:       '#3b82f6',
    subscription: '#f59e0b',
    donation:     '#10b981',
    bits:         '#8b5cf6',
    raid:         '#ef4444',
    host:         '#06b6d4',
    superchat:    '#f97316',
    merch:        '#ec4899',
    default:      '#6b7280',
  },
};
// ─── END CONFIG ───────────────────────────────────────────────────────────────


// ─── Event formatting ─────────────────────────────────────────────────────────

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

  const icon  = EVENT_ICONS[type] || '🔔';
  const color = CONFIG.eventColors[type] || CONFIG.eventColors.default;
  let   title = name;
  let   msg   = '';

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

  return { icon, color, title, message: msg };
}


// ─── Queue & slot tracking ────────────────────────────────────────────────────

const pendingQueue = []; // events waiting for a slot
let   activeCount  = 0;  // number of toasts currently visible

function enqueue(detail) {
  if (activeCount < CONFIG.maxToasts) {
    showToast(detail);
  } else {
    pendingQueue.push(detail);
  }
}

function onSlotOpened() {
  if (pendingQueue.length > 0) {
    showToast(pendingQueue.shift());
  }
}


// ─── Toast lifecycle ──────────────────────────────────────────────────────────

function showToast(detail) {
  activeCount++;

  const { icon, color, title, message } = formatEvent(detail);
  const stack = document.getElementById('toast-stack');

  // Build element
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.style.setProperty('--event-color',    color);
  toast.style.setProperty('--toast-duration', `${CONFIG.toastDuration}ms`);
  toast.innerHTML = `
    <div class="toast-body">
      <span class="toast-icon">${icon}</span>
      <div class="toast-text">
        <span class="toast-title">${title}</span>
        ${message ? `<span class="toast-message">${message}</span>` : ''}
      </div>
    </div>
    <div class="toast-progress"></div>
  `;

  // Append to bottom of stack
  stack.appendChild(toast);

  // Trigger slide-in on next paint (gives the browser a frame to register
  // the initial transform before we add the .visible class)
  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('visible'));
  });

  // Schedule removal
  const timer = setTimeout(() => removeToast(toast), CONFIG.toastDuration);

  // Store timer on element so it could be cancelled if needed
  toast._timer = timer;
}

function removeToast(toast) {
  if (!toast.isConnected) return;

  // Phase 1 — fade out
  toast.classList.add('exiting');

  // Phase 2 — collapse height after fade completes, reshifting the stack
  setTimeout(() => {
    toast.classList.add('collapsed');
  }, 350); // matches the fade transition duration in CSS

  // Remove from DOM after both transitions complete
  setTimeout(() => {
    toast.remove();
    activeCount--;
    onSlotOpened();
  }, 700); // 350ms fade + 300ms collapse
}


// ─── Event listener ───────────────────────────────────────────────────────────

document.addEventListener('onEventReceived', (obj) => {
  enqueue(obj.detail);
});
