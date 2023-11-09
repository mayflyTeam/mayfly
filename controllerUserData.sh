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
# Now, change directory to where your Node.js app is located
cd /home/ubuntu/environment/natsApi
# Install Node.js using NodeSource's setup script for the latest version
curl -sL https://deb.nodesource.com/setup_current.x | sudo -E bash -
apt-get install -y nodejs
# Install PM2 globally
npm install pm2 -g
# Install your application's dependencies
npm install
# Start your Node.js application with PM2
pm2 start api.js --name "natsApi"
# Optionally, save the PM2 process list and startup configuration
pm2 save
pm2 startup