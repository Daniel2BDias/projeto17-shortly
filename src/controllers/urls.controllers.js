import { nanoid } from "nanoid";
import {
  addVisitCount,
  checkOwnership,
  deleteUrlFromDataBase,
  getSessionByToken,
    getUrl_Id,
  getUserBySession,
  redirectUrl,
  registerUrl,
  urlExists,
} from "../repository/urls.repository.js";
import { checkUser } from "../repository/user.repository.js";

export const postUrlController = async (req, res) => {
  const { url } = req.body;
  const { token } = res.locals;
  const shortUrl = nanoid(8);
  console.log(shortUrl);
  try {
    console.log(token);
    const user = await getUserBySession(token);
    console.log(user)
    const getUserId = await checkUser(user.rows[0].email);
    console.log(getUserId);
    const userId = getUserId.rows[0].id;
    const postUrl = await registerUrl(shortUrl, url, userId);
    console.log(postUrl);

    res.status(201).send(postUrl.urlData.rows[0]);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const getUrlById = async (req, res) => {
  const { id } = req.params;

  try {
    const getUrl = await getUrl_Id(id);
    if(getUrl.rows[0].length === 0) return res.sendStatus(404);

    res.status(200).send(getUrl.rows[0]);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const openUrl = async (req, res) => {
  const { shortenUrl } = req.params;

  try {
    const url = await redirectUrl(shortenUrl);
    if(!url) return res.sendStatus(404);
    const addVisit = await addVisitCount(shortenUrl);
    res.redirect(url);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const deleteUrl = async (req, res) => {
  const { id } = req.params;
  const { token } = res.locals;

  try {
    const session = await getSessionByToken(token);
    const isUrl = await urlExists(id);

    if(isUrl.rowCount === 0) return res.sendStatus(404);

    const userId = session.rows[0].userId;

    const checkOwnership = await checkOwnership(userId, id);

    if(checkOwnership.rowCount === 0) return res.sendStatus(401);

    const deleteFromDatabase = await deleteUrlFromDataBase(id);

    res.sendStatus(204);
  } catch {
    res.status(500).send(error.message);
  }
};
