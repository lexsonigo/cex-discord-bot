import chalk from 'chalk';

export function logAppLaunching(port: string): void {
  console.log(
    '\n',
    String.fromCodePoint(0x1F525),
    chalk.yellow.bold('cexbot'),
    chalk.yellow('is running on'),
    chalk.yellow.bold(`http://localhost:${port}`),
    '\n',
    chalk.gray('(Press CTRL+C to stop)'),
    '\n',
  );
}
