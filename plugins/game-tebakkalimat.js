let fetch = require('node-fetch')

let timeout = 100000
let poin = 500
let handler = async (m, { conn, usedPrefix }) => {
    conn.tebakkalimat = conn.tebakkalimat ? conn.tebakkalimat : {}
    let id = m.chat
    if (id in conn.tebakkalimat) {
        conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebakkalimat[id][0])
        throw false
    }

    // Ambil data dari API baru (tanpa apikey)
    let src = await (await fetch('https://api.deline.web.id/game/tebakkalimat')).json()
    // Validasi respons
    if (!src.status) throw 'Gagal mengambil soal tebak kalimat'
    let json = src.result // { index, soal, jawaban }

    // Buat caption untuk ditampilkan di WA
    let caption = `
${json.soal}

┌─⊷ *SOAL*
▢ Timeout *${(timeout / 1000).toFixed(2)} detik*
▢ Ketik ${usedPrefix}tela untuk bantuan
▢ Bonus: ${poin} Kredit sosial
▢ *Balas/ REPLY soal ini untuk menjawab*
└──────────────
`.trim()

    conn.tebakkalimat[id] = [
        await conn.reply(m.chat, caption, m),
        json, // menyimpan objek json { index, soal, jawaban }
        poin,
        setTimeout(() => {
            if (conn.tebakkalimat[id]) {
                conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.jawaban}*`, conn.tebakkalimat[id][0])
            }
            delete conn.tebakkalimat[id]
        }, timeout)
    ]
}

handler.help = ['tebakkalimat']
handler.tags = ['game']
handler.command = /^tebakkalimat/i
handler.register = false
handler.group = true

module.exports = handler