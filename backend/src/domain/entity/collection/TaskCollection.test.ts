import { TaskCollection } from './TaskCollection'
import {
  TaskMockData1,
  TaskMockData2,
  TaskMockData3,
} from '@/domain/mock/MockData'
describe('TaskCollection', () => {
  it('should create an TaskCollection', () => {
    const tasks = TaskCollection.create([
      TaskMockData1,
      TaskMockData2,
      TaskMockData3,
    ])
    expect(tasks).toBeInstanceOf(TaskCollection)
    expect(tasks.length).toBe(3)
  })
  it('should add an attendee', () => {
    const tasks = TaskCollection.create([TaskMockData1, TaskMockData2])
    expect(tasks.length).toBe(2)
    const newTasks = tasks.add(TaskMockData3)
    expect(newTasks.length).toBe(3)
  })
  it('should delete an attendee', () => {
    const tasks = TaskCollection.create([
      TaskMockData1,
      TaskMockData2,
      TaskMockData3,
    ])
    expect(tasks.length).toBe(3)
    const newTasks = tasks.delete(TaskMockData1)
    expect(newTasks.length).toBe(2)
  })
})
