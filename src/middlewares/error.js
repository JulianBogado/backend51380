import EErrors from "../services/errors/enums.js";

export default (error, req, res, next) => {
  console.log(error.cause);
  switch (error.code) {
    case EErrors.INVALID_TYPES_ERROR:
      res
        .status(400)
        .send({ status: "Error", error: error.name, cause: error.cause });
      break;
    case EErrors.USER_NOT_FOUND:
      res
        .status(402)
        .send({ status: "Error", error: error.name, cause: error.cause });
      break;
    case EErrors.DATABASE_ERROR:
      res
        .status(500)
        .send({ status: "Error", error: error.name, cause: error.cause });
      break;
    default:
      res.send({ status: "Error", error: "Error sin manejar" });
      break;
  }
};
