import RecruimentSetting from './RecruimentSetting';
import PdfUploader from './PdfUploader';
const RecruimentAndPdf = () => {
  return (
    <div className=" w-screen h-screen flex flex-row p-2">
      <RecruimentSetting />
      <PdfUploader />
    </div>
  );
};
export default RecruimentAndPdf;
