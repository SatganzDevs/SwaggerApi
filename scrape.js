const axios = require('axios')
const cheerio = require('cheerio')
const fetch = require('node-fetch')
const request = require('request')



const pindl = async(url) => {
  try {
    let form = new URLSearchParams();
    form.append("url", url);
    let html = await (
      await fetch("https://pinterestvideodownloader.com/", {
        method: "POST",
        body: form,
      })
    ).text();
    const $ = cheerio.load(html);
    const videoSrc = $('video').attr('src');
    if (videoSrc) {
      return { status: true, videoUrl: videoSrc };
    } else {
      return { status: false, error: "Video not found" };
    }
  } catch (error) {
    return { status: false, error: error.message };
  }
}
const soundcloud = async(link) => {
      return new Promise((resolve, reject) => {
        const options = {
          method: "POST",
          url: "https://www.klickaud.co/download.php",
          headers: {
            "content-type": "application/x-www-form-urlencoded",
          },
          formData: {
            value: link,
            "2311a6d881b099dc3820600739d52e64a1e6dcfe55097b5c7c649088c4e50c37":
              "710c08f2ba36bd969d1cbc68f59797421fcf90ca7cd398f78d67dfd8c3e554e3",
          },
        };
        request(options, async function (error, response, body) {
          console.log(body);
          if (error) throw new Error(error);
          const $ = cheerio.load(body);
          resolve({
            judul: $(
              "#header > div > div > div.col-lg-8 > div > table > tbody > tr > td:nth-child(2)"
            ).text(),
            download_count: $(
              "#header > div > div > div.col-lg-8 > div > table > tbody > tr > td:nth-child(3)"
            ).text(),
            thumb: $(
              "#header > div > div > div.col-lg-8 > div > table > tbody > tr > td:nth-child(1) > img"
            ).attr("src"),
            link: $("#dlMP3")
              .attr("onclick")
              .split(`downloadFile('`)[1]
              .split(`',`)[0],
          });
        });
      });
    }

function pinterest(querry){
  return new Promise(async(resolve,reject) => {
     axios.get('https://id.pinterest.com/search/pins/?autologin=true&q=' + querry, {
      headers: {
      "cookie" : "_auth=1; _b=\"datr=dgHRZPXP9znuQccJISuqXCVY;sb=iFbSZJl9p5Fft_D6ybT-p152;c_user=100027826357661;xs=32%3ADmebA0mr3Id53g%3A2%3A1691506316%3A-1%3A10820%3A%3AAcW9BndOiNTsz3YWfnUcIMhyeASVA-t1M9FSlSH4dg;fr=1c8f5S30ou827667r.AWUND2xkpi206cUhNYV9NcHJySw.BlbHJ0.77.AAA.0.0.BlbHJ0.AWXWoWLxjCc;wd=1280x598;presence=EDvF3EtimeF1703191540EuserFA21B27826357661A2EstateFDutF0CEchF_7bCC;usida=eyJ2ZXIiOjEsImlkIjoiQXM2MWIxdTExajNiOTgiLCJ0aW1lIjoxNzAzMTkxNjAyfQ%3D%3D;\"; _pinterest_sess=TWc9PSZkKzNNRGwyZ0VXY0kxMUk1YWJIV3QvaTlrVDJOdVh5M3lhamlhTGtRYzVncjhKUmhhNlpHc2g3cXg4aDRHVGRpdHVWMVMyZzJmMEx1dkdlVkZHVlhwaXVWQTRzdFJ3d1hoNVI5TUxIdUU4T3F0cndmSW14QmRoNUlsa3puTnl3YU1ZdGtFaXBhVEhlaGRUQTBaa21uSnIvRm5aM2Z3MVBaQWFCRVA0bWlMYnVoN0FsdU5kVTRDK1hMVFZpT3ZlQVE4SG5sbmMxSkhIbmloVitMTXdOa0JJM2lyckVEZkpUTk8vS1Z5RVNKTUZtenNQcnpMVFlKTW01WStQNFBnM21idGMwQU1HNENpdnhLSEpCT3k1OWI1aHpKUVFiakZXM1YyVWtjTDVNa1M5WG9lVlBjbGFzN0V0RjJub0U3TGFuaHFEeTFaaHp3VGhscGwySEo5eGdIb3RyZ2g0a1FtR21lSVgySWo1K25pVkFaZzhHUzNRaFNtMWR1UFF5Q3M1ZnJYclc4ZHJmdUpqSVFUWkpWZElFVEJBPT0mRVlhdU80K1pId1M1Ym1jTDVKc05zRVVwWnFNPQ==; _ir=0"
    }
      }).then(({ data }) => {
    const $ = cheerio.load(data)
    const result = [];
    const hasil = [];
       $('div > a').get().map(b => {
        const link = $(b).find('img').attr('src')
            result.push(link)
    });
      result.forEach(v => {
     if(v == undefined) return
     hasil.push(v.replace(/236/g,'736'))
      })
      hasil.shift();
    resolve(hasil)
    })
  })
}




/*
SatganzDevs
wa.me/6281316701742
https://instagram.com/kurniawan_satriaaaa
https://github.com/SatganzDevs
*/

module.exports = { pindl, soundcloud, pinterest }


