FROM ubuntu:16.04

MAINTAINER https://github.com/franklang/

WORKDIR /opt

RUN apt-get update \
    && apt-get install -y build-essential \
    && apt-get install -y curl \
    && curl -s https://raw.githubusercontent.com/nodesource/distributions/master/deb/setup_5.x > /tmp/setup_5.x \
    && bash /tmp/setup_5.x \
    && apt-get install -y nodejs \
    && apt-get install -y git-core \
    && /usr/bin/npm install -g gulp \
    && /usr/bin/npm install -g bower

VOLUME ["/opt"]
CMD ["gulp", "watch"]
