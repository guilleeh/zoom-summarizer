import Head from 'next/head';
import { useEffect, useState } from 'react';
import FileDownload from 'react-file-download';

import Navbar from '../components/navbar';
import { apiFetch } from '../api/fetch';
import CustomLoader from '../components/loader';
import Table from '../components/table';

export default function Home() {
  const [me, setMe] = useState(null);
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
    const id = window.localStorage.getItem('id');

    const url = process.env.API_URL + 'uploads';

    const resp = await apiFetch(url, 'get', { id }, null, true);

    if (resp.success) {
      setRecordings(resp.data);
    }
  };

  const handleDownload = async (transcriptId) => {
    const url = process.env.API_URL + 'generate-pdf';

    const resp = await apiFetch(
      url,
      'post',
      null,
      { transcriptId },
      true,
      'blob',
    );

    FileDownload(resp, 'Transcript.pdf');
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
        <Table data={recordings} handleDownload={handleDownload} />
      </div>
    </>
  );
}
