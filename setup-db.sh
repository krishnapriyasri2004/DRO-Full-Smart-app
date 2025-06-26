#!/bin/bash

# Install required npm packages
npm install mysql2 bcrypt

# Create the database directory if it doesn't exist
mkdir -p db

# Run the database initialization script
echo "Initializing database..."
node -e "require('./lib/db-init.js')()"

echo "Database setup complete!"
