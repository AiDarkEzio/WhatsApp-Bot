import * as deMainFunc from '@aidarkezio/main-func'
import fs from 'fs';
import lib from "../lib";

const optsMp4 = lib.functions.optsCreater(['ytpm4', 'video'], [], [], undefined)
const optsPm3 = lib.functions.optsCreater(['ytpm3', 'song'], [], [], undefined)

lib.addCommand(optsPm3, async (message, socket) => {
    if (!message.body) { 
       await message.textReply({ text: `*Plz enter url or text.*` })
       return;
    }
    await message.textReply({ text: `*Wait, I'm searching...*` })
    let prompt:string|undefined = undefined;
    if ((message.args) && (deMainFunc.Bot.isUrl(message.args?.[0]))) prompt = message.args[0];
    else prompt = message.body;
    if (!prompt) {
        await message.textReply({ text: "Sorry I didn't found your url or text." })
        return;
    }
    const data = await lib.plugin.downloadVideoFromYouTube(prompt,{ isAudio: true })
    if (!data.audioPath) {
        await message.textReply({ text: "Sorry I didn't found your song." })
        return
    }
    const reply = await message.textReply({ text: `*I'm sending it for you...*` })
    await socket.sendMessage(
        message.from,{ 
            document: { stream: fs.createReadStream(data.audioPath) },
            caption: data.metadata.author.name,
            mimetype: 'mp3',
            seconds: data.metadata.duration.seconds,
            mentions: [message.from] 
        }, { quoted: reply })
})

lib.addCommand(optsMp4, async (message, socket) => {
    if (!message.body) { 
       await message.textReply({ text: `*Plz enter url or text.*` })
       return;
    }
    await message.textReply({ text: `*Wait, I'm searching...*` })
    let prompt:string|undefined = undefined;
    if ((message.args) && (deMainFunc.Bot.isUrl(message.args?.[0]))) prompt = message.args[0];
    else prompt = message.body;
    if (!prompt) {
        await message.textReply({ text: "Sorry I didn't found your url or text." })
        return;
    }
    const data = await lib.plugin.downloadVideoFromYouTube(prompt,{ isAudio: true })
    if (!data.videoPath) {
        await message.textReply({ text: "Sorry I didn't found your video." })
        return
    }
    const reply = await message.textReply({ text: `*I'm sending it for you...*` })
    await socket.sendMessage(
        message.from,{ 
            video: { stream: fs.createReadStream(data.videoPath) },
            caption: data.metadata.author.name,
            mentions: [message.from] 
        }, { quoted: reply })
})