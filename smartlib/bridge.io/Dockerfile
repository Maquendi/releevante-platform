# Use Python 3.9 as the base image
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Install system dependencies required for pyscard and other libraries
RUN apt-get update && apt-get install -y \
    libpcsclite-dev \
    swig \
    gcc \
    g++ \
    make \
    pkg-config \
    libusb-1.0-0-dev \
    pcscd \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose the port the app runs on
EXPOSE 7777

# Command to run the application
CMD ["uvicorn", "app:socket_app", "--host", "0.0.0.0", "--port", "7777"]
