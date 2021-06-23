import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

const Dropzone = ({ setError, handleUpload }) => {
  const isValidFileSize = (file) => {
    const size = (file.size / 1024 / 1024).toFixed(2);
    return size <= 5;
  };

  const isValidFileType = (file) => {
    const fileType = file.name.split('.').pop().toLowerCase();
    return ['mp3'].includes(fileType);
  };

  const onDrop = useCallback((acceptedFiles) => {
    // Do something with the files
    if (acceptedFiles.length > 1) {
      setError(`You can only upload 1 file at a time.`);
      return;
    }

    const files = [];
    acceptedFiles.forEach((file) => {
      if (!isValidFileSize(file) || !isValidFileType(file)) {
        files.push(file);
      }
    });

    if (files.length === 0) {
      // Files are good to go!
      const file = acceptedFiles[0];
      handleUpload(file);
    } else {
      setError(`File size too large or unsupported.`);
      return;
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      className="flex justify-center py-10 border rounded shadow"
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag 'n' drop some files here, or click to select files</p>
      )}
    </div>
  );
};

export default Dropzone;
