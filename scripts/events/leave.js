module.exports.config = {
  name: "leave",
  eventType: ["log:unsubscribe"],
  version: "1.0.0",
  credits: "Rakib",
  description: "Thông báo bot hoặc người rời khỏi nhóm",
  dependencies: {
    "fs-extra": "",
    "path": ""
  }
};

module.exports.run = async function({ api, event, Users, Threads }) {
  if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) return;

  const { createReadStream, existsSync, mkdirSync } = global.nodemodule["fs-extra"];
  const { join } = global.nodemodule["path"];
  const { threadID } = event;

  const data = global.data.threadData.get(parseInt(threadID)) || (await Threads.getData(threadID)).data;
  const name = global.data.userName.get(event.logMessageData.leftParticipantFbId) || await Users.getNameUser(event.logMessageData.leftParticipantFbId);
  
  const isSelfLeave = (event.author == event.logMessageData.leftParticipantFbId);
  const type = isSelfLeave
    ? "  তোর সাহস কম নয় এখানে 𝚁𝙰𝙺𝙸𝙱-𝙱𝙾𝚃-𝟎𝟎𝟕 থাকতে তুই লিভ নিস😡😠🤬 \n✢━━━━━━━━━━━━━━━✢\n ----❖----- 𝚁𝙰𝙺𝙸𝙱 -----❖----"
    : "তোমার এই গ্রুপে থাকার কোনো যোগ্যাতা নেই আবাল😡।\nতাই তোমার লাথি মেরে গ্রুপ থেকে বের করে দেওয়া হলো🤪। WELLCOME REMOVE🤧 \n✢━━━━━━━━━━━━━━━✢\n ----❖----- 𝚁𝙰𝙺𝙸𝙵 -----❖----";

  const path = join(__dirname, "RAKIB", "leaveGif");
  const gifFile = isSelfLeave ? "leave1.gif" : "leave2.gif";
  const gifPath = join(path, gifFile);

  if (!existsSync(path)) mkdirSync(path, { recursive: true });

  let msg = typeof data.customLeave == "undefined" ? "ইস {name} {type} " : data.customLeave;
  msg = msg.replace(/\{name}/g, name).replace(/\{type}/g, type);

  const formPush = existsSync(gifPath)
    ? { body: msg, attachment: createReadStream(gifPath) }
    : { body: msg };

  return api.sendMessage(formPush, threadID);
}
