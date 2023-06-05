import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public");
  },
  filename: (req, file, cb) => {
    cb(null, path.join(__dirname, "public"));
  },
});

export const uploader = multer({ storage });

//----------------------__DIRNAME-------------------------------
// https://flaviocopes.com/fix-dirname-not-defined-es-module-scope/
import path from "path";
import { fileURLToPath } from "url";
export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

//----------------------Connect to Mongo-------------------------------

import { connect, Schema, model } from "mongoose";

export async function connectMongo() {
  try {
    await connect(
      /* PONER TU STRING ENTERO ACA */
      "mongodb+srv://CoderUser:vLSqrrQputf7JxQE@mongocoder.lfl9ccu.mongodb.net/51380?retryWrites=true&w=majority"
    );
  } catch (e) {
    console.log(e);
    throw "can not connect to the db";
  }
}
