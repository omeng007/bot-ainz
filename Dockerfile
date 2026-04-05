FROM node:20-bookworm-slim

# Install dependencies sistem + git (diperlukan untuk beberapa package npm)
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    ffmpeg \
    imagemagick \
    webp \
    git \
    ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# Copy package.json terlebih dahulu untuk mengoptimalkan cache layer
COPY package.json .

# Install semua dependencies dari package.json (termasuk qrcode-terminal jika ada)
RUN npm install

# Copy seluruh kode
COPY . .

EXPOSE 5000

CMD ["node", "index.js", "--autocleartmp"]
