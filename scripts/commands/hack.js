module.exports.config = {
  name: "hack",
  version: "1.0.0",
  permission: 0,
  credits: "Rakib",
  description: "example",
  prefix: true,
  category: "Fun",
  usages: "user",
  cooldowns: 5,
  dependencies: {
    "axios": "",
    "fs-extra": "",
    "canvas": ""
  }
};

module.exports.wrapText = (ctx, text, maxWidth) => {
  return new Promise(resolve => {
    if (ctx.measureText(text).width < maxWidth) return resolve([text]);
    if (ctx.measureText('W').width > maxWidth) return resolve(null);
    const words = text.split(' ');
    const lines = [];
    let line = '';
    while (words.length > 0) {
      let split = false;
      while (ctx.measureText(words[0]).width >= maxWidth) {
        const temp = words[0];
        words[0] = temp.slice(0, -1);
        if (split) words[1] = `${temp.slice(-1)}${words[1]}`;
        else {
          split = true;
          words.splice(1, 0, temp.slice(-1));
        }
      }
      if (ctx.measureText(`${line}${words[0]}`).width < maxWidth) {
        line += `${words.shift()} `;
      } else {
        lines.push(line.trim());
        line = '';
      }
      if (words.length === 0) lines.push(line.trim());
    }
    return resolve(lines);
  });
}

module.exports.run = async function ({ args, Users, Threads, api, event, Currencies }) {
  const { loadImage, createCanvas, registerFont } = require("canvas");
  const fs = global.nodemodule["fs-extra"];
  const axios = global.nodemodule["axios"];

  const fontPath = __dirname + "/fonts/Siyamrupali.ttf";
  registerFont(fontPath, { family: "Siyamrupali" });

  let pathImg = __dirname + "/cache/background.png";
  let pathAvt1 = __dirname + "/cache/Avtmot.png";

  var id = Object.keys(event.mentions)[0] || event.senderID;
  var name = await Users.getNameUser(id);

  const backgrounds = [
    "https://drive.google.com/uc?id=1RwJnJTzUmwOmP3N_mZzxtp63wbvt9bLZ"
  ];
  const bg = backgrounds[Math.floor(Math.random() * backgrounds.length)];

  const avatar = (
    await axios.get(
      `https://graph.facebook.com/${id}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
      { responseType: "arraybuffer" }
    )
  ).data;
  fs.writeFileSync(pathAvt1, Buffer.from(avatar, "utf-8"));

  const background = (
    await axios.get(bg, { responseType: "arraybuffer" })
  ).data;
  fs.writeFileSync(pathImg, Buffer.from(background, "utf-8"));

  const baseImage = await loadImage(pathImg);
  const baseAvt1 = await loadImage(pathAvt1);

  const canvas = createCanvas(baseImage.width, baseImage.height);
  const ctx = canvas.getContext("2d");

  ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

  ctx.font = "23px Siyamrupali";
  ctx.fillStyle = "#1878F3";
  ctx.textAlign = "start";

  const lines = await this.wrapText(ctx, name, 1160);
  ctx.fillText(lines.join('\n'), 200, 497);

  ctx.drawImage(baseAvt1, 83, 437, 100, 101);

  const imageBuffer = canvas.toBuffer();
  fs.writeFileSync(pathImg, imageBuffer);
  fs.removeSync(pathAvt1);

  const fbCode = Math.floor(10000 + Math.random() * 90000);

  const messages = [
    "Breaking News: রাকিব এখন আমাদের নিয়ন্ত্রণে!",
    "সতর্কবার্তা: প্রোফাইল হ্যাকড!",
    "ভাই, ফটো এখন AI দ্বারা সম্পাদিত!",
    "রাকিব বস, এখন আপনি হ্যাকারদের রাজা!",
    "হ্যাক শেষ, এখন এক কাপ চা দেন!",
    `ফেসবুক কোড: ${fbCode}`
  ];

  const msg = messages[Math.floor(Math.random() * messages.length)];

  return api.sendMessage({
    body: msg,
    attachment: fs.createReadStream(pathImg)
  }, event.threadID, () => fs.unlinkSync(pathImg), event.messageID);
}
