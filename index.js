
const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const crypto = require('crypto');
const axios = require('axios');
const path = require('path');
const ytdl = require('ytdl-core');
const ffmpegPath = require('ffmpeg-static');
const { spawn } = require('child_process');
const pump = require('pump');




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
const { snapsave } = require('./snapsave.js');
const { TiktokDL } = require("@tobyg74/tiktok-api-dl")
//const { enhanceImage } = require('./remini.js');
const { scdl, pinterest, pindl } = require('./scrape.js');
const satria = require('@bochilteam/scraper')




app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increase the limit based on your image size
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/views', express.static('views'));




app.get('/', (req, res) => {
res.render('index')
const reff = path.join(__dirname, 'SatganzDevs-Sapi-1.0.0-oas3-resolved.json')
});









app.get('/api/sound', async (req, res) => {
let result = await axios.get('https://storages.satganzdevs.repl.co/api/random-sound')
let hasil = result.data.url
res.setHeader('content-type', 'audio/mpeg');
res.end(await getBuffer(hasil))
})






app.get('/api/pinterest', async (req, res) => {
const { query } = req.query;
if (!query) {
return res.status(400).json({ error: 'Query parameter is required' });
}
const result = await pinterest(query);
res.json(result);
})





app.get('/api/lirik', async (req, res) => {
const { judul } = req.query;
if (!judul) {
return res.status(400).json({ error: 'Judul musik tidak ditemukan' });
}
const result = await satria.lyrics(judul)
res.json(result);
})





app.get('/api/ytv', async (req, res) => {
try {
const { url } = req.query;
if (!url) { return res.status(400).json({ error: 'Missing URL parameter' }) }
if (!ytdl.validateURL(url)) { return res.status(400).json({ error: 'Invalid YouTube URL' }) }
const videoStream = ytdl(url, { filter: format => format.container === 'mp4' });
res.setHeader('content-type', 'video/mp4');
videoStream.pipe(res);
} catch (error) {
console.error(error);
res.status(500).json({ error: 'Internal server error' });
}
});





app.get('/api/thumb', async (req, res) => {
try {
const query = ["tsunade icon", "tsunade waifu icon", "tsunade anime icon", "tsunade girl icon"];
const result = await pinterest('kanna kamui icon fanart&rs=guide&source_module_id=OBkanna_kamui_icon8034f28a-ee45-4a1c-a0cf-bf88b55429d2&journey_depth=1&add_refine=Kamui icon%7Cguide%7Cword%7C2');
if (!result || result.length === 0) {
res.status(404).send("No results found");
return;
}
const randomImageUrl = pickRandom(result);
if (!randomImageUrl) {
res.status(500).send("Internal Server Error");
return;
}
const imageResponse = await axios.get(randomImageUrl, { responseType: 'arraybuffer' });
res.writeHead(200, { 'Content-Type': 'image/jpeg' }); 
res.end(imageResponse.data, 'binary');
} catch (error) {
console.error(error);
res.status(500).send("Internal Server Error");
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
const audioStream = ytdl(url, { quality: 'highestaudio' });
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





app.post('/api/enhance-image', async (req, res) => {
try {
const imageData = req.body.image;
const imageBuffer = Buffer.from(imageData, 'base64');
const tempFilePath = 'temp_image.jpeg';
await fs.writeFile(tempFilePath, imageBuffer);
await enhanceImage(tempFilePath, "OHKItQuVy1N4c9B0HOOeWlUD8E2-d3VW4sBnQI2AX33Zbsbt");
const enhancedImageContent = await fs.readFile('output_image.jpeg');
await fs.unlink(tempFilePath);
await fs.unlink('output_image.jpeg');
res.send(enhancedImageContent);
} catch (error) {
const imageData = req.body.image;
const imageBuffer = Buffer.from(imageData, 'base64');
const tempFilePath = 'temp_image.jpeg';
await fs.writeFile(tempFilePath, imageBuffer);
await enhanceImage(tempFilePath, "y03sv_sa6ww7qqrwelmhFbke3-eQds9SA3wqAJUVEJbMlLQR");
const enhancedImageContent = await fs.readFile('output_image.jpeg');
await fs.unlink(tempFilePath);
await fs.unlink('output_image.jpeg');
res.send(enhancedImageContent);
}
});





async function enhanceImage(imagePath, api) {
const content = await fs.readFile(imagePath);
const md5Hash = crypto.createHash('md5').update(content).digest('base64');
const client = axios.create({
baseURL: 'https://developer.remini.ai/api',
headers: { Authorization: `Bearer ${api}` },
timeout: 60000,
});
console.log('Submitting image ...');
const submitTaskResponse = await client.post('/tasks', {
tools: [
{ type: 'face_enhance', mode: 'beautify' },
{ type: 'background_enhance', mode: 'base' },

],
image_md5: md5Hash,
image_content_type: 'image/jpeg',
output_content_type: 'image/jpeg',
});
const taskID = submitTaskResponse.data.task_id;
const uploadURL = submitTaskResponse.data.upload_url;
const uploadHeaders = submitTaskResponse.data.upload_headers;
console.log('Uploading image to Google Cloud Storage ...');
await axios.put(uploadURL, content, { headers: uploadHeaders });
console.log(`Processing task: ${taskID} ...`);
await client.post(`/tasks/${taskID}/process`);
console.log(`Polling result for task: ${taskID} ...`);
for (let i = 0; i < 50; i++) {
const getTaskResponse = await client.get(`/tasks/${taskID}`);
if (getTaskResponse.data.status === 'completed') {
console.log('Processing completed.');
console.log('Output url: ' + getTaskResponse.data.result.output_url);
await fs.writeFile('output_image.jpeg', getTaskResponse.data.result.output_url);
break;
} else {
if (getTaskResponse.data.status !== 'processing') {
console.error('Found illegal status: ' + getTaskResponse.data.status);
process.exit(1);
}
console.log('Processing, sleeping 2 seconds ...');
await new Promise((resolve) => setTimeout(resolve, 2000));
}
}
}





app.listen(PORT, () => {
console.log(`Server is running on port ${PORT}`);
});
