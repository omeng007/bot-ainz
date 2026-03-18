const fs = require('fs')

let handler = async (m, { conn }) => {
  // Kirim audio
  const audioPath = './media/ketawa.mp3'
  if (fs.existsSync(audioPath)) {
    try {
      await conn.sendFile(m.chat, audioPath, 'ketawa.mp3', null, m, { type: 'audioMessage', ptt: true })
    } catch (e) {
      console.error('Gagal kirim audio:', e)
      await conn.sendMessage(m.chat, { text: '⚠️ Audio gagal' }, { quoted: m })
    }
  } else {
    await conn.sendMessage(m.chat, { text: '🔇 Audio tidak ditemukan' }, { quoted: m })
  }

  // Kirim stiker lokal
  const stickerPath = './media/sticker/sowner.webp'
  if (fs.existsSync(stickerPath)) {
    try {
      const stickerBuffer = fs.readFileSync(stickerPath)
      if (typeof conn.sendSticker === 'function') {
        await conn.sendSticker(m.chat, stickerBuffer, m)
      } else {
        await conn.sendMessage(m.chat, { sticker: stickerBuffer }, { quoted: m })
      }
    } catch (e) {
      console.error('Gagal kirim stiker:', e)
      await conn.sendMessage(m.chat, { text: '❌ Gagal kirim stiker' }, { quoted: m })
    }
  } else {
    await conn.sendMessage(m.chat, { text: '❌ File stiker tidak ditemukan' }, { quoted: m })
  }
}

// Pattern yang mencocokkan mention nomor di mana saja dalam teks
handler.customPrefix = /\B@(?:6287755090983|\+62[\s\-]*877[\s\-]*5509[\s\-]*0983|123733981274298)\b/i
handler.command = new RegExp()

module.exports = handler