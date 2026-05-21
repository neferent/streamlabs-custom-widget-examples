# DeathCounter

A chat-controlled death counter. Allowed users type commands in Twitch chat to increment, decrement, or reset the count. The number bumps when it goes up and shakes when it goes down or resets.

## Commands

| Command | Action |
|---------|--------|
| `!death` | +1 |
| `!death undo` | -1 (floor: 0) |
| `!death reset` | Reset to 0 |

## Configuration

Edit the `CONFIG` block at the top of `DeathCounter.js`:

| Option | Default | Description |
|--------|---------|-------------|
| `allowedUsers` | `['streamlabs']` | Twitch usernames that can control the counter (case-insensitive) |
| `incrementCommand` | `'!death'` | Chat command to add 1 |
| `decrementCommand` | `'!death undo'` | Chat command to subtract 1 |
| `resetCommand` | `'!death reset'` | Chat command to reset to 0 |
| `label` | `'Deaths'` | Text shown below the number |
| `icon` | `'💀'` | Icon shown above the number |
| `minCount` | `0` | Counter floor — won't go below this |

### Adding moderators

Add usernames to the `allowedUsers` array:

```js
allowedUsers: [
  'streamlabs',
  'your_mod_name',
  'another_mod',
],
```

Usernames are case-insensitive — `Neferent` and `neferent` both work.

### Allowing all moderators

If you'd prefer to allow anyone with mod status rather than managing a list, replace the `allowedSet` check in the chat handler with:

```js
const isMod   = d.tags['mod'] === '1';
const isOwner = d.owner === true;
if (!isMod && !isOwner) return;
```

## Notes

- The count resets to 0 when the widget reloads (browser source refresh)
- `'streamlabs'` is in `allowedUsers` by default so Streamlabs test alerts trigger correctly
- No external libraries required
