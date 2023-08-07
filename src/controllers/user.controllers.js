import bcrypt from "bcrypt";
import { checkUser, createSession, deleteSession, getCounts, getUserInfo, rankingListing, registerUser } from "../repository/user.repository.js";

export const signUpController = async (req, res) => {
  const {name, email, password} = req.body;
  try {
    if(typeof password !== "string") return res.sendStatus(422);
    const checkConflict = await checkUser(email);

    if (checkConflict.rowCount > 0) return res.sendStatus(409);

    await registerUser(name, email, password);

    res.sendStatus(201);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const loginController = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await checkUser(email);

    if (existingUser.rowCount === 0) return res.sendStatus(401);

    const pWordValid = bcrypt.compareSync(
      password,
      existingUser.rows[0].password
    );
    
    if (!pWordValid) return res.sendStatus(401);

    const sessionData = await createSession(email, existingUser);

    res.status(200).send({ token: sessionData });
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
  const { userId, userEmail } = res.locals;

  try {
    const userInfo = await getUserInfo(userId);
    const getUser = await checkUser(userEmail);

    console.log(getUser);

    const linksArray = userInfo.rows.map((urls => {
        delete urls.createdAt;
        delete urls.userId;
        return urls;
    }));

    const getVisitCount = await getCounts(userId);

    const total = getVisitCount.rows[0].sum;

    const result = {
      id: userId,
      name: getUser.rows[0].name,
      visitCount: Number(total),
      shortenedUrls: linksArray
    }


    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const getRanking = async (req, res) => {
  try {
    const ranking = await rankingListing();

    res.send(ranking.rows);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
