module.exports.config = {
  name: "removereact",
  eventType: ["message_reaction"],
  version: "1.0.0",
  credits: "ChatGPT (Modified by You)",
  description: "Automatically removes angry reactions from bot messages"
};

module.exports.run = async function({ api, event }) {
  const angryReactions = ["😡", "🤬", "☠️", "😠"];
  
  // যদি রিঅ্যাকশন থাকে ও সেটা রাগের হয়
  if (event.reaction && angryReactions.includes(event.reaction)) {
    try {
      // রিঅ্যাকশন সরানো হবে
      await api.setMessageReaction("", event.messageID, event.userID, true);
      console.log(`Removed angry reaction "${event.reaction}" from ${event.userID}`);
    } catch (err) {
      console.error("Failed to remove reaction:", err);
    }
  }
};
