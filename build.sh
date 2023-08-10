#!/bin/sh

rm -Rf $PWD/dist

mkdir $PWD/dist

/usr/bin/docker build --no-cache --tag ninja:latest .

/usr/bin/docker run -v $PWD/dist:/app/out/ ninja:latest yarn make --platform win32
