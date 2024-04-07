import { Team } from '../Team'
import { ImmutableArray } from '../base/Array'
import { PairCollection } from './PairCollection'

export class TeamCollection extends ImmutableArray<Team> {
  protected teams: Team[]
  constructor(teams: Team[]) {
    super()
    this.teams = teams
  }
  add(team: Team): TeamCollection {
    return new TeamCollection([...this.teams, team])
  }
  delete(team: Team) {
    const deletedTeams = this.teams.filter((p) => !p.equals(team))
    return new TeamCollection(deletedTeams)
  }
  has(team: Team): boolean {
    return this.teams.some((p) => p.equals(team))
  }

  replaceTeam(team: Team) {
    const new_teams = this.delete(team).add(team)
    return new_teams
  }

  get allPairs(): PairCollection {
    const pairs = this.teams.map((team) => team.pairs).flat()
    return new PairCollection(pairs)
  }
}
