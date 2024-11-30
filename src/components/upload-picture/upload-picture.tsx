import { ReactComponent as UploadIcon } from "../../img/icons/upload-icon.svg";
import { useIsMobileOnly } from "../../hooks/useIsMobile";
import { setUploadedPath } from "../../store/action";
import { useDropzone } from "react-dropzone";
import { useDispatch } from "react-redux";
import { useRef, useState } from "react";

interface UploadProps {
  onFileUpload: (fileUrl: string) => void;
  inputId: string;
  name: string;
}

export function Upload({ onFileUpload, inputId, name }: UploadProps): JSX.Element {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const dispatch = useDispatch();
  const isMobile = useIsMobileOnly();

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      acceptedFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          const url = reader.result as string;
          dispatch(setUploadedPath({ path: url }));
          setUploadedFiles(acceptedFiles);
          setFileUrl(url);
          onFileUpload(url);
        };
        reader.readAsDataURL(file);
      });
    },
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files && event.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        const url = reader.result as string;
        setFileUrl(url);
        dispatch(setUploadedPath({ path: url }));
        onFileUpload(url);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="upload">
      <div className="upload__wrapper" {...getRootProps()}>
        {
          fileUrl
          ?
          <img src={fileUrl} alt="Uploaded file" width={100} height={100} className="upload__preview" />
          :
          <div>
            {
              isMobile &&
              <button className="button button--no-shadow upload__button" onClick={handleButtonClick} type="button">
                <UploadIcon />
              </button>
            }
            <input {...getInputProps()} className="visually-hidden" name={name} onChange={handleChange} id={inputId} ref={fileInputRef}/>
            <ul>
              {uploadedFiles.map((file) => (
                <li key={file.name}>
                  <img src={fileUrl ? fileUrl : ''} alt="Uploaded file" width={100} height={100} className="upload__preview" />
                </li>
              ))}
            </ul>
            {
              !isMobile &&
              <div className="upload__drop form__input">
                <p className="upload__description">Перетащи сюда изображение или кликни для загрузки.</p>
              </div>
            }
            <input {...getInputProps} className="visually-hidden" name={name} onChange={handleChange}/>
            {uploadedFiles.map((file) => (
              <div className="upload__image-wrapper" key={file.name}>
                <img src={fileUrl ? fileUrl : ''} alt="Uploaded file" width={60} height={60} className="upload__preview" />
              </div>
            ))}
            <p className="upload__description">PNG, GIF, WEBP, JPG, JPEG. Max 1Gb.</p>
          </div>
        }
      </div>
      {
        isMobile && fileUrl
        ?
        <img src={fileUrl} alt="Uploaded file" width={100} height={100} className="upload__preview" />
        :
        ''
      }
    </div>
  );
}
