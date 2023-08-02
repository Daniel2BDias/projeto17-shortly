import db from "../database/database.connection.js";

export default function validateToken(req, res, next) {
  const { authorization } = req.headers;

  const token = authorization?.replace("Bearer ", "");

  if (!token) return res.sendStatus(401);

  const validateToken = db.query(
    `SELECT COUNT(*) FROM sessions WHERE token=${token}`
  );

  if (validateToken === 0) return res.sendStatus(401);

  res.locals.token = token;

  next();
}
