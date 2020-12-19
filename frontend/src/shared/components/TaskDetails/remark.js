import visit from 'unist-util-visit';
import emoji from 'node-emoji';
import emoticon from 'emoticon';
import { Emoji } from 'emoji-mart';
import React from 'react';

import ReactDOMServer from 'react-dom/server';

const RE_EMOJI = /:\+1:|:-1:|:[\w-]+:/g;
const RE_SHORT = /[$@|*'",;.=:\-)([\]\\/<>038BOopPsSdDxXzZ]{2,5}/g;

const DEFAULT_SETTINGS = {
  padSpaceAfter: false,
  emoticon: false,
};

function plugin(options) {
  const settings = Object.assign({}, DEFAULT_SETTINGS, options);
  const pad = !!settings.padSpaceAfter;
  const emoticonEnable = !!settings.emoticon;

  function getEmojiByShortCode(match) {
    // find emoji by shortcode - full match or with-out last char as it could be from text e.g. :-),
    const iconFull = emoticon.find(e => e.emoticons.includes(match)); // full match
    const iconPart = emoticon.find(e => e.emoticons.includes(match.slice(0, -1))); // second search pattern
    const trimmedChar = iconPart ? match.slice(-1) : '';
    const addPad = pad ? ' ' : '';
    let icon = iconFull ? iconFull.emoji + addPad : iconPart && iconPart.emoji + addPad + trimmedChar;
    return icon || match;
  }

  function getEmoji(match) {
    console.log(match);
    const got = emoji.get(match);
    if (pad && got !== match) {
      return got + ' ';
    }

    console.log(got);
    return ReactDOMServer.renderToStaticMarkup(<Emoji set="google" emoji={match} size={16} />);
  }

  function transformer(tree) {
    visit(tree, 'paragraph', function(node) {
      console.log(tree);
      // node.value = node.value.replace(RE_EMOJI, getEmoji);
      node.type = 'html';
      node.tagName = 'div';
      node.value = node.children[0].value.replace(RE_EMOJI, getEmoji);

      if (emoticonEnable) {
        // node.value = node.value.replace(RE_SHORT, getEmojiByShortCode);
      }
      console.log(node);
    });
  }

  return transformer;
}

export { plugin };
