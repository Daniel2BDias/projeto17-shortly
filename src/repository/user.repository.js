import db from "../database/database.connection";
import { v4 as uuid } from "uuid";
import bcrypt from "bcrypt";

export const checkUser = async (email) => {
    const res = await db.query(`SELECT * FROM users WHERE email=$1;`, [
        email,
      ]);

      return res;
};

export const registerUser = async ({name, email, password}) =>{
    const hashedPw = bcrypt.hashSync(password, 10);

    const res = await db.query(
      `INSERT INTO users (name, email, password) VALUES ($1, $2, $3);`,
      [name, email, hashedPw]
    );

    return res;
};

export const createSession = async (email, existingUser) => {
    const token = uuid();
    const userId = existingUser.rows[0].id;

    const res = await db.query(
      `INSERT INTO sessions ("userId", email, token) VALUES ($1, $2, $3);`,
      [userId, email, token]
    );

    return res;
};

export const deleteSession = async (token) => {
    const res = await db.query(`DELETE FROM sessions WHERE token=$1`, [token]);
    return res;
};