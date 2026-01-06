// Switch to the target database
db = db.getSiblingDB('cdp-portal-backend')

const sourceTeams = [
  {
    _id: 'platform',
    name: 'Platform',
    description: 'The team that runs the platform',
    github: 'cdp-platform',
    createdAt: ISODate('2023-10-26T12:51:00.028Z')
  },
  {
    _id: 'tenantteam1',
    name: 'TenantTeam1',
    description: 'A test team',
    github: 'cdp-tenant-1',
    createdAt: ISODate('2024-10-26T12:51:00.028Z')
  }
]

const teamsToInsert = sourceTeams.map((t) => ({
  teamId: t._id, // map _id to TeamId
  name: t.name,
  description: t.description ?? null,
  github: t.github ?? null,
  created: t.createdAt ?? null,
  serviceCode: null // leave blank if not available
}))

db.teams.bulkWrite(
  teamsToInsert.map((team) => ({
    updateOne: {
      filter: { teamId: team.teamId },
      update: { $setOnInsert: team },
      upsert: true
    }
  })),
  { ordered: false }
)

print(`${teamsToInsert.length} teams processed for cdp-portal-backend`)
