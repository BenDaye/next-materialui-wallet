FROM keymetrics/pm2:12-stretch

RUN apt-get update && apt-get dist-upgrade -y

RUN apt-get install -y libudev-dev libusb-1.0-0-dev

RUN rm -rf /var/lib/apt/lists/* && apt-get purge -y --auto-remove $buildDeps
