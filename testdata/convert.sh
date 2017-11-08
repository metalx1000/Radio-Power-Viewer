#!/bin/bash

if [ "$1" = "" ]
then
  echo "Input File needed..."
  echo "example: $0 'doc.kml'"
  exit 1
fi

file="$1"
output="test.json"

#fake height levels
high=( 50 100 150 200 250 300 )

#converts test data
echo "Converting Data into $output..."

echo "[" > "$output"

cat "$file"|grep '81.'|sed 's/ //g'|while read line
do
  rand=$[$RANDOM % ${#high[@]}]
  date > /dev/null
  height=${high[$rand]}
  lat="$(echo "$line"|cut -d\, -f2)"
  lng="$(echo "$line"|cut -d\, -f1)"
  echo -n "{\"lat\":$lat,\"lng\":$lng,\"height\":$height},"
done|sed 's/,$//g'|sed 's/},/},\n/g' >> "$output"

echo "" >> "$output"
echo "]" >> "$output"

cat "$output"

echo "Output is in $output"
