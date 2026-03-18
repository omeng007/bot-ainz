const fs = require('fs');
const fetch = require('node-fetch');

const handler = async (m, { conn, args, text, usedPrefix, command }) => {
    text = text 
        ? text 
        : m.quoted && m.quoted.text 
        ? m.quoted.text 
        : m.quoted && m.quoted.caption 
        ? m.quoted.caption 
        : m.quoted && m.quoted.description 
        ? m.quoted.description 
        : '';
        
    if (!text) throw `Example: ${usedPrefix + command} Lagi Ruwet`;

    // Kirim pesan menunggu
    await conn.reply(m.chat, global.stiker_wait, m);

    let res;
    if (command === 'brat') {
        res = `https://api.nexray.web.id/maker/brat?text=${encodeURIComponent(text.substring(0, 151))}`;
    } else if (command === 'brathd') {
        res = `https://api.nexray.web.id/maker/brathd?text=${encodeURIComponent(text.substring(0, 151))}`;
    } else if (command === 'brat2' || command === 'bratgif') {
        res = `https://api.nexray.web.id/maker/bratvid?text=${encodeURIComponent(text.substring(0, 151))}`;
    } else if (command === 'bratvid') {
        res = `https://api.nexray.web.id/maker/bratvid?text=${encodeURIComponent(text.substring(0, 151))}`;
    } else if (command === 'bratanime') {
        res = `https://api.nexray.web.id/maker/bratanime?text=${encodeURIComponent(text.substring(0, 151))}`;
    } else if (command === 'ttp') {
        res = `https://api.nexray.web.id/maker/ttp?text=${encodeURIComponent(text.substring(0, 151))}`;
    } else if (command === 'attp') {
        res = `https://api.botcahx.eu.org/api/maker/attp?text=${encodeURIComponent(text.substring(0, 151))}&apikey=${btc}`;
    }

    const err = fs.readFileSync(`./media/sticker/emror.webp`);

    try {
        const response = await fetch(res);
        const buffer = await response.buffer();

        if (command === 'attp') {
            await conn.sendFile(m.chat, buffer, 'sticker.webp', '', m);
        } else if (command === 'bratvid' || command === 'brat2' || command === 'bratgif') {
            await conn.sendVideoAsSticker(m.chat, buffer, m, { packname: global.packname, author: global.author });
        } else {
            await conn.sendImageAsSticker(m.chat, buffer, m, { packname: global.packname, author: global.author });
        }
    } catch (e) {
        console.error(e);
        await conn.sendImageAsSticker(m.chat, err, m, { packname: global.packname, author: global.author });
    }
};

handler.command = handler.help = ['brat', 'brathd', 'brat2', 'bratgif', 'bratvid', 'bratanime', 'ttp', 'attp'];
handler.tags = ['sticker'];
handler.limit = true;

module.exports = handler;