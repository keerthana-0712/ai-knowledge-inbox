export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  meta?: unknown;
}

class Logger {
  private recentLogs: LogEntry[] = [];
  private readonly maxLogs = 60;

  private formatMessage(level: LogLevel, message: string, meta?: unknown): string {
    const timestamp = new Date().toISOString();
    this.recentLogs.push({ timestamp, level, message, meta });
    if (this.recentLogs.length > this.maxLogs) {
      this.recentLogs.shift();
    }
    const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] [${level}] ${message}${metaStr}`;
  }

  getRecentLogs(): LogEntry[] {
    return [...this.recentLogs];
  }

  debug(message: string, meta?: unknown): void {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(this.formatMessage(LogLevel.DEBUG, message, meta));
    }
  }

  info(message: string, meta?: unknown): void {
    console.info(this.formatMessage(LogLevel.INFO, message, meta));
  }

  warn(message: string, meta?: unknown): void {
    console.warn(this.formatMessage(LogLevel.WARN, message, meta));
  }

  error(message: string, meta?: unknown): void {
    console.error(this.formatMessage(LogLevel.ERROR, message, meta));
  }
}

export const logger = new Logger();
