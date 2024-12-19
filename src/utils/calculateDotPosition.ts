export function calculateDotPosition(value: number, target: number, radius: number): { top: string, left: string, transform: string } {
  const percentage = (value / target) * 100;  // Вычисляем процентное соотношение
  const angle = (percentage * 360) / 100;     // Рассчитываем угол для точки
  const radians = (angle - 90) * (Math.PI / 180);  // Учитываем -90° для начального положения

  // Смещение по горизонтали и вертикали с учетом радиуса
  const x = radius + Math.cos(radians) * radius;
  const y = radius + Math.sin(radians) * radius;

  // Убираем ограничение на угол и учитываем, что прогресс может выходить за пределы 100%
  return {
    top: `${y + 1}px`,
    left: `${x + 1}px`,
    transform: `rotate(${angle}deg)` // Устанавливаем угол без ограничения
  };
}
