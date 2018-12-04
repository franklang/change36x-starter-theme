FROM ubuntu:16.04

WORKDIR /home/app/
COPY ./themes/responsive/ /home/app/

ADD setup_4.x /tmp/setup_4.x
RUN bash /tmp/setup_4.x

RUN apt-get update
RUN apt-get install -y build-essential nodejs git

RUN /usr/bin/npm install bower gulp
RUN /usr/bin/npm install -g bower gulp

#RUN rm -rf node_modules/
RUN bower install --allow-root
RUN npm install
RUN gulp

CMD ["gulp watch"]
