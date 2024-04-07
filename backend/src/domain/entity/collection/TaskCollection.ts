import { Task } from '../Task'
import { ImmutableArray } from '../base/Array'

export class TaskCollection extends ImmutableArray<Task> {
  protected tasks: Task[]
  constructor(tasks: Task[]) {
    super()
    this.tasks = tasks
  }
  add(pair: Task): TaskCollection {
    return new TaskCollection([...this.tasks, pair])
  }
  delete(pair: Task) {
    const deletedTasks = this.tasks.filter((p) => !p.equals(pair))
    return new TaskCollection(deletedTasks)
  }
  has(pair: Task): boolean {
    return this.tasks.some((p) => p.equals(pair))
  }
}
