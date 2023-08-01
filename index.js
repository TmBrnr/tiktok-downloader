/*  by Naufal Taufiq Ridwan
    Github : https://github.com/n0l3r
    Don't remove credit.
*/

const express = require('express');
const fetch = require("node-fetch");
const fs = require("fs");
const puppeteer = require("puppeteer");
const app = express();
app.use(express.json());
const cors = require('cors');
app.use(cors({ origin: 'http://localhost:3000' })); // replace with your React app's URL
app.use(express.json());
const path = require("path");




const headers = new fetch.Headers();
headers.append('User-Agent', 'TikTok 26.2.0 rv:262018 (iPhone; iOS 14.4.2; en_US) Cronet');

const getVideoWM = async (url) => {
    const idVideo = getIdVideo(url)
    const API_URL = `https://api16-normal-c-useast1a.tiktokv.com/aweme/v1/feed/?aweme_id=${idVideo}`;
    const request = await fetch(API_URL, {
        method: "GET",
        headers : headers
    });
    const body = await request.text();
    var res = JSON.parse(body);
    const urlMedia = res.aweme_list[0].video.download_addr.url_list[0]
    const data = {
        url: urlMedia,
        id: idVideo
    }
    return data
}

const getVideoNoWM = async (url) => {
    const idVideo = getIdVideo(url)
    const API_URL = `https://api16-normal-c-useast1a.tiktokv.com/aweme/v1/feed/?aweme_id=${idVideo}`;
    const request = await fetch(API_URL, {
        method: "GET",
        headers : headers
    });
    const body = await request.text();
    var res = JSON.parse(body);
    const urlMedia = res.aweme_list[0].video.play_addr.url_list[0]
    const data = {
        url: urlMedia,
        id: idVideo
    }
    return data
}

const getIdVideo = (url) => {
    const idVideo = url.substring(url.indexOf("/video/") + 7, url.length);
    return (idVideo.length > 19) ? idVideo.substring(0, idVideo.indexOf("?")) : idVideo;
}

const downloadMedia = async (data) => {
    const folder = "downloads/";
    const fileName = `${data.id}.mp4`;
    const downloadFile = fetch(data.url);
    const file = fs.createWriteStream(path.join(folder, fileName));
  
    return new Promise((resolve, reject) => {
        downloadFile.then(res => {
            res.body.pipe(file);
            file.on("finish", () => {
                file.close();
                console.log("[+] Downloaded successfully");
                resolve(fileName); // Resolve promise with fileName when download is complete
            });
            file.on("error", (err) => {
                console.log("[X] Error: " + err);
                reject(err);
            });
        });
    });
}

app.get('/download', async (req, res) => {
    const url = req.query.url;
    const watermark = req.query.watermark;
    console.log(`[*] Downloading video from URL: ${url}`);
    var data = (watermark === "With Watermark") ? await getVideoWM(url) : await getVideoNoWM(url);
    const fileName = await downloadMedia(data);
    res.setHeader('Content-Disposition', 'attachment; filename=' + fileName);
    res.setHeader('Content-Transfer-Encoding', 'binary');
    res.sendFile(path.join(__dirname, `downloads/${fileName}`));
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on Port ${port}`));

