import * as baileys from "@adiwajshing/baileys";
import chalk from "chalk";
import { Boom } from "@hapi/boom";
import fs from 'fs';
import path from "path";
import lib from '.'
import * as typesEvent from '../types/event'
import * as typesSocket from '../types/socket'
import * as typesPlugin from '../types/plugin'
import { BotConnet } from "..";

export const presenceUpdate = (arg: typesEvent.presenceUpdate) => {
  let presences = arg.presences[Object.keys(arg.presences)[0]];
  console.log(
    chalk.red(new Date().toLocaleString("EN", { timeZone: "Asia/Colombo" })),
    chalk.blue(arg.id + ": ") +
      chalk.magenta(
        presences.lastKnownPresence
          ? presences.lastKnownPresence
          : presences.lastSeen ? new Date(presences.lastSeen) : presences.lastSeen
      ),
    presences.lastSeen ? ":" : "",
    chalk.magentaBright(presences.lastSeen ? new Date(presences.lastSeen) : "")
  );
};

export const connectionUpdate = async (socket: typesSocket.WebSocketInfo) => {
  const baileys_V = await baileys.fetchLatestBaileysVersion();
  return async (arg: Partial<baileys.ConnectionState>) => {
    if (arg.connection == "connecting")
      console.log(chalk.yellow("👩 Connecting to WhatsApp...▶"));
    else if (arg.connection == "open") {
      fs.readdirSync("./temp").forEach((file) => {
        fs.unlinkSync(`./plugins/${file}`);
      });
      console.log(
        chalk.green(
          `👩 Login successful! ▶\n  Baileys ${
            baileys_V.isLatest ? "latest version " : "not latest version "
          }`,
          baileys_V.version.join(".")
        )
      );
    } else if (arg.connection == "close") {
      let reason = new Boom(arg.lastDisconnect?.error)?.output.statusCode;
      if (reason === baileys.DisconnectReason.badSession) {
        console.log(
          chalk.red(`💥 Bad Session File, Please Delete Session and Scan Again`)
        );
        socket.logout();
      } else if (reason === baileys.DisconnectReason.connectionClosed) {
        console.log(chalk.red("💥 Connection closed, reconnecting...."));
        baileys.delay(10 * 1000);
        await BotConnet();
      } else if (reason === baileys.DisconnectReason.connectionLost) {
        console.log(
          chalk.red("💥 Connection Lost from Server, reconnecting...")
        );
        baileys.delay(10 * 1000);
        await BotConnet();
      } else if (reason === baileys.DisconnectReason.connectionReplaced) {
        console.log(
          chalk.red(
            "💥 Connection Replaced, Another New Session Opened, Please Close Current Session First"
          )
        );
        socket.logout();
      } else if (reason === baileys.DisconnectReason.loggedOut) {
        console.log(
          chalk.red(`💥 Device Logged Out, Please Scan Again And Run.`)
        );
        await BotConnet();
      } else if (reason === baileys.DisconnectReason.restartRequired) {
        console.log(chalk.red("💥 Restart Required."));
        baileys.delay(5000);
        console.log(chalk.red("💥 Restarting..."));
        await BotConnet();
      } else if (reason === baileys.DisconnectReason.timedOut) {
        console.log(chalk.red("💥 Connection TimedOut, Reconnecting..."));
        await BotConnet();
      } else
        console.log(
          chalk.red(
            `💥 Unknown DisconnectReason: ${reason}|${arg.connection}`
          )
        );
    } else if (arg.isOnline === true) console.log(chalk.blue("👩 Online."));
    else if (arg.isOnline === false) console.log(chalk.red("👩 Offine."));
    else if (arg.receivedPendingNotifications === true)
      console.log(chalk.blue("👩 Received Pending Notifications."));
    else if (arg.receivedPendingNotifications === false)
      console.log(chalk.red("👩 Not Received Pending Notifications."));
    else if (arg.isNewLogin === true)
      console.log(chalk.blue("👩 New Login."));
    else if (arg.isNewLogin === false)
      console.log(chalk.red("👩 Not New Login."));
    else if (arg.qr)
      console.log(chalk.magenta("Qr: "), chalk.magentaBright(arg.qr));
    else console.log("👩 Connection...", arg);
  };
}

export const messagingHistorySet = async (arg: typesEvent.messagingHistorySet) => {
  console.log(chalk.blue("Setting up messaging history...."));
  const pathMessagingHistory = path.join(__dirname, '..', 'database', 'json', 'messagingHistory.json');
  fs.writeFileSync(pathMessagingHistory, JSON.stringify(arg), { encoding: 'utf-8' })
  console.log(chalk.green("Seted up messaging history."));
};

export const blockListSet = async (arg:{ blocklist:string[]}) => {
  console.log(chalk.blue("Setting up block list...."));
  const pathMessagingHistory = path.join(__dirname, '..', 'database', 'json', 'blockListSet.json');
  fs.writeFileSync(pathMessagingHistory, JSON.stringify(arg), { encoding: 'utf-8' })
  console.log(chalk.green("Seted up block list."));
};

export async function messagesUpsert(socket: typesSocket.WebSocketInfo, commands: typesPlugin.pluginControlerOutputOptions[]) {
  return async (args: typesEvent.messagesUpsert) => {
    let message = args.messages[0];
    message.messageStubType ? console.log(chalk.blueBright(typesEvent.messageStubTypeList[message.messageStubType])) : ''
    if (message.key?.id?.startsWith("BAE5") && message.key?.id?.length == 16) return;
    if (!message.message || (message.key && message.key.remoteJid == "status@broadcast")) {
      message.messageStubType ? '' : console.log(chalk.cyan('Status :'), JSON.stringify(message));
      return;
    }
    if (args.type == 'append') {
      console.log(chalk.cyan('Append: '), JSON.stringify(message));
    } else if (!message.message) {
      console.log(chalk.cyan('Without message: '), JSON.stringify(message))
    } else {
      let normalizedWAMessage = await lib.normalize.normalizeWAMessage(socket, message);
      // console.log(normalizedWAMessage);
      lib.functions.messagesUpsertLogger(normalizedWAMessage);
      commands.map(async item => {
        item.commands.map(async i => {
          if ((i == normalizedWAMessage.command)) {
            try {
              await item.function(normalizedWAMessage, socket);
            } catch (error) {
              normalizedWAMessage.reply({ text: `*Somthing went wrong.*` })
              console.log(error);
              console.log(chalk.red(error));
            }
          }
        })
      })
    }
  };
}