#!/bin/bash

path=/var/log/auth.log
iauthPath=${HOME}/ilastlog

cleanup(){
    if [ $? -eq 4 ]; then
        echo Not found in ${path}
    elif [ $? -eq 3 ]; then
        echo Not found bash shell
    elif [ $? -eq 5 ]; then
        echo "Can't make a file in ${iauthPath}"
    else
        echo
    fi
}

isStartLog(){
    return 0    
}

initUserMap(){
    local -n ref=$1
    for name in $(cut -d: -f1 /etc/passwd); do
        ref[${name}]=""
    done
}

trap cleanup EXIT

if [ ! -e ${path} ]; then
    exit 4
fi
if [ $( which bash &> /dev/null; echo "$?" ) -ne 0 ]; then
    exit 3
fi

# users init using Map variable
declare -A userMap
initUserMap userMap

# read auth.log 
# extract fields like info, timestamp per line
authData=$(cat "${path}")
deli='~'
hint='(login:session): session open'
options=(-d $deli --hint "$hint")
cmd="ilastlog"

parsedText="$( echo "$authData" | ${cmd} "${options[@]}")"

# uniqText=$(echo "$parsedText" | awk '{data[$1]=$0} END {for (key in data) print data[key]}')

######################################
# IFS - for delimiter
PRE_IFS=${IFS}
IFS=$'\n'
for line in ${parsedText}; do
    k=$(echo "$line" | cut -f1 -d'~')
    v=$(echo "$line" | cut -f2 -d'~')
    userMap[$k]=$v
done
IFS=${PRE_IFS}
#####################################
# append log

# how to print pretty.
sentence=''
for key in "${!userMap[@]}"; do
    if [ -z ${userMap[$key]} ]; then
        sentence=${sentence}$(printf '%-25s**로그인한 기록이 없습니다**\\n' $key)
    else
        sentence=${sentence}$(printf '%-25s%s\\n' $key ${userMap[${key}]})
    fi
done

# write and print
echo -e "${sentence}" | tee -a ${iauthPath}
