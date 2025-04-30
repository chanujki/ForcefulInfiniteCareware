const fs = require("fs-extra");
const axios = require("axios");
const { loadImage, createCanvas, registerFont } = require("canvas");
const path = require("path");

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
    "fs-extra": ""
  }
};

const fontPath = path.join(__dirname, "cache", "Siyamrupali.ttf");
if (fs.existsSync(fontPath)) {
  registerFont(fontPath, { family: "Siyamrupali" });
} else {
  console.warn("Siyamrupali.ttf not found! Using default font.");
}

module.exports.wrapText = (ctx, text, maxWidth) => {
  return new Promise(resolve => {
    if (ctx.measureText(text).width < maxWidth) return resolve([text]);

    const words = text.split(' ');
    const lines = [];
    let line = '';
    
    while (words.length > 0) {
      let split = false;
      
      // Check if any word exceeds the maxWidth and split it
      while (ctx.measureText(words[0]).width >= maxWidth) {
        const temp = words[0];
        words[0] = temp.slice(0, -1); // Keep shortening the word
        
        // If split, append last char to the next word
        if (split) {
          words[1] = temp.slice(-1) + words[1];
        } else {
          split = true;
          words.splice(1, 0, temp.slice(-1)); // Insert the split character
        }
      }
      
      // Check if the current line can accommodate the next word
      if (ctx.measureText(line + words[0]).width < maxWidth) {
        line += words.shift() + " ";
      } else {
        lines.push(line.trim()); // If it doesn't fit, push the line
        line = ''; // Reset the line
      }
      
      // If no more words left, push the last line
      if (words.length === 0) lines.push(line.trim());
    }
    
    return resolve(lines);
  });
};

module.exports.run = async function({ args, Users, Threads, api, event, Currencies }) {
  let pathImg = __dirname + "/cache/background.png";
  let pathAvt1 = __dirname + "/cache/Avtmot.png";

  var id = Object.keys(event.mentions)[0] || event.senderID;
  var name = await Users.getNameUser(id);

  var background = [
    "[https://drive.google.com/uc?id=1RwJnJTzUmwOmP3N_mZzxtp63wbvt9bLZ](https://drive.google.com/uc?id=1RwJnJTzUmwOmP3N_mZzxtp63wbvt9bLZ)"
  ];

  var rd = background[Math.floor(Math.random() * background.length)];

  let getAvtmot = (await axios.get(`https://graph.facebook.com/${id}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" })).data;

  fs.writeFileSync(pathAvt1, Buffer.from(getAvtmot, "utf-8"));

  let getbackground = (await axios.get(rd, { responseType: "arraybuffer" })).data;

  fs.writeFileSync(pathImg, Buffer.from(getbackground, "utf-8"));

  let baseImage = await loadImage(pathImg);
  let baseAvt1 = await loadImage(pathAvt1);

  let canvas = createCanvas(baseImage.width, baseImage.height);
  let ctx = canvas.getContext("2d");

  ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

  ctx.font = "23px Siyamrupali";
  ctx.fillStyle = "#1878F3";
  ctx.textAlign = "start";
  ctx.setTransform(1, 0, 0, 1, 0, 0);

  // Wrap text for name to fit within the image
  const lines = await this.wrapText(ctx, name, 1160);
  ctx.fillText(lines.join('\n'), 200, 497);

  ctx.beginPath();
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
    "এইমাত্র কোর্টের বেডা হ্যাকড হইছে!",
    "কোর্টের বেডা এখন আমাদের সিস্টেমে!",
    "সতর্ক থাকুন! কোর্টের বেডা ইন অ্যাকশন!",
    "AI বলতেছে: কোর্টের বেডা অলরেডি ফাঁস!",
    "ফেসবুক এখন চালাচ্ছে কোর্টের বেডা personally!"
  ];

  const randomMsg = messages[Math.floor(Math.random() * messages.length)];
  const msgWithCode = `${randomMsg}\n\nFB Code: ${fbCode}`;

  return api.sendMessage({
    body: msgWithCode,
    attachment: fs.createReadStream(pathImg)
  }, event.threadID, () => fs.unlinkSync(pathImg), event.messageID);
};
