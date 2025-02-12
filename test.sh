#!/bin/bash

# node를 bg에 실행시켜놓고, 입력데이터를 하나씩 전달하고 받아온다.

# grep를 실행한다.

regex='^(?<month>\S{3})? {1,2}(?<day>\S+) (?<time>\S+) (?<hostname>\S+) (?<process>.+?(?=\[)|.+?(?=))[^a-zA-Z0-9](?<pid>\d{1,7}|)[^a-zA-Z0-9]{1,3}(?<info>.*)$'

str='Oct  2 02:21:02 init-adl-001 systemd-logind[613]: New session 516 of user initadm.'


result=$(node test.js "$str")

echo -e $result
