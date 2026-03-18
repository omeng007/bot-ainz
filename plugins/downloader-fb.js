let axios = require('axios');

let handler = async (m, { conn, text, usedPrefix }) => {
    if (!text) throw `✨ *Contoh penggunaan:* ${usedPrefix}fb https://www.facebook.com/share/v/.../`;
    if (!text.match(/facebook/gi)) throw '❌ URL harus dari Facebook!';
    
    try {
        await m.reply('🎬 *Mengunduh konten Facebook...*');
        
        // Gunakan API deline.web.id (hanya mengembalikan video, tanpa audio)
        const apiUrl = `https://api.deline.web.id/downloader/facebook?url=${encodeURIComponent(text)}`;
        const res = await axios.get(apiUrl, { timeout: 60000 });
        
        if (!res.data?.status || !res.data?.result) {
            throw new Error('Respons API tidak valid');
        }

        const result = res.data.result;
        
        // Ambil URL video dari properti 'download' (kualitas terbaik) atau dari array list
        let videoUrl = result.download;
        if (!videoUrl && result.list && result.list.length > 0) {
            // Prioritaskan kualitas HD (biasanya index 0)
            videoUrl = result.list[0].url;
        }
        
        if (!videoUrl) throw new Error('Tidak ada video yang ditemukan');

        // Buat caption (tanpa menyebutkan audio)
        let caption = `📘 *FACEBOOK VIDEO*\n\n`;
        caption += `📅 *Diunduh:* ${new Date().toLocaleDateString('id-ID')}\n`;
        if (result.list && result.list.length > 0) {
            caption += `🎬 *Kualitas tersedia:* ${result.list.map(v => v.quality.replace('Download ', '')).join(', ')}\n`;
        }
        caption += `\n> © ʜᴀꜱʜɪʀᴀ - ᴀɪ • ʙʏ ᴀɪɴᴢ`;

        // Kirim video (tanpa audio)
        await conn.sendFile(m.chat, videoUrl, 'facebook.mp4', caption, m, false, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

    } catch (e) {
        console.error('Error detail:', e);
        let errorMsg = e.message || 'Terjadi kesalahan';
        conn.reply(m.chat, `❌ *Gagal mengunduh konten Facebook*\n\n${errorMsg}`, m);
    }
};

handler.help = ['facebook <url>'];
handler.tags = ['downloader'];
handler.command = /^(fb|facebook|fbdl|facebookdl)$/i;
handler.limit = true;
module.exports = handler;