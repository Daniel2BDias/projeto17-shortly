import db from "../database/database.connection.js";

export const getUserBySession = async (token) => {
  try {
    const result = await db.query(
      `SELECT * FROM sessions WHERE token = $1`,
      [token]
    );

    return result;
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const registerUrl = async (shortUrl, url, userId) => {
  const result = await db.query(
    `INSERT INTO urls ("shortUrl", "userId", url) VALUES ($1, $3, $2)`,
    [shortUrl, url, userId]
  );
  const urlData = await db.query(
    `SELECT id FROM urls WHERE "shortUrl"=$1`,
    [shortUrl]
  );

  return urlData.rows[0].id;
};

export const getUrl_Id = async (id) => {
  const result = await db.query(
    `SELECT id, url, "shortUrl" FROM urls WHERE id=$1`,
    [id]
  );

  return result;
};

export const redirectUrl = async (shortUrl) => {
  const result = await db.query(`SELECT * FROM urls WHERE "shortUrl"=$1`, [
    shortUrl,
  ]);

  return result?.rows[0]?.url;
};

export const addVisitCount = async (shortUrl) => {
  const getCount = await db.query(`SELECT * FROM urls WHERE "shortUrl"=$1`, [
    shortUrl,
  ]);
  const count = getCount.rows[0].visitCount;

  const res = await db.query(`UPDATE urls SET "visitCount"=$1 WHERE "shortUrl"=$2`, [
    count+1,
    shortUrl,
  ]);

  return res;
};

export const getSessionByToken = async (token) => {
  const res = await db.query(`SELECT * FROM sessions WHERE token=$1`, [token]);

  return res;
};

export const urlExists = (id) => {
  const res = db.query(`SELECT * FROM urls WHERE id=$1`, [id]);

  return res;
};

export const checkOwnership = async (userId, id) => {
  const res = await db.query(`DELETE FROM urls WHERE id=$2 AND "userId"=$1`, [
    userId,
    id,
  ]);

  return res;
};

export const deleteUrlFromDataBase = async (id) => {
  const res = db.query(`DELETE FROM urls WHERE id=$1`, [id]);
  return res;
};
