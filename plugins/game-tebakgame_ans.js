const similarity = require('similarity')
const threshold = 0.72

let handler = m => m

handler.before = async function (m) {
    let id = m.chat
    if (!m.quoted) return !0
    this.tebakgame = this.tebakgame ? this.tebakgame : {}
    if (!(id in this.tebakgame)) return !0
    if (m.quoted.id !== this.tebakgame[id][0].key.id) return !0

    let users = global.db.data.users[m.sender]
    let json = this.tebakgame[id][1]
    let jawaban = json.jawaban.toLowerCase().trim()
    let teksUser = (m.text || '').toLowerCase().trim()

    if (!teksUser) return !0

    if (teksUser === jawaban) {
        users.money += this.tebakgame[id][2]
        m.reply(`*Benar!*\n+${this.tebakgame[id][2]} money`)
        clearTimeout(this.tebakgame[id][3])
        delete this.tebakgame[id]
    } else if (similarity(teksUser, jawaban) >= threshold) {
        m.reply(`*Dikit Lagi!*`)
    } else {
        m.reply(`*Salah!*`)
    }
    return !0
}

handler.exp = 0
module.exports = handler