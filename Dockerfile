# 使用 Node.js 20 作为基础镜像
FROM node:20-alpine

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm ci --production

# 复制源代码和构建文件
COPY dist/ ./dist/
COPY .env ./

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["node", "dist/index.js"]
