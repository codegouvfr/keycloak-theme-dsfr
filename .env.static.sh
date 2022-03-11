#!/bin/bash

export REACT_APP_CONFIGURATION=$(cat << EOF
{
	"apiUrl": "https://sill.lab.sspcloud.fr/api",
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