export function calculateDotPosition(
  value: number,
  target: number,
  radius: number
): { top: string, left: string, transform: string } {
  const percentage = (value / target) * 100;
  const angle = (percentage * 360) / 100;
  const radians = (angle - 90) * (Math.PI / 180);

  const x = radius + Math.cos(radians) * radius;
  const y = radius + Math.sin(radians) * radius;

  return {
    top: `${y}px`,
    left: `${x}px`,
    transform: `rotate(${angle}deg)`
  };
}
