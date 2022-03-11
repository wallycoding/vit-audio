import { randomBytes } from "crypto";
import path from "path";
const ROOT_PATH = process.cwd();
const VIDEOS_PATH = path.resolve(ROOT_PATH, "tmp");
const AUDIOS_PATH = path.resolve(ROOT_PATH, "tmp", "audios");

const createHash = (filename) => `${randomBytes(6).toString("hex")}-${filename}`;

export const mountVideoPath = (filename) =>
  path.resolve(VIDEOS_PATH, `${createHash(filename)}`);

export const mountAudioPath = (filename) =>
  path.resolve(AUDIOS_PATH, `${createHash(filename)}`);
