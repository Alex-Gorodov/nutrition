import '@pqina/pintura/pintura.css';
import { getEditorDefaults } from '@pqina/pintura';
import { PinturaEditor } from "@pqina/react-pintura";
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUploadedPath } from '../../store/action';
import { RootState } from '../../store/root-reducer';

export function ImageEditor(): JSX.Element {
  const dispatch = useDispatch();
  const [isEditorOpen, setIsEditorOpen] = useState(true);

  const path = useSelector((state: RootState) => state.page.uploadedPath);

  if (!isEditorOpen || !path) return <></>;

  return (
    <div className="upload__editor">
      <PinturaEditor
        {...getEditorDefaults()}
        src={path}

        onProcess={(res) => {
          const resultUrl = URL.createObjectURL(res.dest);
          dispatch(setUploadedPath({ path: resultUrl }));
          setIsEditorOpen(false);
        }}
        onClose={() => setIsEditorOpen(false)}
      />
    </div>
  );
}
