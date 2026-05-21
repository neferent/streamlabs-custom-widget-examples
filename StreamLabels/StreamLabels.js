// ─── CONFIG ───────────────────────────────────────────────────────────────────
// Add, remove, or reorder entries to control which stats appear and in what order.
// Each entry needs a unique `key` that matches a key in `state` below.
const CONFIG = {
  stats: [
    { key: 'lastFollow',      label: 'Last Follow'    },
    { key: 'lastSub',         label: 'Last Sub'       },
    { key: 'lastDonation',    label: 'Last Tip'       },
    { key: 'largestDonation', label: 'Largest Tip'    },
    { key: 'totalDonations',  label: 'Total Tips'     },
    { key: 'lastBits',        label: 'Last Bits'      },
    { key: 'lastRaid',        label: 'Last Raid'      },
  ],

  // Shown when no event of that type has been received yet this session.
  emptyValue: '—',
};
// ─── END CONFIG ───────────────────────────────────────────────────────────────


// ─── Session state ────────────────────────────────────────────────────────────
// All values reset when the widget reloads (i.e. per session).

const state = {
  lastFollow:      null,  // { name }
  lastSub:         null,  // { name, months, gifted, gifter }
  lastDonation:    null,  // { name, amount, formattedAmount }
  largestDonation: null,  // { name, amount, formattedAmount }
  totalDonations:  0,
  lastBits:        null,  // { name, amount }
  lastRaid:        null,  // { name, raiders }
};


// ─── Formatters ───────────────────────────────────────────────────────────────
// Each function receives the current state value and returns a display string.

const formatters = {
  lastFollow: (v) =>
    v ? v.name : null,

  lastSub: (v) => {
    if (!v) return null;
    if (v.gifted) return `${v.name} (gift from ${v.gifter})`;
    return v.months > 1 ? `${v.name} × ${v.months}mo` : v.name;
  },

  lastDonation: (v) =>
    v ? `${v.formattedAmount} — ${v.name}` : null,

  largestDonation: (v) =>
    v ? `${v.formattedAmount} — ${v.name}` : null,

  totalDonations: (v) =>
    v > 0 ? `$${v.toFixed(2)}` : null,

  lastBits: (v) =>
    v ? `${v.amount.toLocaleString()} — ${v.name}` : null,

  lastRaid: (v) =>
    v ? `${v.name} (${v.raiders.toLocaleString()})` : null,
};


// ─── DOM ──────────────────────────────────────────────────────────────────────

function buildBar() {
  const bar = document.getElementById('labels-bar');
  CONFIG.stats.forEach(({ key, label }) => {
    const stat = document.createElement('div');
    stat.className = 'stat';
    stat.id = `stat-${key}`;
    stat.innerHTML = `
      <span class="stat-label">${label}</span>
      <span class="stat-value empty">${CONFIG.emptyValue}</span>
    `;
    bar.appendChild(stat);
  });
}

function updateStat(key) {
  const el = document.querySelector(`#stat-${key} .stat-value`);
  if (!el) return;

  const formatted = formatters[key] ? formatters[key](state[key]) : null;

  if (formatted === null) {
    el.textContent = CONFIG.emptyValue;
    el.classList.add('empty');
    el.classList.remove('updated');
  } else {
    el.textContent = formatted;
    el.classList.remove('empty');
    // Restart the flash animation
    el.classList.remove('updated');
    void el.offsetWidth;
    el.classList.add('updated');
  }
}


// ─── Event handling ───────────────────────────────────────────────────────────

document.addEventListener('onEventReceived', (obj) => {
  const d = obj.detail;

  switch (d.type) {
    case 'follow':
      state.lastFollow = { name: d.name };
      updateStat('lastFollow');
      break;

    case 'subscription':
      state.lastSub = {
        name:   d.name,
        months: d.months || 1,
        gifted: d.gifted || false,
        gifter: d.gifter || '',
      };
      updateStat('lastSub');
      break;

    case 'donation': {
      const entry = { name: d.name, amount: d.amount, formattedAmount: d.formattedAmount };
      state.lastDonation = entry;
      updateStat('lastDonation');

      if (!state.largestDonation || d.amount > state.largestDonation.amount) {
        state.largestDonation = entry;
        updateStat('largestDonation');
      }

      state.totalDonations = (state.totalDonations || 0) + d.amount;
      updateStat('totalDonations');
      break;
    }

    case 'bits':
      state.lastBits = { name: d.name, amount: d.amount };
      updateStat('lastBits');
      break;

    case 'raid':
      state.lastRaid = { name: d.name, raiders: d.raiders };
      updateStat('lastRaid');
      break;
  }
});


// ─── Init ─────────────────────────────────────────────────────────────────────

buildBar();
