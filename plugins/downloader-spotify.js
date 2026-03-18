const fetch = require('node-fetch');

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) throw `❓ *Contoh:*\n${usedPrefix}spotify https://open.spotify.com/track/...\n${usedPrefix}spotify lagu favorit`;

  const wait = '⏳ *Memproses...*';
  m.reply(wait);

  // URL Spotify
  if (args[0].match(/open\.spotify\.com\/(track|playlist|album)/i)) {
    try {
      const encoded = encodeURIComponent(args[0]);
      const api = await fetch(`https://api.nexray.web.id/downloader/spotify?url=${encoded}`);
      const json = await api.json();

      if (!json.status || !json.result?.url) throw 'Gagal mendapatkan URL download';

      const { title, artist, url } = json.result;
      
      // Gunakan judul asli untuk title
      let titleText = title;
      if (titleText.length > 60) titleText = titleText.substring(0, 57) + '...';

      // Body hanya berisi credit/nama Anda
      let bodyText = '© ʜᴀꜱʜɪʀᴀ - ᴀɪ • ʙʏ ᴀɪɴᴢ';

      // Kirim audio dengan thumbnail di contextInfo
      await conn.sendMessage(m.chat, {
        audio: { 
          url: url 
        },
        mimetype: 'audio/mpeg',
        fileName: `${title} - ${artist}.mp3`.replace(/[<>:"/\\|?*]/g, ''),
        contextInfo: {
          externalAdReply: {
            title: titleText,
            body: bodyText,
            mediaType: 2,
            thumbnailUrl: 'https://www.scdn.co/i/_global/open-graph-default.png',
            sourceUrl: args[0],
            mediaUrl: args[0],
            showAdAttribution: true
          }
        }
      }, {
        quoted: m
      });

    } catch (e) {
      throw `❌ *Download gagal:* ${e.message || 'Coba lagi'}`;
    }
  } 
  // Search
  else {
    try {
      const query = encodeURIComponent(args.join(' '));
      const api = await fetch(`https://api.nexray.web.id/search/spotify?q=${query}`);
      const json = await api.json();

      if (!json.status || !json.result?.length) throw 'Tidak ada hasil ditemukan';

      let teks = `🔍 *SPOTIFY SEARCH*\n\n`;
      teks += `📌 *Kata kunci:* "${args.join(' ')}"\n`;
      teks += `📊 *Hasil:* ${json.result.length} ditemukan\n\n`;

      json.result.slice(0, 5).forEach((track, i) => {
        teks += `*${i + 1}.* *${track.title}*\n`;
        teks += `   🎤 ${track.artist}\n`;
        teks += `   ⏱️ ${track.duration}\n`;
        teks += `   🔗 ${track.url}\n\n`;
      });

      if (json.result.length > 5) {
        teks += `...dan ${json.result.length - 5} hasil lainnya\n\n`;
      }

      teks += `📝 *Cara download:*\n${usedPrefix}spotify <link di atas>\n\n`;
      teks += `> © ʜᴀꜱʜɪʀᴀ - ᴀɪ • ʙʏ ᴀɪɴᴢ`;

      m.reply(teks);

    } catch (e) {
      throw `❌ *Pencarian gagal:* ${e.message || 'Coba kata kunci lain'}`;
    }
  }
};

handler.help = ['spotify <url/query>'];
handler.tags = ['downloader'];
handler.command = /^(spotify|spoti)$/i;
handler.limit = true;
module.exports = handler;