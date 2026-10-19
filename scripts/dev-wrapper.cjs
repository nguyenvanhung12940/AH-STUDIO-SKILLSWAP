const { spawn } = require('child_process');

const args = process.argv.slice(2);
const filteredArgs = [];

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--host') {
    i++; // Skip the value as well
    continue;
  }
  filteredArgs.push(args[i]);
}

// Ensure -p 3000 and -H 0.0.0.0 are present for this environment
if (!filteredArgs.includes('-p') && !filteredArgs.includes('--port')) {
  filteredArgs.push('-p', '3000');
}
if (!filteredArgs.includes('-H') && !filteredArgs.includes('--hostname')) {
  filteredArgs.push('-H', '0.0.0.0');
}

const next = spawn('npx', ['next', 'dev', ...filteredArgs], {
  stdio: 'inherit',
  shell: true
});

next.on('exit', (code) => {
  process.exit(code);
});
