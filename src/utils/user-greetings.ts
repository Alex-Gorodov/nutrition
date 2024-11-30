export function userGreetings(name: string): string {
  const localTime = new Date().getHours();
  let greeting;

  if (localTime >= 4 && localTime < 11) {
    greeting = `Доброе утро, ${name}!`;
  } else if (localTime >= 11 && localTime < 17) {
    greeting = `Добрый день, ${name}!`;
  } else if (localTime >= 17 && localTime < 21) {
    greeting = `Добрый вечер, ${name}!`;
  } else {
    greeting = `Ночной жор, ${name}?`;
  }

  return greeting;
}
