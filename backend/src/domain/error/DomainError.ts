export class DomainError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'DomainError'
  }
}
export class InvalidParameterError extends DomainError {
  constructor(message: string) {
    super(message)
    this.name = 'InvalidParameterError'
  }
}
export class UnPemitedOperationError extends DomainError {
  constructor(message: string) {
    super(message)
    this.name = 'UnPemitedOperationError'
  }
}

export class NoEffectiveOperationError extends DomainError {
  constructor(message: string) {
    super(message)
    this.name = 'NoEffectiveOperationError'
  }
}

export class RepositoryError extends DomainError {
  constructor(message: string) {
    super(message)
    this.name = 'RepositoryError'
  }
}
export class QueryError extends DomainError {
  constructor(message: string) {
    super(message)
    this.name = 'QueryError'
  }
}

export class QueryNotFoundError extends DomainError {
  constructor(message: string) {
    super(message)
    this.name = 'QueryNotFoundError'
  }
}

export class ActionError extends DomainError {
  constructor(message: string) {
    super(message)
    this.name = 'ActionError'
  }
}
