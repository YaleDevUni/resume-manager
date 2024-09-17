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
    <div className=" w-screen h-screen flex flex-row p-2">
      <div className="  -right-16 h-72 flex flex-col rounded-br-3xl justify-evenly w-16 shadow-[8px_15px_15px_-5px_rgba(0,0,0,0.1)] bg-white ">
        <FaUserCircle className="  w-12 h-12 m-2" />
        <IoMdArrowRoundBack
          onClick={handleGoDashBoard}
          className=" w-12 h-12 m-2 cursor-pointer hover:fill-orange-400"
        />
        <div className=" w-12 h-12 m-2  rounded-full"></div>
      </div>
      <RecruimentSetting />
      <PdfUploader />
    </div>
  );
};
export default RecruimentAndPdf;
