const TIME_PTN = [
    "(?<timestamp>\\b\\w{3} \\d{1,2} \\d{2}:\\d{2}:\\d{2}\\b)",
    "(?<timestamp>\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{6}[+-]\\d{2}:\\d{2})",
    "(?<timestamp>\\w{3}, \\d{2} \\w{3} \\d{4} \\d{2}:\\d{2}:\\d{2} [+-]\\d{4})",
];

const LOGIN_PTN =
    "(?<hostname>\\S+) (?<process>.+?(?=\\[)|.+?(?=))[^a-zA-Z0-9](?<pid>\\d{1,7}|)[^a-zA-Z0-9]{1,3}.*for user (?<name>.*)\\(.*\\) by.*";
const CUSTOM_PTN = "";

export default {
    TIME_PTN,
    LOGIN_PTN,
    CUSTOM_PTN,
};
