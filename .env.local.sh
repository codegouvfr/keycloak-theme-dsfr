#!/bin/bash

export REACT_APP_CONFIGURATION=$(cat << EOF
{
	/*"apiUrl": "http://localhost:8080/api",*/
	"apiUrl": "https://code.gouv.fr/data/sill2.json",
	"mockAuthentication": {
		"isUserInitiallyLoggedIn": false,
		"user": {
			"email": "joseph.garrone@data.gouv.fr",
			"familyName": "Garrone",
			"firstName": "Joseph",
			"username": "garronej",
			"groups": [],
			"local": "fr"
		}
	}
}
EOF
) 

$@