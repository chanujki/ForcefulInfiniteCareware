const axios = require("axios");
const request = require("request");
const fs = require("fs-extra");
const { alldown } = require("nayan-videos-downloader");

module.exports = {
  config: {
    name: "auto",
    version: "0.0.2",
    permission: 0,
    prefix: true,
    credits: "Nayan",
    description: "auto video download",
    category: "user",
    usages: "",
    cooldowns: 5,
  },

  start: async function({ nayan, events, args }) {},

  handleEvent: async function ({ api, event, args }) {
    const content = event.body ? event.body : '';
    const body = content.toLowerCase();

    if (body.startsWith("https://")) {
      try {
        api.setMessageReaction("🔍", event.messageID, (err) => {}, true);
        const data = await alldown(content);

        // Check if data and data.data exist before destructuring
        if (!data || !data.data) {
          api.sendMessage("Error: ভিডিও ডাউনলোড করতে ব্যর্থ। দয়া করে সঠিক লিংক দিন।", event.threadID, event.messageID);
          return;
        }

        const { low, high, title } = data.data;

        const video = (await axios.get(high, {
          responseType: "arraybuffer",
        })).data;

        const filePath = __dirname + "/cache/auto.mp4";
        fs.writeFileSync(filePath, Buffer.from(video, "utf-8"));

        api.setMessageReaction("✔️", event.messageID, (err) => {}, true);
        return api.sendMessage({
          body: `《TITLE》: ${title}`,
          attachment: fs.createReadStream(filePath)
        }, event.threadID, event.messageID);

      } catch (err) {
        console.error("Download error:", err);
        return api.sendMessage("Error: ভিডিও ডাউনলোড করতে সমস্যা হয়েছে।", event.threadID, event.messageID);
      }
    }
  }
};
