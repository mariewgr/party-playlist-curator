import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import axios from 'axios';

const SERVER = import.meta.env.VITE_SERVER_URL;

export default function QRCode() {
  const [hostUrl, setHostUrl] = useState('');

  useEffect(() => {
    axios.get(`${SERVER}/api/host-url`).then(({ data }) => setHostUrl(data.url)).catch(() => {});
  }, []);

  if (!hostUrl) return null;

  return (
    <div className="flex flex-col items-center gap-3 p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
      <p className="text-sm font-medium text-gray-600">Guests — scan to join</p>
      <QRCodeSVG value={hostUrl} size={160} />
      <p className="text-xs text-gray-400 break-all">{hostUrl}</p>
    </div>
  );
}
