let fetch = require('node-fetch');

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `*Example:* ${usedPrefix + command} https://www.youtube.com/watch?v=`;
  m.reply(wait);

  try {
    let result = null;
    const resolutions = ['1080', '720', '480', '360', '240', '144'];

    // Coba semua resolusi dari tertinggi ke terendah
    for (let res of resolutions) {
      try {
        // Coba API v1
        const apiUrl = `https://api.nexray.web.id/downloader/v1/ytmp4?url=${encodeURIComponent(text)}&resolusi=${res}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        if (data.status && data.result?.url) {
          result = data.result;
          result.quality = result.quality || `${res}p`;
          break;
        }
      } catch (error) {
        continue;
      }
    }

    // Jika API v1 gagal, coba API lama
    if (!result) {
      for (let res of resolutions) {
        try {
          const apiUrl = `https://api.nexray.web.id/downloader/ytmp4?url=${encodeURIComponent(text)}&resolusi=${res}`;
          const response = await fetch(apiUrl);
          const data = await response.json();
          
          if (data.status && data.result?.url) {
            result = data.result;
            result.quality = data.result.resolusi ? `${data.result.resolusi}p` : `${res}p`;
            break;
          }
        } catch (error) {
          continue;
        }
      }
    }

    // Jika masih gagal, coba tanpa parameter resolusi
    if (!result) {
      try {
        const apiUrl = `https://api.nexray.web.id/downloader/v1/ytmp4?url=${encodeURIComponent(text)}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        if (data.status && data.result?.url) {
          result = data.result;
          result.quality = result.quality || 'Default';
        }
      } catch (error) {
        // Coba API lama tanpa parameter
        try {
          const apiUrl = `https://api.nexray.web.id/downloader/ytmp4?url=${encodeURIComponent(text)}`;
          const response = await fetch(apiUrl);
          const data = await response.json();
          if (data.status && data.result?.url) {
            result = data.result;
            result.quality = result.resolusi ? `${result.resolusi}p` : 'Default';
          }
        } catch (e) {}
      }
    }

    if (result?.url) {
      const caption = `📺 *Title:* ${result.title}\n${result.author && result.author !== 'Unknown' ? `👤 *Author:* ${result.author}\n` : ''}⏱️ *Duration:* ${result.duration} seconds\n📊 *Quality:* ${result.quality}\n📁 *Format:* ${result.format || 'MP4'}\n\n> © ʜᴀꜱʜɪʀᴀ - ᴀɪ • ʙʏ ᴀɪɴᴢ`;
      
      await conn.sendMessage(m.chat, { 
        video: { url: result.url }, 
        mimetype: 'video/mp4',
        caption: caption
      }, { quoted: m });
    } else {
      throw '❌ Error: Unable to fetch video';
    }
  } catch (error) {
    throw '❌ Error: Failed to download video';
  }
};

handler.help = handler.command = ['ytmp4', 'ytv', 'youtube'];
handler.tags = ['downloader'];
handler.limit = true;
handler.premium = false;

module.exports = handler;