let fetch = require('node-fetch')

let timeout = 100000
let poin = 10000
let handler = async (m, { conn, usedPrefix }) => {
    conn.kimia = conn.kimia ? conn.kimia : {}
    let id = m.chat
    if (id in conn.kimia) {
        conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.kimia[id][0])
        throw false
    }

    // Ambil data dari API baru (tanpa apikey)
    let src = await (await fetch('https://api.deline.web.id/game/tebakkimia')).json()
    // Validasi respons
    if (!src.status) throw 'Gagal mengambil soal tebak kimia'
    let json = src.data // { unsur, lambang }

    // Buat caption untuk ditampilkan
    let caption = `
*${json.unsur}*

┌─⊷ *SOAL*
▢ Apa lambang unsur dari unsur di atas?
▢ Timeout *${(timeout / 1000).toFixed(2)} detik*
▢ Ketik ${usedPrefix}kmi untuk bantuan
▢ Bonus: ${poin} money
▢ *Balas/ REPLY soal ini untuk menjawab*
└──────────────
`.trim()

    conn.kimia[id] = [
        await conn.reply(m.chat, caption, m),
        json, // menyimpan objek json { unsur, lambang }
        poin,
        setTimeout(() => {
            if (conn.kimia[id]) {
                conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.lambang}*`, conn.kimia[id][0])
            }
            delete conn.kimia[id]
        }, timeout)
    ]
}

handler.help = ['tebakkimia']
handler.tags = ['game']
handler.command = /^tebakkimia/i
handler.register = false
handler.group = false

module.exports = handler