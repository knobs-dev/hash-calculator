# pull official base image
FROM node:14-alpine

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install --silent

# add app
COPY . ./
RUN mv customization/theme.js src/theme/theme.js
RUN mv customization/favicon.ico public/favicon.ico
RUN mv customization/logo192.png public/logo192.png
RUN mv customization/logo512.png public/logo512.png
RUN mv customization/manifest.json public/manifest.json
ARG APP_TITLE
RUN sed -i.bak "s/%TITLE%/${APP_TITLE}/g" public/index.html

# start app
CMD ["npm", "start"]