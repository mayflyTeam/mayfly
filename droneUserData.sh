#!/bin/bash
# Make sure we run the script with root privileges
if [ "$EUID" -ne 0 ]; then
  echo "Please run as root"
  exit
fi
# save logs
exec > /var/log/user-data.log 2>&1
# Update the instance's package references
apt-get update -y
# Change directory to where your docker-compose.yml file is located
cd /home/ubuntu/environment/plane-config/compose
# Pull the latest images specified in your docker-compose.yml file
docker compose pull
# Start up your Docker containers in detached mode
docker compose up -d