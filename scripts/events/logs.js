module.exports.config = {
	name: "logs",
	eventType: ["log:unsubscribe","log:subscribe","log:thread-name"],
	version: "1.0.0",
	credits: "ryuko",
	description: "record bot activity notifications",
    envConfig: {
        enable: true
    }
};

module.exports.run = async function({ api, event, Threads }) {
    const logger = require("../../Rakib/catalogs/Rakibc.js");
    if (!global.configModule[this.config.name].enable) return;
    var formReport =  "system bot notification for operator" +
                        "\n\nthread id : " + event.threadID +
                        "\naction : {task}" +
                        "\nuser id : " + event.author +
                        "\ndate : " + Date.now() +" ",
        task = "";
    switch (event.logMessageType) {
        case "log:thread-name": {
            const oldName = (await Threads.getData(event.threadID)).name || "this name cannot find on botdata",
                    newName = event.logMessageData.name || "this name cannot find on botdata";
            task = "member changed the group namefrom : '" + oldName + "' to '" + newName + "'";
            await Threads.setData(event.threadID, {name: newName});
            break;
        }
        case "log:subscribe": {
            if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) task = "user added the bot to a new group";
            break;
        }
        case "log:unsubscribe": {
            if (event.logMessageData.leftParticipantFbId== api.getCurrentUserID()) task = "user kicked the bot out of the group"
            break;
        }
        default: 
            break;
    }

    if (task.length == 0) return;

    formReport = formReport
    .replace(/\{task}/g, task);

    return api.sendMessage(formReport, global.config.ADMINBOT[0], (error, info) => {
        if (error) return logger("", "");
    });
  return api.sendMessage(formReport, global.config.ADMINBOT[0]);
}

