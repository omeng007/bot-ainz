const fetch = require('node-fetch');

let handler = async (m, { conn, text, command, usedPrefix }) => {
  if (!text) throw `*Example: ${usedPrefix + command} halo*`; 
  await m.reply(wait);
  try {
    const res = await fetch(`https://api.nexray.web.id/maker/iqc?text=${encodeURIComponent(text)}`);
    const buffer = await res.buffer();
    // Kirim dengan caption wm (sama seperti di hd)
    await conn.sendFile(m.chat, buffer, 'iqc.jpg', wm, m);
  } catch (error) {
    console.error(error);
    throw eror;
  }
};

handler.help = ['iqc <text>'];
handler.tags = ['tools'];
handler.command = ['iqc'];
handler.limit = true;

module.exports = handler;