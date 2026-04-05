FROM node:20-bookworm

# Update dan install package yang diperlukan
RUN apt-get update && \
    apt-get install -y \
    ffmpeg \
    imagemagick \
    webp \
    && rm -rf /var/lib/apt/lists/*

# Copy package.json dan install dependencies
COPY package.json .
RUN npm install

# Copy seluruh source code
COPY . .

EXPOSE 5000

CMD ["node", "index.js", "--autocleartmp"]
