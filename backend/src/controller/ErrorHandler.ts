import { DomainError } from '@/domain/error/DomainError'
import { HttpException, Logger } from '@nestjs/common'

export class ErrorHandler {
  public static handle(domainErr: DomainError): HttpException {
    Logger.error(domainErr.message)
    switch (domainErr.name) {
      case 'InvalidParameterError':
        return new HttpException(domainErr.message, 400)
      case 'UnPemitedOperationError':
        return new HttpException(domainErr.message, 403)
      case 'NoEffectiveOperationError':
        return new HttpException(domainErr.message, 405)
      case 'UnableToProgressError':
        return new HttpException(domainErr.message, 406)
      case 'RepositoryError':
        return new HttpException(domainErr.message, 500)
      case 'QueryError':
        return new HttpException(domainErr.message, 500)
      case 'QueryNotFoundError':
        return new HttpException(domainErr.message, 404)
      case 'ActionError':
        return new HttpException(domainErr.message, 500)
      default:
        return new HttpException(domainErr.message, 500)
    }
  }
}
