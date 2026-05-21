// ─── CONFIG ───────────────────────────────────────────────────────────────────
const CONFIG = {
  // Twitch usernames allowed to control the counter (case-insensitive).
  // 'streamlabs' is included by default so test alerts work out of the box.
  allowedUsers: [
    'streamlabs',
  ],

  // Chat commands
  incrementCommand: '!death',       // adds 1
  decrementCommand: '!death undo',  // subtracts 1
  resetCommand:     '!death reset', // resets to 0

  // Display
  label: 'Deaths',
  icon:  '💀',

  // Counter floor — won't go below this value
  minCount: 0,
};
// ─── END CONFIG ───────────────────────────────────────────────────────────────


// ─── State ────────────────────────────────────────────────────────────────────

let count = 0;

// Normalise allowed list once so every comparison is O(1) and case-insensitive
const allowedSet = new Set(CONFIG.allowedUsers.map(u => u.toLowerCase()));


// ─── Display ──────────────────────────────────────────────────────────────────

function render(animation) {
  const valueEl = document.getElementById('counter-value');

  valueEl.textContent = count;

  if (animation) {
    valueEl.classList.remove('bump', 'shake');
    void valueEl.offsetWidth; // force reflow so the animation restarts
    valueEl.classList.add(animation);
  }
}

function init() {
  document.getElementById('counter-icon').textContent  = CONFIG.icon;
  document.getElementById('counter-label').textContent = CONFIG.label;
  render(null);
}


// ─── Chat handler ─────────────────────────────────────────────────────────────

document.addEventListener('onEventReceived', (obj) => {
  const d = obj.detail;

  // Only process Twitch chat messages
  if (d.command !== 'PRIVMSG' || d.type !== 'chatmessage') return;

  const sender  = (d.from || '').toLowerCase();
  const message = (d.body || '').trim().toLowerCase();

  // Check sender is in the allowed list
  if (!allowedSet.has(sender)) return;

  // Longest command first so '!death reset' isn't partially matched by '!death'
  if (message === CONFIG.resetCommand.toLowerCase()) {
    count = CONFIG.minCount;
    render('shake');
  } else if (message === CONFIG.decrementCommand.toLowerCase()) {
    count = Math.max(CONFIG.minCount, count - 1);
    render('shake');
  } else if (message === CONFIG.incrementCommand.toLowerCase()) {
    count++;
    render('bump');
  }
});


// ─── Init ─────────────────────────────────────────────────────────────────────

init();
