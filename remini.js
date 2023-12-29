fs = require('fs');
axios = require('axios');
crypto = require('crypto');




async function enhanceImage(imagePath) {
const content = await fs.readFile(imagePath);
const md5Hash = crypto.createHash('md5').update(content).digest('base64');
const client = axios.create({
baseURL: 'https://developer.remini.ai/api',
headers: { Authorization: `Bearer y03sv_sa6ww7qqrwelmhFbke3-eQds9SA3wqAJUVEJbMlLQR` },
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
module.exports = { enhanceImage}