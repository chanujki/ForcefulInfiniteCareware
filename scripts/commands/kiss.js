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
  const { existsSync, mkdirSync, writeFileSync } = global.nodemodule["fs-extra"];
  const axios = global.nodemodule["axios"];
  const dir = resolve(__dirname, 'cache', 'canvas');
  const filePath = resolve(dir, 'kissv3.png');

  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

  if (!existsSync(filePath)) {
    try {
      const response = await axios.get("https://i.imgur.com/3laJwc1.jpg", { responseType: "arraybuffer" });
      writeFileSync(filePath, Buffer.from(response.data, "binary"));
    } catch (error) {
      console.error("Error downloading kissv3 image:", error.message || error);
    }
  }
};

async function makeImage({ one, two }) {
  const fs = global.nodemodule["fs-extra"];
  const path = global.nodemodule["path"];
  const axios = global.nodemodule["axios"];
  const jimp = global.nodemodule["jimp"];
  const __root = path.resolve(__dirname, "cache", "canvas");

  const pathImg = `${__root}/batman_${one}_${two}.png`;
  const avatarOne = `${__root}/avt_${one}.png`;
  const avatarTwo = `${__root}/avt_${two}.png`;

  try {
    const avatarURL = (uid) =>
      `https://graph.facebook.com/${uid}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

    const getAvatar = async (url, path) => {
      const response = await axios.get(url, { responseType: "arraybuffer" });
      fs.writeFileSync(path, Buffer.from(response.data, "binary"));
    };

    await getAvatar(avatarURL(one), avatarOne);
    await getAvatar(avatarURL(two), avatarTwo);

    const baseImg = await jimp.read(`${__root}/kissv3.png`);
    const circleOne = await jimp.read(await circle(avatarOne));
    const circleTwo = await jimp.read(await circle(avatarTwo));

    baseImg
      .composite(circleOne.resize(350, 350), 200, 300)
      .composite(circleTwo.resize(350, 350), 600, 80);

    const raw = await baseImg.getBufferAsync("image/png");
    fs.writeFileSync(pathImg, raw);
    return pathImg;
  } catch (error) {
    console.error("Error creating image:", error.message || error);
    throw error;
  } finally {
    if (fs.existsSync(avatarOne)) fs.unlinkSync(avatarOne);
    if (fs.existsSync(avatarTwo)) fs.unlinkSync(avatarTwo);
  }
}

async function circle(imagePath) {
  const jimp = require("jimp");
  const image = await jimp.read(imagePath);
  image.circle();
  return await image.getBufferAsync("image/png");
}

module.exports.run = async function ({ event, api, args }) {
  const fs = global.nodemodule["fs-extra"];
  const { threadID, messageID, senderID } = event;
  const mention = Object.keys(event.mentions);

  if (!mention[0]) {
    return api.sendMessage("Please mention 1 person.", threadID, messageID);
  }

  const one = senderID;
  const two = mention[0];

  try {
    const path = await makeImage({ one, two });
    api.sendMessage(
      {
        body: "ইস বেবি, তোমাকে তো খেয়ে দিল এখন তো তোমার বিয়ে হবে না। 🤭🤣",
        attachment: fs.createReadStream(path),
      },
      threadID,
      () => fs.unlinkSync(path),
      messageID
    );
  } catch (error) {
    api.sendMessage("ছবি তৈরি করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।", threadID, messageID);
  }
};
