let handler = async (m, { conn }) => {
    conn.tebakbendera2 = conn.tebakbendera2 ? conn.tebakbendera2 : {}
    let id = m.chat
    if (!(id in conn.tebakbendera2)) throw false
    let json = conn.tebakbendera2[id][1]
    // Perbaikan: gunakan json.name
    let ans = json.name
    let clue = ans.replace(/[bcdfghjklmnpqrstvwxyz]/g, '_')
    m.reply('```' + clue + '```')
}
handler.command = /^teii/i
handler.limit = true
module.exports = handler