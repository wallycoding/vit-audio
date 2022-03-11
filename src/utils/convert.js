import { EventEmitter } from "events";
import { createReadStream, unlink } from "fs";
import { spawn } from "child_process";

export const videoToAudio = (videoPath, audioPath) =>
  new Promise((resolve, reject) => {
    try {
      const child = spawn("ffmpeg", [
        "-i",
        videoPath,
        "-vn",
        "-ar",
        "44100",
        "-ab",
        "192k",
        audioPath,
      ]);
      child.once("close", () => {
        unlink(videoPath, (err) => {
          if (err) return reject(err);
          const audioEvent = new EventEmitter();
          audioEvent.on("delete", () => {
            unlink(audioPath, (err) => {
              if (err) return console.log("FAIL TO DELETE AUDIO", audioPath);
              console.log("DELETED", audioPath);
            });
          });
          const audioReadableStream = createReadStream(audioPath);
          resolve(audioReadableStream);
          setTimeout(() => {
            audioEvent.emit("delete");
          }, 1000 * 30); // DELETE AFTER 30s
        });
      });
    } catch (error) {
      reject(error);
    }
  });
