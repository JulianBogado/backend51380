import { format, createLogger, transports, addColors } from "winston";
import ip from "ip";
import path from "path";
import { fileURLToPath } from "url";
export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

const { Console, File } = transports;

const myCustomLevels = {
  levels: {
    debug: 5,
    http: 4,
    info: 3,
    warn: 2,
    error: 1,
    fatal: 0,
  },
  colors: {
    debug: "bold blue",
    http: "italic cyan",
    info: "gray",
    warn: "yellow",
    error: "whiteBG red",
    fatal: "redBG grey",
  },
};

const myFormat = format.printf(({ level, message }) => {
  return `[${new Date().toLocaleTimeString()}] [${level}]: ${message}`;
});

const myFormatFile = format.printf(({ level, message }) => {
  return `[${new Date().toLocaleTimeString()}] [${level.toLocaleUpperCase()}]: ${message}`;
});

addColors(myCustomLevels.colors);

const logger = createLogger({
  levels: myCustomLevels.levels,
  transports: [
    new Console({
      level: "debug",
      format: format.combine(format.colorize({ all: true }), myFormat),
    }),
    new File({
      filename: path.join(__dirname, "../logs/errors.log"),
      level: "error",
      format: myFormatFile,
      maxsize: 5242880,
      maxFiles: 5,
    }),
  ],
});

const addLogger = (req, res, next) => {
  req.logger = logger;
  const ipClient = ip.address();
  req.logger.http(`${req.method} on ${req.url} from [${ipClient}]`);
  next();
};

export { addLogger, logger };
