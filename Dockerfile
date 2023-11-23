FROM node:lts-slim
WORKDIR /app
COPY ./package.json .
RUN npm install
COPY . .
RUN npm run build
CMD ["sh", "-c", "node dist/main"]