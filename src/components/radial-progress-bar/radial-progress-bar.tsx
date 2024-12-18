import { ReactComponent as DoneIcon } from '../../img/icons/done-v-icon.svg'

type RadialProgressBarProps = {
  target: number;
  value: number;
  field: string;
};

export function RadialProgressBar({ target, value, field }: RadialProgressBarProps): JSX.Element {
  const progress = Math.min((value / target) * 100, 100);

  const angle = progress * 3.6;

  const isTargetAchieved = 360 - angle <= 0;
  const style = {
    background: isTargetAchieved ? 'green' : `conic-gradient(#ddd 0deg ${360 - angle}deg, rgb(63.75, 63.75, 63.75) ${360 - angle}deg 360deg)`,
  };

  return (
    <div className="radial-bar" style={style}>
      <div className="radial-bar__overlay">
        {
          isTargetAchieved
          ?
          <>
            <DoneIcon/>
            {field}
          </>
          :
          <>
            <p>
              <b>{value}{field !== 'калорий' && ' г'}</b>
              <span className='radial-bar__target'>/ {target}</span>
            </p>
            <span>{field}</span>
          </>
        }
      </div>
    </div>
  );
}
