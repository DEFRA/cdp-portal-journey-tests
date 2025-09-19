// MongoDb replica set init
;(function () {
  const RS_NAME = 'rs0'
  const RS_PRIMARY = 'mongodb:27017'
  const WAIT_SEC = 30

  function notYetInitialized(err) {
    return /no replset config|not yet initialized|NotYetInitialized/i.test(
      err && err.message
    )
  }

  function waitForPrimary(maxSec) {
    for (let i = 0; i < maxSec; i++) {
      try {
        const s = rs.status()
        if (s.ok === 1) {
          const primary = (s.members || []).find(
            (m) => m.stateStr === 'PRIMARY'
          )
          if (primary) return { ok: 1, primary: primary.name }
        }
      } catch (e) {
        if (!notYetInitialized(e)) throw e
      }
      sleep(1000)
    }
    return { ok: 0, error: 'timeout waiting for PRIMARY' }
  }

  // If already a replSet, just ensure PRIMARY becomes available
  try {
    const s = rs.status()
    // If set name mismatches desired, warn but do nothing destructive
    if (s.set && s.set !== RS_NAME) {
      print(`Replica set already initialized with different name: ${s.set}`)
    }
    const result = waitForPrimary(WAIT_SEC)
    if (result.ok) {
      print(`Replica set ready. PRIMARY: ${result.primary}`)
      quit(0)
    }
    print(result.error)
    quit(2)
  } catch (e) {
    if (!notYetInitialized(e)) {
      print(`Unexpected error while checking rs.status(): ${e.message}`)
      quit(1)
    }
  }

  // Not initialized -> initiate with a simple single-node config
  const config = { _id: RS_NAME, members: [{ _id: 0, host: RS_PRIMARY }] }

  try {
    const res = rs.initiate(config)
    if (!(res && res.ok === 1)) {
      print('rs.initiate returned non-ok response:')
      printjson(res)
      quit(1)
    }
  } catch (e) {
    // If another init raced us, tolerate AlreadyInitialized
    if (!/already initialized|AlreadyInitialized/i.test(e.message)) {
      print(`rs.initiate failed: ${e.message}`)
      quit(1)
    }
  }

  const result = waitForPrimary(WAIT_SEC)
  if (result.ok) {
    print(`Replica set initialized. PRIMARY: ${result.primary}`)
    quit(0)
  }

  print(result.error)
  quit(2)
})()
