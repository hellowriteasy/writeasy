ARG NODE_IMAGE=$NODE_IMAGE
FROM ${NODE_IMAGE} 

WORKDIR /usr/app


# Install dependencies
COPY ./package*.json ./

RUN npm install

# Copy all app files
COPY . .

# Expose the port that your app runs on
EXPOSE 8000

# Start the app
CMD [ "npm", "start" ]
