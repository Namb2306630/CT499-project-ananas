const app = require("./app");
const config = require("./app/config");
const MongoDB = require("./app/utils/mongodb.util");
const seedAdmin = require("./app/seeds/seedAdmin");

const PORT = config.app.port;
const MONGODB_URI = config.db.uri;

async function startServer() {
  try {
    await MongoDB.connect(MONGODB_URI);
    console.log("Connected to the database");

    seedAdmin();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
    });
  } catch (error) {
    console.error("Cannot connect to the database:", error);
    process.exit();
  }
}

startServer();
