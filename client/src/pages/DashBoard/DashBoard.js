import React, { useEffect } from 'react';
import Sidebar from './SideBar';
import Table from './Table';
import Info from './Info';
import { useDispatch, useSelector } from 'react-redux';
import { clearPdf } from '../../features/resume/resumeSlice';

const PdfViewer = () => {
  const dispatch = useDispatch();
  const pdfUrl = useSelector(state => state.resume.pdf.data);

  useEffect(() => {
    const handleEscKey = event => {
      if (event.key === 'Escape' && pdfUrl) {
        dispatch(clearPdf());
      }
    };

    window.addEventListener('keydown', handleEscKey);

    return () => {
      window.removeEventListener('keydown', handleEscKey);
    };
  }, [dispatch, pdfUrl]);

  if (!pdfUrl) return null;

  return (
    <div className="fixed inset-0 z-50 flex pointer-events-none">
      <div className="w-9/12 flex items-center justify-center">
        <div className="relative bg-white rounded-lg w-[95%] h-[95vh] overflow-hidden shadow-lg pointer-events-auto">
          <iframe src={pdfUrl} className="w-full h-full" title="PDF Viewer" />
        </div>
      </div>
    </div>
  );
};

const DashBoard = () => {
  const dispatch = useDispatch();
  const pdfUrl = useSelector(state => state.resume.pdf.data);

  return (
    <>
      <div className="w-screen h-screen flex flex-row justify-between">
        <Sidebar />
        <Table />
        <Info />
      </div>
      <PdfViewer />
    </>
  );
};

export default DashBoard;
