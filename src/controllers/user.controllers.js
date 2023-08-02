import db from "../database/database.connection.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

export const signUpController = async (req,res) => {
    const { name, email, password } = req.body;
  
    try {
      const alreadySignedEmail = await db.query(`SELECT COUNT(*) FROM users WHERE email=$1;`, [email]);
  
      if (alreadySignedEmail !== 0) return res.sendStatus(409);
  
      const hashedPw = bcrypt.hashSync(password, 10);
  
      await db.query(`INSERT INTO users (name, email, password) VALUES ($1, $2, $3);`, [name, email, hashedPw]);
  
      res.sendStatus(201);
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  export const loginController = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const existingUser = await db.query(`SELECT * FROM users WHERE email=$1;`, [email]);
      if (existingUser.rows.length === 0) return res.sendStatus(404);
      const pWordValid = bcrypt.compareSync(password, existingUser.rows[0].password);
      if (!pWordValid) return res.sendStatus(401);
  
      const token = uuid();
      const userId = existingUser.rows[0].id;
  
      await db.query(`INSERT INTO sessions ("userId", email, token) VALUES ($1, $2, $3);`, [userId, email, token]);
  
      res.status(200).send({ token });
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  export const logOutController = async (req, res) => {
    const { authorization } = req.headers;
  
    const token = authorization?.replace("Bearer ", "");
  
    try {
      await db.query(`DELETE FROM sessions WHERE token=$1`, [token]);
  
      res.status(200).send("Logged Out Successfully!");
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  export const getUserMe = async (req, res) => {

  };

  export const getRanking = async (req, res) => {

  };