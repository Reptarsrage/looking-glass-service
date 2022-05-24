import "dotenv/config";
import { build } from "./app";

const server = build({
  logger: {
    level: process.env.LOG_LEVEL ?? "debug",
    prettyPrint: true,
  },
});

const port = parseInt(process.env.PORT ?? "3001", 10);
const host = process.env.HOST ?? "127.0.0.1";
server.listen(port, host, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  console.log(`Server listening at ${address}`);
});
