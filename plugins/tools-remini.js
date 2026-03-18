const fetch = require('node-fetch');
const uploadImage = require('../lib/uploadImage.js');

let handler = async (m, { conn, usedPrefix, command }) => {
    const q = m.quoted ? m.quoted : m;
    const mime = (q.msg || q).mimetype || q.mediaType || '';
    if (/^image/.test(mime) && !/webp/.test(mime)) {
        await conn.reply(m.chat, wait, m);
        try {
            const img = await q.download();
            const out = await uploadImage(img);
            // Gunakan API NexRay untuk remini (langsung mengembalikan gambar)
            const api = await fetch(`https://api.nexray.web.id/tools/remini?url=${out}`);
            const buffer = await api.buffer();
            await conn.sendFile(m.chat, buffer, 'remini.jpg', wm, m);
        } catch (e) {
            console.error(e);
            m.reply(`Identifikasi gagal. Silakan coba lagi.`);
        }
    } else {
        m.reply(`Kirim gambar dengan caption *${usedPrefix + command}* atau tag gambar yang sudah dikirim.`);
    }
};

handler.help = ['remini'];
handler.tags = ['tools'];
handler.command = ['remini'];
handler.premium = false;
handler.limit = false;

module.exports = handler;