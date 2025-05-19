# Bridge.io

A Python application for NFC card reading with FastAPI and Socket.IO.

## Running with Python

```bash
uvicorn app:socket_app --host 0.0.0.0 --port 7777 --reload
```

## Running with Docker

### Build and run with Docker Compose

```bash
docker-compose up -d
```

### Build and run with Docker

```bash
docker build -t bridge-io .
docker run -p 7777:7777 bridge-io
```

## NFC Reader Support

If you need to use an NFC reader with the Docker container, uncomment the device mapping in the docker-compose.yml file:

```yaml
devices:
  - /dev/bus/usb:/dev/bus/usb
privileged: true
```
