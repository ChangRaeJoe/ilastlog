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
        ref[${name}]=0
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
echo "$context" | NODE_ENV=production node test.js 2> /dev/null
exit 0

#######################################
###     node를 사용하지 않는 방법   ###
#######################################
PRE_IFS=${IFS}
IFS=$'\n'
for line in ${context}; do
    echo ""
done

IFS=${PRE_IFS}
# append log

# how to print pretty.
# stdout
sentence=''
for key in "${!userMap[@]}"; do
    if [ ${userMap[${key}]} -eq 0 ]; then
        sentence=${sentence}$(printf '%-25s**로그인한 기록이 없습니다**\\n' $key)
    else
        sentence=${sentence}$(printf '%-25s%s\\n' $key ${userMap[${key}]})
    fi
    echo ''
done

# write
printf '' > ${iauthPath}
echo -e "${sentence}" | tee -a ${iauthPath}

