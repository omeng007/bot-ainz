const fetch = require("node-fetch");

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `🚩 *Contoh:* ${usedPrefix + command} https://t.me/addstickers/ainz`;
    if (!text.match(/(https:\/\/t.me\/addstickers\/)/gi)) throw `🚩 *Contoh:* ${usedPrefix + command} https://t.me/addstickers/ainz`;
    m.reply(wait);
    try {
        let apiUrl = `https://api.nexray.web.id/tools/telegram-sticker?url=${encodeURIComponent(text)}`;
        let res = await (await fetch(apiUrl)).json();
        
        if (!res.status) {
            throw new Error(`Permintaan API gagal: ${JSON.stringify(res)}`);
        }
        
        let stickers = res.result.sticker;
        
        if (!stickers || !Array.isArray(stickers)) {
            throw new Error(`Format respons tidak valid.`);
        }
        
        let total = stickers.length;
        m.reply(`Memproses ${total} stiker`);   
        
        for (let i = 0; i < stickers.length; i++) {
            let stickerUrl = stickers[i].url;
            await sleep(5000);
            await conn.sendImageAsSticker(m.chat, stickerUrl, null, { 
                packname: global.packname,
                author: global.author
            });
        }  
        
        await conn.reply(m.chat, `Total ${total} stiker berhasil dikirim`, m);
        
    } catch (e) {
        console.error('Error details:', e);
        throw `🚩 Terjadi kesalahan: ${e.message}`;
    }
};

handler.help = ['telesticker'];
handler.command = /^(telesticker|stele)$/i;
handler.tags = ['sticker'];
handler.premium = true;
handler.limit = true;

module.exports = handler;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}