import * as dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { DBConnection } from "./config/db";

const PORT = process.env.PORT || 3000;

function startApp() {
  DBConnection()
    .then((res) => {
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
