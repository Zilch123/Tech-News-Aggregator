# Use a lightweight Node.js image
FROM node:16

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the frontend application code
COPY . .

# Set execute permissions for the run script
RUN chmod +x run.sh

# Expose the frontend port
EXPOSE 5173

# Command to start the frontend
CMD ["./run.sh"]
