FROM node:20-bookworm-slim

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    ffmpeg \
    imagemagick \
    webp && \
    rm -rf /var/lib/apt/lists/*

COPY package.json .

RUN npm install && npm install qrcode-terminal

COPY . .

EXPOSE 5000

CMD ["node", "index.js", "--autocleartmp"]
