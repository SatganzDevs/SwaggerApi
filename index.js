
const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const crypto = require('crypto');
const axios = require('axios');
const path = require('path');
const cheerio = require('cheerio')
const ytdl = require('ytdl-core');
const ffmpegPath = require('ffmpeg-static');
const { spawn } = require('child_process');
const pump = require('pump');



const nomorRandom = (min, max) => {
return Math.floor(Math.random() * (max - min + 1)) + min };
const creator = 'satganzdevs'
const getBuffer = async (url, options) => {
try {
options ? options : {}
const res = await axios({method: "get", url, headers: { 'DNT': 1, 'Upgrade-Insecure-Request': 1  }, ...options, responseType: 'arraybuffer'})
return res.data
} catch (err) { return err }
}
const pickRandom = (arr) => { return arr[Math.floor(Math.random() * arr.length)] };
const app = express();
const PORT = process.env.PORT || 3000;
const { snapsave } = require('./Satzz/snapsave.js');
const { TiktokDL } = require("@tobyg74/tiktok-api-dl")
const { scdl, pinterest, pindl } = require('./Satzz/scrape.js');





app.use(cors());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/views', express.static('views'));




app.get('/', (req, res) => {
res.render('index')
const reff = path.join(__dirname, 'SatganzDevs-Sapi-1.0.0-oas3-resolved.json')
});



/// STARTS OF API CODE \\\
app.get('/api/welcome', async (req, res) => {
const Welcomer = require('@cycloneaddons/welcomer');
const image = new Welcomer()
.setBackground("https://i.pinimg.com/originals/28/36/ef/2836efe516eb35bcd9b959855e1a1dd9.jpg")
.setGIF(false)
.setAvatar(req.avatar)
.setName(req.username)
.setDiscriminator(req.discriminator)
.setBlur(2)
let welcome_img = await image.generate()
res.setHeader('content-type', 'image/png');
res.end(welcome_img)
})
app.get('/api/pinterest', async (req, res) => {
const { query } = req.query;
if (!query) {
return res.status(400).json({ error: 'Query parameter is required' });
}
const result = await pinterest(query);
res.json(result);
})
app.get('/api/pinterestdl', async (req, res) => {
try {
const { url } = req.query;
if (!url) { return res.status(400).json({ error: 'Missing URL parameter' }) }
const results = await pindl(url);
res.json(results)
} catch (error) {
console.error(error);
res.status(500).json({ error: 'Internal server error' });
}
})
app.get('/api/lirik', async (req, res) => {
try {
const Buscar = require("lyria-npm")
const { judul } = req.query;
if (!judul) {
return res.status(400).json({ error: 'Judul musik tidak ditemukan' });
}
let ss = await Buscar(judul)
let bro = {
  title: ss.titulo,
  artist: ss.artista,
  album: ss.albulm,
  release: ss.fecha,
  genre: ss.Generos,
  listen: ss.Escuchar,
  lyrics: ss.letra
}
res.json(bro);
} catch (error) {
console.log('[lyric-api]:', error.message, error.stack)
}
})
app.get('/api/ytv', async (req, res) => {
try {
const { url } = req.query;
if (!url) { return res.status(400).json({ error: 'Missing URL parameter' }) }
if (!ytdl.validateURL(url)) { return res.status(400).json({ error: 'Invalid YouTube URL' }) }
const videoStream = await ytdl(url);
res.setHeader('content-type', 'video/mp4');
videoStream.pipe(res);
} catch (error) {
console.error(error);
res.status(500).json({ error: 'Internal server error' });
}
});
app.get('/api/yta', async (req, res) => {
try {
const { url } = req.query;
if (!url) {
return res.status(400).json({ error: 'Missing URL parameter' });
}
if (!ytdl.validateURL(url)) {
return res.status(400).json({ error: 'Invalid YouTube URL' });
}   
const audioStream = await ytdl(url,  { filter: "audioonly" });
res.setHeader('content-type', 'audio/mpeg');
audioStream.pipe(res);
} catch (error) {
console.error(error);
res.status(500).json({ error: 'Internal server error' });
}
});
app.get('/api/snapsave', async (req, res) => {
try {
const { url } = req.query;
if (!url) {
return res.status(400).json({ error: 'Missing URL parameter' });
}
const result = await snapsave(url);
res.json(result);
} catch (error) {
console.log(error);
res.status(500).json({ error: 'Internal server error' });
}
})
app.get('/api/tiktok', async (req, res) => {
try {
const { url } = req.query;
if (!url) {
return res.status(400).json({ error: 'Missing URL parameter' });
}
const result = await TiktokDL(url, {version: "v3"})
res.json(result);
} catch (error) {
console.log(error);
res.status(500).json({ error: 'Internal server error' });
}
})








app.listen(PORT, () => {
console.log(`「 Connected 」 Server is running on port ${PORT}`);
});
