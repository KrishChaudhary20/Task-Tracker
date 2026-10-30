require("dotenv").config();

const app = require("./app");
const { connectDB, disconnectDB } = require("./config/db");

const PORT = process.env.PORT;

async function startServer() {
  try {
    await connectDB();

    const server = app.listen(PORT, "0.0.0.0" , () => {
      console.log(`Server running on port ${PORT}`);
    });

    const shutdown = async () => {
      console.log("Shutting down...");
      await disconnectDB();
      server.close(() => process.exit(0));
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();
