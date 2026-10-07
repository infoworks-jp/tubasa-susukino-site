import config from './tsubasa-config.js';
import {createChatProvider} from './chat-provider.js';
import {mountChat} from './chat-widget.js';
mountChat(config,createChatProvider());
