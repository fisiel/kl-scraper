import { LoggerMethod } from '../type/logger-method.type';

export interface Logger {
  error: LoggerMethod;
  warn: LoggerMethod;
  info: LoggerMethod;
  debug: LoggerMethod;
}
