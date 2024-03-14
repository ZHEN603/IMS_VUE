# 使用一个兼容的Node.js版本
FROM node:20-alpine AS build-stage

# 安装git
RUN apk add --no-cache git

WORKDIR /app

# 复制package.json和package-lock.json文件
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制项目文件
COPY . .

# 构建应用
RUN npm run build

# 生产阶段
FROM nginx:stable-alpine AS production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf

# 将自定义的 Nginx 配置文件复制到容器中
COPY nginx.conf /etc/nginx/conf.d/

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
