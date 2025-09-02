db = db.getSiblingDB('cdp-portal-backend')

db.repositories.updateOne(
  {
    _id: 'cdp-portal-frontend'
  },
  {
    $setOnInsert: {
      _id: 'cdp-portal-frontend',
      description: 'cdp-portal-frontend',
      primaryLanguage: 'JavaScript',
      url: 'https://github.com/DEFRA/cdp-portal-frontend',
      isArchived: false,
      isTemplate: false,
      isPrivate: false,
      createdAt: [63616533685000000, 0],
      teams: [
        {
          github: 'cdp-platform',
          teamId: 'platform',
          name: 'Platform'
        }
      ],
      topics: ['cdp', 'service', 'frontend', 'node']
    }
  },
  { upsert: true }
)

db.repositories.updateOne(
  {
    _id: 'cdp-portal-backend'
  },
  {
    $setOnInsert: {
      _id: 'cdp-portal-backend',
      description: 'cdp-portal-backend',
      primaryLanguage: 'JavaScript',
      url: 'https://github.com/DEFRA/cdp-portal-backend',
      isArchived: false,
      isTemplate: false,
      isPrivate: false,
      createdAt: [636165336850000000, 0],
      teams: [
        {
          github: 'cdp-platform',
          teamId: 'platform',
          name: 'Platform'
        }
      ],
      topics: ['cdp', 'service', 'backend', 'dotnet']
    }
  },
  { upsert: true }
)

db.repositories.updateOne(
  {
    _id: 'cdp-self-service-ops'
  },
  {
    $setOnInsert: {
      _id: 'cdp-self-service-ops',
      description: 'cdp-self-service-ops',
      primaryLanguage: 'JavaScript',
      url: 'https://github.com/DEFRA/cdp-self-service-ops',
      isArchived: false,
      isTemplate: false,
      isPrivate: false,
      createdAt: [636165336850000000, 0],
      teams: [
        {
          github: 'cdp-platform',
          teamId: 'platform',
          name: 'Platform'
        }
      ],
      topics: ['cdp', 'service', 'backend', 'node']
    }
  },
  { upsert: true }
)

db.repositories.updateOne(
  {
    _id: 'cdp-user-service'
  },
  {
    $setOnInsert: {
      _id: 'cdp-user-service',
      description: 'cdp-user-service',
      primaryLanguage: 'JavaScript',
      url: 'https://github.com/DEFRA/cdp-user-service',
      isArchived: false,
      isTemplate: false,
      isPrivate: false,
      createdAt: [636165336850000000, 0],
      teams: [
        {
          github: 'cdp-platform',
          teamId: 'platform',
          name: 'Platform'
        }
      ],
      topics: ['cdp', 'service', 'backend', 'node']
    }
  },
  { upsert: true }
)

db.repositories.updateOne(
  {
    _id: 'cdp-env-test-suite'
  },
  {
    $setOnInsert: {
      _id: 'cdp-env-test-suite',
      description: 'cdp-env-test-suite',
      primaryLanguage: 'JavaScript',
      url: 'https://github.com/DEFRA/cdp-env-test-suite',
      isArchived: false,
      isTemplate: false,
      isPrivate: false,
      createdAt: [636165336850000000, 0],
      teams: [
        {
          github: 'cdp-platform',
          teamId: 'platform',
          name: 'Platform'
        }
      ],
      topics: ['cdp', 'test', 'test-suite', 'journey']
    }
  },
  { upsert: true }
)

db.repositories.updateOne(
  {
    _id: 'cdp-postgres-service'
  },
  {
    $setOnInsert: {
      _id: 'cdp-postgres-service',
      description: 'cdp-postgres-service',
      primaryLanguage: 'JavaScript',
      url: 'https://github.com/DEFRA/cdp-postgres-service',
      isArchived: false,
      isTemplate: false,
      isPrivate: false,
      createdAt: [636165336850000000, 0],
      teams: [
        {
          github: 'cdp-platform',
          teamId: 'platform',
          name: 'Platform'
        }
      ],
      topics: ['cdp', 'service', 'backend', 'node']
    }
  },
  { upsert: true }
)

db.repositories.updateOne(
  {
    _id: 'cdp-service-prototype'
  },
  {
    $setOnInsert: {
      _id: 'cdp-service-prototype',
      description: 'cdp-service-prototype',
      primaryLanguage: 'JavaScript',
      url: 'https://github.com/DEFRA/cdp-service-prototype',
      isArchived: false,
      isTemplate: false,
      isPrivate: false,
      createdAt: [63616533685000000, 0],
      teams: [
        {
          github: 'cdp-platform',
          teamId: 'platform',
          name: 'Platform'
        }
      ],
      topics: ['cdp', 'service', 'prototype', 'node']
    }
  },
  { upsert: true }
)

db.repositories.updateOne(
  {
    _id: 'tenant-backend'
  },
  {
    $setOnInsert: {
      _id: 'tenant-backend',
      description: 'tenant-backend',
      primaryLanguage: 'JavaScript',
      url: 'https://github.com/DEFRA/tenant-backend',
      isArchived: false,
      isTemplate: false,
      isPrivate: false,
      createdAt: [63616533685000000, 0],
      teams: [
        {
          github: 'TenantTeam1',
          teamId: 'tenantteam1',
          name: 'TenantTeam1'
        }
      ],
      topics: ['cdp', 'service', 'backend', 'node']
    }
  },
  { upsert: true }
)
