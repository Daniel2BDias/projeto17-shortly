import { nanoid, customRandom, urlAlphabet } from "nanoid";
import {
    getUrl_Id,
  getUserBySession,
  redirectUrl,
  registerUrl,
} from "../repository/urls.repository.js";

export const postUrlController = (req, res) => {
  const { url } = req.body;
  const { token } = res.locals;
  const shorten = customRandom(urlAlphabet, 10);
  const shortUrl = shorten();
  try {
    const user = getUserBySession(token);
    const userId = user.rows[0].id;
    const postUrl = registerUrl(shortUrl, url, userId);

    res.status(201).send(postUrl.urlData.rows[0]);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const getUrlById = (req, res) => {
  const { id } = req.params;

  try {
    const getUrl = getUrl_Id();
    if(getUrl.rows[0].length === 0) return res.sendStatus(404);

    res.status(200).send(getUrl.rows[0]);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const openUrl = (req, res) => {
  const { shortenUrl } = req.params;

  try {
    const url = redirectUrl(shortenUrl);
    res.redirect(url);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const deleteUrl = (req, res) => {
  const { id } = req.params;
  const { token } = res.locals;

  try {
    const deleted = ;

    res.send()
  } catch {
    res.status(500).send(error.message);
  }
};
