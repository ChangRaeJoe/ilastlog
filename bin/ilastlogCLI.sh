#!/bin/bash

AUTH_PATH=/var/log/auth.log
IAUTH_PATH=${HOME}/ilastlog

cleanup(){
    if [ $? -eq 4 ]; then
        echo Not found in ${AUTH_PATH}
    elif [ $? -eq 3 ]; then
        echo Not found bash shell
    elif [ $? -eq 5 ]; then
        echo "Can't make a file in ${IAUTH_PATH}"
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

calculate(){
    # (data, hint
    # calcuate
    local data=$1

    # timestamp, username filter using regex
    timePtns='[[:digit:]]{4}-[[:digit:]]{2}-[[:digit:]]{2}T[[:digit:]]{2}:[[:digit:]]{2}:[[:digit:]]{2}.[[:digit:]]{6}[+-][[:digit:]]{2}:[[:digit:]]{2}'
    
    timeStamps="$(echo "$data" | grep -ioE "$timePtns" )"
    users=$(echo "$data" | grep -ioE 'for user .*\(' | awk '{print $3}' | cut -d '(' -f 1)
    
    # combine m,n per line
    combineData="$(paste -d '\t\t' <(echo "$users") <(echo "$timeStamps"))"
    
    # sort
    sortedData="$(sort -k 2 <<<"$combineData" | sort -k 1 <<<"$combineData")"
    # uniq user
    uniqData="$(awk '{data[$1]=$2} END {for(i in data) printf("%s\t%s\n", i, data[i])}'<<<"$sortedData" )"
    
    echo "$uniqData"
}
trap cleanup EXIT

# check bin/bash, check auth.log
if [ ! -e ${AUTH_PATH} ]; then
    exit 4
fi
if [ $( which bash &> /dev/null; echo "$?" ) -ne 0 ]; then
    exit 3
fi

# command options process
source ilastlogOpt.sh

# users init using Map variable
# read auth.log 
# extract fields like info, timestamp per line
authData=$(cat "${AUTH_PATH}" | grep -iE "$hint")
uniqData="$(calculate "$authData")"
######################################

declare -A userMap
initUserMap userMap

## put uniqData in userMap
PRE_IFS=$IFS
IFS=$'\n'
for line in $uniqData
do
    k=$(cut -d $'\t' -f 1 <<<"$line")
    v=$(cut -d $'\t' -f 2 <<<"$line")
    userMap["$k"]="$v"
done
IFS=$PRE_IFS


#####################################
# concate for one line
sentence=''
for key in "${!userMap[@]}"; do
    if [ -z ${userMap[$key]} ]; then
        sentence=${sentence}$(printf '%-25s**로그인한 기록이 없습니다**\\n' $key)
    else
        sentence=${sentence}$(printf '%-25s%s\\n' $key ${userMap[${key}]})
    fi
done

# write and print
echo -e "${sentence}" | tee -a ${IAUTH_PATH}
