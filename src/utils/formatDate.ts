// import { Months } from "../const";

// export function formatDate(date: Date): string {

//   const dateToFormat = new Date(date);

//   const dateDay = dateToFormat.getDate();
//   const dateMonth = Months[dateToFormat.getMonth()].slice(0,-1);

//   if (!dateMonth || !dateDay) {
//     console.error('Invalid month index:', dateMonth);
//     return '';
//   }

//   return dateDay + ' ' + (dateMonth.charAt(dateMonth.length) === 'т' ?  dateMonth + 'а ' : dateMonth + 'я');
// }


import { Months } from "../const";

export function formatDate(date: Date): string {
  const dateToFormat = new Date(date);

  const dateDay = dateToFormat.getDate();
  const monthIndex = dateToFormat.getMonth();

  // Проверка корректности индекса месяца
  if (monthIndex < 0 || monthIndex > 11) {
    console.error('Invalid month index:', monthIndex);
    return '';
  }

  const dateMonth = Months[monthIndex]?.slice(0, -1);

  if (!dateMonth || !dateDay) {
    console.error('Invalid date format:', { dateMonth, dateDay });
    return '';
  }

  return (
    dateDay +
    ' ' +
    (dateMonth.charAt(dateMonth.length - 1) === 'т' ? dateMonth + 'а ' : dateMonth + 'я')
  );
}
