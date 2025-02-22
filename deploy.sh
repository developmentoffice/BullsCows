#!/bin/bash

rm -rf public
npm run build
rm -rf ../bc/*
cp public/* ../bc -R
cd ../bc
git add .
git commit -a -m "Release"
git push origin master
cd ../bullscows
