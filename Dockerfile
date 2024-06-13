FROM node:20.10 AS build-stage
WORKDIR /app

COPY package.json .npmrc /app/
ENV REACT_APP_API_URL="https://mis-ru-selling-service.numedy.com"

RUN npm i

COPY . .
RUN npm run build --prod

FROM nginx
WORKDIR /etc/nginx/html

COPY --from=build-stage /app/build/index.html ./index.html
COPY --from=build-stage /app/build/ ./price/
COPY ./conf/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
