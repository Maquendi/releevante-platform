#!/bin/bash
# Wait for the system and PM2 to fully start
sleep 10 # seconds
# Close any existing Chrome instances
pkill -f "chrome" || true
/usr/bin/google-chrome --kiosk --noerrdialogs --disable-infobars --disable-session-crashed-bubble --incognito http://localhost:3000

