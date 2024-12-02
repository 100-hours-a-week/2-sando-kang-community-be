#!/bin/bash

pkill -f 'node app.js' || true

cd /home/ubuntu/2-sando-kang-community-be
sh ./start.sh

sudo systemctl restart nginx

