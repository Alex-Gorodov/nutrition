type GroupByDateItem<T> = {
  date: string;
  item: T;
};

export function groupByDate<T>(
  items: T[],
  getDate: (item: T) => string
): Record<string, T[]> {
  return items.reduce((groups, item) => {
    const date = getDate(item);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}
