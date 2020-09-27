#!/bin/sh

#########################################
# Run gtop in your terminal using the `gtop` command, but in a docker container by running the following lines.
# ```sh
# $ sh -c "$(curl -fSsL https://raw.githubusercontent.com/aksakalli/gtop/master/gtop-docker.sh)"

# $ gtop		# Run gtop from your terminal whenever you want to open gtop.
#########################################

sudo tee /usr/local/bin/gtop > /dev/null << EOF
docker run --rm -it \
	--name gtop-from-executable \
	--net="host" \
	--pid="host" \
	aksakalli/gtop
EOF

sudo chmod 555 /usr/local/bin/gtop
