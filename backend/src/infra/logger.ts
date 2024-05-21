export enum LogLevel {
  Debug = 'DEBUG',
  Error = 'ERROR',
}

export class Logger {
  static log(level: LogLevel, message: string, error?: Error): void {
    const timestamp = new Date().toISOString()
    if (level === LogLevel.Error && error) {
      console.error(
        `[${timestamp}] [${level}] ${message}\nStack Trace:\n${error.stack}`,
      )
    } else {
      console.log(`[${timestamp}] [${level}] ${message}`)
    }
  }

  static debug(message: string): void {
    Logger.log(LogLevel.Debug, message)
  }

  static error(message: string, error?: Error): void {
    Logger.log(LogLevel.Error, message, error)
  }
}
