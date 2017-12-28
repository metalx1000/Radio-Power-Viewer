#!/bin/bash
cat log.dat|while read line;do echo "${line}="|base64 -d 2>/dev/null|grep 99|awk '{print $4","$24","}';echo "${line}"|cut -d\| -f2;done|sed ':a;N;$!ba;s/,\n/,/g'|grep '^26'|tr ',' ' '|awk '{print "{\"lat\":"$1",\"lng\":"$2",\"height\":"$4",\"db\":"$3"},"}' > points.json
