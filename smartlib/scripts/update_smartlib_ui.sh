#!/bin/bash

# This script updates the smartlib UI by pulling the latest changes from the master branch,
# installing dependencies, and building the UI.
# It assumes that the script is run from a user with the necessary permissions to access the repository.
# Ensure the script is run with root privileges
# if [ "$EUID" -ne 0 ]; then
#     echo "Please run as root"
#     exit 1
# fi


# Define the repository path
REPO_PATH="/home/releevante/Documents/platform/releevante-platform"
UI_PATH="$REPO_PATH/smartlib/ui"

# sudo chown -R $USER:$USER "$UI_PATH/.next"

sudo rm -r "$UI_PATH/.next"

# Navigate to the repository
cd "$REPO_PATH" || { echo "Failed to cd into repository"; exit 1; }

echo "Pulling latest changes from master branch..."
git checkout smartlib/master && git pull origin master || { echo "Git pull failed"; exit 1; }


# Navigate to the UI directory
cd "$UI_PATH" || { echo "Failed to cd into UI directory"; exit 1; }

echo "Installing dependencies..."
npm install || { echo "npm install failed"; exit 1; }

echo "Building the UI..."

npm run build || { echo "npm build failed"; exit 1; }

echo "Update and build completed successfully!"


git add .

# Check if there are any changes to commit
if ! git diff-index --quiet HEAD --; then
    echo "Changes detected, committing..."
    git commit -m "Update smartlib UI" || { echo "Git commit failed"; exit 1; }
else
    echo "No changes detected, skipping commit."
fi


sudo chown releevante:releevante /home/releevante/.pm2/rpc.sock /home/releevante/.pm2/pub.sock

# restart the pm2 process
echo "Restarting pm2 smartlib-ui process..."

pm2 restart smartlib-ui

#open chrome with the smartlib url
echo "executing open-smartlib-ui.sh"

/home/releevante/Documents/platform/releevante-platform/smartlib/scripts/open-smartlib-ui.sh

echo "Done!"