module.exports.config = {
  name: "joinnoti",
  eventType: ["log:subscribe"],
  version: "1.0.1",
  credits: "Rakib",
  description: "Notify bot or group member with random gif/photo/video",
  dependencies: {
    "fs-extra": "",
    "path": "",
    "pidusage": ""
  }
};

module.exports.onLoad = function () {
    const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
    const { join } = global.nodemodule["path"];

  const path = join(__dirname, "RAKIB", "font");
  if (existsSync(path)) mkdirSync(path, { recursive: true });	

  const path2 = join(__dirname, "RAKIB", "font");
    if (!existsSync(path2)) mkdirSync(path2, { recursive: true });

    return;
}


module.exports.run = async function({ api, event }) {
  const { join } = global.nodemodule["path"];
  const { threadID } = event;
  if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
    api.changeNickname(`${(!global.config.BOTNAME) ? "bot" : global.config.BOTNAME}`, threadID, api.getCurrentUserID());
    const fs = require("fs");
    return api.sendMessage("কিগো জান শয়তানি করার জন্য অ্যাড দিছো☠️", event.threadID, () => api.sendMessage({body:`╔════•| ✿ |•════╗\nআ্ঁস্ঁসা্ঁলা্ঁমু্ঁ💚আ্ঁলা্ঁই্ঁকু্ঁম্ঁ\n╚════•| ✿ |•════╝
________________________
𝐓𝐡𝐚𝐧𝐤 𝐲𝐨𝐮 𝐬𝐨 𝐦𝐮𝐜𝐡 𝐟𝐨𝐫 𝐚𝐝𝐝𝐢𝐧𝐠 𝐦𝐞 𝐭𝐨 𝐲𝐨𝐮𝐫 𝐢-𝐠𝐫𝐨𝐮𝐩-🖤🤗\n𝐈 𝐰𝐢𝐥𝐥 𝐚𝐥𝐰𝐚𝐲𝐬 𝐬𝐞𝐫𝐯𝐞 𝐲𝐨𝐮 𝐢𝐧𝐚𝐡𝐚𝐥𝐥𝐚𝐡 🌺❤️-!!
________________________\n\n𝐓𝐨 𝐯𝐢𝐞𝐰 𝐚𝐧𝐲 𝐜𝐨𝐦𝐦𝐚𝐧𝐝

${global.config.PREFIX}Help\n${global.config.PREFIX}Info\n${global.config.PREFIX}
যেকোনো প্রয়োজনে আমার বস রাকিব এর  সাথে যোগাযোগ করতে পারো..!!�

OWNER😐: Rakib Chowdhury 

Facebook :     https://www.facebook.com/SYSTEM.ERROR.KING 

🔵WHATSAPP NUMBER: wa.me/+8801771306867

☠️🫰SUPPORT INFORMATION:
 https://system-error-king.github.io/

 আর কিছু দিবো না 👻

আমার বস রাকির এর পক্ষ থেকে 🫰🥰

তোমাদের জন্য ভালোবাসা অবিরাম 🫰🤖

THANKS FOR ADDING『🫰🤖』`, attachment: fs.createReadStream(__dirname + "/RAKIB/join.mp4")} ,threadID));
  }
  else {
    try {
      const { createReadStream, existsSync, mkdirSync, readdirSync } = global.nodemodule["fs-extra"];
      let { threadName, participantIDs } = await api.getThreadInfo(threadID);

      const threadData = global.data.threadData.get(parseInt(threadID)) || {};
      const path = join(__dirname, "RAKIB", "font");
      const pathGif = join(path, `${threadID}.gif`);

      var mentions = [], nameArray = [], memLength = [], i = 0;

      for (id in event.logMessageData.addedParticipants) {
        const userName = event.logMessageData.addedParticipants[id].fullName;
        nameArray.push(userName);
        mentions.push({ tag: userName, id });
        memLength.push(participantIDs.length - i++);
      }
      memLength.sort((a, b) => a - b);

      (typeof threadData.customJoin == "undefined") ? msg = "•━━𝐑𝐀𝐊𝐈𝐁-𝐁𝐎𝐓-𝟎𝟎𝟕🤖━━━•\n\n╔════•|      ✿      |•════╗\n 💐আ্ঁস্ঁসা্ঁলা্ঁমু্ঁ💚আ্ঁলা্ঁই্ঁকু্ঁম্ঁ💐\n╚════•|      ✿      |•════╝\n\n╰┈➤W⃠E⃠L⃠L⃠C⃠O⃠M⃠E⃠➤\n\n  ╰┈➤𝐍𝐄𝐖➤\n          ~🇲‌🇪‌🇲‌🇧‌🇪‌🇷‌~\n\n╰┈➤ {name} ➤\n\n༄✺আ্ঁপ্ঁনা্ঁকে্ঁ আ্ঁমা্ঁদে্ঁর্ঁ✺࿐\n\n{threadName}\n\n 🌿🌸—এ্ঁর্ঁ প্ঁক্ষ্ঁ🍀থে্ঁকে্ঁ🍀—🌸🌿\n\n       🌿_ভা্ঁলো্ঁবা্ঁসা্ঁ_অ্ঁভি্ঁরা্ঁম্ঁ_🌿\n\n༄✺আঁপঁনিঁ এঁইঁ গ্রুঁপেঁর {soThanhVien} নঁং মে্ঁম্বা্ঁরঁ ࿐\n\nগুপে আসার জন্য তোমাকে অন্তরের অন্তর স্থল থেকে জানাই অবিরাম ভালবাসা!!-\n\n\n🖤🌻🥀🖤━━╬٨♪❤٨ـﮩﮩـ╬━❤️❥\n⭕⭕হা্ঁসি্ঁ ম্ঁজা্ঁ ঠা্ঁট্টা্ঁয়্ঁ ব্ঁন্ধু্ঁত্ব্ঁ হ্ঁবে্ঁ চি্ঁর্ঁকা্ঁলী্ঁন্ঁ বে্ঁচে্ঁ থা্ঁকু্ঁক্ঁ ব্ঁন্ধু্ঁত্ব্ঁ\nভা্ঁলো্ঁবা্ঁসা্ঁর্ঁ স্ঁম্প্ঁর্কে্ঁ আ্ঁজী্ঁব্ঁন্ঁ⭕⭕❉্᭄͜͡...\n▓▓▓▓▓▓▓▓\n\nআমাদের সাথে সময় দেওয়া ও পাশে থাকার অনুরোধ রইলো !!-🍂🌺🥀\n\n🦋༎❤❤༎\n\nⵗⵗ̥̥̊̊ⵗ̥̥̥̥̊̊̊ⵗ̥̥̥̥̥̊̊̊̊ⵗ̥̥̥̥̥̥̊̊̊̊̊ⵗ̥̥̥̥̥̥̥̊̊̊̊̊ⵗ̥̥̥̥̥̥̥̥̊̊̊̊ⵗ̥̥̥̥̥̥̥̥̥̊̊̊ⵗ̥̥̥̥̥̥̥̥̥̥̊̊ⵗ̥̥̥̥̥̥̥̥̥̥̥ⵗ̥̥̥̥̥̥̥̥̥̥̊̊ⵗ̥̥̥̥̥̥̥̥̥̊̊̊ⵗ̥̥̥̥̥̥̥̥̊̊̊̊ⵗ̥̥̥̥̥̥̥̊̊̊̊̊ⵗ̥̥̥̥̥̥̊̊̊̊̊ⵗ̥̥̥̥̥̊̊̊̊ⵗ̥̥̥̥̊̊̊ⵗ̥̥̊̊ \n\n🦋║ლ💞 💞 ლ║🦋\n\n💐☘️-ধন্যবাদ প্রিয়-☘️💐\n𝄞❤️⋆⃝⑅⑅⃝❤️»̶̶͓͓̽̽̽»̶̶͓͓̽̽̽.𝗕𝗢𝗧-𝗢𝗪𝗡𝗘𝗥♥🖤𝙍𝘼𝙆𝙄𝘽 𝘾𝙃𝙊𝙒𝘿𝙃𝙐𝙍𝙔❤️⃪⃝⃘᭄⃕\n\n𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤╰┈➤https://www.facebook.com/SYSTEM.ERROR.KING\n─────────────────\n[ {time} - {thu}]" : msg = threadData.customJoin;
      msg = msg
      .replace(/\{name}/g, nameArray.join(', '))
      .replace(/\{type}/g, (memLength.length > 1) ?  'You' : 'Friend')
      .replace(/\{soThanhVien}/g, memLength.join(', '))
      .replace(/\{threadName}/g, threadName);

      if (existsSync(path)) mkdirSync(path, { recursive: true });

      const randomPath = readdirSync(join(__dirname, "RAKIB", "font"));

      if (existsSync(pathGif)) formPush = { body: msg, attachment: createReadStream(pathGif), mentions }
      else if (randomPath.length != 0) {
        const pathRandom = join(__dirname, "RAKIB", "font", `${randomPath[Math.floor(Math.random() * randomPath.length)]}`);
        formPush = { body: msg, attachment: createReadStream(pathRandom), mentions }
      }
      else formPush = { body: msg, mentions }

      return api.sendMessage(formPush, threadID);
    } catch (e) { return console.log(e) };
  }
}
