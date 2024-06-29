import { LogLevelColor } from './types/enum/log-level-color.enum';
import { LogLevelName } from './types/enum/log-level-name.enum';

export class LogFormatter {
  public formatMessage(levelName: LogLevelName, serviceName: string, message: string): string {
    return `${LogLevelColor[levelName]}[${this.getCurrentTimestamp()}] [${levelName}] [${serviceName}]\x1b[0m ${message}`;
  }

  private getCurrentTimestamp(): string {
    const date = new Date();

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const milliseconds = date.getMilliseconds().toString().padStart(3, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
  }
}
