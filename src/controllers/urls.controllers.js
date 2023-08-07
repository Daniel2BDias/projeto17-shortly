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

export const postUrlController = async (req, res) => {
  const { url } = req.body;
  const { token } = res.locals;
  const shortUrl = nanoid(8);
  
  try {
    const session = await getUserBySession(token);
    const userId = session.rows[0].userId;
    const postUrl = await registerUrl(shortUrl, url, userId);

    res.status(201).send({ id: postUrl, shortUrl});
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const getUrlById = async (req, res) => {
  const { id } = req.params;

  try {
    const getUrl = await getUrl_Id(id);
    if(getUrl.rowCount === 0) return res.sendStatus(404);

    res.status(200).send(getUrl.rows[0]);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const openUrl = async (req, res) => {
  const { shortUrl } = req.params;

  try {
    const url = await redirectUrl(shortUrl);
    console.log(url);
    if(!url) return res.sendStatus(404);
    const addVisit = await addVisitCount(shortUrl);
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

    const isOwner = await checkOwnership(userId, id);

    if(isOwner.rowCount === 0) return res.sendStatus(401);

    const deleteFromDatabase = await deleteUrlFromDataBase(id);

    res.sendStatus(204);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
