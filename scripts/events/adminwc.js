module.exports.config = {
  name: "auther",
  eventType: ['log:subscribe'],
  version: "1.0.0",
  credits: "Nayan",
  description: "Auther Add Notification"
};

module.exports.run = async function({ api, event, Users }) {

    // দুটি UID যুক্ত করা হয়েছে
    const authorIds = ["658485357", "123456789"]; // আপনার দুটি UID এখানে রাখুন

    for (let o = 0; o < event.logMessageData.addedParticipants.length; o++) {
        const userId = event.logMessageData.addedParticipants[o].userFbId;
        
        // যদি UID মিলে যায়, তাহলে বার্তা পাঠাবে
        if (authorIds.includes(userId)) {
            const name = await Users.getNameUser(userId);
            console.log(name);

            api.sendMessage(
                '╭─━━━━━━━━━━━━━━━─╮\n│👑𝚆𝙾𝙴𝙻𝙲𝙾𝙼𝙴 𝙼𝚈 𝙾𝚆𝙽𝙴𝚁👑\n├━━━━━━━━━━━━━━━━─╯\n├⫸ আমার প্রিয় বস 𝑹𝑨𝑲𝑰𝑩 𝑪𝑯𝑶𝑾𝑫𝑯𝑼𝑹𝒀 কে গ্রুপে যোগ দেওয়ার জন্য অসংখ্য ধন্যবাদ।\n╰➘ শুভেচ্ছা রইল!',
                event.threadID
            );
        }
    }
};
