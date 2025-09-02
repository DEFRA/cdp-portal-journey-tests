db = db.getSiblingDB('cdp-user-service-backend')

db.scopes.updateOne(
  {
    value: 'externalTest'
  },
  {
    $setOnInsert: {
      _id: new ObjectId('674def9d30093e3a3aa49d35'),
      userId: '90552794-0613-4023-819a-512aa9d40023',
      value: 'externalTest',
      kind: ['team'],
      teams: ['platform'],
      createdAt: '2024-12-02T17:34:21.295Z',
      updatedAt: '2024-12-02T17:34:21.295Z'
    }
  },
  { upsert: true }
)

db.scopes.updateOne(
  {
    value: 'breakglass'
  },
  {
    $setOnInsert: {
      _id: new ObjectId('6750708d454fcbbcc1568154'),
      userId: '90552794-0613-4023-819a-512aa9d40023',
      value: 'breakGlass',
      kind: ['user'],
      teams: [],
      createdAt: '2024-12-02T17:34:21.295Z',
      updatedAt: '2024-12-02T17:34:21.295Z'
    }
  },
  { upsert: true }
)

db.scopes.updateOne(
  {
    value: 'admin'
  },
  {
    $setOnInsert: {
      _id: new ObjectId('6824a65285c4bfd4d458ab74'),
      userId: '90552794-0613-4023-819a-512aa9d40023',
      value: 'admin',
      kind: ['team'],
      teams: ['platform'],
      createdAt: '2024-12-02T17:34:21.295Z',
      updatedAt: '2024-12-02T17:34:21.295Z'
    }
  },
  { upsert: true }
)

db.teams.updateOne(
  {
    name: 'Platform'
  },
  {
    $setOnInsert: {
      _id: 'platform',
      name: 'Platform',
      description: 'The team that runs the platform',
      github: 'cdp-platform',
      users: ['90552794-0613-4023-819a-512aa9d40023'],
      scopes: [
        new ObjectId('674def9d30093e3a3aa49d35'),
        new ObjectId('6824a65285c4bfd4d458ab74')
      ],
      alertEmailAddresses: ['platform@cdp.local'],
      createdAt: '2023-10-26T12:51:00.028Z',
      updatedAt: '2023-10-26T12:51:00.028Z'
    }
  },
  { upsert: true }
)

db.teams.updateOne(
  {
    name: 'TenantTeam1'
  },
  {
    $setOnInsert: {
      _id: 'tenantteam1',
      name: 'TenantTeam1',
      description: 'A test team',
      github: 'cdp-tenant-1',
      users: [],
      scopes: [],
      createdAt: '2024-10-26T12:51:00.028Z',
      updatedAt: '2024-10-26T12:55:00.028Z'
    }
  },
  { upsert: true }
)
