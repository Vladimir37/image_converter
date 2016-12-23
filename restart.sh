#!/bin/bash
forever stopall
cd /webapps/new_ic/image_converter/Main/
forever start ic_main.js
cd ../External/
forever start ic_external.js
