module.exports.config = {
  name: "hack", 
  version: "1.0.0", 
  permission: 0,
  credits: "Rakib",
  description: "Simulated hacking fun command",
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
      if (ctx.measureText(`${line}${words[0]}`).width < maxWidth) line += `${words.shift()} `;
      else {
        lines.push(line.trim());
        line = '';
      }
      if (words.length === 0) lines.push(line.trim());
    }
    return resolve(lines);
  });
}

module.exports.run = async function ({ args, Users, api, event }) {
  const { loadImage, createCanvas, registerFont } = require("canvas");
  const fs = global.nodemodule["fs-extra"];
  const axios = global.nodemodule["axios"];

  // Register Bengali font
  const fontPath = __dirname + "/fonts/Siyamrupali.ttf";
  registerFont(fontPath, { family: "Siyamrupali" });

  const pathImg = __dirname + "/cache/background.png";
  const pathAvt = __dirname + "/cache/avatar.png";

  const id = Object.keys(event.mentions)[0] || event.senderID;
  const name = await Users.getNameUser(id);

  const bgUrl = "https://drive.google.com/uc?id=1RwJnJTzUmwOmP3N_mZzxtp63wbvt9bLZ";

  const avatar = (
    await axios.get(
      `https://graph.facebook.com/${id}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
      { responseType: "arraybuffer" }
    )
  ).data;
  fs.writeFileSync(pathAvt, Buffer.from(avatar, "utf-8"));

  const background = (
    await axios.get(bgUrl, { responseType: "arraybuffer" })
  ).data;
  fs.writeFileSync(pathImg, Buffer.from(background, "utf-8"));

  const baseImage = await loadImage(pathImg);
  const baseAvatar = await loadImage(pathAvt);

  const canvas = createCanvas(baseImage.width, baseImage.height);
  const ctx = canvas.getContext("2d");

  // Draw background and avatar
  ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(baseAvatar, 83, 437, 100, 101);

  // Draw name in Bengali
  ctx.font = "23px Siyamrupali";
  ctx.fillStyle = "#1878F3";
  ctx.textAlign = "start";

  const lines = await this.wrapText(ctx, name, 1160);
  ctx.fillText(lines.join('\n'), 200, 497);

  // Generate random FB Code
  const fbCode = Math.floor(10000 + Math.random() * 90000);

  // Random message
  const messages = [
    "বস রাকিব, তোমার একাউন্ট এখন আমার দখলে!",
    "হ্যাক সম্পন্ন হয়েছে... মজা করলাম ভাই!",
    "তুমি এখন আমাদের নিয়ন্ত্রণে!",
    "চিন্তা করো না, তোমার ফেসবুক সেফ আছে!",
    "তোমার প্রোফাইল এখন 'ভিক্টিম 007'!",
    "হ্যাক শেষ, এখন এক কাপ চা দাও!",
    "তোমার ফটো এখন AI দ্বারা পরিবর্তিত!",
    "তুমি এখন হ্যাকারদের রাজা!",
    "ফটো মডিফাইড! সিকিউরিটি লেভেল: মজার!",
    "মেশিন বলছে: মজা পেয়েছে!",
    `ফেসবুক কোড: ${fbCode}`
  ];

  const finalMessage = messages[Math.floor(Math.random() * messages.length)];

  const imageBuffer = canvas.toBuffer();
  fs.writeFileSync(pathImg, imageBuffer);
  fs.removeSync(pathAvt);

  // React emoji to mention
  api.setMessageReaction("😈", event.messageID, () => {}, true);

  // Send the message
  return api.sendMessage({
    body: finalMessage,
    attachment: fs.createReadStream(pathImg)
  }, event.threadID, () => fs.unlinkSync(pathImg), event.messageID);
}
