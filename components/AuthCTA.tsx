import Link from 'next/link';

interface AuthCTAProps {
  /** The path the user should be redirected to after successful login/registration */
  redirectPath: string;
}

/**
 * Prominent Call-to-Action component with Login and Register buttons.
 * It passes the current page path as a query parameter for post-authentication redirect.
 */
export const AuthCTA = ({ redirectPath }: AuthCTAProps) => {
  return (
    <div className="mt-12 p-6 bg-green-100 border border-green-300 rounded-xl shadow-lg w-full max-w-lg mx-auto text-center">
      <h3 className="text-xl font-bold text-green-800 mb-3">
        Ready to Implement Smart Waste Management?
      </h3>
      <p className="text-gray-700 mb-4">
        Login to schedule a consultation or register your institution now.
      </p>
      
      <div className="flex justify-center gap-4">
        {/* Link to Login, passing the current page as redirect target */}
        <Link 
          href={`/auth/login?redirect=${redirectPath}`}
          className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-200 shadow-md"
        >
          Login
        </Link>
        
        {/* Link to Register, passing the current page as redirect target */}
        <Link 
          href={`/auth/register?redirect=${redirectPath}`}
          className="px-6 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-800 transition duration-200 shadow-md"
        >
          Register
        </Link>
      </div>
    </div>
  );
};