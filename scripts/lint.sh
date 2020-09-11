#!/bin/bash
yarn --cwd frontend eslint $(echo $1 | sed 's/frontend\///g')
