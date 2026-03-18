let fetch = require('node-fetch')

let timeout = 100000
let poin = 10000
let handler = async (m, { conn, usedPrefix }) => {
    conn.siapakahaku = conn.siapakahaku ? conn.siapakahaku : {}
    let id = m.chat
    if (id in conn.siapakahaku) {
        conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.siapakahaku[id][0])
        throw false
    }
    // Ambil data dari API baru (tanpa apikey)
    let src = await (await fetch(`https://api.deline.web.id/game/siapakahaku`)).json()
    // Validasi respons
    if (!src.status) throw 'Gagal mengambil soal siapakahaku'
    let json = src.result // { soal, jawaban }

    // Buat caption untuk ditampilkan
    let caption = `
${json.soal}

┌─⊷ *SOAL*
▢ Timeout *${(timeout / 1000).toFixed(2)} detik*
▢ Ketik ${usedPrefix}maka untuk bantuan
▢ Bonus: ${poin} money
▢ *Balas/ REPLY soal ini untuk menjawab*
└──────────────
`.trim()

    conn.siapakahaku[id] = [
        await conn.reply(m.chat, caption, m),
        json,
        poin,
        setTimeout(() => {
            if (conn.siapakahaku[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.jawaban}*`, conn.siapakahaku[id][0])
            delete conn.siapakahaku[id]
        }, timeout)
    ]
}

handler.help = ['siapakahaku']
handler.tags = ['game']
handler.command = /^siapakahaku/i
handler.register = false
handler.group = true

module.exports = handler