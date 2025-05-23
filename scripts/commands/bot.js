module.exports.config = {
    name: "bot",
    version: "1.0.2",
    hasPermssion: 0,
    credits: "Rakib - fixed by ChatGPT",
    description: "Chatbot with reply support",
    usePrefix: true,
    prefix: "awto",
    category: "user",
    commandCategory: "ChatBots",
    cooldowns: 5,
};

module.exports.run = async function({ api, event, args, Users }) {
    const axios = require("axios");
    const id = event.senderID;
    const name = await Users.getNameUser(id);

    let prompt = args.join(" ");

    // যদি reply করা হয়, সেটা ব্যবহার করো
    if (!prompt && event.type === "message_reply" && event.messageReply.body) {
        prompt = event.messageReply.body;
    }

    const tl = ["🙈💋"];
    const rand = tl[Math.floor(Math.random() * tl.length)];

    if (!prompt) return api.sendMessage(`${name}\n${rand}`, event.threadID, event.messageID);

    try {
        const response = await axios.get(`http://5.9.12.94:14642/sim?ask=${encodeURIComponent(prompt)}`);
        const result = response.data.reply;

        return api.sendMessage(result, event.threadID, event.messageID);
    } catch (error) {
        console.error(error);
        return api.sendMessage("দুঃখিত, কিছু ত্রুটি ঘটেছে। আবার চেষ্টা করুন।", event.threadID, event.messageID);
    }
};
