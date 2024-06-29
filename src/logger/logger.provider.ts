import { LogFormatter, LogLevelName } from './log/log.module';
import { LoggerLevel } from './types/enum/logger-level.enum';
import { Logger } from './types/interface/logger.interface';

export class LoggerProvider {
  private readonly logMessageFormatter = new LogFormatter();

  constructor(private readonly level: LoggerLevel) {}

  public provide(serviceName: string): Logger {
    return {
      error: (message: string): void => this.log(LogLevelName.ERROR, serviceName, message),
      warn: (message: string): void => this.log(LogLevelName.WARN, serviceName, message),
      info: (message: string): void => this.log(LogLevelName.INFO, serviceName, message),
      debug: (message: string): void => this.log(LogLevelName.DEBUG, serviceName, message),
    };
  }

  private log(levelName: LogLevelName, serviceName: string, message: string): void {
    if (LoggerLevel[levelName] <= this.level) {
      console.log(this.logMessageFormatter.formatMessage(levelName, serviceName, message));
    }
  }
}
