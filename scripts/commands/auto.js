const axios = require("axios");
const fs = require("fs-extra");
const { alldown } = require("nayan-videos-downloaders");

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
          return api.sendMessage("Error: ভিডিও ডাউনলোড করতে ব্যর্থ। দয়া করে সঠিক লিংক দিন।", event.threadID, event.messageID);
        }

        const { low, high, title } = data.data;

        const video = (await axios.get(high, {
          responseType: "arraybuffer",
        })).data;

        const filePath = __dirname + "/cache/auto.mp4";
        fs.writeFileSync(filePath, Buffer.from(video, "utf-8"));

        // Format title beautifully for Rakib Bot
        const formattedTitle = title
          .split(" ")
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");

        const messageText = `━━━━━━━━━━━━━━━
🤖 𝐑𝐀𝐊𝐈𝐁 𝐁𝐎𝐓 - 𝐕𝐈𝐃𝐄𝐎 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃
━━━━━━━━━━━━━━━
《🎬 𝐓𝐈𝐓𝐋𝐄》: ${formattedTitle}
━━━━━━━━━━━━━━━`;

        api.setMessageReaction("✔️", event.messageID, (err) => {}, true);
        return api.sendMessage({
          body: messageText,
          attachment: fs.createReadStream(filePath)
        }, event.threadID, event.messageID);

      } catch (err) {
        console.error("Download error:", err);
        return api.sendMessage("Error: ভিডিও ডাউনলোড করতে সমস্যা হয়েছে।", event.threadID, event.messageID);
      }
    }
  }
};
