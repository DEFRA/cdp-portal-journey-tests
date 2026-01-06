db = db.getSiblingDB('cdp-user-service-backend')

const users = [
  {
    _id: '90552794-0613-4023-819a-512aa9d40023',
    name: 'Admin User',
    email: 'admin.user@oidc.mock',
    github: 'adminuser',
    createdAt: '2023-10-26T12:51:00.028Z',
    updatedAt: '2023-10-26T12:51:00.028Z',
    teams: ['platform'],
    scopes: [
      {
        scopeId: 'canGrantBreakGlass',
        scopeName: 'canGrantBreakGlass',
        teamId: 'platform',
        teamName: 'Platform'
      },
      {
        scopeId: 'breakGlass',
        scopeName: 'breakGlass',
        teamId: 'platform',
        teamName: 'Platform',
        startDate: '2023-10-26T12:51:00.028Z',
        endDate: '2023-11-26T12:51:00.028Z'
      },
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
    _id: 'dfa791eb-76b2-434c-ad1f-bb9dc1dd8b48',
    name: 'Non-Admin User',
    email: 'non-admin.user@oidc.mock',
    github: 'nonadminuser',
    createdAt: new Date('2024-11-11T13:51:00.028Z'),
    updatedAt: new Date('2024-11-12T13:24:00.028Z'),
    teams: ['tenantteam1'],
    scopes: []
  }
]

const relationships = [
  {
    subject: '90552794-0613-4023-819a-512aa9d40023',
    subjectType: 'user',
    relation: 'canGrantBreakGlass',
    resource: 'platform',
    resourceType: 'team'
  },
  {
    subject: '90552794-0613-4023-819a-512aa9d40023',
    subjectType: 'user',
    relation: 'granted',
    resource: 'externalTest',
    resourceType: 'permission'
  }
]

// Update Users
db.users.bulkWrite(
  users.map((r) => ({
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
  relationships.map((r) => ({
    updateOne: {
      filter: r,
      update: { $setOnInsert: r },
      upsert: true
    }
  })),
  { ordered: false }
)
