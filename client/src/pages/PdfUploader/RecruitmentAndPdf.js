import RecruimentSetting from './RecruimentSetting';
import PdfUploader from './PdfUploader';
import { useNavigate, Link } from 'react-router-dom';

// Icons
import { FaUserCircle } from 'react-icons/fa';
import { IoMdArrowRoundBack } from 'react-icons/io';
const RecruimentAndPdf = () => {
  const navigate = useNavigate();
  // handlers
  const handleGoDashBoard = () => {
    navigate(-1);
  };
  return (
    <div className=" w-screen h-screen flex flex-row ">
      <div className=" bg-gray-800  -right-18 h-32 flex flex-col rounded-br-3xl justify-between w-12 shadow-[8px_15px_15px_-5px_rgba(0,0,0,0.1)]  ">
        <FaUserCircle
          className="cursor-pointer fill-white  w-6 h-6 m-2"
          onClick={() => navigate('/dashboard/profile')}
        />
        {/* <div className='h-4' /> */}
        <IoMdArrowRoundBack
          onClick={handleGoDashBoard}
          className="fill-white w-6 mb-8 h-6 m-2 cursor-pointer hover:fill-orange-400"
        />
      </div>
      <RecruimentSetting />
      <PdfUploader />
    </div>
  );
};
export default RecruimentAndPdf;
