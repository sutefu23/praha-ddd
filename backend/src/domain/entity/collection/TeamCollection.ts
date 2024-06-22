import { Team } from '../Team'
import { ImmutableArray } from '../base/Array'
import { PairCollection } from './PairCollection'

export class TeamCollection extends ImmutableArray<Team> {
  protected constructor(teams: Team[]) {
    super(teams)
  }
  static create(teams: Team[]): TeamCollection {
    return new TeamCollection(teams)
  }
  add(team: Team): TeamCollection {
    return new TeamCollection([...this, team])
  }
  delete(team: Team) {
    const deletedTeams = this.filter((p) => !p.equals(team))
    return new TeamCollection(deletedTeams)
  }
  has(team: Team): boolean {
    return this.some((p) => p.equals(team))
  }

  replaceTeam(team: Team) {
    const new_teams = this.delete(team).add(team)
    return new_teams
  }

  get allPairs(): PairCollection {
    const pairs = this.map((team) => team.pairs).flat()
    return PairCollection.create(pairs)
  }
}
