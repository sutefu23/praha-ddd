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
import { AttendeeGetUsecase } from '@/domain/usecase/AttendeeGetUsecase'
import { AttendeeCreateUsecase } from '@/domain/usecase/AttendeeCreateUsecase'
import { AttendeeListGetUsecase } from '@/domain/usecase/AttendeeListGetUsecase'
import { AttendeeModifyStatusUsecase } from '@/domain/usecase/AttendeeModifyStatusUsecase'
import { sendMailClient } from '@/infra/api/MailClient'
import { SendMailAction } from '@/infra/api/SendMail'
import { AttendeeRejoinUsecase } from '@/domain/usecase/AttendeeRejoinUsecase'
import { AttendeeWithdrawUsecase } from '@/domain/usecase/AttendeeWithdrawUsecase'
import { BulkCreateTaskAndAttacheToAllAttendee } from '@/domain/usecase/BulkCreateTaskAndAttacheToAllAttendee'
import { PairAddAttendeeUsecase } from '@/domain/usecase/PairAddAttendeeUsecase'
import { PairDeleteAttendeeUsecase } from '@/domain/usecase/PairDeleteAttendeeUsecase'
import { PairListGetUsecase } from '@/domain/usecase/PairListGetUsecase'
import { TaskCreateUsecase } from '@/domain/usecase/TaskCreateUsecase'
import { TeamAddPairUsecase } from '@/domain/usecase/TeamAddPairUsecase'
import { TeamCreateUsecase } from '@/domain/usecase/TeamCreateUsecase'
import { TeamDeletePairUsecase } from '@/domain/usecase/TeamDeletePairUsecase'
import { TeamListGetUsecase } from '@/domain/usecase/TeamListGetUsecase'

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

export const sendMailAction = new SendMailAction(sendMailClient)

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

export const attendeeCreateUsecase = new AttendeeCreateUsecase(
  attendeeRepository,
  attendeeQueryService,
)

export const attendeeGetUsecase = new AttendeeGetUsecase(attendeeQueryService)

export const attendeeListGetUsecase = new AttendeeListGetUsecase(
  attendeeQueryService,
)

export const attendeeModifyStatusUsecase = new AttendeeModifyStatusUsecase(
  attendeeQueryService,
  teamQueryService,
  pairQueryService,
  sendMailAction,
  attendeeRepository,
)

export const attendeeRejoinUsecase = new AttendeeRejoinUsecase(
  attendeeQueryService,
  teamQueryService,
  pairQueryService,
  attendeeRepository,
)

export const attendeeWithdrawUsecase = new AttendeeWithdrawUsecase(
  attendeeQueryService,
  teamQueryService,
  pairQueryService,
  sendMailAction,
  attendeeRepository,
)

export const bulkCreateTaskAndAttacheToAllAttendee = new BulkCreateTaskAndAttacheToAllAttendee(
  taskRepository,
  attendeeQueryService,
  attendeeAttachedTaskRepository,
)

export const pairAddAttendeeUsecase = new PairAddAttendeeUsecase(
  pairRepository,
  pairQueryService,
  attendeeQueryService,
)

export const pairDeleteAttendeeUsecase = new PairDeleteAttendeeUsecase(
  pairRepository,
  pairQueryService,
  attendeeQueryService,
)

export const pairListGetUsecase = new PairListGetUsecase(pairQueryService)

export const taskCreateUsecase = new TaskCreateUsecase(
  taskRepository,
  taskQueryService,
)

export const teamAddPairUsecase = new TeamAddPairUsecase(
  teamRepository,
  teamQueryService,
  pairQueryService,
)

export const teamCreateUsecase = new TeamCreateUsecase(
  teamRepository,
  teamQueryService,
  pairQueryService,
)

export const teamDeletePairUsecase = new TeamDeletePairUsecase(
  teamRepository,
  teamQueryService,
  pairQueryService,
)

export const teamListGetUsecase = new TeamListGetUsecase(teamQueryService)
