const fs = require('fs-extra');
const pathFile = __dirname + '/autoreact/autoreact.txt';

module.exports = {
  config: {
    name: "autoreact",
    version: "1.0.0",
    permission: 0,
    credits: "Rakib",
    description: "",
    prefix: 'awto',
    category: "auto",
    usages: "[off]/[on]",
    cooldowns: 5,
    dependencies: {
      "request": "",
      "fs-extra": "",
      "axios": ""
    }
  },

  languages: {
    "en": {
      "off": 'Autoreact বন্ধ করা হয়েছে।',
      "on": 'Autoreact চালু করা হয়েছে।',
      "error": 'সঠিক ভাবে on/off দিন।'
    }
  },

  handleEvent: async ({ api, event }) => {
    if (!fs.existsSync(pathFile))
      fs.writeFileSync(pathFile, 'false');
    
    const isEnable = fs.readFileSync(pathFile, 'utf-8');

    // শুধু নতুন মেসেজে রিয়েক্ট দেবে, বটের মেসেজে নয়
    if (isEnable === 'true' && event.senderID !== api.getCurrentUserID()) {
      const reactions = ["💀", "🙄", "🤭", "🥺", "😶", "😝", "👿", "🤓", "🥶", "🗿", "😾", "🤪", "🤬", "🤫", "😼", "😶‍🌫️", "😎", "🤦", "💅", "👀", "☠️", "🧠", "👺", "🤡", "🤒", "🤧", "😫", "😇", "🥳", "😭"];
      const reaction = reactions[Math.floor(Math.random() * reactions.length)];

      api.setMessageReaction(reaction, event.messageID, err => {
        if (err) console.error("React error:", err);
      }, true);
    }
  },

  start: async ({ api, event, args, getText }) => {
    if (args[0] === 'on') {
      fs.writeFileSync(pathFile, 'true');
      return api.sendMessage(getText("on"), event.threadID, event.messageID);
    } else if (args[0] === 'off') {
      fs.writeFileSync(pathFile, 'false');
      return api.sendMessage(getText("off"), event.threadID, event.messageID);
    } else {
      return api.sendMessage(getText("error"), event.threadID, event.messageID);
    }
  }
};
