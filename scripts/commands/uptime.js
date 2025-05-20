const fs = require("fs-extra");
const axios = require("axios");
const moment = require("moment-timezone");
const request = require("request");
const { loadImage, createCanvas, registerFont } = require("canvas");

module.exports.config = {
  name: "uptime",
  version: "1.0.0",
  permission: 0,
  prefix: false,
  credits: "Rakib Mahmud",
  description: "Bot uptime info triggered by keyword 'গড'",
  category: "info",
  usages: "",
  cooldowns: 5,
};

function byte2mb(bytes) {
  const units = ['Bytes', 'KB', 'MB', 'GB'];
  let l = 0, n = parseInt(bytes, 10) || 0;
  while (n >= 1024 && ++l) n = n / 1024;
  return `${n.toFixed(n < 10 && l > 0 ? 1 : 0)} ${units[l]}`;
}

module.exports.handleEvent = async function ({ event, api }) {
  const content = event.body?.toLowerCase();
  if (!content || !content.includes("গড")) return;

  const { threadID, messageID } = event;
  const pidusage = await global.nodemodule["pidusage"](process.pid);
  const timeStart = Date.now();
  const uptime = process.uptime();
  const hours = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);

  const z_1 = hours.toString().padStart(2, '0');
  const x_1 = minutes.toString().padStart(2, '0');
  const y_1 = seconds.toString().padStart(2, '0');

  const timeNow = moment.tz("Asia/Dhaka").format("DD/MM/YYYY || HH:mm:ss");

  const bgUrls = [
    "https://i.imgur.com/9jbBPIM.jpg",
    "https://i.imgur.com/cPvDTd9.jpg",
    "https://i.imgur.com/ZT8CgR1.jpg"
  ];
  const bgUrl = bgUrls[Math.floor(Math.random() * bgUrls.length)];
  const pathImg = __dirname + `/Rakib/uptime_bg.png`;

  // Load background image
  const bgData = (await axios.get(bgUrl, { responseType: "arraybuffer" })).data;
  fs.writeFileSync(pathImg, Buffer.from(bgData, "utf-8"));
  const bgImage = await loadImage(pathImg);
  const canvas = createCanvas(bgImage.width, bgImage.height);
  const ctx = canvas.getContext("2d");

  // Draw background
  ctx.drawImage(bgImage, 0, 0);

  // Load font
  const fontPath = __dirname + `/Rakib/UTM-Avo.ttf`;
  if (!fs.existsSync(fontPath)) {
    const fontData = (await axios.get("https://github.com/hanakuUwU/font/raw/main/UTM%20Avo.ttf", { responseType: "arraybuffer" })).data;
    fs.writeFileSync(fontPath, Buffer.from(fontData, "utf-8"));
  }
  registerFont(fontPath, { family: "UTM" });

  // Draw text
  ctx.fillStyle = "#ffffff";
  ctx.font = "60px UTM";
  ctx.fillText("Bot Uptime", 100, 100);
  ctx.font = "45px UTM";
  ctx.fillText(`${z_1} : ${x_1} : ${y_1}`, 100, 180);
  ctx.font = "35px UTM";
  ctx.fillText(`Time: ${timeNow}`, 100, 250);
  ctx.fillText(`CPU: ${pidusage.cpu.toFixed(1)}%`, 100, 300);
  ctx.fillText(`RAM: ${byte2mb(pidusage.memory)}`, 100, 350);
  ctx.fillText(`Ping: ${Date.now() - timeStart}ms`, 100, 400);

  const imageBuffer = canvas.toBuffer();
  fs.writeFileSync(pathImg, imageBuffer);

  api.sendMessage({
    body: "গড ডাকলে হাজির!\nHere's your uptime info:",
    attachment: fs.createReadStream(pathImg)
  }, threadID, () => fs.unlinkSync(pathImg), messageID);
};

module.exports.run = () => {};
