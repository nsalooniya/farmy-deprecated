const execSync = require('child_process').execSync;

const message = process.argv[2];
const version = process.argv[3];

console.log(message, version);

if (message && version) {
    try {
        execSync(`git add .`);
        console.log(`=> git add .`);
        execSync(`git commit -m "${message}"`);
        console.log(`=> git commit -m "${message}"`);
        execSync(`npm version ${message}`);
        console.log(`=> npm version ${message}`);
        execSync(`git push`);
        console.log(`=> git push`);
        execSync(`npm publish`);
        execSync(`=> npm publish`);
    } catch (err) {
        console.log('error :', err);
    }
} else {
    throw Error('Wrong args passed');
}
