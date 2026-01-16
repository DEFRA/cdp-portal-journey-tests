db = db.getSiblingDB('cdp-portal-backend')

const repos = [
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },

  {
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
  },
  {
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
  },
  {
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
]

db.repositories.bulkWrite(
  repos.map((r) => ({
    updateOne: {
      filter: { _id: r._id },
      update: { $setOnInsert: r },
      upsert: true
    }
  })),
  { ordered: false }
)
