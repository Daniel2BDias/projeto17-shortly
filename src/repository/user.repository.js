import db from "../database/database.connection.js";
import { v4 as uuid } from "uuid";
import bcrypt from "bcrypt";

export const checkUser = async (email) => {
  const res = await db.query(`SELECT * FROM users WHERE email=$1;`, [email]);
  return res;
};

export const registerUser = async (name, email, password) => {
  const hashedPw = bcrypt.hashSync(password, 10);

  const result = await db.query(
    `INSERT INTO users (name, email, password) VALUES ($1, $2, $3);`,
    [name, email, hashedPw]
  );

  return result;
};

export const createSession = async (email, existingUser) => {
  const token = uuid();
  const userId = existingUser.rows[0].id;

  const res = await db.query(
    `INSERT INTO sessions ("userId", "userEmail", token) VALUES ($1, $2, $3);`,
    [userId, email, token]
  );

  return token;
};

export const deleteSession = async (token) => {
  const res = await db.query(`DELETE FROM sessions WHERE token=$1`, [token]);
  return res;
};

export const getUserInfo = async (userId) => {
  const res = await db.query(`SELECT * FROM urls WHERE "userId" = $1`, [userId]);

  return res;
};

export const getCounts = async (userId) => {
  const result = await db.query(`SELECT SUM("visitCount") FROM urls WHERE "userId" = $1;`, [userId]);

  return result;
};

export const rankingListing = async () => {
   const result = await db.query(`
      SELECT users.id, users.name, 
        COUNT(urls.id) as "linksCount",
        COALESCE(SUM(urls."visitCount"), 0) as "visitCount"
      FROM users
      LEFT JOIN urls ON urls."userId" = users.id
      GROUP BY users.id
      ORDER BY "visitCount" DESC
      LIMIT 10
    `);

    return result;
};
