import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";
import Logo from "../components/Logo.jsx";
import Button from "../components/Button.jsx";
import Divider from "../components/Divider.jsx";
import Inputbox from "../components/Inputbox.jsx";
import GoogleAuthButton from "../components/GoogleAuthButton.jsx";
import useStore from "../store";
import { loginUser } from "../utils/apiCalls";

const LoginPage = () => {
  const navigate = useNavigate();
  const { user, signIn } = useStore();
  const [data, setData] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);

  const hasGoogleClient = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting) return;
    setSubmitting(true);

    try {
      const result = await loginUser(data);

      signIn({ user: result.user, token: result.token });
      toast.success(result.message);
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSuccess = (result) => {
    signIn({ user: result.user, token: result.token });
    toast.success(result.message);
    navigate("/");
  };

  if (user?.token) return <Navigate to='/' replace />;

  return (
    <div className='flex w-full min-h-screen overflow-hidden'>
      <div className='hidden md:flex flex-col gap-y-4 w-1/4 min-h-screen bg-black items-center justify-center'>
        <Logo type='login' />
        <span className='text-xl font-semibold text-white'>Welcome, back!</span>
      </div>

      <div className='flex w-full md:flex-1 min-h-screen bg-white dark:bg-gradient-to-b md:dark:bg-gradient-to-r from-black via-[#071b3e] to-black items-center px-10 md:px-20 lg:px-40'>
        <div className='w-full flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
          <div className='block mb-10 md:hidden'>
            <Logo />
          </div>

          <div className='max-w-md w-full space-y-8'>
            <div>
              <h2 className='mt-6 text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white'>
                Sign in to your Account
              </h2>
            </div>

            {hasGoogleClient && (
              <>
                <GoogleAuthButton
                  label='Sign in with Google'
                  onSuccess={handleGoogleSuccess}
                />
                <Divider label='or sign in with email' />
              </>
            )}

            <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
              <div className='flex flex-col rounded-md shadow-md space-y-px gap-5'>
                <Inputbox
                  type='email'
                  label='Email Address'
                  name='email'
                  value={data.email}
                  isRequired={true}
                  placeholder='you@example.com'
                  onChange={handleChange}
                />
                <Inputbox
                  type='password'
                  label='Password'
                  name='password'
                  value={data.password}
                  isRequired={true}
                  placeholder='password'
                  onChange={handleChange}
                />
              </div>

              <Button
                label={submitting ? "Signing in..." : "Sign in"}
                type='submit'
                styles='group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-full text-white bg-black dark:bg-rose-800 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 mt-8'
              />
            </form>

            <div className='flex items-center justify-center text-gray-600 dark:text-gray-300'>
              <p>
                Don&apos;t have an account?{" "}
                <Link to='/signup' className='text-rose-800 font-medium'>
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <Toaster richColors />
    </div>
  );
};

export default LoginPage;
