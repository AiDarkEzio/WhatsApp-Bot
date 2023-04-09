import * as typesPlugin from  "../types/plugin"
import * as typesEvent from '../types/event'
import * as typesSocket from '../types/socket'

let commands: typesPlugin.pluginControlerOutputOptions[] = []
export default async function addCommand (opts: typesPlugin.pluginControlerInputoptions, func: (message: typesEvent.normalizedWAMessage, socket: typesSocket.WebSocketInfo ) => Promise<void>) {
var infos = {
    commands: opts["commands"] === undefined ? [] : opts["commands"],
    category: opts["category"] === undefined ? ["all"] : opts["category"],
    fromMe: opts["fromMe"] === undefined ? true : opts["fromMe"],
    onlyGroup: opts["onlyGroup"] === undefined ? false : opts["onlyGroup"],
    sucReact: opts["sucReact"] === undefined ? "💖" : opts["sucReact"],
    onlyPm: opts["onlyPm"] === undefined ? false : opts["onlyPm"],
    deleteCommand: opts["deleteCommand"] === undefined ? false : opts["deleteCommand"],
    desc: opts["desc"] === undefined ? "" : opts["desc"],
    dontAddCommandList: opts["dontAddCommandList"] === undefined ? false : opts["dontAddCommandList"],
    function: func,
  };
  commands.push(infos)
  return infos;
}

export { commands }

