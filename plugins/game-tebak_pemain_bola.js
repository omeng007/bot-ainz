let fetch = require('node-fetch')

let timeout = 100000
let poin = 10000
let handler = async (m, { conn, usedPrefix }) => {
    conn.tebakbola = conn.tebakbola ? conn.tebakbola : {}
    let id = m.chat
    if (id in conn.tebakbola) {
        conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebakbola[id][0])
        throw false
    }

    // Ambil data dari API baru (tanpa apikey)
    let src = await (await fetch('https://api.deline.web.id/game/tebakpemainbola')).json()
    // Validasi respons
    if (!src.status) throw 'Gagal mengambil soal tebak pemain bola'
    let json = src.result // { soal, jawaban, deskripsi }

    // Buat caption untuk ditampilkan
    let caption = `
${json.soal}

┌─⊷ *SOAL*
▢ Deskripsi: ${json.deskripsi}
▢ Timeout *${(timeout / 1000).toFixed(2)} detik*
▢ Ketik ${usedPrefix}tboa untuk bantuan
▢ Bonus: ${poin} money
▢ *Balas/ reply soal ini untuk menjawab*
└──────────────
`.trim()

    conn.tebakbola[id] = [
        await conn.reply(m.chat, caption, m),
        json, // menyimpan objek json { soal, jawaban, deskripsi }
        poin,
        setTimeout(() => {
            if (conn.tebakbola[id]) {
                conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.jawaban}*`, conn.tebakbola[id][0])
            }
            delete conn.tebakbola[id]
        }, timeout)
    ]
}

handler.help = ['tebakbola']
handler.tags = ['game']
handler.command = /^tebakbola/i
handler.register = false
handler.group = true

module.exports = handler