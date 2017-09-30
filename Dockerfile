FROM node:4-slim

ENV LANG=en_US.utf8 \
    TERM=xterm-256color

RUN apt-get update -y && apt-get upgrade -qy && \
    npm install gtop -g

ENTRYPOINT ["gtop"]