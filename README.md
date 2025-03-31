# releevante-systems
a multiple project repo for holding various systems.

# build the projects docker images:
docker compose -f docker/docker-compose.dev.yml build

# start docker containers:
docker compose -f  docker/docker-compose.dev.yml up -d

sudo systemctl daemon-reload

sudo systemctl restart pm2-releevante.service

pm2 save

pm2 list

pm2 restart all

pm2 status

sudo systemctl mask sleep.target suspend.target hibernate.target hybrid-sleep.target

systemctl status sleep.target

sudo chown releevante:releevante /home/releevante/.pm2/rpc.sock /home/releevante/.pm2/pub.sock

# smartlib-aggregator
  - journalctl -u smartlib.service --no-pager --lines=50
  - sudo systemctl restart pm2-releevante.service