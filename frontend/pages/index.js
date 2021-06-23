import Head from 'next/head';
import { useEffect, useState } from 'react';
import FileDownload from 'react-file-download';

import Navbar from '../components/navbar';
import { apiFetch } from '../api/fetch';
import CustomLoader from '../components/loader';
import Table from '../components/table';
import Reload from '../components/reload';

export default function Home() {
  const [me, setMe] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [recordings, setRecordings] = useState(null);

  const meCall = async () => {
    const id = window.localStorage.getItem('id');
    const url = process.env.API_URL + `me`;
    const resp = await apiFetch(url, 'get', { id }, null, true);
    if (resp.success) {
      setMe(resp.data);
    }
  };

  const recordingsCall = async () => {
    setIsLoading(true);
    const id = window.localStorage.getItem('id');

    const url = process.env.API_URL + 'uploads';

    const resp = await apiFetch(url, 'get', { id }, null, true);

    if (resp.success) {
      setRecordings(resp.data);
    }

    setIsLoading(false);
  };

  const handleDownload = async (transcriptId, name) => {
    const url = process.env.API_URL + 'generate-pdf';

    const resp = await apiFetch(
      url,
      'post',
      null,
      { transcriptId },
      true,
      'blob',
    );

    const fileName = name ? name.split('.')[0] : 'Transcript';

    FileDownload(resp, `${fileName}.pdf`);
  };

  useEffect(() => {
    meCall();
    recordingsCall();
  }, []);

  if (!me || !recordings) {
    return <CustomLoader />;
  }

  return (
    <>
      <Navbar me={me} />
      <div className="container mx-auto py-4">
        <h2 class="text-2xl font-bold text-center py-10 leading-7 text-gray-900 sm:text-3xl sm:truncate">
          Recording Transcripts
        </h2>
        <div className="flex justify-end">
          <Reload isLoading={isLoading} reload={recordingsCall} />
        </div>
        <Table data={recordings} handleDownload={handleDownload} />
      </div>
    </>
  );
}
