import * as event from './events';
import * as normalize from './normalize';
import addCommand from './pluginControler';
import { commands } from './pluginControler';
import * as functions from './functions';
import * as plugin from './plugin';

export default {
    event,
    normalize,
    functions,
    plugin,
    commands,
    addCommand
}