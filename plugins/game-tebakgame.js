let fetch = require('node-fetch')
let timeout = 100000
let poin = 10000

let handler = async (m, { conn, usedPrefix }) => {
    conn.tebakgame = conn.tebakgame ? conn.tebakgame : {}
    let id = m.chat
    if (id in conn.tebakgame) {
        conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebakgame[id][0])
        throw false
    }

    // Ambil data dari API
    let src = await (await fetch('https://api.deline.web.id/game/tebakgame')).json()
    if (!src.status) throw 'Gagal mengambil soal tebak game'
    let json = src.result // { img, jawaban }

    // Buat caption
    let caption = `
≡ _GAME TEBAK GAME_

┌─⊷ *SOAL*
▢ Timeout *${(timeout / 1000).toFixed(2)} detik*
▢ Bonus: ${poin} money
▢ Ketik ${usedPrefix}tgame untuk bantuan
▢ *REPLY* pesan ini untuk menjawab
└──────────────
    `.trim()

    conn.tebakgame[id] = [
        await conn.sendMessage(m.chat, { image: { url: json.img }, caption: caption }, { quoted: m }),
        json, // menyimpan objek { img, jawaban }
        poin,
        setTimeout(() => {
            if (conn.tebakgame[id]) {
                conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.jawaban}*`, conn.tebakgame[id][0])
                delete conn.tebakgame[id]
            }
        }, timeout)
    ]
}

handler.help = ['tebakgame']
handler.tags = ['game']
handler.command = /^tebakgame/i
handler.limit = false
handler.group = true

module.exports = handler