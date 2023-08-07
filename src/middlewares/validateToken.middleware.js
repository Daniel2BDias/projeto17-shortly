import db from "../database/database.connection.js";

export default async function validateToken (req, res, next) {
  const { authorization } = req.headers;

  const token = authorization?.replace("Bearer ", "");

  if (!token) return res.sendStatus(401);

  const validateToken = await db.query(
    `SELECT * FROM sessions WHERE token = $1`, [token]
  );

  if (validateToken.rowCount === 0) return res.sendStatus(401);

  res.locals.token = token;
  res.locals.userId = validateToken.rows[0].userId;

  next();
}
