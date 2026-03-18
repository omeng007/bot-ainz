let axios = require('axios');

let handler = async (m, { conn, text, usedPrefix }) => {
    if (!text) throw `Contoh: ${usedPrefix}instagram <url>`;
    if (!text.includes('instagram.com')) throw 'URL harus Instagram!';
    
    await m.reply('⏳ Mengunduh konten Instagram...');
    
    try {
        let res;
        let usingV1 = false;
        try {
            res = await axios.get(`https://api.nexray.web.id/downloader/v2/instagram?url=${encodeURIComponent(text)}`, { timeout: 60000 });
            if (!res.data.status) throw 'Gagal v2';
        } catch {
            usingV1 = true;
            res = await axios.get(`https://api.nexray.web.id/downloader/instagram?url=${encodeURIComponent(text)}`, { timeout: 60000 });
            if (!res.data.status) throw 'Gagal mengambil data';
            // Ubah struktur v1 ke format v2
            res.data.result = { media: res.data.result.map(v => ({ 
                type: v.type, 
                url: v.url 
            })) };
        }

        const data = res.data.result;
        if (!data.media?.length) throw 'Media tidak ditemukan';

        // Metadata (v1 mungkin tidak punya)
        const username = data.username || data.author || 'Tidak diketahui';
        const title = data.title || '';
        const likes = data.likes || 0;
        const comments = data.comment && data.comment !== '-' ? data.comment : (data.comments?.length || 0);
        const takenAt = data.taken_at ? new Date(data.taken_at * 1000).toLocaleString('id-ID') : '';

        // Caption
        let caption = `📸 *INSTAGRAM DOWNLOADER*\n\n👤 *Username:* ${username}\n`;
        if (title) caption += `📝 *Caption:* ${title.slice(0, 200)}${title.length > 200 ? '...' : ''}\n`;
        caption += `\n📊 *Statistik:*\n   • ❤️ ${likes} suka\n`;
        if (comments > 0) caption += `   • 💬 ${comments} komentar\n`;
        if (takenAt) caption += `   • 🕒 ${takenAt}\n`;
        caption += `\n🔄 *Jumlah Media:* ${data.media.length}\n> © ʜᴀꜱʜɪʀᴀ - ᴀɪ • ʙʏ ᴀɪɴᴢ`;

        // Kirim media
        for (let i = 0; i < data.media.length; i++) {
            const item = data.media[i];
            // Tentukan tipe
            const isVideo = (item.type && (item.type.includes('video') || item.type.includes('mp4'))) || 
                            (item.url && item.url.match(/\.(mp4|mov|avi)$/i));
            
            const fileCaption = data.media.length === 1 ? caption : 
                (i === 0 ? `${caption}\n\n${isVideo ? '🎬' : '🖼️'} 1/${data.media.length}` : 
                `${isVideo ? '🎬' : '🖼️'} ${i+1}/${data.media.length}\n\n> © ʜᴀꜱʜɪʀᴀ - ᴀɪ • ʙʏ ᴀɪɴᴢ`);

            try {
                // Download dengan header
                const mediaRes = await axios({
                    method: 'GET',
                    url: item.url,
                    responseType: 'arraybuffer',
                    timeout: 120000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                        'Referer': 'https://www.instagram.com/'
                    }
                });
                
                if (isVideo) {
                    await conn.sendMessage(m.chat, { 
                        video: mediaRes.data, 
                        caption: fileCaption,
                        mimetype: 'video/mp4'
                    }, { quoted: m });
                } else {
                    await conn.sendMessage(m.chat, { 
                        image: mediaRes.data, 
                        caption: fileCaption 
                    }, { quoted: m });
                }
            } catch (e) {
                console.log('Gagal download dengan axios, fallback ke sendFile:', e.message);
                // Fallback: kirim langsung URL
                const fileName = `ig_${i+1}.${isVideo ? 'mp4' : 'jpg'}`;
                await conn.sendFile(m.chat, item.url, fileName, fileCaption, m);
            }
            
            if (i < data.media.length - 1) await new Promise(r => setTimeout(r, 1500));
        }
    } catch (e) {
        console.error('Instagram Downloader Error:', e);
        conn.reply(m.chat, `❌ Error: ${e.message}`, m);
    }
};

handler.help = ['instagram <url>'];
handler.tags = ['downloader'];
handler.command = /^(ig|instagram|igdl|instagramdl)$/i;
handler.limit = true;
module.exports = handler;