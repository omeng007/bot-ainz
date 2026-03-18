require("dotenv").config();

global.owner = ["6287755090983"]; // wajib di isi tidak boleh kosong
global.mods = ["6287755090983"]; // wajib di isi tidak boleh kosong
global.prems = ["6287755090983"]; // wajib di isi tidak boleh kosong
global.nameowner = "ᴀɪɴᴢ"; // wajib di isi tidak boleh kosong
global.numberowner = "6287755090983"; // wajib di isi tidak boleh kosong
global.mail = "support@Az.eu.org"; // wajib di isi tidak boleh kosong
global.gc = "https://chat.whatsapp.com/Lhqaza71YXN1H8R6Di2YFp"; // wajib di isi tidak boleh kosong
global.instagram = "https://instagram.com/ainzvldgd"; // wajib di isi tidak boleh kosong
global.wm = "© ʜᴀꜱʜɪʀᴀ - ᴀɪ • ʙʏ ᴀɪɴᴢ"; // isi nama bot atau nama kalian
global.wait = "_*Tunggu sedang di proses...*_"; // ini pesan simulasi loading
global.eror = "_*Server Error*_"; // ini pesan saat terjadi kesalahan
global.stiker_wait = "*⫹⫺ Stiker sedang dibuat...*"; // ini pesan simulasi saat loading pembuatan sticker
global.packname = "© ʜᴀꜱʜɪʀᴀ - ᴀɪ"; // watermark stikcker packname
global.author = "ʙʏ ᴀɪɴᴢ"; // watermark stikcker author
global.maxwarn = "5"; // Peringatan maksimum Warn

global.autobio = true; // Set true/false untuk mengaktifkan atau mematikan autobio (default: false)
global.antiporn = false; // Set true/false untuk Auto delete pesan porno (bot harus admin) (default: false)
global.spam = false; // Set true/false untuk anti spam (default: false)
global.gcspam = false; // Set true/false untuk menutup grup ketika spam (default: false)

// APIKEY INI WAJIB DI ISI! //
global.btc = "gpdV9HTp";
// global.btc = process.env.API_KEY_BTC;
// aktifkan akses .env di atas jika kamu ingin menaruh key api di .env
// Daftar terlebih dahulu https://api.botcahx.eu.org

// AKSESKEY INI DI ISI JIKA DIPERLUKAN (e.g suno ai (ai music ) & fitur prem lainnya//
global.aksesKey = "YOUR_AKSESKEY_HERE";
// global.aksesKey = process.env.API_KEY_BTC_AKSESKEY;
// aktifkan akses .env di atas jika kamu ingin menaruh key api di .env
// Daftar terlebih dahulu https://api.botcahx.eu.org

// Tidak boleh diganti atau di ubah
global.APIs = {
  btc: "https://api.botcahx.eu.org",
};

//Tidak boleh diganti atau di ubah
global.APIKeys = {
  "https://api.botcahx.eu.org": global.btc,
};

let fs = require("fs");
let chalk = require("chalk");
let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(chalk.redBright("Update 'config.js'"));
  delete require.cache[file];
  require(file);
});

