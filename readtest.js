const readline = require("readline");

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	terminal: true, // 또는 false
});

rl.question("이름을 입력하세요: ", (answer) => {
	console.log(`입력한 이름: ${answer}`);
	rl.close();
});
