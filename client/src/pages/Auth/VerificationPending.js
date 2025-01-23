const VerificationPending = () => {
  return (
    <div className="w-screen mt-36">
      <div className="w-1/3 mx-auto flex flex-col items-center border rounded-lg shadow-[0_0_10px_rgba(0,0,0,0.3)] p-16 px-4 pb-8">
        <svg
          className="w-16 h-16 text-yellow-500 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h2 className="text-2xl font-bold mb-4">Verify Your Email</h2>
        <p className="text-gray-600 mb-6 text-center">
          A verification email has been sent to your email address. Please check
          your inbox and click the verification link to complete the
          registration process.
        </p>
        <p className="text-sm text-gray-500">
          If you don't see the email, please check your spam folder.
        </p>
      </div>
    </div>
  );
};

export default VerificationPending;
