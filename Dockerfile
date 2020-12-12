FROM node:15-alpine

RUN apk --no-cache add procps
ENV LANG=en_US.utf8 \
    TERM=xterm-256color

COPY lib lib
COPY bin bin
COPY package.json .
COPY package-lock.json .

RUN npm install --production
ENTRYPOINT ["./bin/gtop"]
