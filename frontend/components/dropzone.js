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

    const file = acceptedFiles[0];

    if (!isValidFileSize(file)) {
      setError(`File size must be less than 5mb.`);
      return;
    }

    if (!isValidFileType(file)) {
      setError('File must be of type .mp3.');
      return;
    }
    // Files are good to go!
    setError(null);
    handleUpload(file);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      className="flex justify-center py-10 border rounded shadow"
    >
      <input {...getInputProps()} accept=".mp3,audio/*" />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag 'n' drop some files here, or click to select files</p>
      )}
    </div>
  );
};

export default Dropzone;
