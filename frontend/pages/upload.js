import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import FileDownload from 'react-file-download';

import Navbar from '../components/navbar';
import { apiFetch } from '../api/fetch';
import CustomLoader from '../components/loader';
import Dropzone from '../components/dropzone';
import Alert from '../components/alert';

export default function Home() {
  const router = useRouter();
  const [me, setMe] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const meCall = async () => {
    const id = window.localStorage.getItem('id');
    const url = process.env.API_URL + `me`;
    const resp = await apiFetch(url, 'get', { id }, null, true);
    if (resp.success) {
      setMe(resp.data);
    }
  };

  const handleUpload = async (file) => {
    setLoading(true);
    const id = window.localStorage.getItem('id');
    const formData = new FormData();
    formData.append('id', id);
    formData.append('uploadedFile', file);

    const url = process.env.API_URL + 'upload';
    const resp = await apiFetch(url, 'post', null, formData, true);

    setLoading(false);
    if (resp.success) {
      setError(null);
      router.push('/');
    } else {
      setError('There was a problem uploading your recording.');
    }
  };

  useEffect(() => {
    meCall();
  }, []);

  if (!me) {
    return <CustomLoader />;
  }

  return (
    <>
      <Navbar me={me} />
      <div className="container mx-auto py-4">
        <h2 class="text-2xl font-bold text-center py-10 leading-7 text-gray-900 sm:text-3xl sm:truncate">
          Audio Upload
        </h2>
        <Dropzone setError={setError} handleUpload={handleUpload} />
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <CustomLoader />
          </div>
        )}
      </div>
      {error && (
        <div className="container mx-auto w-1/3">
          <Alert title="Upload Error. " subtitle={error} />{' '}
        </div>
      )}
    </>
  );
}
