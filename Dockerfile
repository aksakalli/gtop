FROM node:5-slim

ENV LANG=en_US.utf8 \
    TERM=xterm-256color

COPY lib lib
COPY bin bin
COPY package.json .
COPY package-lock.json .

RUN npm install
ENTRYPOINT ["./bin/gtop"]
