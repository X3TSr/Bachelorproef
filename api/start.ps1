# start.ps1
docker build -t api .
docker compose up -d
docker image prune -f