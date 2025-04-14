module.exports.config = {
  name: "prefix",
  version: "1.0.0",
  permission: 0,
  credits: "ryuko",
  prefix: true,
  description: "guide",
  category: "system",
  premium: false,
  usages: "",
  cooldowns: 5,
};

module.exports.handleEvent = async ({ event, api, Threads }) => {
  var { threadID, messageID, body, senderID } = event;
  function out(data) {
    api.sendMessage(data, threadID, messageID)
  }
  var dataThread = (await Threads.getData(threadID));
  var data = dataThread.data; 
  const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};

  var arr = ["mpre","mprefix","prefix", "command mark", "What is the prefix of the bot?","PREFIX"];
  arr.forEach(i => {
    let str = i[0].toUpperCase() + i.slice(1);
    if (body === i.toUpperCase() | body === i | str === body) {
		const prefix = threadSetting.PREFIX || global.config.PREFIX;
      if (config.PREFIX == null) {
        return out(`╔══≪❈𝐏𝐫𝐞𝐟𝐢𝐱 𝐄𝐯𝐞𝐧𝐭❈≫══╗\n║𝐑𝐎𝐁𝐎𝐓 𝐏𝐑𝐄𝐅𝐈𝐗 ➠ ｢ ${global.config.PREFIX} ｣  ║\n║𝐑𝐎𝐁𝐎𝐓 𝐂𝐌𝐃➢ ｢ ${client.commands.size} ｣   ║\n╚══≪❈ 𝐑𝐚𝐤𝐢𝐛-𝐁𝐨𝐭 ❈≫══╝\n𝐂𝐫𝐞𝐚𝐭𝐨𝐫\n➥𝚁𝙰𝙺𝙸𝙱 𝙲𝙷𝙾𝚆𝙳𝙷𝚄𝚁𝚄`)
      }
      else return out(`╔══≪❈𝐏𝐫𝐞𝐟𝐢𝐱 𝐄𝐯𝐞𝐧𝐭❈≫══╗\n║𝐑𝐎𝐁𝐎𝐓 𝐏𝐑𝐄𝐅𝐈𝐗 ➠ ｢ ${global.config.PREFIX} ｣  ║\n║𝐑𝐎𝐁𝐎𝐓 𝐂𝐌𝐃➢ ｢ ${client.commands.size} ｣   ║\n╚══≪❈ 𝐑𝐚𝐤𝐢𝐛-𝐁𝐨𝐭 ❈≫══╝\n𝐂𝐫𝐞𝐚𝐭𝐨𝐫\n➥𝚁𝙰𝙺𝙸𝙱 𝙲𝙷𝙾𝚆𝙳𝙷𝚄𝚁𝚄`)
    }

  });
};

module.exports.run = async({ event, api }) => {
    return api.sendMessage("no prefix commands", event.threadID)
}
