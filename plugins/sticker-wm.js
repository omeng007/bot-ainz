const uploadFile = require('../lib/uploadFile')
const uploadImage = require('../lib/uploadImage')
let fetch = require("node-fetch")

let handler = async (m, { conn, text, usedPrefix, command}) => {
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ''
  if (!text) throw `Example: ${usedPrefix}${command} packname|author\nContoh: ${usedPrefix}${command} HASHIRA|Ainz`
  if (/video/g.test(mime) && (q.msg || q).seconds > 11) return m.reply('Maksimal 10 detik!')
  await m.reply(wait)
      
  try {
    let img = await q.download()
    if (!img) throw `Balas gambar/video/stiker dengan perintah ${usedPrefix} ${command}`

    // Parse packname dan author
    let parts = text.split('|').map(s => s.trim())
    let packname = parts[0] || ''
    let author = parts[1] || '\nʜᴀꜱʜɪʀᴀ - ᴀɪ • ʙʏ ᴀɪɴᴢ'

    if (q.isAnimated === true) {
      let mediaUrl = await uploadImage(img, "true")
      if (!mediaUrl) throw 'Gagal mengunggah gambar.'

      const apiUrl = `https://api.nexray.web.id/tools/converter?url=${encodeURIComponent(mediaUrl)}&format=MP4`
      const res = await fetch(apiUrl)
      const json = await res.json()

      if (!json.status || !json.result) throw 'Gagal mengubah stiker animasi ke video.'

      await conn.sendVideoAsSticker(m.chat, json.result, m, {
        packname: packname,
        author: author
      })
    } else {
      await conn.sendImageAsSticker(m.chat, img, m, {
        packname: packname,
        author: author
      })
    }
  } catch (e) {
    console.log(e)
    throw `Gagal! Balas gambar/video dengan caption *${usedPrefix}${command}*`
  }
}

handler.help = ['wm', 'watermark']
handler.tags = ['sticker']
handler.command = /^wm|watermark?$/i
handler.limit = true

module.exports = handler