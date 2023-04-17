import * as baileys from "@adiwajshing/baileys";
import chalk from 'chalk';
import language from '../database/ts/language/EN'
import * as typesEvent from '../types/event'
import * as typesSocket from '../types/socket'
import * as typesPlugin from '../types/plugin'

export function getRandomItemFromArray<T>(arr: T[]): T | undefined {
    if (arr.length === 0) return undefined;
    return arr[Math.floor(Math.random() * arr.length)];
}
  

export const optsCreater = (commands: string[], booleans: ('FM'|'OG'|"OP"|'DC'|"DAC")[], category: string[]= ['all'], sucReact:string|undefined=undefined, desc: string = ''): typesPlugin.pluginControlerInputoptions => {
    const react = getRandomItemFromArray(language.STRINGS.react.SUCCESS)
    let boolean = {
        fromMe: false,
        onlyGroup: false,
        onlyPm: false,
        deleteCommand: false,
        dontAddCommandList: false,
    }
    if (!(category.includes('all'))) category.push('all');
    if (booleans.includes('FM')) boolean.fromMe = true;
    if (booleans.includes('OG')) boolean.onlyGroup = true;
    if (booleans.includes('OP')) boolean.onlyPm = true;
    if (booleans.includes('DC')) boolean.deleteCommand = true;
    if (booleans.includes('DAC')) boolean.dontAddCommandList = true;
    return {
        commands,
        sucReact: sucReact ? sucReact : react ? react : '✔',
        category,
        desc,
        ...boolean
    }
}

export const messagesUpsertLogger = (message: typesEvent.normalizedWAMessage): void => {
    if (message.isGroup) {
        console.log(
            chalk.green('G>', new Date, message.from, message.pushName?message.pushName:message.sender, message.type, ':'), message.displayText
         )
    } else {
        console.log(
           chalk.green('P>', new Date, message.pushName?message.pushName:message.from,message.type, ':'), message.displayText
        )
    }
}

export const sendMessageWithTyping = async (
  socket: typesSocket.WebSocketInfo,
  jid: string,
  content: baileys.AnyMessageContent,
  options: baileys.MiscMessageGenerationOptions = {}
) => {
  await socket.presenceSubscribe(jid);
  await baileys.delay(500);

  await socket.sendPresenceUpdate("composing", jid);
  await baileys.delay(2500);

  await socket.sendPresenceUpdate("paused", jid);

  return await socket.sendMessage(jid, content, options);
};

export const sendMessageWithRecording = async (
    socket: typesSocket.WebSocketInfo,
    jid: string,
    content: baileys.AnyMessageContent,
    options: baileys.MiscMessageGenerationOptions = {}
) => {
  await socket.presenceSubscribe(jid);
  await baileys.delay(500);

  await socket.sendPresenceUpdate("recording", jid);
  await baileys.delay(2500);

  await socket.sendPresenceUpdate("paused", jid);
  
  return await socket.sendMessage(jid, content, options);
};

export function customFilter<T>(arr: T[], callbackfn: (value: T, index: number, array: T[]) => boolean): T[] {
    const result: T[] = [];
  
    for (let i = 0; i < arr.length; i++) {
      const element = arr[i];
      if (callbackfn(element, i, arr)) {
        result.push(element);
      }
    }
  
    return result;
  }
  