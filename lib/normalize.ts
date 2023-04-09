import * as baileys from "@adiwajshing/baileys";
import * as typesEvent from '../types/event';
import * as typesSocket from '../types/socket';
import lib from ".";

export function parseCommand(input: string): { prefix: string, command: string, body: string, args: string[], flags: string[] } | null {
    const regex = /^([\/\\~.,;:]){1}(\w+)\s*(.*)$/;
    const matches = input.match(regex);
    if (!matches) return null
    const prefix = matches[1];
    const command = matches[2];
    const argsFlags = matches[3].split(/\s+/);
    const body = argsFlags.join(' ')
    const args: string[] = [];
    const flags: string[] = [];
    argsFlags.map(item => {
        if (item.startsWith('--')) flags.push(item)
        else args.push(item)
    })
    return { 
        prefix, 
        command,
        body, 
        args, 
        flags 
    };
  }
  

export const normalizeWAMessage = async (socket: typesSocket.WebSocketInfo, waMessage: baileys.WAMessage): Promise<typesEvent.normalizedWAMessage> => {
    const from = baileys.jidNormalizedUser(waMessage.key.remoteJid ? waMessage.key.remoteJid : waMessage.key.participant ? waMessage.key.participant : '');
    const fromMe = waMessage.key.fromMe ? waMessage.key.fromMe : false;
    const id = waMessage.key.id;
    const isBot = id?.startsWith("BAE5") && id?.length == 16;
    const isGroup = from.endsWith("@g.us");
    const sender = baileys.jidNormalizedUser( (fromMe && socket.user?.id) || waMessage.key.participant || from || "" );

    const type = baileys.getContentType(waMessage.message||undefined);
    const message = baileys.extractMessageContent(waMessage.message);
    const msg = type ? message?.[type] : message?.conversation

    const displayId = 
        message?.conversation?.toString() || 
        message?.imageMessage?.caption?.toString() || 
        message?.videoMessage?.caption?.toString() || 
        message?.extendedTextMessage?.text?.toString() ||
        message?.buttonsResponseMessage?.selectedButtonId?.toString() || 
        message?.listResponseMessage?.singleSelectReply?.selectedRowId?.toString() || 
        message?.templateButtonReplyMessage?.selectedId?.toString() ||
        message?.documentMessage?.caption?.toString() || 
        message?.documentWithCaptionMessage?.message?.documentMessage?.caption?.toString() ||
        message?.locationMessage?.name?.toString() ||
        message?.viewOnceMessage?.message?.imageMessage?.caption || 
        message?.viewOnceMessage?.message?.videoMessage?.caption || "" ;
    const displayText =
        message?.conversation?.toString() || 
        message?.imageMessage?.caption?.toString() || 
        message?.videoMessage?.caption?.toString() || 
        message?.extendedTextMessage?.text?.toString() ||
        message?.buttonsResponseMessage?.selectedDisplayText?.toString() || 
        message?.listResponseMessage?.title?.toString() || 
        message?.templateButtonReplyMessage?.selectedDisplayText?.toString() ||
        message?.buttonsMessage?.contentText?.toString() ||
        message?.listMessage?.description?.toString() ||
        message?.documentMessage?.caption?.toString() || 
        message?.documentWithCaptionMessage?.message?.documentMessage?.caption?.toString() ||
        message?.locationMessage?.name?.toString() ||
        message?.viewOnceMessage?.message?.imageMessage?.caption || 
        message?.viewOnceMessage?.message?.videoMessage?.caption || "";

    let convertedObject = parseCommand(displayId)

    const reply = async (content: import("@adiwajshing/baileys/lib/Types").AnyMessageContent): Promise<import("@adiwajshing/baileys/lib/Types").WAProto.WebMessageInfo | undefined> => {
        return await socket.sendMessage(from, content, { quoted: waMessage })
    }
    const textReply = async (content: import("@adiwajshing/baileys/lib/Types").AnyMessageContent): Promise<import("@adiwajshing/baileys/lib/Types").WAProto.WebMessageInfo | undefined> => {
        return await lib.functions.sendMessageWithTyping(socket, from, content, { quoted: waMessage })
    }
    const AudioReply = async (content: import("@adiwajshing/baileys/lib/Types").AnyMessageContent): Promise<import("@adiwajshing/baileys/lib/Types").WAProto.WebMessageInfo | undefined> => {
        return await lib.functions.sendMessageWithRecording(socket, from, content, { quoted: waMessage })
    }

    return {
        status: waMessage.status, //
        pushName: waMessage.pushName || waMessage.verifiedBizName, //
        waMessage, //
        from, //
        fromMe, //
        id, //
        isBot, //
        isGroup, //
        sender, //
        type, //
        msg, //
        displayText, //
        displayId, //
        isCommand: !(convertedObject == null),
        ...convertedObject,
        sendMessageWithRecording: lib.functions.sendMessageWithRecording,
        sendMessageWithTyping: lib.functions.sendMessageWithTyping,
        textReply,
        AudioReply,
        reply
    }
}