#!/bin/sh

sudo tee /usr/local/bin/gtop > /dev/null << EOF
docker run --rm -it \
	--name gtop-from-executable \
	--net="host" \
	--pid="host" \
	aksakalli/gtop
EOF

sudo chmod a+x /usr/local/bin/gtop
