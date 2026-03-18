let fetch = require('node-fetch')

let timeout = 100000
let poin = 10000
let handler = async (m, { conn, usedPrefix }) => {
    conn.asahotak = conn.asahotak ? conn.asahotak : {}
    let id = m.chat
    if (id in conn.asahotak) {
        conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.asahotak[id][0])
        throw false
    }
    // Ambil data dari API baru (tanpa apikey)
    let src = await (await fetch(`https://api.deline.web.id/game/asahotak`)).json()
    // Validasi respons
    if (!src.status) throw 'Gagal mengambil soal asahotak'
    let json = src.data // { index, soal, jawaban }

    // Buat caption untuk ditampilkan
    let caption = `
${json.soal}

┌─⊷ *SOAL*
▢ Timeout *${(timeout / 1000).toFixed(2)} detik*
▢ Ketik ${usedPrefix}toka untuk bantuan
▢ Bonus: ${poin} money
▢ *Balas/ Reply soal ini untuk menjawab*
└──────────────
`.trim()

    conn.asahotak[id] = [
        await conn.reply(m.chat, caption, m),
        json,
        poin,
        setTimeout(() => {
            if (conn.asahotak[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.jawaban}*`, conn.asahotak[id][0])
            delete conn.asahotak[id]
        }, timeout)
    ]
}

handler.help = ['asahotak']
handler.tags = ['game']
handler.command = /^asahotak/i
handler.register = false
handler.group = true

module.exports = handler