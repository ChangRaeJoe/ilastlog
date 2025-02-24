const api = require("../ilastlogAPI");

const sampleTexts = [
	"Mon, 10 Feb 2025 15:02:37 +0900 joe-1hostname CRON[17340]: pam_unix(cron:session): session opened for user root(uid=0) by root(uid=0)",
	"Mon, 10 Feb 2025 11:02:37 +0900 joe-1hostname CRON[17340]: pam_unix(cron:session): session opened for user root(uid=0) by root(uid=0)",
	"Mon, 10 Feb 2025 13:02:37 +0900 joe-1hostname CRON[17340]: pam_unix(cron:session): session opened for user user2(uid=0) by root(uid=0)",
	"Mon, 10 Feb 2025 14:02:37 +0900 joe-1hostname CRON[17340]: pam_unix(cron:session): session opened for user user3(uid=0) by root(uid=0)",
];

const sampleTexts2 = [
	"Feb 10 11:02:37 joe-1hostname login[17340]: pam_unix(login:session): session open for user root(uid=0) by root(uid=0)",
	"Feb 10 13:02:37 joe-1hostname login[17340]: pam_unix(login:session): session open for user user4(uid=0) by root(uid=0)",
	"Feb 10 15:02:37 joe-1hostname login[17340]: pam_unix(login:session): session open for user root(uid=0) by root(uid=0)",
];

const sampleTexts3 = [
	"2025-02-01T22:45:32.861235+09:00 joe-1hostname CRON[17340]: pam_unix(cron:session): session opened for user root(uid=0) by root(uid=0)",
	"2025-02-25T12:55:01.861235+09:00 joe-1hostname CRON[17340]: pam_unix(cron:session): session opened for user root(uid=0) by root(uid=0)",
	"2025-02-25T15:55:01.861235+09:00 joe-1hostname CRON[17340]: pam_unix(cron:session): session opened for user root(uid=0) by root(uid=0)",
	"2025-02-25T18:55:01.861235+09:00 joe-1hostname CRON[17340]: pam_unix(cron:session): session opened for user user6(uid=0) by root(uid=0)",
];

api.setOptions({ delimiter: "~~~", hint: "pam" });
api.ilastlog(sampleTexts);
api.ilastlog(sampleTexts2);
api.ilastlog(sampleTexts3);
