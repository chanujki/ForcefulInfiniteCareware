module.exports.config = {
    name: "out",
    version: "1.0.0",
    permission: 2,
    credits: "Rakib",
    description: "Leave the group",
    prefix: "noprefix",
    category: "Admin",
    usages: "out [id]",
    cooldowns: 10,
};

module.exports.run = async function({ api, event, args }) {
        if (!args[0]) return api.removeUserFromGroup(api.getCurrentUserID(), event.threadID);
        if (!isNaN(args[0])) return api.removeUserFromGroup(api.getCurrentUserID(), args.join(" "));
}
