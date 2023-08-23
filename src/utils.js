import multer from "multer";
import { logger } from "./middlewares/logger.js";

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
import dotenv from "dotenv";
dotenv.config();

export async function connectMongo() {
  try {
    await connect(
      /* PONER TU STRING ENTERO ACA */
      `${process.env.MONGO_URL}`,
    )
    logger.info("Connected to Mongo");
  } catch (e) {
    logger.error(e);
    throw "can not connect to the db";
  }
}


// Opciones de páginación

export function getProductPaginationOptions(query) {
  const { limit = 10, page = 1, sort } = query;

  const options = {
    limit: parseInt(limit),
    page: parseInt(page),
    sort: sort === "asc" ? { price: 1 } : sort === "desc" ? { price: -1 } : null,
  };

  return options;
}

//BCrypt

import bcrypt from 'bcrypt';
export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const isValidPassword = (password, hashPassword) => bcrypt.compareSync(password, hashPassword);
