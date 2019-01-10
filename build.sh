#!/bin/bash
####################################
#
# Stop pm2, push changes from git and restart pm2
#
####################################

# Services to stop and start. 
serv_bot="server-bot"
serv_web="server-webapp"

# Print start status message.
echo "Stopping $serv_bot and $serv_web"
date
echo

# Backup the files using tar.
pm2 stop $serv_bot
pm2 stop $serv_web

# Print end status message.
echo
echo "Services stopped"
date

# Pulling changes from git.
git pull origin master --no-edit

# Print end status message.
echo
echo "Changed fetched"
date

# Print start status message.
echo "Starting $serv_bot and $serv_web"
date
echo

# Backup the files using tar.
pm2 start $serv_bot
pm2 start $serv_web

