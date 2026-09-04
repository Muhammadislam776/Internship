import React from 'react';
import { CanvasEditor } from '../../editor/CanvasEditor';

export const CertDesignerPage = () => {
  return (
    <CanvasEditor
      onSaveSuccess={(cert) => {
        console.log('Saved certificate:', cert);
      }}
    />
  );
};
