#!/bin/sh
set -eux

echo "Waiting for Mongo to be ready..."
until mongosh --host mongo --eval "db.adminCommand('ping')" >/dev/null 2>&1; do
  sleep 1
done

echo "Downloading sampledata.archive..."
apt-get update -y || true
apt-get install -y curl || true
curl -L "https://atlas-education.s3.amazonaws.com/sampledata.archive" -o /tmp/sampledata.archive

if [ ! -f /tmp/sampledata.archive ]; then
  echo "Archive not found, aborting"
  exit 1
fi

ls -lh /tmp/sampledata.archive

echo "Starting mongorestore..."
mongorestore --host mongo --archive=/tmp/sampledata.archive --nsInclude=sample_airbnb.* --verbose

echo "Cleaning up and marking seed done"
rm -f /tmp/sampledata.archive
mkdir -p /seed
touch /seed/seed_done
echo "Seed finished"

echo "Checking collection names and creating 'listings' if necessary"
LISTINGS_COUNT=$(mongosh --quiet --host mongo --eval "db.getSiblingDB('sample_airbnb').listings.countDocuments()")
if [ "${LISTINGS_COUNT}" -eq 0 ]; then
  echo "'listings' is empty, attempting to create from 'listingsAndReviews'"
  mongosh --host mongo --eval "db.getSiblingDB('sample_airbnb').listingsAndReviews.aggregate([{ \$match: {} }, { \$out: 'listings' }])"
  NEW_COUNT=$(mongosh --quiet --host mongo --eval "db.getSiblingDB('sample_airbnb').listings.countDocuments()")
  echo "listings count after copy: ${NEW_COUNT}"
else
  echo "'listings' already has documents: ${LISTINGS_COUNT}"
fi
