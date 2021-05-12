& docker build -t looking-glass-service:latest .
& docker stop lgs
& docker rm lgs
& docker create -i -t -p 3001:3001 --name lgs --env-file prod.env looking-glass-service
& docker start lgs
& docker update --restart unless-stopped lgs
