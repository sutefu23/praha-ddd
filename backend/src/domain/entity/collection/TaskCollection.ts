import { Task } from '../Task'
import { ImmutableArray } from '../base/Array'

export class TaskCollection extends ImmutableArray<Task> {
  protected constructor(tasks: Task[]) {
    super(tasks)
  }
  static create(tasks: Task[]): TaskCollection {
    return new TaskCollection(tasks)
  }
  add(pair: Task): TaskCollection {
    return new TaskCollection([...this, pair])
  }
  delete(pair: Task) {
    const deletedTasks = this.filter((p) => !p.equals(pair))
    return new TaskCollection(deletedTasks)
  }
  has(pair: Task): boolean {
    return this.some((p) => p.equals(pair))
  }
}
