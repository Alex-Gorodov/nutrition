import { Oval } from "react-loader-spinner";

type SpinnerProps = {
  size: string;
  color?: string;
  wrapper?: boolean;
}

export function LoadingSpinner({size, color, wrapper}: SpinnerProps): JSX.Element {
  return (
    <Oval
      visible={true}
      height={size}
      width={size}
      color={color ? color : "black"}
      secondaryColor="rgba(45,52,64, 40%)"
      ariaLabel="oval-loading"
      wrapperStyle={{}}
      wrapperClass={wrapper ? 'spinner-wrapper' : ''}
    />
  )
}
