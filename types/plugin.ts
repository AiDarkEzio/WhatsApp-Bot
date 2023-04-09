import * as typesEvent from './event'
import * as typesSocket from './socket'

export interface pluginControlerInputoptions {
    commands: string[] ;
    sucReact: string;
    category: string[]
    fromMe: boolean;
    onlyGroup: boolean;
    onlyPm: boolean;
    deleteCommand: boolean;
    desc: string;
    dontAddCommandList: boolean;
}

export interface pluginControlerOutputOptions {
    commands: string[];
    sucReact: string;
    category: string[]
    fromMe: boolean;
    onlyGroup: boolean;
    onlyPm: boolean;
    deleteCommand: boolean;
    desc: string;
    dontAddCommandList: boolean;
    function: (message: typesEvent.normalizedWAMessage, socket: typesSocket.WebSocketInfo ) => Promise<void>
}