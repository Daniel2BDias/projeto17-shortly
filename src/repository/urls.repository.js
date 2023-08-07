import db from "../database/database.connection.js";

export const getUserBySession = async (token) => {
    const result = await db.query(`SELECT * FROM sessions WHERE token=$1`, token);
    return result;
};

export const registerUrl = async (shortUrl, url, userId) => {
    const result = await db.query(`INSERT INTO urls ("shortUrl", "userId", url) VALUES ($1, $3, $2)`, [shortUrl, url, userId]);
    const urlData = await db.query(`SELECT (id, "shortUrl", url) FROM urls WHERE "shortUrl"=$1`, [shortUrl]);
    return {result, urlData};
};

export const getUrl_Id = async (id) => {
    const result = await db.query(`SELECT (id, url, "shortUrl") FROM urls WHERE id=$1`, [id]);
    
    return result;
};

export const redirectUrl = async (shortenUrl) => {
    const result = db.query(`SELECT url FROM urls WHERE "shortUrl"=$1`, [shortenUrl]);

    return result.rows[0].url;
};