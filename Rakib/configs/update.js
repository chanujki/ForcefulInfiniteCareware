module.exports = {
  name: "update",
  execute: async function({ message }) {
    return message.reply(`
📢 Bot Updated!

✅ Version: 4.1.0
🆕 নতুন ফিচার:
- song কমান্ড
- প্রোফাইল কিরিটি
- UI উন্নত করা হয়েছে
`);
  }
};
