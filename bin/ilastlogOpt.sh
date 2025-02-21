#!/bin/bash
DEFAULT_HINT='\(login:session\): session open'
DEFAULT_DELIMITER='~'

##########################
# assign variables: help, version, delimiter, hint, argument
##########################

if ! options=$( getopt -o vhd: -l version,help,hint: -- "$@" )
then
    echo "error: print usage"
    exit 1
fi


# "-v -d: ',' --version -- arg1"

eval set -- $options

while true; do
    case "$1" in
    -h|--help)
        help='help'
        shift ;;
    -v|--version)
        #version=$(grep -ioE '"version.*"' ../package.json)
        version='0.0.0'
        shift ;;
    -d)
        delimiter=${2}
        shift 2 ;;
    --hint)
        hint=${2}
        shift 2 ;;
    --)
        shift
        break
   esac
done

argument="$@"

if [ -n "$version" ]; then
    echo $version;
    exit 0;
elif [ -n "$help" ]; then
    echo $help;
    exit 0;
fi

if [ -z "$delimiter" ]; then
    delimiter="$DEFAULT_DELIMITER"
fi
if [ -z "$hint" ]; then
    hint="$DEFAULT_HINT"
fi

