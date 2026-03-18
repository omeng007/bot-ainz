const fs = require('fs');

let handler = async (m, { conn, isOwner }) => {
    try {
        if (isOwner) {
            // Daftar respons unik acak untuk owner
            const ownerMessages = [
                "✨ My Creator! Aku selalu siap melayanimu, Tuan! 🫡",
                "💖 Hai sang Pencipta! Ada yang bisa kubantu hari ini?",
                "🌟 Owner kesayanganku online! Langsung semangat nih! 🔥",
                "🦸‍♂️ Pangeran ku datang! Perintah apa hari ini?",
                "🤖 Laporan: Sistem 100% siap! Menunggu perintahmu, Master!",
                "💫 Hadirrr! Langsung merinding lihat owner tampan ini!",
                "🎯 Fokus maksimal! Owner sedang online! Ada kebutuhan khusus?",
                "🧠 CPU langsung naik 100% karena kedatangan owner! Hehe~",
                "⚡ Energy recharge! Owner datang! Siap melayani!",
                "🌹 Yang terhormat owner ganteng, ada yang perlu dibantu?",
                "🐾 Langkah kaki owner terdeteksi! Aku sudah standby nih!",
                "🎭 Theatre mode: ON! Siap menghibur owner hari ini!",
                "📱 Device optimize for owner! Everything ready!",
                "🎪 Selamat datang di show khusus owner! Ada yang bisa ditunjukkan?",
                "💌 Pesan rahasia: Owner adalah orang terhebat di dunia!"
            ];
            
            // Pilih pesan acak
            const randomMessage = ownerMessages[Math.floor(Math.random() * ownerMessages.length)];
            
            // Dapatkan foto profil pengguna dengan fallback default
            let ppUrl = await conn.profilePictureUrl(m.sender, "image").catch(() => "https://telegra.ph/file/24fa902ead26340f3df2c.png");
            
            // Siapkan objek pesan
            const messageData = {
                text: randomMessage, 
                mentions: [m.sender],
                contextInfo: {
                    externalAdReply: {
                        title: `${m.pushName} - Personal Assistant`,
                        body: 'Always at your service, Master!',
                        thumbnailUrl: ppUrl,
                        sourceUrl: 'https://wa.me/' + conn.user.jid.split('@')[0],
                        mediaType: 1,
                        renderLargerThumbnail: true
                    }
                }
            };
            
            await conn.sendMessage(m.chat, messageData, { quoted: m });
        } else {
            // Respons untuk pengguna biasa
            const userMessages = [
                "Hai, ada yang bisa aku bantu? 😊",
                "Halo! Butuh bantuan dengan sesuatu?",
                "Yo! Ada yang bisa gw bantu?",
                "Hai manusia! Aku siap membantumu hari ini!",
                "Halo! Senang bertemu denganmu! Ada yang bisa dibantu?",
                "Hai! Aku di sini untuk membantu!",
                "Halo! Terima kasih sudah menghubungiku! Ada yang bisa dibantu?"
            ];
            
            const randomUserMessage = userMessages[Math.floor(Math.random() * userMessages.length)];
            
            await conn.sendMessage(m.chat, { 
                text: randomUserMessage, 
                mentions: [m.sender]
            }, { quoted: m });
        }
    } catch (error) {
        console.error('Error dalam handler:', error);
        // Fallback response jika terjadi error
        await conn.sendMessage(m.chat, { 
            text: "Maaf, sedang ada gangguan teknis. Coba lagi nanti ya! 🙏", 
        }, { quoted: m });
    }
}

// Custom prefix untuk memanggil bot
handler.customPrefix = /^(bot|sayang|p|oy|cuk|cuy|tes|woi|hai|halo|hello|hi)$/i;
handler.command = new RegExp();

// Info handler
handler.help = ['bot', 'sayang', 'p'];
handler.tags = ['main'];
handler.category = 'main';

module.exports = handler;