import Button from '../../components/Button';
const RecruimentSetting = () => {
  return (
    <div className=" relative w-1/2 m-2  p-2 border shadow-[0_0_6px_rgba(0,0,0,0.2)] rounded-lg ">
      <div className=" flex flex-row justify-between">
        <div className=" text-3xl">Recruitment Setting</div>
          <Button className=" font-bold">Add New</Button>
      </div>
      <div className=" font-bold ">Select Recruitment ID</div>
      <table className="w-full">
        <thead>
          <tr className=" bg-black text-white">
            <th className=" text-start">Recruitment ID</th>
            <th className=" text-start">Created At</th>
            <th className=" text-start">Modified At</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 10 }).map((_, index) => (
            <tr
              className={` ${
                index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'
              } hover:bg-gray-300 cursor-pointer`}
            >
              <td key={index}>Seng123</td>
              <td key={index + '123'}>2014/12/12</td>
              <td key={index + '1234'}>2014/12/12</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className=" text-center">1 2 3 4 5 6 7 8 9 10</div>
      <hr className="my-4" />
      <div className=" text-xl mb-4">
        Current Recruitment ID: <span> Seng123</span>
      </div>
      <div className=" flex flex-row gap-2">
        {' '}
        <div>
          <input
            className="  p-2 border rounded-md shadow-[0_0_6px_rgba(0,0,0,0.2)]"
            type="text"
            id="skillsToMatch"
            name="skillsToMatch"
            placeholder="Add Required Skills"
          />
        </div>
        <Button>Add Required Skills</Button>
      </div>
      <div className=" flex flex-row flex-wrap gap-1">
        {Array.from({ length: 10 }).map((_, index) => (
          <div
            className={` my-2 p-2 border shadow-[0_0_6px_rgba(0,0,0,0.2)] rounded-lg`}
          >
            <div className=" text-center">Java</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecruimentSetting;
