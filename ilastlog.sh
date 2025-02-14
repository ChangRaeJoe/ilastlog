#!/bin/bash

# auth.log 읽어오기 또는 명령어를 통해 최근날짜부터 읽어오기
# cmd [-h]
# stdout format
# username  date/none

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
    # 직접 $1 $2, 간접 참조 $(!1) or local -n
    local -n ref=$1
    for name in $(cut -d: -f1 /etc/passwd); do
        ref[${name}]=""
    done
}

trap cleanup EXIT

# exit 0,1,126을 제외한 숫자를 개발자 마음대로 사용해도 되나
if [ ! -e ${path} ]; then
    exit 4
fi
if [ $( which bash &> /dev/null; echo "$?" ) -ne 0 ]; then
    exit 3
fi

# read auth.log filltered grep cmd.
context=$(grep -iE '\(login:session\): session open' ${path})
# users init using Map variable
declare -A userMap
initUserMap userMap

# 각 행에서 시간, 사용자명을 추출한다.
# IFS: 나눌 단위지정
parsedText="$(echo "$context" | NODE_ENV=production node ilastlog.js 2> /dev/null)"

uniqText=$(echo "$parsedText" | awk '{data[$1]=$0} END {for (key in data) print data[key]}')
######################################
PRE_IFS=${IFS}
IFS=$'\n'
for line in ${uniqText}; do
    k=$(echo "$line" | cut -f1 -d',')
    v=$(echo "$line" | cut -f2 -d',')
    userMap[$k]=$v
done
IFS=${PRE_IFS}
#####################################
# append log

# how to print pretty.
# stdout
sentence=''
for key in "${!userMap[@]}"; do
    if [ -z ${userMap[$key]} ]; then
        sentence=${sentence}$(printf '%-25s**로그인한 기록이 없습니다**\\n' $key)
    else
        sentence=${sentence}$(printf '%-25s%s\\n' $key ${userMap[${key}]})
    fi
done

# write
echo -e "${sentence}" | tee -a ${iauthPath}

