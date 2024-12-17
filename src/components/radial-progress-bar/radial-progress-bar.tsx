// type RadialProgressBarProps = {
//   target: number;
//   value: number;
//   field: string;
// };

// export function RadialProgressBar({ target, value, field }: RadialProgressBarProps): JSX.Element {
//   const angle = value / target * 100 * 3.6; // Угол для отображения прогресса в 360 градусах

//   const style = {
//     background: `conic-gradient(#028cd5 0deg ${angle}deg, #ddd ${angle}deg 360deg)`,
//   };

//   console.log('====================================');
//   console.log(angle);
//   console.log('====================================');

//   return (
//     <div className="radial-bar" style={style}>
//       <div className="radial-bar__overlay">
//         <b>{value}</b>
//         <span>{field}</span>
//       </div>
//     </div>
//   );
// }

import { ReactComponent as DoneIcon } from '../../img/icons/done-v-icon.svg'

type RadialProgressBarProps = {
  target: number;
  value: number;
  field: string;
};

export function RadialProgressBar({ target, value, field }: RadialProgressBarProps): JSX.Element {
  // Рассчитываем процент прогресса
  const progress = Math.min((value / target) * 100, 100); // Процент заполнения (максимум 100%)

  // Угол для прогресса
  const angle = progress * 3.6; // Угол на 360 градусов

  const isTargetAchieved = 360 - angle <= 0;
  // Применяем правильный конусный градиент
  const style = {
    background: isTargetAchieved ? 'green' : `conic-gradient(#ddd 0deg ${360 - angle}deg, #028cd5 ${360 - angle}deg 360deg)`,
  };



  console.log('====================================');
  console.log('Angle:', angle); // Проверим, какой угол мы вычислили
  console.log('====================================');

  return (
    <div className="radial-bar" style={style}>
      <div className="radial-bar__overlay">
        {
          isTargetAchieved
          ?
          <DoneIcon/>
          :
          <>
            <b>{value}</b>
            <span>{field}</span>
          </>
        }
      </div>
    </div>
  );
}
