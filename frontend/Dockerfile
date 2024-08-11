ARG NODE_IMAGE=node:18.17.0-alpine

###################
# Set up stage
###################

FROM ${NODE_IMAGE} As BUILDER

WORKDIR /usr/app

ARG NEXT_PUBLIC_BACKEND_ROOT_URL=$NEXT_PUBLIC_BACKEND_ROOT_URL
ARG NEXT_PUBLIC_FIREBASE_API_KEY=$NEXT_PUBLIC_FIREBASE_API_KEY

COPY package*.json ./

# install dependencies
RUN npm install

# copy remaining code from repo to image 
COPY . .

RUN npm run build

######################
# Build for production 
######################

FROM ${NODE_IMAGE} as RUNNER

WORKDIR /usr/app

# copy the node_modules and build app from the builder stage
COPY --from=BUILDER /usr/app/node_modules ./node_modules
COPY --from=BUILDER /usr/app/package.json ./
COPY --from=BUILDER /usr/app/package-lock.json ./
COPY --from=BUILDER /usr/app/.next ./.next
COPY --from=BUILDER /usr/app/public ./public

EXPOSE 3000

# start the server using production build
CMD ["npm", "start"]
