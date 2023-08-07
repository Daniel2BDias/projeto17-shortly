import bcrypt from "bcrypt";
import { checkUser, createSession, deleteSession, registerUser } from "../repository/user.repository.js";

export const signUpController = async (req, res) => {
  try {
    registerUser(req.body);

    res.sendStatus(201);
  } catch (error) {
    if (error.code === "23505") return res.sendStatus(409);
    res.status(500).send(error.message);
  }
};

export const loginController = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = checkUser(email);

    if (existingUser.rows.length === 0) return res.sendStatus(404);

    const pWordValid = bcrypt.compareSync(
      password,
      existingUser.rows[0].password
    );
    
    if (!pWordValid) return res.sendStatus(401);

    createSession(email, existingUser);

    res.status(200).send({ token });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const logOutController = async (req, res) => {
  const { authorization } = req.headers;

  const token = authorization?.replace("Bearer ", "");

  try {
    deleteSession(token);

    res.status(200).send("Logged Out Successfully!");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const getUserMe = async (req, res) => {
  const { token } = res.locals.token;
};

export const getRanking = async (req, res) => {
  try {

  } catch (error){
    res.status(500).send(error.message);
  };
};
