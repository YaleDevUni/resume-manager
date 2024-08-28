const Home = () => {
  return (
    <div className="w-screen relative mt-36  ">
      <div className=" w-3/4 mx-auto flex flex-col items-center border rounded-lg shadow-[0_0_10px_rgba(0,0,0,0.3)] p-16">
        <h1 className=" text-6xl font-extrabold  mb-12">
          Resume Manager for HR
        </h1>
        <br />
        <p className=" w-3/4 font-semibold text-2xl mb-12">
          Welcome to the Resume Manager for HR! This application is designed to
          help HR professionals manage resumes and job postings. To get started,
          click on the Sign Up link below to create an account.
        </p>
        <br />
        <div className="flex flex-row w-1/6">
          <a
            href="/signup"
            className=" border rounded-md shadow-[0_0_6px_rgba(0,0,0,0.2)] text-center w-1/2 p-3 mr-2 hover:bg-gray-200 "
          >
            Sign Up
          </a>
          <a
            href="/login"
            className="border rounded-md shadow-[0_0_6px_rgba(0,0,0,0.2)] text-center w-1/2 p-3 hover:bg-gray-200"
          >
            Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default Home;
