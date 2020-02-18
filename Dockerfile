FROM node:5-slim

ENV LANG=en_US.utf8 \
    TERM=xterm-256color

COPY lib lib
COPY bin bin
COPY package.json .

RUN npm install --production
ENTRYPOINT ["./bin/gtop"]
