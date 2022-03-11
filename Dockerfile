FROM node:17-slim
RUN apt update && apt install -y ffmpeg
WORKDIR /vitaudio/
COPY package.json package-lock.json /vitaudio/
RUN npm i
COPY . .
USER node
CMD [ "npm", "run", "dev" ]