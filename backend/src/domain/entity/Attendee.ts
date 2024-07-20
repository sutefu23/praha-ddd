import { BaseEntity, EntityProps } from 'src/domain/entity/base/Entity'
import { EnrollmentStatus, StatusConst } from '../valueObject/EnrollmentStatus'
import { UUID } from '../valueObject/UUID'
import { InvalidParameterError } from '../error/DomainError'
// 参加者
export interface AttendeeProps extends EntityProps {
  readonly id: UUID
  readonly name: string
  readonly email: string
  readonly enrollment_status: EnrollmentStatus
}

export type UpdateAttendeeProps = Partial<AttendeeProps> & {
  id: AttendeeProps['id']
}

export interface CreateAttendeeProps {
  readonly name: string
  readonly email: string
}

export class Attendee extends BaseEntity<AttendeeProps> {
  private constructor(props: AttendeeProps) {
    super(props)
  }

  get id(): UUID {
    return this.props.id
  }

  get name(): string {
    return this.props.name
  }

  get email(): string {
    return this.props.email
  }

  get enrollment_status(): EnrollmentStatus {
    return this.props.enrollment_status
  }

  setName(name: string) {
    return new Attendee({
      ...this.props,
      name,
    })
  }
  setEnrollmentStatus(new_enrollment_status: EnrollmentStatus) {
    return new Attendee({
      ...this.props,
      enrollment_status: new_enrollment_status,
    })
  }

  public static create(
    createProps: CreateAttendeeProps,
  ): Attendee | InvalidParameterError {
    const id = UUID.new()
    const enrollment_status = EnrollmentStatus.mustParse(StatusConst.ENROLLMENT)
    const name = createProps.name
    if (name.length === 0) {
      return new InvalidParameterError('名前が入力されていません')
    }
    if (
      new RegExp(
        /^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,}\.[A-Za-z0-9]{1,}$/,
      ).test(createProps.email) === false
    ) {
      return new InvalidParameterError('メールアドレスが不正です')
    }
    const props: AttendeeProps = {
      id,
      name: createProps.name,
      email: createProps.email,
      enrollment_status: enrollment_status,
    }
    return new Attendee(props)
  }

  public static regen(regenProps: AttendeeProps): Attendee {
    return new Attendee(regenProps)
  }
}
