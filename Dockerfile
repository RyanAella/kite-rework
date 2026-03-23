FROM nginx:alpine

WORKDIR /usr/share/nginx/html/

COPY ./ /usr/share/nginx/html/

RUN \
apk add --update nodejs npm && \
npm install tailwindcss @tailwindcss/cli && \
npx @tailwindcss/cli -i /usr/share/nginx/html/style.css -o /usr/share/nginx/html/generated/tailwind.css 



