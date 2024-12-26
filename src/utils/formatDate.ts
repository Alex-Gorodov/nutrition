import { Months } from "../const";

export function formatDate(date: Date): string {

  const dateToFormat = new Date(date);

  const dateDay = dateToFormat.getDate();
  const dateMonth = Months[dateToFormat.getMonth()].slice(0,-1);

  if (!dateMonth || !dateDay) {
    console.error('Invalid month index:', dateMonth);
    return '';  // Можно вернуть дефолтное значение или обработать ошибку
  }

  return dateDay + ' ' + (dateMonth.charAt(dateMonth.length) === 'т' ?  dateMonth + 'а ' : dateMonth + 'я');
}
