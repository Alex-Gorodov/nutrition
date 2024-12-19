import { calculateDotPosition } from '../../utils/calculateDotPosition';

type RadialProgressBarProps = {
  target: number;
  value: number;
  field: string;
  size: number; // Размер SVG
  gradientId: string; // ID для градиента
  strokeColorStart: string; // Начальный цвет градиента
  strokeColorEnd: string; // Конечный цвет градиента
};

function setStrokeOffset(value: number, target: number, circumference: number): number {
  const percent = (value / target) * 100;
  if (percent <= 100) {
    return circumference - (percent / 100) * circumference;
  } else {
    return 0;  // Для значения > 100%, кольцо будет заполнено
  }
}

export function Ring({
  target,
  value,
  field,
  size,
  gradientId,
  strokeColorStart,
  strokeColorEnd,
}: RadialProgressBarProps): JSX.Element {
  const radius = (size - 34) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = setStrokeOffset(value, target, circumference);
  const { top, left, transform } = calculateDotPosition(value, target, radius); // Используем импортированную функцию

  // Вычисляем процент для точки
  const percentage = (value / target) * 100;
  const rotateAngle = percentage <= 100 ? percentage * 3.6 : 360 + (percentage % 100) * 3.6; // Когда больше 100%, продолжаем вращение

  return (
    <div className="ring-container">
      <div className={`ring ${field}`} id={field}>
        <div
          className="dot"
          style={{
            top: top,
            left: left,
            transform: transform, // Используем вычисленный угол для точки
          }}
        ></div>
        <svg className="progress-ring" height={size} width={size}>
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={strokeColorStart} />
              <stop offset="100%" stopColor={strokeColorEnd} />
            </linearGradient>
          </defs>
          <circle
            className="progress-ring__circle"
            strokeWidth={34}
            strokeLinecap="round"
            stroke={`url(#${gradientId})`}
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
            style={{
              strokeDasharray: `${circumference} ${circumference}`,
              strokeDashoffset, // Обновляем offset кольца
            }}
          />
        </svg>
      </div>
    </div>
  );
}
