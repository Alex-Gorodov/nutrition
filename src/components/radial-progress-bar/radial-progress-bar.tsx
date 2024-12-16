type RadialProgressBarProps = {
  target: number;
  value: number;
  field: string;
};

export function RadialProgressBar({ target, value, field }: RadialProgressBarProps): JSX.Element {
  const progress = Math.min((value / target) * 100, 100); // Процент заполнения (максимум 100%)
  const isOverHalf = progress > 50; // Проверяем, превышает ли прогресс 50%

  // Угол для градиента
  const angle = isOverHalf
    ? (progress - 50) * 3.6 // Для правой половины
    : 90 - progress * 3.6; // Для левой половины

  const style = {
    background: isOverHalf
      ? `linear-gradient(${angle}deg, #028cd5 50%, transparent 50%), linear-gradient(90deg, #028cd5 50%, #ddd 50%)`
      : `linear-gradient(${angle}deg, #ddd 50%, transparent 50%), linear-gradient(90deg, #028cd5 50%, #ddd 50%)`,
  };

  return (
    <div className="radial-bar" style={style}>
      <div className="radial-bar__overlay">
        <b>{value}</b>
        <span>{field}</span>
      </div>
    </div>
  );
}
