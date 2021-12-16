const execSync = require('child_process').execSync;

const message = process.argv[2];
const version = process.argv[3];

const logBlue = (log) => console.log('\x1b[34m%s\x1b[0m', log);
const logRed = (log) => console.log('\x1b[31m%s\x1b[0m', log);

if (message && version) {
    try {
        logBlue(`=> git add .`);
        execSync(`git add .`);
        logBlue(`=> git commit -m "${message}"`);
        execSync(`git commit -m "${message}"`);
        logBlue(`=> npm version ${version}`);
        execSync(`npm version ${version}`);
        logBlue(`=> git push -u origin`);
        execSync(`git push`);
        logBlue(`=> npm publish`);
        execSync(`npm publish`);
    } catch (err) {
        logRed('error :', err);
    }
} else {
    throw Error('Wrong args passed');
}
