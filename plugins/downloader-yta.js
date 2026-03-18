let fetch = require('node-fetch');

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `*Example:* ${usedPrefix + command} https://youtube.com/...`;
  m.reply(wait);

  try {
    let result;
    
    // Coba kedua API secara berurutan
    const apis = [
      `https://api.nexray.web.id/downloader/v1/ytmp3?url=${encodeURIComponent(text)}`,
      `https://api.nexray.web.id/downloader/ytmp3?url=${encodeURIComponent(text)}`
    ];

    for (let api of apis) {
      try {
        const res = await fetch(api);
        const data = await res.json();
        if (data.status && data.result?.url) {
          result = data.result;
          break;
        }
      } catch (e) {}
    }

    if (!result?.url) throw 'URL download tidak ditemukan';

    // Kirim audio saja
    await conn.sendMessage(m.chat, {
      audio: { url: result.url },
      mimetype: 'audio/mpeg',
      fileName: `${result.title || 'audio'}.mp3`.replace(/[<>:"/\\|?*]/g, '')
    }, { quoted: m });

  } catch (e) {
    let errorMessage = '❌ Error: ' + (e.message || 'Terjadi kesalahan');
    conn.reply(m.chat, errorMessage, m);
  }
};

handler.help = handler.command = ['ytmp3', 'yta'];
handler.tags = ['downloader'];
handler.limit = true;
handler.premium = false;

module.exports = handler;