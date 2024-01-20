import { Pair } from '../Pair'
import { ImmutableArray } from '../base/Array'

export class PairCollection extends ImmutableArray<Pair> {
  private pairs: Pair[]
  constructor(pairs: Pair[]) {
    super()
    this.pairs = pairs
  }
  add(pair: Pair): PairCollection {
    return new PairCollection([...this.pairs, pair])
  }
  delete(pair: Pair) {
    const deletedPairs = this.pairs.filter((p) => !p.equals(pair))
    return new PairCollection(deletedPairs)
  }
  has(pair: Pair): boolean {
    return this.pairs.some((p) => p.equals(pair))
  }
}
