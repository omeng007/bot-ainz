let fetch = require('node-fetch');

let handler = async (m, { conn, text, usedPrefix }) => {
    if (!text) throw `Contoh penggunaan: ${usedPrefix}ytplay judul lagu\nContoh: ${usedPrefix}ytplay Ismail - Closed Doors`;

    try {
        await m.reply('🔍 Mencari lagu di YouTube...');

        // Gunakan endpoint yang sesuai dengan respons yang diberikan
        const apiUrl = `https://api.nexray.web.id/downloader/ytplay?q=${encodeURIComponent(text)}`;
        const res = await fetch(apiUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'application/json'
            },
            timeout: 30000
        });

        if (!res.ok) throw 'Gagal terhubung ke server YouTube';

        const data = await res.json();

        if (!data.status || !data.result) {
            throw 'Video tidak ditemukan di YouTube';
        }

        const result = data.result;
        const audioUrl = result.download_url;

        if (!audioUrl) {
            throw 'URL download tidak ditemukan';
        }

        // Buat caption sesuai data dari respons
        let caption = '';
        caption += `🎵 *YOUTUBE AUDIO DOWNLOADER*\n\n`;
        caption += `📌 *Judul:* ${result.title || 'Tidak ada judul'}\n`;
        caption += `📺 *Channel:* ${result.channel || 'Tidak diketahui'}\n`;
        caption += `⏱️ *Durasi:* ${result.duration || 'Tidak diketahui'}\n`;
        caption += `👁️ *Views:* ${result.views || 'Tidak diketahui'}\n`;
        caption += `📅 *Diunggah:* ${result.upload_at || 'Tidak diketahui'}\n`;
        caption += `🔗 *URL:* ${result.url || 'Tidak ada'}\n\n`;
        caption += `📦 *Format:* MP3\n\n`;
        caption += `> © ʜᴀꜱʜɪʀᴀ - ᴀɪ • ʙʏ ᴀɪɴᴢ`;

        // Kirim pesan extended dengan thumbnail
        await conn.relayMessage(m.chat, {
            extendedTextMessage: {
                text: caption,
                contextInfo: {
                    externalAdReply: {
                        title: result.title || 'YouTube Track',
                        body: result.channel || 'Unknown Channel',
                        mediaType: 1,
                        previewType: 0,
                        renderLargerThumbnail: true,
                        thumbnailUrl: result.thumbnail || 'https://www.youtube.com/img/desktop/yt_1200.png',
                        sourceUrl: result.url || text
                    }
                },
                mentions: [m.sender]
            }
        }, {});

        // Kirim audio LANGSUNG tanpa contextInfo
        await conn.sendMessage(m.chat, {
            audio: {
                url: audioUrl
            },
            mimetype: 'audio/mpeg',
            fileName: `${result.title || 'audio'}.mp3`.replace(/[<>:"/\\|?*]/g, '')
        }, { quoted: m });

    } catch (e) {
        // Hanya tampilkan error singkat
        conn.reply(m.chat, eror, m);
    }
};

handler.help = ['play', 'ytaudio'];
handler.tags = ['downloader'];
handler.command = /^(play|ytaudio)$/i;
handler.limit = true;
handler.premium = false;

module.exports = handler;