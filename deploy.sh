#!/bin/bash

rm -rf public
npm run build
rm -rf ../bc/*
cp public/* ../bc -R