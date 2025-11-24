#!/bin/sh
set -eux

echo "Waiting for Mongo to be ready for user creation..."
until mongosh --host mongo --eval "db.adminCommand('ping')" >/dev/null 2>&1; do
  sleep 1
done

echo "Creating admin user..."
mongosh 'mongodb://mongo:27017/sample_airbnb' --eval "db.users.updateOne({ username: 'admin' }, { \$set: { username: 'admin', password: 'admin' } }, { upsert: true });"

mkdir -p /seed
touch /seed/user_done
echo "User created"
