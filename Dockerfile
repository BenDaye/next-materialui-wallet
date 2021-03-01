FROM registry.cn-shenzhen.aliyuncs.com/zingy9217/next-materialui-wallet-pkg:latest

COPY ./ ./

EXPOSE 80

CMD [ "pm2-runtime", "start", "pm2.json" ]
