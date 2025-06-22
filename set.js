const fs = require('fs-extra');
const { Sequelize } = require('sequelize');
if (fs.existsSync('set.env'))
    require('dotenv').config({ path: __dirname + '/set.env' });

const path = require("path");
const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined
    ? databasePath
    : process.env.DATABASE_URL;

module.exports = {
    session: process.env.SESSION_ID || 'eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiNkF3ZnpVQ2tLWWRoY0NNWE1JcWtRMUhvMDlQTm0rd2oxL1RmNWdxSG9Gaz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQTl2Z1ZRN2R5dXlGbzVYN2hjNWJvTnNqaEtDems1UHNROXdyN3dvZ0hqcz0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJxR2JCdVZ3K0Jab09veGZ5cW9kRVZ1MmtDOWpCY2tiY1FIaU1ITDRGQlVJPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJMdDV6azBxRzUrRWY1bzRUSW4xUS9MTWxIUDRBYTBSTU1GWGM4Y09LelE4PSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IlVMQzJKVW1VM3pSNkhVVng4aHpFMnZOQ1VqaHB4ZEhDdEJuNEpQMGZFVzQ9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6InlKdGRLd0R2QmxGRnp5QXhkTDNCcnNqdENpZmNqbGxzWHhBN1czbVpqRHc9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoieUI4a2ZzRXpXeHMySHZTTnJKTTlybDhCdmxFamRncDNLMVBDT1I3d0xGST0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoicTUvUzc5cDVSZ1NjK3RFSTNheVY0NG1ZMzRhRjlsNlVYeFQ4eExTZnJpRT0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IjFaRzJqbVk5SjlWQ3FaT25Ea0tnbXQ3OUIzb3FVTjlPT0lrU3o1NjNIRjZYcEo2WFpGNnNMODg4ZWJpcUE1Y2FEZ3d2YXVlcHZyNWRiRHEyR3NScGlRPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MTcyLCJhZHZTZWNyZXRLZXkiOiJCckYzRk95eEQyeHQ3aDh4OERqWTBQUG12VDQrOS80NDFnQzFZenVCbXRrPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W3sia2V5Ijp7InJlbW90ZUppZCI6IjIzNDgwNTg0OTY2MDVAcy53aGF0c2FwcC5uZXQiLCJmcm9tTWUiOnRydWUsImlkIjoiQ0UxNjBCODE5Q0I5RkYyMzBBREZCQTc3OTlGNzRDN0EifSwibWVzc2FnZVRpbWVzdGFtcCI6MTc1MDU1OTM0NX0seyJrZXkiOnsicmVtb3RlSmlkIjoiMjM0ODA1ODQ5NjYwNUBzLndoYXRzYXBwLm5ldCIsImZyb21NZSI6dHJ1ZSwiaWQiOiJERDZGRjE5NUJFNTI3QTk3MzE3OTI0N0JBOTQ0MzE5NSJ9LCJtZXNzYWdlVGltZXN0YW1wIjoxNzUwNTU5MzUyfV0sIm5leHRQcmVLZXlJZCI6MzEsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjozMSwiYWNjb3VudFN5bmNDb3VudGVyIjoxLCJhY2NvdW50U2V0dGluZ3MiOnsidW5hcmNoaXZlQ2hhdHMiOmZhbHNlfSwicmVnaXN0ZXJlZCI6dHJ1ZSwicGFpcmluZ0NvZGUiOiIxMjNMT1RVUyIsIm1lIjp7ImlkIjoiMjM0ODA1ODQ5NjYwNTo0NkBzLndoYXRzYXBwLm5ldCIsImxpZCI6IjU2MTUzMDA2NDA3Njg0OjQ2QGxpZCIsIm5hbWUiOiLimIbgv5DgvLXgvb3gvIbgvJIg8J2RqvCdkpDwnZKF8J2ShvCdkpkg8J2RuPCdkoLwnZKC8J2SlPCdkorwnZKOIOC8kuC8huC/kOC8teC9vSJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDT0xoZ3g4UTJ0VGR3Z1lZQ0NBQUtBQT0iLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoiVno0aUl1ZnhBZDFHVnRMYW5CVm1wWE81RGdyYXVxdmx4L2x6NlFwSlBoZz0iLCJhY2NvdW50U2lnbmF0dXJlIjoidDhTZkZiMXFTVmVDVUgzVU5MR1h3dUNHU1d6U3g3MHBqZXdiVlRGK0wxdDQwNm5QTXQyYWE4WkxTaUx2d3NKNndIZkw0M09admFKYXk1MFEvMmJ1Qnc9PSIsImRldmljZVNpZ25hdHVyZSI6Ik1PcUdFNFhJN1VSa2hFdk1KeTI1T3lBbTJMWXhQZGRFcE1kVkltVVdNVU1sR0tPelBaWFBjaWtSZEJxSnNsNXFMTU1kTEpCQlpGcmtlNWtzNldoaGpRPT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiMjM0ODA1ODQ5NjYwNTo0NkBzLndoYXRzYXBwLm5ldCIsImRldmljZUlkIjowfSwiaWRlbnRpZmllcktleSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkJWYytJaUxuOFFIZFJsYlMycHdWWnFWenVRNEsycnFyNWNmNWMra0tTVDRZIn19XSwicGxhdGZvcm0iOiJhbmRyb2lkIiwicm91dGluZ0luZm8iOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJDQWdJRFE9PSJ9LCJsYXN0QWNjb3VudFN5bmNUaW1lc3RhbXAiOjE3NTA1NTkzMzUsImxhc3RQcm9wSGFzaCI6IjJHNEFtdSIsIm15QXBwU3RhdGVLZXlJZCI6IkFBQUFBSTZHIn0=',
    PREFIXE: process.env.PREFIX || ".",
    OWNER_NAME: process.env.OWNER_NAME || "Codex",
    NUMERO_OWNER: process.env.NUMERO_OWNER || "2348058496605",
    
    AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "no",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_DOWNLOAD_STATUS || "no",
    AUTO_READ: process.env.AUTO_READ || "no",
    AUTO_REACT: process.env.AUTO_REACT || "no",
    AUTO_REACT_STATUS: process.env.AUTO_REACT_STATUS || "no",
    AUTO_REPLY: process.env.AUTO_REPLY || "no",
    AUTO_SAVE_CONTACTS: process.env.AUTO_SAVE_CONTACTS || "no",
    AUTO_REJECT_CALL: process.env.AUTO_REJECT_CALL || "no",
    AUTO_BIO: process.env.AUTO_BIO || "no",
    AUDIO_REPLY: process.env.AUDIO_REPLY || "no",
    AUTO_TAG_STATUS: process.env.AUTO_TAG_STATUS || "no",

    BOT: process.env.BOT_NAME || "𝐂𝐨𝐝𝐞𝐱𝐗 𝐍𝐞𝐨𝐍",
    URL: process.env.BOT_MENU_LINKS || "https://files.catbox.moe/p6uxq0.png",
    MODE: process.env.PUBLIC_MODE || "no",
    PM_PERMIT: process.env.PM_PERMIT || "no",
    
    HEROKU_APP_NAME: process.env.HEROKU_APP_NAME,
    HEROKU_APY_KEY: process.env.HEROKU_APY_KEY,
    
    WARN_COUNT: process.env.WARN_COUNT || "3",
    ETAT: process.env.PRESENCE || "",
    CHATBOT: process.env.CHATBOT || "no",
    DP: process.env.STARTING_BOT_MESSAGE || "yes",
    
    ADM: process.env.ANTI_DELETE_MESSAGE || "yes",
    ANTIDELETE1: process.env.ANTIDELETE1 || "yes",
    ANTIDELETE2: process.env.ANTIDELETE2 || "yes",
    CHARLESKE_CHATBOT: process.env.CHARLESKE_CHATBOT || "no",
    ANTICALL: process.env.ANTICALL || "yes",
    
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgresql://postgres:bKlIqoOUWFIHOAhKxRWQtGfKfhGKgmRX@viaduct.proxy.rlwy.net:47738/railway"
        : "postgresql://postgres:bKlIqoOUWFIHOAhKxRWQtGfKfhGKgmRX@viaduct.proxy.rlwy.net:47738/railway",
};

let fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`mise à jour ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});