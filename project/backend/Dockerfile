# Backend Dockerfile
# project/backend/Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Copy requirements first for better caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Make run.sh executable
RUN chmod +x run.sh

EXPOSE 8000

CMD ["./run.sh"]