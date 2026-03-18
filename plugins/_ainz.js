let handler = m => m

handler.before = async function (m, { conn }) {
  if (m.isBaileys && m.fromMe) return true
  
  if (m.mtype === 'stickerMessage') {
    const sticker = m.msg?.stickerMessage || m.message?.stickerMessage
    
    if (sticker?.fileSha256 instanceof Uint8Array) {
      const hash = Array.from(sticker.fileSha256)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
      
      // Daftar hash dan teks respons yang sesuai
      const stickerResponses = {
        '4dd56a42e144ab3752c3b30600ed58956f00c77426fd01e1727770c9d959a444': 'engkol',
        
  'c94e6edd8c7a5085cf81bb9f030cbe59a5eaad7f29e3839eaa1a4a690d647d63': 'engkol',      
        'c233cef817a2cdbcadc261af0436eb64735133f9b825879ef7fb56ced6cca513': 'ngocok tross',
        '662575db9bfd9b3054a9fc3e8e95a6077e43e11248a83f2286698761e7805018': `📍𝑰𝑵𝑻𝑹𝑶𝑶 𝑴𝑬𝑴 𝑩𝑨𝑹𝑼📍
╭─ׅ──ֹ━━━ׅ━⁞ ✶ ⁞━ׅ━━━ֹ──ׅ─╮
╠━ *𝐍𝐚𝐦𝐚*  ︎ ︎: 
╠━ *𝐔𝐦𝐮𝐫* ︎ ︎ ︎: 
╠━ *𝐊𝐞𝐥𝐚𝐬* ︎ ︎ ︎: 
╠━ *𝐂𝐨/𝐂𝐞* ︎ ︎: 
╠━ *𝐀𝐬𝐤𝐨𝐭*  ︎ ︎: 
╠━ *𝐇𝐨𝐛𝐢* ︎ ︎ ︎ ︎ ︎: 
╠━ *𝐒𝐭𝐚𝐭𝐮𝐬* : 
╠━ *𝐀𝐠𝐚𝐦𝐚* : 
╰────────────────╯
∘₊✧──────☆───────✧₊∘
> *_NOTE/CATATAN_*:
> ● *Status = Jomblo/Pacaran*
> ● *Askot = Asal Kota*
> ● *Agama Boleh Di Privat*
> ● *Jangan Lupa Baca Desk Gc*
∘₊✧──────☆───────✧₊∘

╭︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎︎─ ︎ ︎     ︎ ︎──── ︎  ︎ ︎︎ ︎ ︎  ︎─╮
︎ ︎  ︎    𝐒𝐀𝐋𝐊𝐄𝐍 𝐀𝐋𝐋
╰︎─ ︎ ︎ ︎ ︎ ︎  ︎ ︎──── ︎ ︎ ︎  ︎ ︎ ︎ ︎─╯
> © ʜᴀꜱʜɪʀᴀ - ᴀɪ • ʙʏ ᴀɪɴᴢ`
      }
      
      if (stickerResponses[hash]) {
        await conn.sendMessage(m.chat, { 
          text: stickerResponses[hash]
        }, { 
          quoted: null 
        })
      }
    }
  }
  
  return true
}

module.exports = handler