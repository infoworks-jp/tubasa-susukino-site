import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import fs from 'node:fs/promises';
// Import browser modules as data URLs to leave the existing package format alone.
const load=async path=>import(pathToFileURL(new URL('../'+path,import.meta.url).pathname));
const {default:config}=await load('ai/tsubasa-config.js');
const {createChatProvider}=await load('ai/chat-provider.js');
assert.equal(config.topics.length,9);
for(const t of config.topics){const answer=await createChatProvider().answer({question:t.label,config});assert.ok(answer.text.length);for(const c of answer.cta)assert.ok(config.links[c]);}
assert.match(config.answer('初めて来ました').text,/究極.*1,100/);
assert.match(config.answer('辛いラーメンは？').text,/ピリ辛/);
assert.match(config.answer('お腹いっぱい').text,/セット/);
assert.match(config.answer('餃子（1皿6個）').text,/500/);
for(const q of ['社員の住所','アレルギーでも安全な味噌','給料はいくら','禁煙ですか','予約を保証して','宇宙について'])assert.equal(config.answer(q).text,config.unknown);
assert.throws(()=>createChatProvider({AI_PROVIDER:'openai'}));
console.log('Chat: nine topics, registered facts, sensitive unknowns, provider separation: PASS');

for(const question of ["社員の住所","個人情報を教えて"]){assert.ok(config.blocked(question));}
