import { createWriteStream } from "fs";
import busboy from "busboy";
import { mountVideoPath, mountAudioPath } from "./utils/mount-paths.js";
import { videoToAudio } from "./utils/convert.js";
import { getAudio } from "./utils/audios.js";

class Routes {
  async options(req, res) {
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
    };
    res.writeHead(204, headers);
    res.end();
  }

  async get(req, res) {
    const path = req.url.split("/").slice(1);
    const filename = path[path.length - 1].replace(/\//g, "");
    console.log("GET AUDIO:", filename);
    const audio = getAudio(filename);
    if (!audio) {
      res.writeHead(400);
      return res.end(
        JSON.stringify({
          error: {
            message: "no found audio",
          },
        })
      );
    }
    audio.pipe(res);
  }

  async post(req, res) {
    const { headers } = req;
    try {
      const bb = busboy({ headers });
      bb.on("file", async (name, file, info) => {
        console.log("FILE UPLOAD");
        const videoPath = mountVideoPath(info.filename);
        const audioPath = mountAudioPath(`audio.mp3`);
        const videoWritableStream = createWriteStream(videoPath);
        file.pipe(videoWritableStream);
        const audioReadableStream = await videoToAudio(videoPath, audioPath);
        res.writeHead(200, { Connection: "close" });
        audioReadableStream.pipe(res);
      });
      req.pipe(bb);
    } catch (error) {
      res.writeHead(400);
      res.end(
        JSON.stringify({
          error: {
            message: error.message,
          },
        })
      );
    }
  }
}

export default Routes;
