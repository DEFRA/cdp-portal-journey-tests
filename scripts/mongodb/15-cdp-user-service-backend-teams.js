db = db.getSiblingDB('cdp-user-service-backend')

const teams = [
  {
    _id: 'platform',
    name: 'Platform',
    description: 'The team that runs the platform',
    github: 'cdp-platform',
    alertEmailAddresses: ['platform@cdp.local'],
    createdAt: '2023-10-26T12:51:00.028Z',
    updatedAt: '2023-10-26T12:51:00.028Z',
    users: ['90552794-0613-4023-819a-512aa9d40023'],
    scopes: [
      {
        scopeId: 'externalTest',
        scopeName: 'externalTest'
      },
      {
        scopeId: 'admin',
        scopeName: 'admin'
      }
    ]
  },
  {
    _id: 'tenantteam1',
    name: 'TenantTeam1',
    description: 'A test team',
    github: 'cdp-tenant-1',
    createdAt: '2024-10-26T12:51:00.028Z',
    updatedAt: '2024-10-26T12:55:00.028Z',
    users: ['dfa791eb-76b2-434c-ad1f-bb9dc1dd8b48'],
    scopes: []
  }
]

const teamRelationships = [
  {
    subject: 'platform',
    subjectType: 'team',
    relation: 'granted',
    resource: 'externalTest',
    resourceType: 'permission'
  },
  {
    subject: 'platform',
    subjectType: 'team',
    relation: 'granted',
    resource: 'admin',
    resourceType: 'permission'
  },
  {
    subject: '90552794-0613-4023-819a-512aa9d40023',
    subjectType: 'user',
    relation: 'member',
    resource: 'platform',
    resourceType: 'team'
  },
  {
    subject: 'dfa791eb-76b2-434c-ad1f-bb9dc1dd8b48',
    subjectType: 'user',
    relation: 'member',
    resource: 'tenantteam1',
    resourceType: 'team'
  }
]

db.teams.bulkWrite(
  teams.map((r) => ({
    updateOne: {
      filter: { _id: r._id },
      update: { $setOnInsert: r },
      upsert: true
    }
  })),
  { ordered: false }
)

// Update user permissions
db.relationships.bulkWrite(
  teamRelationships.map((r) => ({
    updateOne: {
      filter: r,
      update: { $setOnInsert: r },
      upsert: true
    }
  })),
  { ordered: false }
)
