import { ReactComponent as UploadIcon } from "../../img/icons/upload-icon.svg";
import { ReactComponent as Cross } from "../../img/icons/cross-icon.svg";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { setUploadedPath } from "../../store/action";
import { useDropzone } from "react-dropzone";
import { useDispatch, useSelector } from "react-redux";
import { useRef, useCallback } from "react";
import { ScreenSizes } from "../../const";
import { RootState } from "../../store/root-reducer";

interface UploadProps {
  onFileUpload: (fileUrl: string) => void;
  inputId: string;
  name: string;
}

export function UploadPicture({ onFileUpload, inputId, name }: UploadProps): JSX.Element {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
  const isMobile = useMediaQuery(ScreenSizes.MobileOnly);
  const path = useSelector((state: RootState) => state.page.uploadedPath);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const url = reader.result as string;
        dispatch(setUploadedPath({ path: url }));
        onFileUpload(url);
      };
      reader.readAsDataURL(file);
    }
  }, [dispatch, onFileUpload]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/jpeg': [],
      'image/jpg': [],
      'image/png': [],
      'image/webp': [],
    },
    onDrop,
  });

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleClearPath = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(setUploadedPath({ path: null }));
  };

  return (
    <div className="upload">
      {path ? (
        <div className="upload__preview-wrapper">
          <img
            className="upload__preview"
            width={100}
            height={100}
            src={path}
            alt="Processed"
          />
          <button
            className="upload__preview-remove-btn"
            onClick={handleClearPath}
            type="button"
          >
            <Cross />
          </button>
        </div>
      ) : (
        <div className="upload__wrapper" {...getRootProps()} tabIndex={-1}>
          {isMobile && (
            <button
              className="button upload__button"
              onClick={handleButtonClick}
              type="button"
            >
              <UploadIcon />
            </button>
          )}
          <input
            {...getInputProps()}
            className="visually-hidden"
            name={name}
            id={inputId}
            ref={fileInputRef}
          />
          {!isMobile && (
            <div className="upload__drop form__input">
              <p className="upload__description">
                Перетащи сюда изображение или кликни для загрузки.
              </p>
            </div>
          )}
          <p className="upload__description">
            PNG, WEBP, JPG, JPEG. Max 1Gb.
          </p>
        </div>
      )}
    </div>
  );
}
