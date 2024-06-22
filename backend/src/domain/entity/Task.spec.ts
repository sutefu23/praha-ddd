import { Task } from './Task'

describe('Task', () => {
  it('タスクを作成できる', () => {
    const task = Task.create({
      taskNumber: 1,
      content: '課題1',
    })
    expect(task).toBeInstanceOf(Task)
  })

  it('タスクの内容を変更できる', () => {
    const task = Task.create({
      taskNumber: 1,
      content: '課題内容',
    })
    const modifiedTask = task.setContent('課題内容変更')
    expect(modifiedTask.content).toBe('課題内容変更')
  })
})
