#!/bin/sh

docker run --rm -it \
	--name gtop-from-executable \
	--net="host" \
	--pid="host" \
	aksakalli/gtop
