import db from "../database/database.connection.js";

export const getUserBySession = async (token) => {
    const result = await db.query(`SELECT * FROM sessions WHERE token = $1`, [token]);
    
    return result;
};

export const registerUrl = async (shortUrl, url, userId) => {
    const result = await db.query(`INSERT INTO urls ("shortUrl", "userId", url) VALUES ($1, $3, $2)`, [shortUrl, url, userId]);
    const urlData = await db.query(`SELECT (id, "shortUrl", url) FROM urls WHERE "shortUrl"=$1`, [shortUrl]);
    const res = {result, urlData};

    return res;
};

export const getUrl_Id = async (id) => {
    const result = await db.query(`SELECT (id, url, "shortUrl") FROM urls WHERE id=$1`, [id]);
    
    return result;
};

export const redirectUrl = async (shortenUrl) => {
    const result = await db.query(`SELECT * FROM urls WHERE "shortUrl"=$1`, [shortenUrl]);

    return result.rows[0].url;
};

export const addVisitCount = async (shortenUrl) => {
    const getCount = await db.query(`SELECT * FROM urls WHERE "shortUrl"=$1`, [shortenUrl]);
    const count = getCount.rows[0].visits;

    const res = await db.query(`UPDATE urls SET visits=$1 WHERE "shortUrl"=$2`, [count, shortenUrl]);

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

export const checkOwnership = async (userId) => {
    const res = await db.query(`DELETE FROM urls WHERE id=$2 AND "userId"=$1`, [userId, id]);

    return res;
};

export const deleteUrlFromDataBase = async (id) => {
    const res = db.query(`DELETE FROM urls WHERE id=$1`, [id]);
    return res;
};