FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

# Update the database connection
RUN sed -i 's/mongodb:\/\/localhost:27017/mongodb:\/\/mongodb:27017/' ./config/db.js

CMD ["node", "app.js"]
