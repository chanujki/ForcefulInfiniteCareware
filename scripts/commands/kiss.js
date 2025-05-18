module.exports.config = {
  name: "kiss",
  version: "2.0.0",
  permission: 0,
  prefix: true,
  credits: "Clarence DK",
  description: "Generates a kiss image",
  category: "img",
  usage: "[@mention]",
  cooldown: 5,
  dependencies: {
    "axios": "latest",
    "fs-extra": "latest",
    "path": "latest",
    "jimp": "latest"
  }
};

module.exports.onLoad = async () => {
  const { resolve } = global.nodemodule["path"];
  const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
  const { downloadFile } = global.utils;
  const dirMaterial = __dirname + `/cache/canvas/`;
  const path = resolve(__dirname, 'cache', 'canvas', 'kissv3.png');
  if (!existsSync(dirMaterial + "canvas")) mkdirSync(dirMaterial, { recursive: true });
  if (!existsSync(path)) await downloadFile("https://i.imgur.com/3laJwc1.jpg", path);
};

async function fetchAvatar(userId, retries = 3) {
  const axios = global.nodemodule["axios"];
  const url = `https://graph.facebook.com/${userId}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

  for (let i = 0; i < retries; i++) {
    try {
      const res = await axios.get(url, { responseType: 'arraybuffer' });
      return res.data;
    } catch (err) {
      if (err.response && err.response.status === 429 && i < retries - 1) {
        console.warn(`Rate limited. Retrying (${i + 1})...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
      } else {
        throw err;
      }
    }
  }
}

async function makeImage({ one, two }) {
  const fs = global.nodemodule["fs-extra"];
  const path = global.nodemodule["path"];
  const jimp = global.nodemodule["jimp"];
  const __root = path.resolve(__dirname, "cache", "canvas");

  let batgiam_img = await jimp.read(__root + "/kissv3.png");
  let pathImg = __root + `/batman_${one}_${two}.png`;
  let avatarOne = __root + `/avt_${one}.png`;
  let avatarTwo = __root + `/avt_${two}.png`;

  try {
    let getAvatarOne = await fetchAvatar(one);
    fs.writeFileSync(avatarOne, Buffer.from(getAvatarOne, 'utf-8'));

    let getAvatarTwo = await fetchAvatar(two);
    fs.writeFileSync(avatarTwo, Buffer.from(getAvatarTwo, 'utf-8'));

    let circleOne = await jimp.read(await circle(avatarOne));
    let circleTwo = await jimp.read(await circle(avatarTwo));
    batgiam_img
      .composite(circleOne.resize(350, 350), 200, 300)
      .composite(circleTwo.resize(350, 350), 600, 80);

    let raw = await batgiam_img.getBufferAsync("image/png");
    fs.writeFileSync(pathImg, raw);
  } catch (error) {
    console.error("Error creating image:", error);
  } finally {
    fs.unlinkSync(avatarOne);
    fs.unlinkSync(avatarTwo);
  }

  return pathImg;
}

async function circle(image) {
  const jimp = require("jimp");
  image = await jimp.read(image);
  image.circle();
  return await image.getBufferAsync("image/png");
}

module.exports.run = async function ({ event, api, args }) {
  const fs = global.nodemodule["fs-extra"];
  const { threadID, messageID, senderID } = event;
  const mention = Object.keys(event.mentions);
  if (!mention[0]) return api.sendMessage("Please mention 1 person.", threadID, messageID);
  else {
    const one = senderID, two = mention[0];
    try {
      const path = await makeImage({ one, two });
      api.sendMessage({
        body: "ইস বেবি, তোমাকে তো খেয়ে দিল এখন তো তোমার বিয়ে হবে না। 🤭🤣",
        attachment: fs.createReadStream(path)
      }, threadID, () => fs.unlinkSync(path), messageID);
    } catch (error) {
      console.error("Error sending image:", error);
    }
  }
};
