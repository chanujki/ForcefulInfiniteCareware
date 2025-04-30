module.exports.config = {
  name: "hack", 
  version: "1.0.0", 
  permission: 0,
  credits: "Nayan",
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

module.exports.wrapText = (ctx, name, maxWidth) => {
  return new Promise(resolve => {
    if (ctx.measureText(name).width < maxWidth) return resolve([name]);
    if (ctx.measureText('W').width > maxWidth) return resolve(null);
    const words = name.split(' ');
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

module.exports.run = async function ({ args, Users, Threads, api, event, Currencies }) {
  const { loadImage, createCanvas } = require("canvas");
  const fs = global.nodemodule["fs-extra"];
  const axios = global.nodemodule["axios"];
  let pathImg = __dirname + "/cache/background.png";
  let pathAvt1 = __dirname + "/cache/Avtmot.png";

  var id = Object.keys(event.mentions)[0] || event.senderID;
  var name = await Users.getNameUser(id);

  var background = [
    "https://i.imgur.com/VQXViKI.png"
  ];
  var rd = background[Math.floor(Math.random() * background.length)];

  let getAvtmot = (
    await axios.get(
      `https://graph.facebook.com/${id}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
      { responseType: "arraybuffer" }
    )
  ).data;
  fs.writeFileSync(pathAvt1, Buffer.from(getAvtmot, "utf-8"));

  let getbackground = (
    await axios.get(`${rd}`, {
      responseType: "arraybuffer",
    })
  ).data;
  fs.writeFileSync(pathImg, Buffer.from(getbackground, "utf-8"));

  let baseImage = await loadImage(pathImg);
  let baseAvt1 = await loadImage(pathAvt1);

  let canvas = createCanvas(baseImage.width, baseImage.height);
  let ctx = canvas.getContext("2d");
  ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

  // ইউজারের নাম
  ctx.font = "400 23px Arial";
  ctx.fillStyle = "#1878F3";
  ctx.textAlign = "start";

  const lines = await this.wrapText(ctx, name, 1160);
  ctx.fillText(lines.join('\n'), 200, 497);

  // প্রোফাইল পিকচার বসানো
  ctx.drawImage(baseAvt1, 83, 437, 100, 101);

  // মজার ফানি টেক্সট
  const funnyReplies = [
    "তোমার একাউন্ট এখন আমাদের দখলে!",
    "হ্যাক সম্পন্ন হয়েছে... মজা করলাম ভাই!",
    "তুমি এখন আমাদের নিয়ন্ত্রণে!",
    "চিন্তা করো না, ফেসবুক সেফ আছে!",
    "তোমার প্রোফাইল এখন 'ভিক্টিম 007'!",
    "হ্যাক শেষ, এখন এক কাপ চা দাও!",
    "তুমি এখন 'হ্যাকারদের রাজা'!",
    "সিকিউরিটি লেভেল: মজার!",
    "মেশিন বলছে: মজা পেয়েছে!"
  ];
  const replyText = funnyReplies[Math.floor(Math.random() * funnyReplies.length)];

  // ছবির উপরে ফানি টেক্সট
  ctx.font = "bold 26px Arial";
  ctx.fillStyle = "#FF0000";
  ctx.textAlign = "center";
  ctx.fillText(replyText, canvas.width / 2, 80);

  const imageBuffer = canvas.toBuffer();
  fs.writeFileSync(pathImg, imageBuffer);
  fs.removeSync(pathAvt1);

  return api.sendMessage({
    body: "", // বডি না দিলেও হবে, সব ছবি দিয়ে বোঝা যাবে
    attachment: fs.createReadStream(pathImg)
  }, event.threadID, () => fs.unlinkSync(pathImg), event.messageID);
}
