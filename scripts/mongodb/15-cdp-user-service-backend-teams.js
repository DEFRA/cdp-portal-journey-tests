db = db.getSiblingDB('cdp-user-service-backend')

db.scopes.updateOne(
  {
    value: 'testAsTenant'
  },
  {
    $setOnInsert: {
      _id: 'testAsTenant',
      userId: '90552794-0613-4023-819a-512aa9d40023',
      value: 'testAsTenant',
      kind: ['user'],
      description:
        'When added to an individual, it will temporarily disable admin permission to allow the user to test the portal as if they were a tenant.',
      teams: [],
      users: [],
      members: [],
      createdAt: '2024-12-02T17:34:21.295Z',
      updatedAt: '2024-12-02T17:34:21.295Z'
    }
  },
  { upsert: true }
)

db.scopes.updateOne(
  {
    value: 'restrictedTechPostgres'
  },
  {
    $setOnInsert: {
      _id: 'restrictedTechPostgres',
      userId: '90552794-0613-4023-819a-512aa9d40023',
      scopeId: 'restrictedTechPostgres',
      value: 'restrictedTechPostgres',
      kind: ['user', 'team'],
      description:
        'A restricted tech permission to allow Postgres service management to a team or user',
      teams: [],
      users: [],
      members: [],
      createdAt: '2024-12-02T17:34:21.295Z',
      updatedAt: '2024-12-02T17:34:21.295Z'
    }
  },
  { upsert: true }
)

db.scopes.updateOne(
  {
    value: 'restrictedTechPython'
  },
  {
    $setOnInsert: {
      _id: 'restrictedTechPython',
      userId: '90552794-0613-4023-819a-512aa9d40023',
      scopeId: 'restrictedTechPython',
      value: 'restrictedTechPython',
      kind: ['user', 'team'],
      description:
        'A restricted tech permission to provide Python service creation and management to a team or user',
      teams: [],
      users: [],
      members: [],
      createdAt: '2024-12-02T17:34:21.295Z',
      updatedAt: '2024-12-02T17:34:21.295Z'
    }
  },
  { upsert: true }
)

db.scopes.updateOne(
  {
    value: 'externalTest'
  },
  {
    $setOnInsert: {
      _id: 'externalTest',
      userId: '90552794-0613-4023-819a-512aa9d40023',
      scopeId: 'externalTest',
      value: 'externalTest',
      kind: ['team'],
      description:
        'Allow teams to view and deploy to the external test environment',
      teams: [
        {
          teamId: 'platform',
          teamName: 'Platform'
        }
      ],
      users: [],
      members: [],
      createdAt: '2024-12-02T17:34:21.295Z',
      updatedAt: '2024-12-02T17:34:21.295Z'
    }
  },
  { upsert: true }
)

db.scopes.updateOne(
  {
    value: 'breakGlass'
  },
  {
    $setOnInsert: {
      _id: 'breakGlass',
      userId: '90552794-0613-4023-819a-512aa9d40023',
      scopeId: 'breakGlass',
      value: 'breakGlass',
      kind: ['user', 'member'],
      description:
        'Allow users access to the production environment via the CDP Terminal',
      teams: [],
      users: [],
      members: [
        {
          userId: '90552794-0613-4023-819a-512aa9d40023',
          userName: 'Admin User',
          teamId: 'platform',
          teamName: 'Platform',
          startDate: '2023-10-26T12:51:00.028Z',
          endDate: '2023-11-26T12:51:00.028Z'
        }
      ],
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
      _id: 'scopeId',
      userId: '90552794-0613-4023-819a-512aa9d40023',
      scopeId: 'scopeId',
      value: 'admin',
      kind: ['team', 'user'],
      description: 'CDP Portal Admin addPermissionToTeam',
      teams: [
        {
          teamId: 'platform',
          teamName: 'Platform'
        }
      ],
      users: [],
      members: [],
      createdAt: '2024-12-02T17:34:21.295Z',
      updatedAt: '2024-12-02T17:34:21.295Z'
    }
  },
  { upsert: true }
)

db.scopes.updateOne(
  {
    value: 'canGrantBreakGlass'
  },
  {
    $setOnInsert: {
      _id: 'canGrantBreakGlass',
      userId: '90552794-0613-4023-819a-512aa9d40023',
      scopeId: 'canGrantBreakGlass',
      value: 'canGrantBreakGlass',
      kind: ['user', 'member'],
      description:
        'Allow a Member of a team to grant the breakGlass permission to team members',
      teams: [],
      users: [],
      members: [
        {
          userId: '90552794-0613-4023-819a-512aa9d40023',
          userName: 'Admin User',
          teamId: 'platform',
          teamName: 'Platform'
        }
      ],
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
        {
          scopeId: 'externalTest',
          scopeName: 'externalTest'
        },
        {
          scopeId: 'admin',
          scopeName: 'admin'
        }
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
      users: ['dfa791eb-76b2-434c-ad1f-bb9dc1dd8b48'],
      scopes: [],
      createdAt: '2024-10-26T12:51:00.028Z',
      updatedAt: '2024-10-26T12:55:00.028Z'
    }
  },
  { upsert: true }
)
