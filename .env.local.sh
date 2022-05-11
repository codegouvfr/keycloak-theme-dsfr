#!/bin/bash

# We would use a .env.local file but we can't define values on mulitple line
# so it's more conveignent to have this file.
# When we do "./.env.local.sh react-app-rewired start" it's like doing "react-app-rewired start"
# but the REACT_APP_CONFIGURATION will be defined as below.

export REACT_APP_CONFIGURATION=$(cat << EOF
{
	//"apiUrl": "https://sill.lab.sspcloud.fr/api",
	"apiUrl": "http://localhost:8080/api",
	/*
	"apiUrl": "https://code.gouv.fr/data/sill-data.json",
	"mockAuthentication": {
		"isUserInitiallyLoggedIn": false,
		"user": {
			"email": "joseph.garrone@data.gouv.fr",
			"agencyName": "Etalab",
			"local": "fr"
		}
	},
	*/
	"headerLinks": [
		{ 
	  		"label": "code.gouv.fr", 
	  		"iconId": "assuredWorkload", 
	  		"url": "https://code.gouv.fr" 
		}
	]
}
EOF
) 

$@