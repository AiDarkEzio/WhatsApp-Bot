import lib from "../lib";

const opts = lib.functions.optsCreater(['alive'], [], undefined, undefined, undefined)

lib.addCommand(opts, async (message) => {
    message.textReply({ text: `*Yeh I'm alive ${message.pushName?message.pushName:'friend'}.*` })
})