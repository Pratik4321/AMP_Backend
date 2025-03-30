import * as dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { DBConnection } from "./config/db";
import { initCronJobs } from "./jobs";

const PORT = process.env.PORT || 3000;

function startApp() {
  DBConnection()
    .then((res) => {
      initCronJobs();
      app.listen(PORT, () => {
        console.log(`
             ---------------------------------------------
            |     Database Connected Successfully!!       |
            |     Server started successfully!!           |
            |     http://localhost:${PORT}                |
            |                                             |
             ---------------------------------------------
            `);
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

startApp();
