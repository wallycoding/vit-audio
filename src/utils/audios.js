import path from "path";
import fs from "fs";
const ROOT_PATH = process.cwd();
const AUDIOS_PATH = path.resolve(ROOT_PATH, "tmp", "audios");

export const getAudio = (filename) => {
    if (!filename) return null;
    const pathAudio = path.resolve(ROOT_PATH, AUDIOS_PATH, filename);
    const hasAudio = fs.existsSync(pathAudio);
    if (!hasAudio) return null;
    return fs.createReadStream(pathAudio);
}
