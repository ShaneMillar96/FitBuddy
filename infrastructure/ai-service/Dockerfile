# Use an official Python runtime as the base image
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Install system dependencies (for OpenCV, MediaPipe, etc.)
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Upgrade pip and install dependencies
COPY requirements.txt .
RUN pip install --upgrade pip && pip install --no-cache-dir -r requirements.txt

# Copy the Python script
COPY ai-analysis-service.py .

# Expose the port the Flask app runs on
EXPOSE 5001

# Command to run the Flask app
CMD ["python", "ai-analysis-service.py"]