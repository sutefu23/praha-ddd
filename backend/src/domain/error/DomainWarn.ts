class Warn extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'Warn'
  }
}

export class TeamLessAttendeeWarn extends Warn {
  constructor(message: string) {
    super(message)
    this.name = 'TeamLessAttendeeWarn'
  }
}

export class PairLessAttendeeWarn extends Warn {
  constructor(message: string) {
    super(message)
    this.name = 'PairLessAttendeeWarn'
  }
}
