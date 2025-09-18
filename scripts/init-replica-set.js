// Quiet replica set init for single-node dev/local use.

// If already initialized, we're done.
try {
  rs.status()
  quit(0)
} catch (e) {
  // If it's not the "no replset config" case, bubble up.
  if (!/no replset config has been received/i.test(e.message)) {
    throw e
  }
  // Initialize a simple single-member set.
  const res = rs.initiate({
    _id: 'rs0',
    members: [{ _id: 0, host: 'mongodb:27017' }]
  })
  if (!res || res.ok !== 1) {
    // Only print on failure to keep noise down.
    printjson(res)
    quit(1)
  }
}

// Wait briefly for PRIMARY election (quietly)
for (let i = 0; i < 30; i++) {
  try {
    const s = rs.status()
    if (s.members && s.members.some((m) => m.stateStr === 'PRIMARY')) {
      break
    }
  } catch (_ignored) {}
  sleep(500)
}

quit(0)
