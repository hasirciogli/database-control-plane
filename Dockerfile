FROM node:latest

WORKDIR /database-control-plane

COPY ./src /database-control-plane/src
COPY ./package.json /database-control-plane/package.json
COPY ./nodemon.json /database-control-plane/nodemon.json
COPY ./package-lock.json /database-control-plane/package-lock.json
COPY ./tsconfig.json /database-control-plane/tsconfig.json

RUN npm install

RUN npx tsc

RUN cp -r ./src/http-server/public ./dist/http-server/public

RUN mkdir -p ./data

RUN npm link

CMD ["node", "./dist/cli/cli.js", "start-http-server"]