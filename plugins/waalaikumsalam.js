let handler = async (m, { conn }) => {
    let waalaikumsalam = `📚 _وَعَلَيْكُمْ السَّلاَمُ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ_\n_wa\'alaikumussalam wa rahmatullahi wa barakatuh_\n 🙏
> © ʜᴀꜱʜɪʀᴀ - ᴀɪ • ʙʏ ᴀɪɴᴢ`;

    await conn.sendMessage(m.chat, {
        react: {
            text: '🙏',
            key: m.key,
        }
    });
    await conn.reply(m.chat, waalaikumsalam, m);
}

handler.customPrefix = /^(assalamualaikum|assalam|salam|asalamualaikum|assalamualaykum|salamu|salamualaikum|samlikum|assalamu'alaikum|assalamu'alaykum|asalamu'alaykum|likum|samlikom|samlekom|assalamualaikum\s+wr\.\s+wb\.|assalamu'alaikum\s+wr\.\s+wb\.|Assalamu'alaikum\s+warahmatullahi\s+wabarakatuh|Assalamualaikum\s+warahmatullahi\s+wabarakatuh|Assalamu'alaikum\s+wr\s+wb|Assalamu'alaikum\s+wr\.\s+wb|Assalamualaikum\s+wr\s+wb|Assalamualaikum\s+wr\.\s+wb|Assalamualaikum\s+wa\s+rahmatullahi\s+wa\s+barakatuh|Assalamualaikum\s+wa\s+rahmatullahi\s+wabarakatuh|Assalamualaikum\s+warahmatullahi\s+wa\s+barakatuh|Assalamu'alaikum\s+wa\s+rahmatullahi\s+wa\s+barakatuh|Assalamu'alaikum\s+warahmatullahi\s+wa\s+barakatuh|Assalamu'alaikum\s+warahmatullahi\s+wa\s+barakatuh)$/i;

handler.command = new RegExp;

module.exports = handler;