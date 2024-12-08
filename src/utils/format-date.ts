import { Months } from "../const";

export function formatDate(date: Date): string {

  const dateDay = new Date(date).getDate();
  const dateMonth = Months[new Date(date).getMonth()];
  const dateYear = new Date(date).getFullYear();

  return dateDay + ', ' + dateMonth + ', ' + dateYear;
}
