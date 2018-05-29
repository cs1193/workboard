export const Logger = (message) => {
  console.group('Logger');
  console.log(message);
  console.groupEnd('Logger');
}
