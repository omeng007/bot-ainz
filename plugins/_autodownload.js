const fetch = require('node-fetch');
const axios = require('axios');

let handler = (m) => m;

handler.before = async function (m, { conn, isPrems }) {
    let chat = global.db.data.chats[m.chat];
    if (!m.text) return;
    if (m.text.startsWith("=>") || m.text.startsWith(">") || m.text.startsWith(".") || m.text.startsWith("#") || m.text.startsWith("!") || m.text.startsWith("/") || m.text.startsWith("\\")) return;
    if (chat.isBanned) return;
    if (!m.text.includes("http")) return;

    let text = m.text.replace(/\n+/g, " ");

    const tiktokRegex = /^(?:https?:\/\/)?(?:www\.|vt\.|vm\.|t\.)?(?:tiktok\.com\/)(?:\S+)?$/i;
    const douyinRegex = /^(?:https?:\/\/)?(?:www\.|vt\.|vm\.|t\.|v\.)?(?:douyin\.com\/)(?:\S+)?$/i;
    const instagramRegex = /^(?:https?:\/\/)?(?:www\.)?(?:instagram\.com\/)(?:tv\/|p\/|reel\/)(?:\S+)?$/i;
    const facebookRegex = /^(?:https?:\/\/(web\.|www\.|m\.)?(facebook|fb)\.(com|watch)\S+)?$/i;
    const pinRegex = /^(?:https?:\/\/)?(?:www\.|id\.)?(?:pinterest\.(?:com|it|co\.[a-z]{2}|[a-z]{2})|pin\.it)\/(?:pin\/)?[^\/\s]+(?:\/)?$/i;
    const youtubeRegex = /^(?:https?:\/\/)?(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]+)(?:\S+)?$/i;
    const spotifyRegex = /^(?:https?:\/\/)?(?:open\.spotify\.com\/track\/)([a-zA-Z0-9]+)(?:\S+)?$/i;
    const twitterRegex = /^(?:https?:\/\/)?(?:www\.)?(?:twitter\.com|x\.com)\/([A-Za-z0-9_]+)\/status\/(\d+)(?:\?[^#]*)?(?:#.*)?$/i;
    const threadsRegex = /^(https?:\/\/)?(www\.)?(threads\.(net|com))(\/[^\s]*)?(\?[^\s]*)?$/;
    const capcutRegex = /^(https?:\/\/)?(www\.)?capcut\.com\/(t|tv|tv2|template|link|vc)\/[A-Za-z0-9_-]+(\/)?(\?.*)?$/i;
    const snackvideoRegex = /^(https?:\/\/)?(www\.)?(snackvideo|kwai)\.com\/@[A-Za-z0-9_.-]+\/video\/[0-9]+(\?.*)?$/i;
    const xiaohongshuRegex = /^(https?:\/\/)?(www\.)?(xiaohongshu\.com\/discovery\/item\/[a-zA-Z0-9]+|xhslink\.com\/[a-zA-Z0-9/]+)(\?.*)?$/i;
    const soundcloudRegex = /^(https?:\/\/)?(www\.|m\.)?soundcloud\.com\/[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?(\?.*)?$/i;
    const cocofunRegex = /^(https?:\/\/)?(www\.)?icocofun\.com\/share\/post\/\d+(\?.*)?$/i;

    if (text.match(tiktokRegex)) {
        conn.sendMessage(m.chat, { react: { text: "🕒", key: m.key } });
        await _tiktok(text.match(tiktokRegex)[0], m, conn);
    } else if (text.match(douyinRegex)) {
        conn.sendMessage(m.chat, { react: { text: "🕒", key: m.key } });
        await _douyin(text.match(douyinRegex)[0], m, conn);
    } else if (text.match(instagramRegex)) {
        conn.sendMessage(m.chat, { react: { text: "🕒", key: m.key } });
        await _instagram(text.match(instagramRegex)[0], m, conn);
    } else if (text.match(facebookRegex)) {
        conn.sendMessage(m.chat, { react: { text: "🕒", key: m.key } });
        await _facebook(text.match(facebookRegex)[0], m, conn);
    } else if (text.match(pinRegex)) {
        conn.sendMessage(m.chat, { react: { text: "🕒", key: m.key } });
        await _pindl(text.match(pinRegex)[0], m, conn);
    } else if (text.match(youtubeRegex)) {
        conn.sendMessage(m.chat, { react: { text: "🕒", key: m.key } });
        await _youtube(text.match(youtubeRegex)[0], m, conn);
    } else if (text.match(spotifyRegex)) {
        conn.sendMessage(m.chat, { react: { text: "🕒", key: m.key } });
        await _spotify(text.match(spotifyRegex)[0], m, conn);
    } else if (text.match(twitterRegex)) {
        conn.sendMessage(m.chat, { react: { text: "🕒", key: m.key } });
        await _twitter(text.match(twitterRegex)[0], m, conn);
    } else if (text.match(threadsRegex)) {
        conn.sendMessage(m.chat, { react: { text: "🕒", key: m.key } });
        await _threads(text.match(threadsRegex)[0], m, conn);
    } else if (text.match(capcutRegex)) {
        conn.sendMessage(m.chat, { react: { text: "🕒", key: m.key } });
        await _capcut(text.match(capcutRegex)[0], m, conn);
    } else if (text.match(snackvideoRegex)) {
        conn.sendMessage(m.chat, { react: { text: "🕒", key: m.key } });
        await _snackvideo(text.match(snackvideoRegex)[0], m, conn);
    } else if (text.match(xiaohongshuRegex)) {
        conn.sendMessage(m.chat, { react: { text: "🕒", key: m.key } });
        await _xiaohongshu(text.match(xiaohongshuRegex)[0], m, conn);
    } else if (text.match(soundcloudRegex)) {
        conn.sendMessage(m.chat, { react: { text: "🕒", key: m.key } });
        await _soundcloud(text.match(soundcloudRegex)[0], m, conn);
    } else if (text.match(cocofunRegex)) {
        conn.sendMessage(m.chat, { react: { text: "🕒", key: m.key } });
        await _cocofun(text.match(cocofunRegex)[0], m, conn);
    }

    return true;
};

module.exports = handler;

let old = new Date();
const _sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function _tiktok(link, m, conn) {
    try {
        if (global.db.data.users[m.sender].limit <= 0)
            return conn.reply(m.chat, "❌ Limit kamu habis!", m);

        const response = await fetch(`https://api.nexray.web.id/downloader/tiktok?url=${encodeURIComponent(link)}`);
        const data = await response.json();

        if (!data.status || !data.result) throw new Error("Respons API tidak valid.");

        const result = data.result;
        const mediaData = result.data;

        global.db.data.users[m.sender].limit -= 1;

        if (Array.isArray(mediaData) && mediaData.length > 0) {
            for (let i = 0; i < mediaData.length; i++) {
                await conn.sendMessage(
                    m.chat,
                    {
                        image: { url: mediaData[i] },
                        caption: i === 0 ? `🍟 *Fetching* : ${(new Date() - old) * 1} ms\n📸 *Total Gambar:* ${mediaData.length}` : null,
                    },
                    { quoted: m }
                );
                if (i < mediaData.length - 1) await _sleep(3000);
            }
        } else if (typeof mediaData === 'string' && mediaData) {
            await conn.sendMessage(
                m.chat,
                {
                    video: { url: mediaData },
                    caption: `🍟 *Fetching* : ${(new Date() - old) * 1} ms`,
                },
                { quoted: m }
            );
        } else {
            throw new Error("Tidak ada media yang ditemukan.");
        }
    } catch (error) {
        console.error("Error _tiktok:", error);
        conn.reply(m.chat, `⚠️ Gagal mengunduh TikTok: ${error.message}`, m);
    }
}

async function _douyin(link, m, conn) {
    try {
        if (global.db.data.users[m.sender].limit <= 0)
            return conn.reply(m.chat, "limit kamu habis!", m);

        let response = await fetch(`https://api.botcahx.eu.org/api/download/douyin?url=${link}&apikey=${btc}`);
        let data = await response.json();

        if (!data.result.video || data.result.video.length === 0) {
            response = await fetch(`https://api.botcahx.eu.org/api/download/douyinslide?url=${link}&apikey=${btc}`);
            data = await response.json();
            if (data.result.images && data.result.images.length > 0) {
                global.db.data.users[m.sender].limit -= 1;
                for (let img of data.result.images) {
                    await conn.sendFile(m.chat, img, null, `🍟 *Fetching* : ${(new Date() - old) * 1} ms`, m);
                    await _sleep(3000);
                }
                return;
            }
        }

        if (data.result.video && data.result.video.length > 0) {
            global.db.data.users[m.sender].limit -= 1;
            if (data.result.video.length > 1) {
                for (let v of data.result.video) {
                    await conn.sendFile(m.chat, v, null, `🍟 *Fetching* : ${(new Date() - old) * 1} ms`, m);
                    await _sleep(3000);
                }
            } else {
                await conn.sendMessage(
                    m.chat,
                    {
                        video: { url: data.result.video[0] },
                        caption: `🍟 *Fetching* : ${(new Date() - old) * 1} ms`,
                    },
                    { quoted: m }
                );
            }
        } else {
            conn.reply(m.chat, "Maaf, tidak dapat mengunduh konten!", m);
        }
    } catch (error) {
        console.error(error);
    }
}

async function _instagram(link, m, conn) {
    try {
        if (global.db.data.users[m.sender].limit <= 0)
            return conn.reply(m.chat, "❌ Limit kamu habis!", m);

        const response = await fetch(`https://api.nexray.web.id/downloader/instagram?url=${encodeURIComponent(link)}`);
        const res = await response.json();

        if (!res.result || !Array.isArray(res.result))
            throw new Error("Gagal mendapatkan media Instagram!");

        const limitnya = 3;
        global.db.data.users[m.sender].limit -= 1;

        for (let i = 0; i < Math.min(limitnya, res.result.length); i++) {
            const item = res.result[i];
            const caption = `🍟 *Fetching* : ${(new Date() - old) * 1} ms`;

            if (item.type === "video") {
                await conn.sendFile(m.chat, item.url, "ig.mp4", caption, m);
            } else if (item.type === "image") {
                await conn.sendFile(m.chat, item.url, "ig.jpg", caption, m);
            }
            if (i < Math.min(limitnya, res.result.length) - 1) await _sleep(3000);
        }
    } catch (err) {
        console.error("Error _instagram:", err);
        conn.reply(m.chat, `⚠️ Gagal mengunduh Instagram: ${err.message}`, m);
    }
}

async function _facebook(link, m, conn) {
    try {
        if (global.db.data.users[m.sender].limit <= 0)
            return conn.reply(m.chat, "❌ Limit kamu habis!", m);

        const response = await fetch(`https://api.deline.web.id/downloader/facebook?url=${encodeURIComponent(link)}`);
        let json = await response.json();

        if (!json.result?.download)
            throw new Error("Gagal mendapatkan video Facebook!");

        global.db.data.users[m.sender].limit -= 1;
        await conn.sendFile(m.chat, json.result.download, "fb.mp4", `🍟 *Fetching* : ${(new Date() - old) * 1} ms`, m);
    } catch (error) {
        console.error("Error _facebook:", error);
        conn.reply(m.chat, `⚠️ Gagal mengunduh Facebook: ${error.message}`, m);
    }
}

async function _pindl(link, m, conn) {
    try {
        if (global.db.data.users[m.sender].limit <= 0)
            return conn.reply(m.chat, "limit kamu habis!", m);

        const api = await fetch(`https://api.botcahx.eu.org/api/download/pinterest?url=${link}&apikey=${btc}`);
        const res = await api.json();
        if (res.result && res.result.data) {
            let { media_type, image, video } = res.result.data;
            global.db.data.users[m.sender].limit -= 1;
            if (media_type === "video/mp4") {
                await conn.sendMessage(m.chat, {
                    video: { url: video },
                    caption: `🍟 *Fetching* : ${(new Date() - old) * 1} ms`,
                }, { quoted: m });
            } else {
                await conn.sendFile(m.chat, image, "pindl.jpeg", `🍟 *Fetching* : ${(new Date() - old) * 1} ms`, m);
            }
        } else {
            conn.reply(m.chat, "Gagal mendapatkan media!", m);
        }
    } catch (error) {
        console.error(error);
    }
}

async function _youtube(link, m, conn) {
    try {
        if (global.db.data.users[m.sender].limit <= 0)
            return conn.reply(m.chat, "❌ Limit kamu habis!", m);

        const apiUrl = `https://api.nexray.web.id/downloader/ytmp4?url=${encodeURIComponent(link)}&resolusi=720`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (!data.status || !data.result?.url) 
            throw new Error("Gagal mendapatkan video YouTube!");

        global.db.data.users[m.sender].limit -= 1;
        await conn.sendMessage(
            m.chat,
            {
                video: { url: data.result.url },
                caption: `🍟 *Fetching* : ${(new Date() - old) * 1} ms`,
            },
            { quoted: m }
        );
    } catch (error) {
        console.error("Error _youtube (NexRay):", error);
        conn.reply(m.chat, `⚠️ Gagal mengunduh YouTube: ${error.message}`, m);
    }
}

async function _spotify(url, m, conn) {
    try {
        if (global.db.data.users[m.sender].limit <= 0)
            return conn.reply(m.chat, "❌ Limit kamu habis!", m);

        const apiUrl = `https://api.nexray.web.id/downloader/v1/spotify?url=${encodeURIComponent(url)}`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (!data.status || !data.result?.url) 
            throw new Error("Gagal mendapatkan audio Spotify!");

        global.db.data.users[m.sender].limit -= 1;
        await conn.sendMessage(
            m.chat,
            {
                audio: { url: data.result.url },
                mimetype: "audio/mpeg",
                caption: `🍟 *Fetching* : ${(new Date() - old) * 1} ms`,
            },
            { quoted: m }
        );
    } catch (e) {
        console.error("Error _spotify (NexRay):", e);
        conn.reply(m.chat, `⚠️ Gagal mengunduh Spotify: ${e.message}`, m);
    }
}

async function _twitter(url, m, conn) {
    try {
        if (global.db.data.users[m.sender].limit <= 0)
            return conn.reply(m.chat, "Limit kamu habis!", m);

        const api = await fetch(`https://api.botcahx.eu.org/api/download/twitter2?url=${url}&apikey=${btc}`);
        const res = await api.json();
        if (res.result && res.result.mediaURLs) {
            global.db.data.users[m.sender].limit -= 1;
            for (const url of res.result.mediaURLs) {
                const response = await fetch(url);
                const buffer = await response.buffer();
                await _sleep(3000);
                conn.sendFile(m.chat, buffer, null, `🍟 *Fetching* : ${(new Date() - old) * 1} ms`, m);
            }
        } else {
            conn.reply(m.chat, "Gagal mendapatkan media dari Twitter!", m);
        }
    } catch (error) {
        console.error(error);
    }
}

async function _threads(url, m, conn) {
    try {
        if (global.db.data.users[m.sender].limit <= 0)
            return conn.reply(m.chat, "Limit kamu habis!", m);

        const apiResponse = await fetch(`https://api.botcahx.eu.org/api/download/threads?url=${url}&apikey=${btc}`);
        const api = await apiResponse.json();
        const foto = api.result.image_urls?.[0] || null;
        const video = api.result.video_urls?.[0] || null;

        if (video) {
            await conn.sendFile(m.chat, video.download_url, "threads.mp4", `🍟 *Fetching* : ${(new Date() - old) * 1} ms`, m);
        } else if (foto) {
            await conn.sendFile(m.chat, foto, "threads.jpeg", `🍟 *Fetching* : ${(new Date() - old) * 1} ms`, m);
        } else {
            throw "Konten tidak ditemukan!";
        }
        global.db.data.users[m.sender].limit -= 1;
    } catch (error) {
        console.error(error);
    }
}

async function _capcut(url, m, conn) {
    try {
        if (global.db.data.users[m.sender].limit <= 0)
            return conn.reply(m.chat, "❌ Limit kamu habis!", m);

        const apiUrl = `https://api.nexray.web.id/downloader/v1/capcut?url=${encodeURIComponent(url)}`;
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();

        if (!data.status) {
            throw new Error(`API Error: ${data.message || 'Status false'}`);
        }

        if (!data.result?.url) {
            throw new Error("URL video tidak ditemukan dalam respons");
        }

        global.db.data.users[m.sender].limit -= 1;
        await conn.sendMessage(
            m.chat,
            {
                video: { url: data.result.url },
                caption: `🍟 *Fetching* : ${(new Date() - old) * 1} ms`,
            },
            { quoted: m }
        );
    } catch (e) {
        console.error("Error _capcut:", e);
        conn.reply(m.chat, `⚠️ Gagal mengunduh CapCut: ${e.message}`, m);
    }
}

async function _snackvideo(url, m, conn) {
    try {
        if (global.db.data.users[m.sender].limit <= 0)
            return conn.reply(m.chat, "❌ Limit kamu habis!", m);

        const apiUrl = `https://api.nexray.web.id/downloader/snackvideo?url=${encodeURIComponent(url)}`;
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();

        if (!data.status) {
            throw new Error(`API Error: ${data.message || 'Status false'}`);
        }

        if (!data.result?.download_url) {
            throw new Error("URL download tidak ditemukan dalam respons");
        }

        global.db.data.users[m.sender].limit -= 1;
        await conn.sendMessage(
            m.chat,
            {
                video: { url: data.result.download_url },
                caption: `🍟 *Fetching* : ${(new Date() - old) * 1} ms`,
            },
            { quoted: m }
        );
    } catch (e) {
        console.error("Error _snackvideo:", e);
        conn.reply(m.chat, `⚠️ Gagal mengunduh SnackVideo: ${e.message}`, m);
    }
}

async function _xiaohongshu(url, m, conn) {
    try {
        if (global.db.data.users[m.sender].limit <= 0)
            return conn.reply(m.chat, "Limit kamu habis!", m);

        let res = await axios.get(`https://api.botcahx.eu.org/api/download/rednote?url=${url}&apikey=${btc}`);
        let result = res.data.result;

        if (!result || !result.media) throw `Gagal mengambil data!`;

        global.db.data.users[m.sender].limit -= 1;

        const media = result.media;
        if (media.videoUrl) {
            await conn.sendMessage(
                m.chat,
                { video: { url: media.videoUrl }, caption: `🍟 *Fetching* : ${(new Date() - old) * 1} ms` },
                { quoted: m }
            );
        } else if (media.images && media.images.length > 0) {
            for (let img of media.images) {
                await _sleep(3000);
                await conn.sendMessage(
                    m.chat,
                    { image: { url: img }, caption: `🍟 *Fetching* : ${(new Date() - old) * 1} ms` },
                    { quoted: m }
                );
            }
        }
    } catch (e) {
        console.log(e);
    }
}

async function _soundcloud(url, m, conn) {
    try {
        if (global.db.data.users[m.sender].limit <= 0)
            return conn.reply(m.chat, "Limit kamu habis!", m);

        const res = await fetch(`https://api.botcahx.eu.org/api/download/soundcloud?url=${url}&apikey=${btc}`);
        let anu = await res.json();
        await conn.sendMessage(
            m.chat,
            { audio: { url: anu.result.url }, mimetype: "audio/mpeg", caption: `🍟 *Fetching* : ${(new Date() - old) * 1} ms` },
            { quoted: m }
        );
        global.db.data.users[m.sender].limit -= 1;
    } catch (e) {
        console.log(e);
    }
}

async function _cocofun(url, m, conn) {
    try {
        if (global.db.data.users[m.sender].limit <= 0)
            return conn.reply(m.chat, "Limit kamu habis!", m);

        const res = await fetch(`https://api.botcahx.eu.org/api/download/cocofun?url=${encodeURIComponent(url)}&apikey=${btc}`);
        const json = await res.json();
        const videoUrl = json.result.no_watermark || json.result.watermark;
        await conn.sendMessage(
            m.chat,
            { video: { url: videoUrl }, caption: `🍟 *Fetching* : ${(new Date() - old) * 1} ms` },
            { quoted: m }
        );
        global.db.data.users[m.sender].limit -= 1;
    } catch (e) {
        console.log(e);
    }
}