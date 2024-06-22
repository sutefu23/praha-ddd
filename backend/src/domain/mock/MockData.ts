import { Attendee } from '../entity/Attendee'

import { Pair } from '../entity/Pair'
import { TeamCollection } from '../entity/collection/TeamCollection'
import { Team } from '../entity/Team'
import { Task } from '../entity/Task'
import { TeamName } from '../valueObject/TeamName'
import { PairCollection } from '../entity/collection/PairCollection'
import { PairName } from '../valueObject/PairName'
import { UUID } from '../valueObject/UUID'
import {
  EnrollmentStatus,
  StatusConst as EnrollmentStatusConst,
} from '../valueObject/EnrollmentStatus'

import { AttendeeCollection } from '../entity/collection/AttendeeCollection'

export const EnrollmentStatusEnrollment = EnrollmentStatus.mustParse(
  EnrollmentStatusConst.ENROLLMENT,
)
export const EnrollmentStatusTemporaryAbsence = EnrollmentStatus.mustParse(
  EnrollmentStatusConst.TEMPORARY_ABSENCE,
)
export const EnrollmentStatusWithdrawal = EnrollmentStatus.mustParse(
  EnrollmentStatusConst.WITHDRAWAL,
)

export const AttendeeMockData1 = Attendee.regen({
  id: UUID.new(),
  name: '田中一郎',
  email: 'test1@example.com',
  enrollment_status: EnrollmentStatusEnrollment,
})
export const AttendeeMockData2 = Attendee.regen({
  id: UUID.new(),
  name: '佐藤次郎',
  email: 'test2@example.com',
  enrollment_status: EnrollmentStatusEnrollment,
})
export const AttendeeMockData3 = Attendee.regen({
  id: UUID.new(),
  name: '安田文子',
  email: 'test3@example.com',
  enrollment_status: EnrollmentStatusEnrollment,
})
export const AttendeeCollectionMockData = AttendeeCollection.regen([
  AttendeeMockData1,
  AttendeeMockData2,
  AttendeeMockData3,
])

export const TaskMockData1 = Task.regen({
  id: UUID.new(),
  taskNumber: 1,
  content: '課題1',
})

export const TaskMockData2 = Task.regen({
  id: UUID.new(),
  taskNumber: 2,
  content: '課題2',
})

export const TaskMockData3 = Task.regen({
  id: UUID.new(),
  taskNumber: 3,
  content: '課題3',
})

const PairNameData1 = PairName.mustParse('1')
const PairNameData2 = PairName.mustParse('2')
const PairNameData3 = PairName.mustParse('3')
const TeamNameDataA = TeamName.mustParse('A')
const TeamNameDataB = TeamName.mustParse('B')
const TeamNameDataC = TeamName.mustParse('C')

export const PairMockData1 = Pair.create({
  name: PairNameData1,
  attendees: AttendeeCollectionMockData,
}) as Pair
export const PairMockData2 = Pair.create({
  name: PairNameData2,
  attendees: AttendeeCollectionMockData,
}) as Pair
export const PairMockData3 = Pair.create({
  name: PairNameData3,
  attendees: AttendeeCollectionMockData,
}) as Pair

export const PairCollectionMockData = PairCollection.create([
  PairMockData1,
  PairMockData2,
  PairMockData3,
])

export const TeamMockDataA = Team.regen({
  id: UUID.new(),
  name: TeamNameDataA,
  pairs: PairCollectionMockData,
})

export const TeamMockDataB = Team.regen({
  id: UUID.new(),
  name: TeamNameDataB,
  pairs: PairCollectionMockData,
})

export const TeamMockDataC = Team.regen({
  id: UUID.new(),
  name: TeamNameDataC,
  pairs: PairCollectionMockData,
})

export const TeamCollectionMockData = TeamCollection.create([
  TeamMockDataA,
  TeamMockDataB,
  TeamMockDataC,
])
