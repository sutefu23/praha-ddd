import { AttendeeAttachedTaskQueryService } from '@/infra/prisma/AttendeeAttachedTaskQueryService'
import { AttendeeAttachedTaskRepository } from '@/infra/prisma/AttendeeAttachedTaskRepository'
import { AttendeeQueryService } from '@/infra/prisma/AttendeeQueryService'
import { AttendeeRepository } from '@/infra/prisma/AttendeeRepository'
import { PairQueryService } from '@/infra/prisma/PairQueryService'
import { PairRepository } from '@/infra/prisma/PairRepository'
import { TaskQueryService } from '@/infra/prisma/TaskQueryService'
import { TaskRepository } from '@/infra/prisma/TaskRepository'
import { TeamQueryService } from '@/infra/prisma/TeamQueryService'
import { TeamRepository } from '@/infra/prisma/TeamRepository'
import { Transaction } from '@/infra/prisma/Transaction'
import { AttendeeAttachedTaskAttachCreateUsecase } from '@/domain/usecase/AttendeeAttachedTaskAttachCreateUsecase'
import { AttendeeAttachedTaskGetUsecase } from '@/domain/usecase/AttendeeAttachedTaskGetUsecase'
import { AttendeeAttachedTaskModifyStatusUsecase } from '@/domain/usecase/AttendeeAttachedTaskModifyStatusUsecase'
import prismaClient from '@/infra/prisma/db'

export const attendeeAttachedTaskQueryService = new AttendeeAttachedTaskQueryService(
  prismaClient,
)
export const attendeeAttachedTaskRepository = new AttendeeAttachedTaskRepository(
  prismaClient,
)
export const attendeeQueryService = new AttendeeQueryService(prismaClient)
export const attendeeRepository = new AttendeeRepository(prismaClient)
export const taskQueryService = new TaskQueryService(prismaClient)
export const taskRepository = new TaskRepository(prismaClient)
export const pairQueryService = new PairQueryService(prismaClient)
export const pairRepository = new PairRepository(prismaClient)
export const teamQueryService = new TeamQueryService(prismaClient)
export const teamRepository = new TeamRepository(prismaClient)
export const transaction = new Transaction()

export const attendeeAttachedTaskAttachCreateUsecase = new AttendeeAttachedTaskAttachCreateUsecase(
  taskQueryService,
  attendeeQueryService,
  attendeeAttachedTaskRepository,
)

export const attendeeAttachedTaskGetUsecase = new AttendeeAttachedTaskGetUsecase(
  attendeeAttachedTaskQueryService,
)

export const attendeeAttachedTaskModifyStatusUsecase = new AttendeeAttachedTaskModifyStatusUsecase(
  attendeeAttachedTaskRepository,
  attendeeAttachedTaskQueryService,
)
