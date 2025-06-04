FROM nginx:alpine

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY calculator/index.html .
COPY calculator/style.css .
COPY calculator/index.js .

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]