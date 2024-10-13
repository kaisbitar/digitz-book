#!/bin/bash

# Set variables
REMOTE_USER="kbitar"
REMOTE_HOST="139.59.133.159"
REMOTE_PORT="2222"
REMOTE_PATH="/var/www/q-project/front-end"
BUILD_FILE="build.tar"

# Function to handle errors
handle_error() {
    echo "Error: $1"
    exit 1
}

# Build the project
npm run build || handle_error "Failed to build the project"

# Create tar file
tar cvzf $BUILD_FILE dist || handle_error "Failed to create tar file"

# Copy file to remote server
echo "Attempting to copy file to remote server..."
scp -P $REMOTE_PORT -v -o ConnectTimeout=30 $BUILD_FILE $REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH || handle_error "Failed to copy file to remote server"

# Execute commands on remote server
echo "Attempting to execute commands on remote server..."
ssh -p $REMOTE_PORT -v -o ConnectTimeout=30 $REMOTE_USER@$REMOTE_HOST << EOF || handle_error "Failed to execute commands on remote server"
    cd $REMOTE_PATH
    tar -zxvf $BUILD_FILE
    rm -rf app-prev
    mv app app-prev
    mv dist app
    rm $BUILD_FILE
EOF

# Clean up local files
rm -rf dist
rm $BUILD_FILE

echo "Deployment completed successfully!"
