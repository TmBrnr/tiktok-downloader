<h1 style="align: center;">Tiktok Downloader</h1>

<h2>Installation</h2>
run in your terminal:

```
git clone https://github.com/n0l3r/tiktok-downloader.git
cd tiktok-downloader
npm i
node index
```

<br>
<h3>Push to Cloud</h3>
```
docker build -t tiktok-downloader
docker tag tiktok-downloader:latest gcr.io/PROJECT_ID/tiktok-downloader
docker push gcr.io/PROJECT_ID/tiktok-downloader
gcloud run deploy --image gcr.io/PROJECT_ID/tiktok-downloader --platform managed
```



