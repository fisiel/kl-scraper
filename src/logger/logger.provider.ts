import { mkdirSync, writeFileSync } from 'fs';
import path from 'path';
import { DEFAULT_LOG_LEVEL } from './constant';
import { LogFormatter } from './log/log.formatter';
import { LogLevelName } from './log/types/enum/log-level-name.enum';
import { LoggerLevel } from './types/enum/logger-level.enum';
import { Logger } from './types/interface/logger.interface';

export class LoggerProvider {
  private readonly logMessageFormatter = new LogFormatter();

  private readonly logFile?: string | undefined;

  constructor(
    private readonly level: LoggerLevel = DEFAULT_LOG_LEVEL,
    dir?: string,
  ) {
    if (dir === undefined) {
      return;
    }

    const logDir = path.join(__dirname, `../../${dir}`);

    mkdirSync(logDir, { recursive: true });

    this.logFile = dir === undefined ? dir : path.join(logDir, `kl-scraper-${Date.now()}.log`);
  }

  public provide(serviceName: string): Logger {
    return {
      error: (message: string): void => this.log(LogLevelName.ERROR, serviceName, message),
      warn: (message: string): void => this.log(LogLevelName.WARN, serviceName, message),
      info: (message: string): void => this.log(LogLevelName.INFO, serviceName, message),
      debug: (message: string): void => this.log(LogLevelName.DEBUG, serviceName, message),
      silly: (message: string): void => this.log(LogLevelName.SILLY, serviceName, message),
    };
  }

  private log(levelName: LogLevelName, serviceName: string, message: string): void {
    if (LoggerLevel[levelName] > this.level) {
      return;
    }

    console.log(this.logMessageFormatter.formatMessageForConsole(levelName, serviceName, message));

    if (this.logFile) {
      writeFileSync(
        this.logFile,
        this.logMessageFormatter.formatMessageForFile(levelName, serviceName, message),
        {
          encoding: 'utf-8',
          flag: 'a',
        },
      );
    }
  }
}
