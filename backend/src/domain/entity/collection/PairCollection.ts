import { Pair } from '../Pair'
import { ImmutableArray } from '../base/Array'

export class PairCollection extends ImmutableArray<Pair> {
  protected constructor(pairs: Pair[]) {
    super(pairs)
  }
  static create(pairs: Pair[]): PairCollection {
    return new PairCollection(pairs)
  }
  add(pair: Pair): PairCollection {
    return new PairCollection([...this, pair])
  }
  delete(pair: Pair) {
    const deletedPairs = this.filter((p) => !p.equals(pair))
    return new PairCollection(deletedPairs)
  }
  has(pair: Pair): boolean {
    return this.some((p) => p.equals(pair))
  }
}
