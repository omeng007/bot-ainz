let fetch = require('node-fetch')

let timeout = 100000
let poin = 500
let handler = async (m, { conn, usedPrefix }) => {
    conn.tebakbendera2 = conn.tebakbendera2 ? conn.tebakbendera2 : {}
    let id = m.chat
    if (id in conn.tebakbendera2) {
        conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebakbendera2[id][0])
        throw false
    }

    // Ambil data dari API baru (tanpa apikey)
    let src = await (await fetch('https://api.deline.web.id/game/tebakbendera')).json()
    // Validasi respons
    if (!src.status) throw 'Gagal mengambil soal tebak bendera'
    let json = src.result // { img: url_gambar, name: nama_negara }

    // Buat caption untuk ditampilkan di WA
    let caption = `
┌─⊷ *SOAL TEBAK BENDERA*
▢ Timeout *${(timeout / 1000).toFixed(2)} detik*
▢ Ketik ${usedPrefix}teii untuk bantuan
▢ Bonus: ${poin} Kredit sosial
▢ *Balas/ REPLY pesan ini untuk menjawab*
└──────────────
    `.trim()

    conn.tebakbendera2[id] = [
        await conn.sendMessage(m.chat, { image: { url: json.img }, caption: caption }, { quoted: m }),
        json, // menyimpan objek json { img, name }
        poin,
        setTimeout(() => {
            if (conn.tebakbendera2[id]) {
                conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.name}*`, conn.tebakbendera2[id][0])
            }
            delete conn.tebakbendera2[id]
        }, timeout)
    ]
}

handler.help = ['tebakbendera']
handler.tags = ['game']
handler.command = /^tebakbendera/i
handler.register = false
handler.group = true

module.exports = handler