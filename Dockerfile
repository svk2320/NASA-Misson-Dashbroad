# Parent image
FROM node:18.0

# current working dirctory
WORKDIR /usr/src/NASA-MISSION-DASHBROAD

# COPY [package.json] to ./(all the files)
COPY ./ ./

# 
RUN npm install
RUN npm run install-client
RUN npm run install-server

# Tells what to run in the container & it can have only one command
CMD [ "/bin/bash"]