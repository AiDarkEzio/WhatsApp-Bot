/* ═══════════════════════════════════════════════════════ //
=> If you want to recode, reupload,
=> or copy the codes/script,
=> pls give credit,
=> no credit? i will take action immediately.
==> Copyright (C) 2023 Subadra Poshitha.
==> Licensed under the  MIT License;
===> you may not use this file except in compliance with the License.
=> Thank you to Lord Buddha, Family and Myself.
=> WhatsApp Bot - Dark_Ezio.
// ════════════════════════════ */

import WA_Baileys_WebConnet from "@adiwajshing/baileys";
import * as baileys from "@adiwajshing/baileys";
import lib from './lib';
import chalk  from "chalk";
import pino from "pino";
import fs from 'fs';
import path from "path";

const logger = pino({ level: "silent" });

fs.readdirSync("./plugins").forEach((file) => {
  if (path.extname(file).toLowerCase() == ".js") require(`./plugins/${file}`);
});

export const BotConnet = async (): Promise<Object> => {
    console.log(chalk.blue("Starting WhatsApp Bot..."));
    baileys.delay(5_000);
    const authState = await baileys.useMultiFileAuthState("./auth");
    const baileys_V =  await baileys.fetchLatestBaileysVersion();

    const socket = WA_Baileys_WebConnet({
      markOnlineOnConnect: true,
      retryRequestDelayMs: 1000,
      printQRInTerminal: true,
      browser: ["Ai Dark Ezio", "Safari", "1.0.0"],
      logger,
      version: baileys_V.version,
      waWebSocketUrl: "wss://web.whatsapp.com/ws/chat",
      connectTimeoutMs: 20_000,
      keepAliveIntervalMs: 15_000,
      emitOwnEvents: true,
      defaultQueryTimeoutMs: 60_000,
      customUploadHosts: [],
      fireInitQueries: true,
      syncFullHistory: false,
      linkPreviewImageThumbnailWidth: 192,
      transactionOpts: { 
        maxCommitRetries: 10, 
        delayBetweenTriesMs: 3_000 
      },
      getMessage: async () => undefined,
      auth: authState.state,
    });

    socket.ev.on("creds.update", authState.saveCreds);

    socket.ev.on("connection.update", await lib.event.connectionUpdate(socket));

    socket.ev.on("presence.update", lib.event.presenceUpdate);

    socket.ev.on("messaging-history.set", lib.event.messagingHistorySet);

    socket.ev.on('blocklist.set', lib.event.blockListSet)

    socket.ev.on("messages.upsert", await lib.event.messagesUpsert(socket, lib.commands));

    return socket;
}

BotConnet();