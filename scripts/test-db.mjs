// Starts a real local MongoDB instance (in-memory, temp-disk-backed binary)
// for testing signup/login without a production connection string. Not for
// production use — data is lost when this process stops. Run standalone and
// leave it running while the dev server is up; put the printed URI into
// .env.local's MONGODB_URI.
import { MongoMemoryServer } from "mongodb-memory-server";

const mongod = await MongoMemoryServer.create({
  instance: { port: 27117, dbName: "goldgroveco_dev" },
});

console.log("TEST_MONGODB_URI=" + mongod.getUri("goldgroveco_dev"));
console.log("Local test MongoDB running. Leave this process running; Ctrl+C to stop.");

process.on("SIGINT", async () => {
  await mongod.stop();
  process.exit(0);
});
