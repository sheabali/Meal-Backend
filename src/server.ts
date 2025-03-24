// import { config } from "dotenv";

import { Server } from 'http';
import mongoose from 'mongoose';
import app from './app';
import config from './app/config';

// const mongoose = require('mongoose');

let server: Server;

async function main() {
  try {
    await mongoose.connect(config.database_url as string);
    server = app.listen(config.port, () => {
      console.log(`Example app listening on port ${config.port}`);
    });
  } catch (err) {
    console.log(err);
  }
}

main();

process.on('unhandledRejection', () => {
  console.log(`😈Unhandled Rejection is detecated. shutting down ...`);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on('uncaughtException', () => {
  console.log(`😈Uncaught Exception is detecated. shutting down ...`);

  process.exit(1);
});
