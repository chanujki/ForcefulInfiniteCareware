//File created by Mohammad Nayan and fully coded by Nayan

const axios = require('axios');

module.exports = {
  config: {
        name: "bot",

    version: "1.0.0",

    hasPermssion: 0,

    credits: "Rakib",

    description: "better than all Sim simi",

    usePrefix: true,

    prefix: "awto",

    category: "user",

    commandCategory: "ChatBots",

    cooldowns: 5,
  },

  handleReply: async function ({ api, event, handleReply }) {
    try {
      const response = await axios.get(`http://65.109.80.126:20392/sim?type=ask&ask=${encodeURIComponent(event.body)}`);
      console.log(response.data);
      const result = response.data.data.msg;

      
      api.sendMessage(result, event.threadID, (error, info) => {
        if (error) {
          console.error('Error replying to user:', error);
          return api.sendMessage('An error occurred while processing your request. Please try again later.', event.threadID, event.messageID);
        }
        global.client.handleReply.push({
          type: 'reply',
          name: this.config.name,
          messageID: info.messageID,
          author: event.senderID,
          head: event.body
        });
      }, event.messageID);

    } catch (error) {
      console.error('Error in handleReply:', error);
      api.sendMessage('An error occurred while processing your request. Please try again later.', event.threadID, event.messageID);
    }
  },


  
  run: async function ({ api, event, args, Users }) {
    try {
      const msg = args.join(" ");
      if (!msg) {
        var tl = ["Hum Baby Bolo🐱"]
        var name = await Users.getNameUser(event.senderID);
        var rand = tl[Math.floor(Math.random() * tl.length)]
        return api.sendMessage({ 
              body: `${name}, ${rand}`, 
              mentions: [{ tag: name, id: event.senderID }] }, event.threadID, (error, info) => {
          if (error) {
            return api.sendMessage('An error occurred while processing your request. Please try again later.', event.threadID, event.messageID);
          }

          global.client.handleReply.push({
            type: 'reply',
            name: this.config.name,
            messageID: info.messageID,
            author: event.senderID,
            head: msg,
          });
        }, event.messageID);
    }

      const response = await axios.get(`http://65.109.80.126:20392/sim?type=ask&ask=${encodeURIComponent(msg)}`);
      console.log(response.data);
      const replyMessage = response.data.data.msg;

      api.sendMessage({ body: replyMessage }, event.threadID, (error, info) => {
        if (error) {
          return api.sendMessage('An error occurred while processing your request. Please try again later.', event.threadID, event.messageID);
        }

        global.client.handleReply.push({
          type: 'reply',
          name: this.config.name,
          messageID: info.messageID,
          author: event.senderID,
          head: msg,
        });
      }, event.messageID);

    } catch (error) {
      console.log(error)
      api.sendMessage('An error has occurred, please try again later.', event.threadID, event.messageID);
    }
  }
};
