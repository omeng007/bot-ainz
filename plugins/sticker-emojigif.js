const fetch = require('node-fetch');
const { Sticker } = require('wa-sticker-formatter');

let handler = async (m, { conn, text, args, usedPrefix, command }) => {
  if (!args[0]) throw `Contoh penggunaan: ${usedPrefix + command} 🫨`;
  
  try {
    await m.reply(wait);
    
    const emoji = encodeURIComponent(args[0]);
    const apiUrl = `https://api.nexray.web.id/tools/emojigif?emoji=${emoji}`;
    
    const res = await fetch(apiUrl);
    const contentType = res.headers.get('content-type');
    
    let mediaBuffer;
    
    if (contentType && contentType.includes('application/json')) {
      const json = await res.json();
      const mediaUrl = json.result || json.url;
      if (!mediaUrl) throw 'Tidak dapat mengambil URL GIF';
      const imgRes = await fetch(mediaUrl);
      mediaBuffer = await imgRes.buffer();
    } else {
      mediaBuffer = await res.buffer();
    }
    
    const sticker = new Sticker(mediaBuffer, {
      pack: packname,
      author: author,
      type: 'full',
      quality: 80
    });
    
    const stikerBuffer = await sticker.toBuffer();
    await conn.sendFile(m.chat, stikerBuffer, 'sticker.webp', '', m);
    
  } catch (e) {
    console.error(e);
    m.reply('*🚩 Emoji tidak support atau terjadi kesalahan!*');
  }
};

handler.help = ['emojigif'];
handler.tags = ['sticker'];
handler.command = /^(emojigif)$/i;
handler.limit = true;

module.exports = handler;