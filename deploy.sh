#!/bin/bash

rm -rf public
npm run build
cd ../bc
git pull origin master
rm -rf *
cp ../bullscows/public/* ./ -R
git add .
git commit -a -m "Release"
git push origin master
cd ../bullscows
