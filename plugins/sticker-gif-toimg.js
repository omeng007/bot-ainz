let fetch = require('node-fetch');
let uploader = require('../lib/uploadFile');

let handler = async (m, { conn, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || q.mediaType || '';
    if (/webp/.test(mime)) {
        let buffer = await q.download();
        await m.reply(wait);
        try {
            let media = await uploader(buffer); // upload file ke server sementara
            let format = command === 'toimg' ? 'PNG' : 'MP4'; // tentukan format
            // Panggil API NexRay
            let apiUrl = `https://api.nexray.web.id/tools/converter?url=${encodeURIComponent(media)}&format=${format}`;
            let res = await fetch(apiUrl);
            let json = await res.json();
            
            if (json && json.status && json.result) {
                // Kirim file hasil konversi
                await conn.sendFile(m.chat, json.result, null, "*DONE*", m);
            } else {
                await m.reply('Error: Gagal mengonversi file. Silakan coba lagi.');
            }
        } catch (err) {
            console.error(err);
            await m.reply('Terjadi kesalahan saat memproses permintaan.');
        }
    } else {
        await m.reply(`Balas stiker dengan perintah ${usedPrefix + command}`);
    }
}

handler.help = ['toimg', 'togif'];
handler.tags = ['tools'];
handler.command = /^(toimg|togif)$/i;
handler.limit = true;

module.exports = handler;