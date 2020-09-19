#!/bin/sh

PASS=true
for FILE in "$@"
do
  yarn --cwd frontend run eslint $(echo $FILE | sed 's/frontend\///g')
  if [ "$?" -eq 1 ]; then
      PASS=false
  fi
done

if [ "$PASS" = "false" ]; then
    exit 1
fi
