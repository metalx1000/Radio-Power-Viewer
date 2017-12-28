#!/bin/bash
cat log.dat|grep 145|while read line;do echo "${line}="|base64 -d 2>/dev/null|grep 99|sed 's/bear=[0-9][0-9][0-9].[0-9]//g'|sed 's/bear=[0-9][0-9].[0-9]//g'|sed 's/bear=[0-9].[0-9]//g'|sed 's/ ]/]/g'|awk '{print $4","$18","}';echo "${line}"|cut -d\| -f2;done|sed ':a;N;$!ba;s/,\n/,/g'|tr "," " "|awk '{print "{\"lat\":"$1",\"lng\":"$2",\"height\":"$4",\"db\":"$3"},"}'
