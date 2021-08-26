FROM registry.cn-shenzhen.aliyuncs.com/zingy9217/next-materialui-wallet-env:latest

WORKDIR /root/app

RUN mkdir -p /root/app

COPY ./package.json ./yarn.lock ./

RUN yarn --production

RUN yarn cache clean && npm cache clean --force
