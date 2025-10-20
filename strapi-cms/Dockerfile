FROM node:18-alpine

# Install dependencies for native modules
RUN apk add --no-cache \
    build-base \
    gcc \
    autoconf \
    automake \
    zlib-dev \
    libpng-dev \
    nasm \
    bash \
    vips-dev

# Set working directory
WORKDIR /opt/app

# Set argument for NODE_ENV
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application files
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 1337

# Start the application
CMD ["npm", "run", "start"]

