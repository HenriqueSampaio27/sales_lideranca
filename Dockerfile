FROM node:18

# Instala o Chromium
RUN apt-get update && apt-get install -y chromium

# Define variável pro Puppeteer encontrar o Chrome
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]