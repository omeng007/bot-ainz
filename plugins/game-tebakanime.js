let fetch = require('node-fetch')
let timeout = 100000
let poin = 10000

let handler = async (m, { conn, usedPrefix }) => {
    conn.tebakanime = conn.tebakanime ? conn.tebakanime : {}
    let id = m.chat
    if (id in conn.tebakanime) {
        conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebakanime[id][0])
        throw false
    }

    // Ambil data dari API baru (tanpa apikey)
    let src = await (await fetch('https://api.deline.web.id/game/tebakanime')).json()
    // Validasi respons
    if (!src.status) throw 'Gagal mengambil soal tebakanime'
    let result = src.result // { soal: url_gambar, jawaban: nama_anime }

    // Buat caption untuk ditampilkan (tanpa deskripsi/tahun karena API baru tidak menyediakan)
    let caption = `
≡ _GAME TEBAK ANIME_

┌─⊷ *SOAL*
▢ Timeout *${(timeout / 1000).toFixed(2)} detik*
▢ Bonus: ${poin} money
▢ Ketik ${usedPrefix}tbam untuk clue jawaban
▢ *REPLY* pesan ini untuk menjawab
└──────────────
    `.trim()

    conn.tebakanime[id] = [
        await conn.sendMessage(m.chat, { image: { url: result.soal }, caption: caption }, { quoted: m }),
        result, // menyimpan objek result { soal, jawaban }
        poin,
        setTimeout(() => {
            if (conn.tebakanime[id]) {
                conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${result.jawaban}*`, conn.tebakanime[id][0])
            }
            delete conn.tebakanime[id]
        }, timeout)
    ]
}

handler.help = ['tebakanime']
handler.tags = ['game']
handler.command = /^tebakanime/i
handler.limit = false
handler.group = true

module.exports = handler