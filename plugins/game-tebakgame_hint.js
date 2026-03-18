let handler = async (m, { conn }) => {
    conn.tebakgame = conn.tebakgame ? conn.tebakgame : {}
    let id = m.chat
    if (!(id in conn.tebakgame)) throw false

    let json = conn.tebakgame[id][1]
    let ans = json.jawaban.trim()
    // Ganti huruf vokal (a,i,u,e,o) dengan underscore
    let clue = ans.replace(/[AIUEOaiueo]/g, '_')
    conn.reply(m.chat, '```' + clue + '```\nBalas soalnya, bukan pesan ini!', conn.tebakgame[id][0])
}

handler.command = /^tgame$/i
handler.limit = true
module.exports = handler