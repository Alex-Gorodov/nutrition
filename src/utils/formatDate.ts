import { Months } from "../const";

export function formatDate(date: Date): string {

  const dateToFormat = new Date(date);

  const dateDay = dateToFormat.getDate();
  const dateMonth = Months[dateToFormat.getMonth()].slice(0,-1);

  return dateDay + ' ' + (dateMonth.charAt(dateMonth.length) === 'т' ?  dateMonth + 'а ' : dateMonth + 'я');
}
