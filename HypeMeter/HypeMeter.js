// Hype Meter — tracks stream activity and fills a visual bar.
//
// Hype is a 0–100 value. Events add hype; it decays by 1 per second when idle.
// Three visual states kick in at 33 (warm), 66 (hot), and 90 (hype).
//
// Event hype contributions:
//   follow:                        +8
//   subscription (new):            +8
//   subscription (resub):          +6
//   subscription (gifted single):  +10
//   subscription (gift bomb ≥5):   +20
//   donation / tip < $10:          +7
//   donation / tip ≥ $10:          +12
//   bits < 1000:                   +5
//   bits ≥ 1000:                   +12
//   raid < 10 viewers:             +10
//   raid ≥ 10 viewers:             +20
//   superchat:                     +10
//   host ≥ 10 viewers:             +10
//   merch / loyalty / other:       +6

var hype = 0;
var DECAY_RATE = 1;
var DECAY_INTERVAL = 1000;

function addHype(amount) {
  hype = Math.min(100, hype + amount);
  render();
}

function hypeForEvent(detail) {
  var type = (detail.type || '').toLowerCase();

  switch (type) {
    case 'follow':
      return 8;

    case 'subscription':
      if (detail.gifted) {
        // gift bomb: detail.amount is the number of subs in the bomb
        if (detail.amount >= 5) return 20;
        return 10;
      }
      return detail.months > 1 ? 6 : 8;

    case 'donation':
    case 'tip':
      return detail.amount >= 10 ? 12 : 7;

    case 'bits':
    case 'cheer':
      return detail.amount >= 1000 ? 12 : 5;

    case 'raid':
      return detail.raiders >= 10 ? 20 : 10;

    case 'host':
      return detail.viewers >= 10 ? 10 : 4;

    case 'superchat':
      return 10;

    default:
      return 6;
  }
}

function render() {
  var pct = Math.round(hype);
  var fill = document.getElementById('hype-fill');
  var glow = document.getElementById('hype-glow');
  var meter = document.getElementById('hype-meter');

  fill.style.height = pct + '%';
  glow.style.height = pct + '%';

  meter.classList.remove('warm', 'hot', 'hype');
  if (pct >= 90) {
    meter.classList.add('hype');
  } else if (pct >= 66) {
    meter.classList.add('hot');
  } else if (pct >= 33) {
    meter.classList.add('warm');
  }
}

setInterval(function () {
  if (hype > 0) {
    hype = Math.max(0, hype - DECAY_RATE);
    render();
  }
}, DECAY_INTERVAL);

document.addEventListener('onLoad', function (obj) {
  console.log('[HypeMeter] loaded', obj.detail);
  render();
});

document.addEventListener('onEventReceived', function (obj) {
  var detail = obj.detail;
  // Ignore chat messages — they would inflate hype on every message
  if (detail.type === 'chatmessage') return;
  console.log('[HypeMeter] event', detail.type, detail);
  addHype(hypeForEvent(detail));
});
