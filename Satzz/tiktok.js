const axios_1 = require("axios");
const cheerio_1 = require("cheerio");



// anjay
const _tiktokurl = "https://www.tiktok.com";
const _tiktokapi = (params) => `https://api.tiktokv.com/aweme/v1/feed/?${params}`;
const _ssstikapi = "https://ssstik.io/abc?url=dl";
const _ssstikurl = "https://ssstik.io";
const _musicaldownapi = "https://musicaldown.com/download";
const _musicaldownurl = "https://musicaldown.com";
const _musicaldownmusicapi = "https://musicaldown.com/mp3/download";





// eh eh
const fetchTT = () => new Promise(async (resolve, reject) => {
axios_1.get(_ssstikurl, {headers: {"User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/111.0"}}).then(({ data }) => {
const regex = /form\.setAttribute\("include-vals",\s*"([^"]+)"\)/;
const match = data.match(regex);
if (match) {
const value = match[1];
resolve({ status: "success", result: value });
} else {
resolve({ status: "error", message: "Failed to get the request form!" });
}
}).catch((e) => resolve({ status: "error", message: e.message }));
});



const SSSTik = (url) => new Promise(async (resolve, reject) => {
const tt = await fetchTT();
if (tt.status !== "success") return resolve({ status: "error", message: tt.message });
(0, axios_1)(_ssstikapi, {method: "POST",headers: {"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",Origin: _ssstikurl,Referer: _ssstikurl + "/en","User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/111.0"},
data: new URLSearchParams(Object.entries({
id: url,
locale: "en",
tt: tt.result
}))
}).then(({ data }) => {
const $ = (0, cheerio_1.load)(data);
const desc = $("p.maintext").text().trim();
const author = {
avatar: $("img.result_author").attr("src"),
nickname: $("h2").text().trim()
};
const statistics = {
likeCount: $("#trending-actions > .justify-content-start").text().trim(),
commentCount: $("#trending-actions > .justify-content-center").text().trim(),
shareCount: $("#trending-actions > .justify-content-end").text().trim()
};
const images = [];
$("ul.splide__list > li").get().map((img) => {
images.push($(img).find("img").attr("src"));
});
if (images.length !== 0) {
resolve({
status: "success",
result: {
type: "image",
desc,
author,
statistics,
images,
music: $("a.music").attr("href")
}
});
}
else {
resolve({
status: "success",
result: {
type: "video",
desc,
author,
statistics,
video: $("a.without_watermark").attr("href"),
music: $("a.music").attr("href")
}
});
}
}).catch((e) => resolve({ status: "error", message: e.message }));
});


module.exports = { SSSTik }
