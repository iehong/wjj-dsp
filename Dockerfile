# Production image, copy all the files and run next
FROM node:alpine
ENV NODE_ENV production
RUN mkdir /app
WORKDIR /app
COPY . /app
RUN npm ci

EXPOSE 3000

CMD ["npm","run", "start"]
