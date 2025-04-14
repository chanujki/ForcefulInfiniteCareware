module.exports.config = {
  name: "info",
  version: "1.0.0",
  permission: 0,
  credits: "Emon",
  prefix: 'awto',
  description: "Admin Information",
  category: "admin",
  usages: "info",
  cooldowns: 5,
  dependencies: 
{
  "request":"",
  "fs-extra":"",
  "axios":""
}
};
module.exports.run = async function({ api,event,args,client,Users,Threads,__GLOBAL,Currencies }) {
const axios = global.nodemodule["axios"];
const request = global.nodemodule["request"];
const fs = global.nodemodule["fs-extra"];
const time = process.uptime(),
  hours = Math.floor(time / (60 * 60)),
  minutes = Math.floor((time % (60 * 60)) / 60),
  seconds = Math.floor(time % 60);
const moment = require("moment-timezone");
var juswa = moment.tz("Asia/Dhaka").format("『D/MM/YYYY』 【hh:mm:ss】");

var callback = () => api.sendMessage({body:` আসালামু আলাইকুম..!! তোমার কিছু বললার থাকলে। আমায় বলতে পারো⭐
--------------------------------------------

FACEBOOK :  Rakib Chowdhury 

GENDER : Male

Age : 19+

Relationship : Single,🥹

Work : Student

FACEBOOK LINK : https://www.facebook.com/SYSTEM.ERROR.KING

WhatsApp 
wa.me/+8801771306867

TELEGRAM : আ্ঁম্মু্ঁ এ্ঁগু্ঁলা্ঁ চা্ঁলা্ঁতে্ঁ মা্ঁনা্ঁ ক্ঁরে্ঁছে্ঁ🐰💦

Mail : আ্ঁব্বু্ঁ ব্ঁলে্ঁছে্ঁ জি্ঁমে্ঁল্ঁ দি্ঁলে্ঁ বি্ঁয়া্ঁ ক্ঁরা্ঁবে্ঁ না্ঁহ্ঁ🐰💦

➟ UPTIME

TODAY IS TIME : ${juswa} 

BOT IS RUNNING ${hours}:${minutes}:${seconds}.

THANKS FOR USING ${global.config.BOTNAME} 『🫰😐』`,attachment: fs.createReadStream(__dirname + "/Rakib/info.jpeg")}, event.threadID, () => 
  fs.unlinkSync(__dirname + "/Rakib/info.jpeg"));  
    return request(encodeURI(`https://i.imgur.com/0eUDMI7.jpeg`)).pipe(
fs.createWriteStream(__dirname+'/Rakib/info.jpeg')).on('close',() => callback());
 };

