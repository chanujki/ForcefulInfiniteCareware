const fs = require("fs");
module.exports.config = {
  name: "reply2",
  version: "1.1.0",
  permission: 0,
  credits: "Rakib",
  description: "noprefix",
  prefix: false,
  category: "user",
  usages: "",
  cooldowns: 5,
};

module.exports.handleEvent = function({ api, event, client, __GLOBAL }) {
  var { threadID, messageID } = event;
  let react = event.body.toLowerCase();
  if(react.includes("i love you") ||
react.includes("love") || 
react.includes("baby") || react.includes("xan") || react.includes("xanu") || react.includes("sona") ||
react.includes("xn") ||
react.includes("xona") || react.includes("xuna") || react.includes("ভালবাসি") ||
react.includes("ব্রেকাপ") ||
react.includes("break up") ||
react.includes("sex") ||
react.includes("nude") ||  
react.includes("Fucking") ||
react.includes("🤤")) {
    var msg = {
        body: "-❒ 🤖 | 𝐌𝐄𝐒𝐒𝐄𝐆𝐄:\n╰┈➤ ভালোবাসা নামক আব্লামি করতে মন চাইলে রাকিব এর ইনবক্স চলে জাও-!!🌚\n\n\n\n━━━━━━━━━━━━━━━━━━━\n✿◕𝐁𝐎𝐓-𝐎𝐖𝐍𝐄𝐑:\n 𝐑𝐀𝐊𝐈𝐁 𝐂𝐇𝐎𝐖𝐃𝐇𝐔𝐑𝐘◕✿🌚\n━━━━━━━━━━━━━━━━━━━𝐅𝐀𝐂𝐄𝐁𝐎𝐎𝐊 : https://www.facebook.com/SYSTEM.ERROR.KING "
      }
      api.sendMessage(msg, threadID, messageID);
    api.setMessageReaction("😤", event.messageID, (err) => {}, true)
    }
  }
  module.exports.run = function({ api, event, client, __GLOBAL }) {

  } 
