#!/bin/bash
# Restart the LinkedIn Skillforge showcase dev server, fully detached (survives tool shell exit).
# Usage: bash /home/z/my-project/scripts/restart-dev.sh
cd /home/z/my-project

pkill -f "next dev" 2>/dev/null
sleep 1

setsid nohup ./node_modules/.bin/next dev -p 3000 > dev.log 2>&1 < /dev/null &
disown 2>/dev/null

# Wait for readiness
for i in $(seq 1 30); do
  code=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/ --max-time 2)
  if [ "$code" = "200" ]; then
    echo "READY (HTTP $code) after ${i}s"
    exit 0
  fi
  sleep 1
done
echo "FAILED to become ready; last log lines:"
tail -20 dev.log
exit 1
