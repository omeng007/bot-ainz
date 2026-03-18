let fetch = require('node-fetch');

// Fungsi untuk memotong teks jika terlalu panjang
function shorten(text, maxLength = 200) {
  if (text && text.length > maxLength) {
    return text.substring(0, maxLength) + '...';
  }
  return text || '';
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `*Contoh:* ${usedPrefix + command} closed doors`;
  m.reply('🔍 Sedang mencari video...');

  try {
    // Panggil API dengan query yang diencode
    const apiUrl = `https://api.nexray.web.id/downloader/ytplayvid?q=${encodeURIComponent(text)}`;
    const res = await fetch(apiUrl);
    const data = await res.json();

    if (!data.status || !data.result) {
      throw 'Video tidak ditemukan atau terjadi kesalahan.';
    }

    const result = data.result;
    const videoUrl = result.download_url;
    if (!videoUrl) throw 'URL download tidak ditemukan.';

    // Siapkan caption informasi (tanpa thumbnail terpisah)
    let caption = `*${result.title || 'Judul tidak tersedia'}*\n\n`;
    caption += `📺 *Channel:* ${result.channel || 'Tidak diketahui'}\n`;
    if (result.channel_url) caption += `   ${result.channel_url}\n`;
    caption += `⏱️ *Durasi:* ${result.duration || 'Tidak diketahui'}\n`;
    caption += `👁️ *Views:* ${result.views || 'Tidak diketahui'}\n`;
    caption += `📅 *Upload:* ${result.upload_at || 'Tidak diketahui'}\n`;
    if (result.description) {
      caption += `📝 *Deskripsi:* ${shorten(result.description, 200)}\n`;
    }
    caption += `\n> © ʜᴀꜱʜɪʀᴀ - ᴀɪ • ʙʏ ᴀɪɴᴢ`;

    // Kirim video langsung dengan caption (tanpa thumbnail terpisah)
    await conn.sendMessage(m.chat, {
      video: { url: videoUrl },
      caption: caption,
      fileName: `${result.title || 'video'}.mp4`.replace(/[<>:"/\\|?*]/g, '')
    }, { quoted: m });

  } catch (e) {
    console.error('Error:', e);
    let errorMessage = '❌ Error: ';
    if (e.message && e.message.includes('tidak ditemukan')) {
      errorMessage = 'Video tidak ditemukan. Coba kata kunci lain.';
    } else if (e.message && (e.message.includes('network') || e.message.includes('fetch'))) {
      errorMessage = 'Gagal terhubung ke server. Cek koneksi internet.';
    } else {
      errorMessage += e.message || 'Terjadi kesalahan saat mengunduh video.';
    }
    conn.reply(m.chat, errorMessage, m);
  }
};

handler.help = ['playvideo', 'playvid'];
handler.tags = ['downloader'];
handler.command = /^(playvideo|playvid|playvidio)$/i;
handler.limit = true;
handler.premium = false;

module.exports = handler;