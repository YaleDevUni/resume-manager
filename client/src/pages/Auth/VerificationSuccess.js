import { Link } from 'react-router-dom';

const VerificationSuccess = () => {
  return (
    <div className="w-screen mt-36">
      <div className="w-1/3 mx-auto flex flex-col items-center border rounded-lg shadow-[0_0_10px_rgba(0,0,0,0.3)] p-16 px-4 pb-8">
        <svg
          className="w-16 h-16 text-green-500 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
        <h2 className="text-2xl font-bold mb-4">
          Email Verified Successfully!
        </h2>
        <p className="text-gray-600 mb-6 text-center">
          Your email has been verified. You can now log in to your account.
        </p>
        <Link
          to="/login"
          className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
};

export default VerificationSuccess;
