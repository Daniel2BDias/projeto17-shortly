import db from "../database/database.connection.js";

export default async function validateToken(req, res, next) {
  const { authorization } = req.headers;

  const token = authorization?.replace("Bearer ", "");

  if (!token) return res.sendStatus(401);

  try{
  const getSession = await db.query(
    `SELECT * FROM sessions WHERE token = $1`,
    [token]
  );

  if (getSession.rowCount === 0) return res.sendStatus(401);

  res.locals.token = token;
  res.locals.userId = getSession.rows[0].userId;
  res.locals.userEmail = getSession.rows[0].userEmail;
  } catch (error) {
    res.status(500).send(error.message);
  }

  next();
}
