import config from './tsubasa-config.js';
import {createChatProvider} from './chat-provider.js';
import {mountChat} from './chat-widget.js?v=20261008-top';
mountChat(config,createChatProvider());
