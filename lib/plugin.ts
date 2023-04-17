import fs from 'fs';
import path from 'path';
// import * as http from 'http';
import ffmpeg from 'fluent-ffmpeg';
import * as https from 'https';
import yts from 'yt-search';
import ytdl from 'ytdl-core';
// import { exec } from 'child_process';

export function downloadVideoAndAudioFromYouTube(url:string, options: { isVideoOnly: boolean; isAudioOnly: boolean; }): Promise<{ videoPath?: string, audioPath?: string, metadata?: yts.VideoMetadataResult, videoDetails: ytdl.MoreVideoDetails }> {
  return new Promise(async (resolve, reject) => {
    try {
      if (!ytdl.validateURL(url)) {
        const searchResult = await yts(url);
        url = searchResult.videos[0].url;
      }

      const videoInfo = await ytdl.getInfo(url);
      // console.log(videoInfo);
      const match = url.match(/(?:youtube\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\?(?:\S*?&?v\=))|youtu\.be\/)([a-zA-Z0-9_-]{6,11})/);
      const videoId = match ? match[1] : 'qrstuvwxyz'; 
      // const video = await yts({ videoId });

      let videoPath: string | undefined;
      let audioPath: string | undefined;

      const request = https.get;
      const agent = new https.Agent({ rejectUnauthorized: false });

      const requestOptions= {
        agent,
        headers: {
          'User-Agent': 'Mozilla/5.0'
        }
      };

      if ((options.isVideoOnly == true) && (options.isAudioOnly == false)) {
        // const videoFormat = ytdl.chooseFormat(videoInfo.formats, { filter: 'video' });
        const videoFormat = videoInfo.formats.filter((item) => item.mimeType?.includes("video/mp4;") && item.hasAudio && item.hasVideo)[0]
        videoPath = path.join(__dirname, '..', 'temp', `${videoId}.${'mp4'}`);
        const videoFileStream = fs.createWriteStream(videoPath);
        request(videoFormat.url, requestOptions, (response) => {
          if (response.statusCode !== 200) {
            reject(new Error(`Failed to download file: ${response.statusCode}`));
            return;
          }
          response.pipe(videoFileStream);
          videoFileStream.on('finish', () => {
            videoFileStream.close();
            resolve({ videoPath, videoDetails: videoInfo.videoDetails});
          });
          videoFileStream.on('error', (err) => {
            videoPath ? fs.unlinkSync(videoPath) : '';
            reject(err);
          });
        });
      } 
      else if ((options.isAudioOnly == true) && (options.isVideoOnly == false)) {
        // const audioFormat = ytdl.chooseFormat(videoInfo.formats, { filter: 'audio',});
        const audioFormat = videoInfo.formats.filter((item) => item.mimeType?.includes("audio/mp4;") && item.hasAudio && !item.hasVideo)[0]
        const tempAudioPath = path.join(__dirname, '..', 'temp', `${videoId}.${'m4a'}`);
        audioPath = path.join(__dirname, '..', 'temp', `${videoId}.${'mp3'}`);
        const audioFileStream = fs.createWriteStream(tempAudioPath);
        request(audioFormat.url, requestOptions, (response) => {
          if (response.statusCode !== 200) {
            reject(new Error(`Failed to download file: ${response.statusCode}`));
            return;
          }
          response.pipe(audioFileStream);
          audioFileStream.on('finish', () => {
            audioFileStream.close()
            try {
              const command = ffmpeg(`${tempAudioPath}`);
              command.audioCodec('libmp3lame').format('mp3');
              command.output(`${audioPath}`)
              command.run()
              command.on('end', () => {
                command
                fs.unlink(tempAudioPath, (err) => {
                  if (err) {
                    console.warn(`Failed to delete temp file: ${err.message}`);
                  }
                });
                resolve({ audioPath, videoDetails: videoInfo.videoDetails});
              })
              command.on('error', (err: { message: any; }) => {
                console.error(`Error during conversion: ${err.message}`)
              });
            } catch (err) {
              console.error(`Error while executing ffmpeg: ${err}`);
            }
          })
          audioFileStream.on('error', (err) => {
            audioPath ? fs.unlinkSync(audioPath) : '';
            reject(err);
          });
        });
      } else {
        // const audioFormat = ytdl.chooseFormat(videoInfo.formats, { filter: 'audio',});
        const audioFormat = videoInfo.formats.filter((item) => item.mimeType?.includes("audio/mp4;") && item.hasAudio && !item.hasVideo)[0]
        // const videoFormat = ytdl.chooseFormat(videoInfo.formats, { filter: 'video' });
        const videoFormat = videoInfo.formats.filter((item) => item.mimeType?.includes("video/mp4;") && item.hasAudio && item.hasVideo)[0]
        videoPath = path.join(__dirname, '..', 'temp', `${videoId}.${'mp4'}`);
        const tempAudioPath = path.join(__dirname, '..', 'temp', `${videoId}.${'m4a'}`);
        audioPath = path.join(__dirname, '..', 'temp', `${videoId}.${'mp3'}`);
        const videoFileStream = fs.createWriteStream(videoPath);
        const audioFileStream = fs.createWriteStream(tempAudioPath);
        request(videoFormat.url, requestOptions, (response) => {
          if (response.statusCode !== 200) {
            reject(new Error(`Failed to download file: ${response.statusCode}`));
            return;
          }
          response.pipe(videoFileStream);
          videoFileStream.on('finish', () => {
            videoFileStream.close();
            request(audioFormat.url, requestOptions, (response) => {
              if (response.statusCode !== 200) {
                reject(new Error(`Failed to download file: ${response.statusCode}`));
                return;
              }
              response.pipe(audioFileStream);
              audioFileStream.on('finish', () => {
                audioFileStream.close()
                try {
                  const command = ffmpeg(`${tempAudioPath}`);
                  command.audioCodec('libmp3lame').format('mp3');
                  command.output(`${audioPath}`)
                  command.run()
                  command.on('end', () => {
                    command
                    fs.unlink(tempAudioPath, (err) => {
                      if (err) {
                        console.warn(`Failed to delete temp file: ${err.message}`);
                      }
                    });
                    resolve({ audioPath, videoPath, videoDetails: videoInfo.videoDetails});
                  })
                  command.on('error', (err: { message: any; }) => {
                    console.error(`Error during conversion: ${err.message}`)
                  });
                } catch (err) {
                  console.error(`Error while executing ffmpeg: ${err}`);
                }
              })
              audioFileStream.on('error', (err) => {
                audioPath ? fs.unlinkSync(audioPath) : '';
                reject(err);
              });
            });
          });
          videoFileStream.on('error', (err) => {
            videoPath ? fs.unlinkSync(videoPath) : '';
            reject(err);
          });
        });
      }
    } catch (err) {
      console.error(err);
      reject(err);
    }
  });
}
