#!/bin/bash
# Author: Hongbo Yin
# Pack Tools Script 
# Version: 0.8

source build/func.sh
source build/conf.sh
source build/main.sh

if [ "$1" == "sit" ]; then
	common sit
elif [ "$1" == "pre" ]; then
	common pre
elif [ "$1" == "test" ]; then
	common test
elif [ "$1" == "dev" ]; then
	doDev
elif [ "$1" == "prod" ]; then
	common prod
else
	usage
fi
