import fs from 'fs';
import path from 'path';
import yts from 'yt-search';
import ytdl from 'ytdl-core';

export function downloadVideoFromYouTube(url:string, options: { isVideo?: boolean; isAudio?: boolean; }): Promise<{ videoPath?: string, audioPath?: string, metadata: yts.VideoMetadataResult, videoDetails: ytdl.MoreVideoDetails }> {
  return new Promise(async (resolve, reject) => {
    try {
      if (!ytdl.validateURL(url)) {
        const searchResult = await yts(url);
        url = searchResult.videos[0].url;
      }

      const videoInfo = await ytdl.getInfo(url);
      const match = url.match(/(?<=v=)[\w-]+|[\w-]+(?=&feature=youtu.be|v=)/);
      const videoId = match ? match[0] : ''; 
      const video = await yts({ videoId });

      let videoPath: string | undefined;
      let audioPath: string | undefined;

      if (options.isVideo) {
        const videoFormat = ytdl.chooseFormat(videoInfo.formats, { quality: 'highest' });
        videoPath = path.join(__dirname, `video.${videoFormat.container}`);
        const videoStream = ytdl(url, { format: videoFormat });
        videoStream.pipe(fs.createWriteStream(videoPath));
      }

      if (options.isAudio) {
        const audioFormat = ytdl.chooseFormat(videoInfo.formats, { quality: 'highestaudio' });
        audioPath = path.join(__dirname, `audio.${audioFormat.container}`);
        const audioStream = ytdl(url, { format: audioFormat });
        audioStream.pipe(fs.createWriteStream(audioPath));
      }

      resolve({ videoPath, audioPath, metadata: video, videoDetails: videoInfo.videoDetails});
    } catch (err) {
      reject(err);
    }
  });
}
