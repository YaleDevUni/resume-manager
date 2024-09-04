import Button from '../../components/Button';
import Pagination from '../../components/Pagination';
import SkillSearchBar from '../../components/SkillSearch';
import { uploadBulkResumes } from '../../services/ResumeApiService';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect, useCallback } from 'react';
import { useAlerts, AlertContainer } from '../../hooks/useAlerts';
import PdfService from '../../services/PdfService';
import useLocalStorage from '../../hooks/useLocalStorage';
import { MdDeleteForever } from 'react-icons/md';
import {
  updateRecruitmentAsync,
  setRecruitmentSync,
} from '../../features/recruitment/recruitSlice';

const PdfUploader = () => {
  // Custom hooks
  const { alerts, addAlert } = useAlerts(); // Custom hook to handle alerts

  // Redux hooks
  const dispatch = useDispatch(); // Redux dispatch function

  // Redux selectors
  const recruitment = useSelector(state => state.recruitment.recruitment);

  // Local state
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);
  const [pdfCount, setPdfCount] = useState(0); // Counter state

  // Handlers
  const handleDragOver = e => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragEnter = e => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = e => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = async e => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const items = e.dataTransfer.items;
    if (items && items.length > 0) {
      const pdfFiles = [];

      const traverseFileTree = async (item, path = '') => {
        return new Promise((resolve, reject) => {
          if (item.isFile) {
            item.file(file => {
              if (file.type === 'application/pdf') {
                pdfFiles.push(file);
              }
              resolve();
            });
          } else if (item.isDirectory) {
            const dirReader = item.createReader();
            dirReader.readEntries(async entries => {
              for (let i = 0; i < entries.length; i++) {
                await traverseFileTree(entries[i], `${path}${item.name}/`);
              }
              resolve();
            });
          }
        });
      };

      const traverseAllItems = async () => {
        for (let i = 0; i < items.length; i++) {
          const entry = items[i].webkitGetAsEntry();
          if (entry) {
            await traverseFileTree(entry);
          }
        }
      };

      await traverseAllItems();

      if (pdfFiles.length > 0) {
        setFiles(prevFiles => [...prevFiles, ...pdfFiles]);
        setPdfCount(prevCount => prevCount + pdfFiles.length);
      } else {
        addAlert('No PDF files found in the uploaded folder.', 'error');
      }
    }
  };

  const handleRemoveFile = index => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    setPdfCount(prevCount => prevCount - 1);
  };

  const handleReadPdf = async file => {
    const text = await PdfService.extractTextFromPdf(file);
    alert(text);
    console.log(text);
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      addAlert('No files to upload.', 'error');
      return;
    }
    console.log(files);
    const pdfData = files.map(file => ({
      filename: file.name,
      data: file,
    }));

    try {
      await uploadBulkResumes(pdfData, recruitment.id);
      addAlert('Resumes uploaded successfully.', 'success');
      setFiles([]);
      setPdfCount(0);
    } catch (error) {
      addAlert(error || 'An unexpected error occurred', 'error');
    }
  };

  return (
    <div className="  w-1/2 m-2  p-2 border shadow-[0_0_6px_rgba(0,0,0,0.2)] rounded-lg  ">
      {recruitment._id ? (
        <div className=" text-3xl  mb-4">
          Upload Resume to <i> {recruitment.recruitmentID}</i>
        </div>
      ) : (
        <div className=" text-3xl  mb-4">
          Please select a recruitment to upload resume
        </div>
      )}
      <div className=" flex flex-row items-center gap-8">
        <div className=" font-bold">Select PDF File</div>
        <div>
          <button className=" font-bold border shadow-[0_0_6px_rgba(0,0,0,0.2)] rounded-lg p-2">
            Browse File
          </button>
        </div>
      </div>
      {/* drag and drop */}
      <div
        className={`mt-8 border-dashed border-2 h-72 flex flex-row items-center justify-center rounded-lg ${
          dragActive
            ? 'border-blue-500 bg-blue-100'
            : 'border-gray-300 bg-slate-200'
        }`}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="text-center">Drag and Drop PDF File Here</div>
      </div>
      <div className="font-bold mt-8">File list</div>
      <div className="h-96 overflow-auto mt-4 p-2 border shadow-inner overflow-y-scroll">
        {files.length > 0 ? (
          files.map((file, index) => (
            <div
              key={index}
              className={`py-2 flex flex-row items-center justify-between gap-8 ${
                index % 2 === 1 ? 'bg-slate-100' : 'bg-slate-200'
              }`}
            >
              <div className="ml-4 font-bold">{file.name}</div>
              <div>
                <button
                  onClick={() => handleRemoveFile(index)}
                  className="bg-white mr-8 font-bold border shadow-[0_0_6px_rgba(0,0,0,0.2)] rounded-lg p-2"
                >
                  Remove
                </button>
                <button
                  onClick={() => handleReadPdf(file)}
                  className="bg-white font-bold border shadow-[0_0_6px_rgba(0,0,0,0.2)] rounded-lg p-2"
                >
                  Temp
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">No files uploaded</div>
        )}
      </div>
      <div className=" w-full flex flex-row justify-end gap-4  my-4">
        <Button
          onClick={() => {
            setFiles([]);
            setPdfCount(0);
          }}
          className=" font-bold"
        >
          Cancel
        </Button>
        <Button onClick={handleUpload} className=" font-bold">
          Upload {pdfCount} PDF Files
        </Button>
      </div>
    </div>
  );
};
export default PdfUploader;
