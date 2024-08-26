FROM node:18-alpine as builder
WORKDIR /tmp/app
COPY web/ ./
RUN npm install
RUN npm run build

FROM nginx
COPY --from=builder /tmp/app/dist /etc/nginx/html
CMD ["nginx", "-g", "daemon off;"]


