// Replica Set Initialization Script
// This script safely initializes the replica set

print('MongoDB Replica Set Initialization')
print('==================================')

try {
  // Check if replica set already exists
  const status = rs.status()
  print('Replica set already initialized:')
  print('  Set:', status.set)
  print('  Members:', status.members.length)

  const primaryMember = status.members.find((m) => m.stateStr === 'PRIMARY')
  if (primaryMember) {
    print('  Primary:', primaryMember.name)
    print('Replica set is ready!')
  } else {
    print('Warning: No primary found, replica set may still be initializing')
  }

  quit(0)
} catch (error) {
  if (error.message.includes('no replset config has been received')) {
    print('Initializing new replica set...')

    const config = {
      _id: 'rs0',
      members: [
        {
          _id: 0,
          host: 'mongodb:27017'
        }
      ]
    }

    print('Configuration:')
    printjson(config)

    const result = rs.initiate(config)

    if (result.ok === 1) {
      print('Replica set initiation successful!')

      // Wait for primary election
      print('Waiting for primary election...')
      let attempts = 0
      const maxAttempts = 30

      while (attempts < maxAttempts) {
        try {
          const currentStatus = rs.status()
          const primary = currentStatus.members.find(
            (m) => m.stateStr === 'PRIMARY'
          )

          if (primary) {
            print('Primary elected:', primary.name)
            print('Replica set ready!')
            quit(0)
          }
        } catch (statusError) {
          // Still initializing
        }

        attempts++
        print('  Waiting... (' + attempts + '/' + maxAttempts + ')')
        sleep(1000)
      }

      print(
        'Replica set initialized but primary election taking longer than expected'
      )
      print('This may be normal - check rs.status() manually')
    } else {
      print('Failed to initialize replica set:')
      printjson(result)
      quit(1)
    }
  } else {
    print('Unexpected error:', error.message)
    quit(1)
  }
}
