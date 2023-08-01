const fetch = require("node-fetch");
const chalk = require("chalk");
const inquirer = require("inquirer");
const fs = require("fs");
const puppeteer = require("puppeteer");
const readline = require('readline');

const headers = new fetch.Headers();
headers.append('User-Agent', 'TikTok 26.2.0 rv:262018 (iPhone; iOS 14.4.2; en_US) Cronet');

const getInput = (message) => new Promise((resolve, reject) => {
    inquirer.prompt([
        {
            type: "input",
            name: "input",
            message: message
        }
    ])
    .then(res => resolve(res))
    .catch(err => reject(err));
});

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
    const fileName = `${data.id}.mp4`
    const downloadFile = fetch(data.url);
    const file = fs.createWriteStream(folder + fileName);
    
    downloadFile.then(res => {
        res.body.pipe(file);
        file.on("finish", () => {
            file.close();
            console.log(chalk.green("[+] Downloaded successfully"));
        });
        file.on("error", (err) => {
            console.log(chalk.red("[X] Error: " + err));
        });
    });
}

(async () => {
    const urlInput = await getInput("Enter the URL : ");
    const url = urlInput.input;
    const choice = await getInput("Choose a option: With Watermark, Without Watermark");
    console.log(chalk.green(`[*] Downloading video from URL: ${url}`));
    var data = (choice.input == "With Watermark") ? await getVideoWM(url) : await getVideoNoWM(url);
    await downloadMedia(data);
})();
