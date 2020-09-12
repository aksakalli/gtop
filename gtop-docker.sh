#!/bin/sh

sudo tee /usr/local/bin/gtop > /dev/null << EOF
docker run --rm -it \
	--name gtop-from-executable \
	--net="host" \
	--pid="host" \
	aksakalli/gtop
EOF

sudo chmod 555 /usr/local/bin/gtop
