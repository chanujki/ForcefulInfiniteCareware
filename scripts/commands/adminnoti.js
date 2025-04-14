const fs = require('fs');
const request = require('request');

module.exports.config = {
    name: "adminnoti",
    version: "1.0.0",
    permission: 2,
    credits: "Nayan",
    description: "",
    prefix: true,
    category: "admin",
    usages: "[msg]",
    cooldowns: 5,
}

let atmDir = [];

const getAtm = (atm, body) => new Promise(async (resolve) => {
    let msg = {}, attachment = [];
    msg.body = body;
    for(let eachAtm of atm) {
        await new Promise(async (resolve) => {
            try {
                let response =  await request.get(eachAtm.url),
                    pathName = response.uri.pathname,
                    ext = pathName.substring(pathName.lastIndexOf(".") + 1),
                    path = __dirname + `/cache/${eachAtm.filename}.${ext}`
                response
                    .pipe(fs.createWriteStream(path))
                    .on("close", () => {
                        attachment.push(fs.createReadStream(path));
                        atmDir.push(path);
                        resolve();
                    })
            } catch(e) { console.log(e); }
        })
    }
    msg.attachment = attachment;
    resolve(msg);
})

module.exports.handleReply = async function ({ api, event, handleReply, Users, Threads, getText }) {

    const moment = require("moment-timezone");
      var gio = moment.tz("Asia/Manila").format("DD/MM/YYYY - HH:mm:s");
    const { threadID, messageID, senderID, body } = event;
    let name = await Users.getNameUser(senderID);
    switch (handleReply.type) {
        case "sendnoti": {
            let text = `${name} replied to your announce\n\ntime : ${gio}\nreply : ${body}\n\nfrom group : ${(await Threads.getInfo(threadID)).threadName || "unknown"}`;
            if(event.attachments.length > 0) text = await getAtm(event.attachments, `${body}${name} replied to your announce\n\ntime : ${gio}\n\nfrom group : ${(await Threads.getInfo(threadID)).threadName || "unknown"}`);
            api.sendMessage(text, handleReply.threadID, (err, info) => {
                atmDir.forEach(each => fs.unlinkSync(each))
                atmDir = [];
                global.client.handleReply.push({
                    name: this.config.name,
                    type: "reply",
                    messageID: info.messageID,
                    messID: messageID,
                    threadID
                })
            });
            break;
        }
        case "reply": {
            let text = `admin ${name} replied to you\n\nreply : ${body}\n\nreply to this message if you want to respond again.`;
            if(event.attachments.length > 0) text = await getAtm(event.attachments, `${body}${name} replied to you\n\nreply to this message if you want to respond again.`);
            api.sendMessage(text, handleReply.threadID, (err, info) => {
                atmDir.forEach(each => fs.unlinkSync(each))
                atmDir = [];
                global.client.handleReply.push({
                    name: this.config.name,
                    type: "sendnoti",
                    messageID: info.messageID,
                    threadID
                })
            }, handleReply.messID);
            break;
        }
    }
}

module.exports.run = async function ({ api, event, args, Users }) {
    const moment = require("moment-timezone");
      var gio = moment.tz("Asia/Manila").format("DD/MM/YYYY - HH:mm:s");
    const { threadID, messageID, senderID, messageReply } = event;
    if (!args[0]) return api.sendMessage("please input message", threadID);
    let allThread = global.data.allThreadID || [];
    let can = 0, canNot = 0;
    let text = `⚠️🔊✧𝐀𝐃𝐌𝐈𝐍-𝐍𝐎𝐓𝐈𝐒✧🔊⚠️\n━━━━━━━━━━━━━━━━━━━\n𝐓𝐈𝐌𝐄 : ${gio}\n𝐀𝐃𝐌𝐈𝐍 𝐍𝐀𝐌𝐄 : ${await Users.getNameUser(senderID)}\n𝐌𝐄𝐒𝐒𝐄𝐆𝐄: ❒ 💬\n╰┈➤ : ${args.join(" ")}\n━━━━━━━━━━━━━━━━━━\nআপনি রিপ্লাই  দিয়ে এরা মতামত জানাবেন।(ধন্যবাদ) \n━━🍒🍏🍑🍏🍒🥭🍏━━.`;
    if(event.type == "message_reply") text = await getAtm(messageReply.attachments, `✱⚠️🔊✧｡𝐀𝐃𝐌𝐈𝐍-𝐍𝐎𝐓𝐈𝐒✧｡⚠️🔊\n━━━━━━━━━━━━━━━━━━━━\nসময় : ${gio}\n𝐀𝐃𝐌𝐈𝐍 𝐍𝐀𝐌𝐄 : ${await Users.getNameUser(senderID)}\n < মেছেজ..😙 : ${args.join(" ")}\n\nআপনার কোন মতামত জানতে চাইলে রিপ্লেই দিয়ে লিখুন  .`);
    await new Promise(resolve => {
        allThread.forEach((each) => {
            try {
                api.sendMessage(text, each, (err, info) => {
                    if(err) { canNot++; }
                    else {
                        can++;
                        atmDir.forEach(each => fs.unlinkSync(each))
                        atmDir = [];
                        global.client.handleReply.push({
                            name: this.config.name,
                            type: "sendnoti",
                            messageID: info.messageID,
                            messID: messageID,
                            threadID
                        })
                        resolve();
                    }
                })
            } catch(e) { console.log(e) }
        })
    })
    api.sendMessage(`send to ${can} thread, not send to ${canNot} thread`, threadID);
} 
