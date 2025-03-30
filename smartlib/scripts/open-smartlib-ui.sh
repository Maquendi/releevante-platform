#!/bin/bash
sleep 10  # Wait for the system and PM2 to fully start
# google-chrome --kiosk http://localhost:3000


/usr/bin/google-chrome --kiosk --noerrdialogs --disable-infobars --disable-session-crashed-bubble --incognito http://localhost:3000

# /usr/bin/google-chrome --start-fullscreen --noerrdialogs --disable-infobars --disable-session-crashed-bubble --incognito http://smartlib-ui.local

# /usr/bin/google-chrome --app=http://smartlib-ui.local --noerrdialogs --disable-infobars --disable-session-crashed-bubble --incognito
