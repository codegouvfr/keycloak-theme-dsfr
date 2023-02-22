#!/bin/bash

# We would use a .env.local file but we can't define values on mulitple line
# so it's more conveignent to have this file.
# When we do "./.env.local.sh react-app-rewired start" it's like doing "react-app-rewired start"
# but the REACT_APP_CONFIGURATION will be defined as below.

export REACT_APP_CONFIGURATION=$(cat << EOF
{
	"apiUrl": "",
}
EOF
) 

$@