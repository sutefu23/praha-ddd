export class DomainError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'DomainError'
  }
}
export class InvalidParameter extends DomainError {
  constructor(message: string) {
    super(message)
    this.name = 'InvalidParameter'
  }
}
export class UnPemitedOperation extends DomainError {
  constructor(message: string) {
    super(message)
    this.name = 'UnPemitedOperation'
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
