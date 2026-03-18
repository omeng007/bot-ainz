let timeout = 100000
let poin = 10000
let fetch = require("node-fetch");

let handler = async (m, { conn, usedPrefix }) => {
    conn.tebakff = conn.tebakff ? conn.tebakff : {}
    let id = m.chat
    if (id in conn.tebakff) {
        conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebakff[id][0])
        throw false
    }

    // Ambil data dari API baru (tanpa apikey)
    let src = await (await fetch('https://api.deline.web.id/game/tebakff')).json()
    // Validasi respons
    if (!src.status) throw "Gagal mengambil soal tebak FF, coba lagi nanti!"
    let json = src.result // { img, fullimg, jawaban, deskripsi }

    // Buat caption untuk ditampilkan
    let caption = `
≡ _GAME TEBAK FF_

┌─⊷ *SOAL*
▢ Penjelasan: *${json.deskripsi}*
▢ Timeout *${(timeout / 1000).toFixed(2)} detik*
▢ Bonus: ${poin} money
▢ Ketik ${usedPrefix}tbff untuk clue jawaban
▢ *REPLY* pesan ini untuk menjawab
└──────────────
    `.trim()

    conn.tebakff[id] = [
        await conn.sendMessage(m.chat, { image: { url: json.img }, caption: caption }, { quoted: m }),
        json, // menyimpan objek json { img, jawaban, deskripsi }
        poin,
        setTimeout(() => {
            if (conn.tebakff[id]) {
                conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.jawaban}*`, conn.tebakff[id][0])
            }
            delete conn.tebakff[id]
        }, timeout)
    ]
}

handler.help = ['tebakff']
handler.tags = ['game']
handler.command = /^tebakff/i
handler.limit = false
handler.group = true

module.exports = handler