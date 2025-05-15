const axios = global.nodemodule["axios"];

module.exports.config = {
  name: "upload",
  version: "1.0.1",
  aliases: ["upl", "uploadmedia"],
  permission: 0,
  credits: "Nayan",
  description: "Upload media to Imgur, Google Drive, or ImgBB",
  prefix: true,
  category: "media",
  usages: "/upload (reply to image or video)",
  cooldowns: 5,
  dependencies: {
    axios: ""
  }
};

module.exports.run = async ({ api, event }) => {
  const attachment = event.messageReply?.attachments?.[0];
  if (!attachment || !attachment.url) {
    return api.sendMessage("❌ Please reply to an image or video to upload.", event.threadID, event.messageID);
  }

  const mediaUrl = attachment.url;

  const menu = `⚙️ Choose upload method:
1️⃣ Imgur
2️⃣ Google Drive
3️⃣ ImgBB

Reply with the number of your choice.`;

  return api.sendMessage(menu, event.threadID, (err, info) => {
    global.client.handleReply.push({
      name: this.config.name,
      messageID: info.messageID,
      author: event.senderID,
      url: mediaUrl,
      type: attachment.type,
    });
  }, event.messageID);
};

module.exports.handleReply = async ({ api, event, handleReply }) => {
  if (event.senderID !== handleReply.author) return;

  const mediaUrl = handleReply.url;
  const fileType = handleReply.type;
  const encodedUrl = encodeURIComponent(mediaUrl);

  try {
    let label = "";
    let resultUrl = "";

    switch (event.body.trim()) {
      case "1":
        label = "Imgur";
        const imgurApi = await axios.get("https://raw.githubusercontent.com/MOHAMMAD-NAYAN-07/Nayan/main/api.json");
        const imgurRes = await axios.get(`${imgurApi.data.api}/imgur?url=${encodedUrl}`);
        resultUrl = imgurRes.data?.link;
        break;

      case "2":
        label = "Google Drive";
        const driveApi = await axios.get("https://raw.githubusercontent.com/MOHAMMAD-NAYAN-07/Nayan/main/api.json");
        const driveRes = await axios.get(`${driveApi.data.api}/drive?type=upload&url=${encodedUrl}`);
        resultUrl = driveRes.data?.downloadURL;
        break;

      case "3":
        label = "ImgBB";
        if (fileType !== "photo") {
          return api.sendMessage("❌ ImgBB only supports image uploads (jpg, png, gif).", event.threadID, event.messageID);
        }
        const imgbbApi = await axios.get("https://raw.githubusercontent.com/MOHAMMAD-NAYAN-07/Nayan/main/api.json");
        const imgbbRes = await axios.get(`${imgbbApi.data.api}/imgbb?imageUrl=${encodedUrl}`)
        resultUrl = imgbbRes.data?.url;
        break;

      default:
        return api.sendMessage("❌ Invalid option. Please reply with 1, 2, or 3.", event.threadID, event.messageID);
    }

    if (!resultUrl) return api.sendMessage(`❌ Upload to ${label} failed.`, event.threadID, event.messageID);

    return api.sendMessage(`✅ Uploaded to ${label}:\n${resultUrl}`, event.threadID, event.messageID);
  } catch (err) {
    console.error(err);
    return api.sendMessage("❌ An error occurred during upload.", event.threadID, event.messageID);
  }
};
