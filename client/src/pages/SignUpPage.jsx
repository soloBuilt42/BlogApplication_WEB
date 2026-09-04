import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { BiImages } from "react-icons/bi";
import { Toaster, toast } from "sonner";
import Logo from "../components/Logo";
import Button from "../components/Button.jsx";
import Divider from "../components/Divider.jsx";
import Inputbox from "../components/Inputbox.jsx";
import GoogleAuthButton from "../components/GoogleAuthButton.jsx";
import useStore from "../store";
import { registerUser } from "../utils/apiCalls";
import { compressImage } from "../utils";

const SignUpPage = () => {
  const navigate = useNavigate();
  const { user, signIn } = useStore();

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [accountType, setAccountType] = useState("User");
  const [image, setImage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const hasGoogleClient = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    try {
      setImage(await compressImage(selectedFile, 400, 0.8));
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting) return;

    if (data.password.length < 6) {
      return toast.error("Password must be at least 6 characters long");
    }

    if (accountType === "Writer" && !image) {
      return toast.error("Writers need a profile picture");
    }

    setSubmitting(true);

    try {
      const result = await registerUser({ ...data, accountType, image });

      if (result.success === "PENDING") {
        toast.success(result.message);
        navigate(`/verify/${result.user._id}`);
        return;
      }

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
        <Logo type='sign-in' />
        <span className='text-xl font-semibold text-white'>
          Create your account
        </span>
      </div>

      <div className='flex w-full md:flex-1 min-h-screen bg-white dark:bg-gradient-to-b md:dark:bg-gradient-to-r from-black via-[#071b3e] to-black items-center px-10 md:px-20 lg:px-40'>
        <div className='w-full flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
          <div className='block mb-10 md:hidden'>
            <Logo />
          </div>

          <div className='max-w-md w-full space-y-8'>
            <div>
              <h2 className='mt-6 text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white'>
                Sign up for an Account
              </h2>
            </div>

            {hasGoogleClient && (
              <>
                <GoogleAuthButton
                  label='Sign up with Google'
                  onSuccess={handleGoogleSuccess}
                />
                <Divider label='or sign up with email' />
              </>
            )}

            <div className='flex gap-3'>
              {["User", "Writer"].map((type) => (
                <button
                  key={type}
                  type='button'
                  onClick={() => setAccountType(type)}
                  className={`flex-1 py-2 rounded-full border text-sm font-medium ${
                    accountType === type
                      ? "bg-black dark:bg-rose-800 text-white border-transparent"
                      : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {type === "User" ? "Reader" : "Writer"}
                </button>
              ))}
            </div>

            <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
              <div className='flex flex-col rounded-md shadow-md space-y-px gap-5'>
                <div className='flex flex-col items-center gap-3'>
                  <label
                    htmlFor='profile-photo'
                    className='flex h-20 w-20 cursor-pointer items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 dark:border-gray-600 dark:bg-transparent dark:text-gray-300 overflow-hidden'
                  >
                    {image ? (
                      <img
                        src={image}
                        alt='Profile preview'
                        className='h-full w-full object-cover'
                      />
                    ) : (
                      <BiImages className='h-8 w-8' />
                    )}
                  </label>
                  <input
                    id='profile-photo'
                    type='file'
                    accept='image/*'
                    onChange={handleFileChange}
                    className='hidden'
                  />
                  <span className='text-xs text-gray-500'>
                    {accountType === "Writer"
                      ? "Profile picture (required for writers)"
                      : "Profile picture (optional)"}
                  </span>
                </div>

                <Inputbox
                  type='text'
                  label='First Name'
                  name='firstName'
                  value={data.firstName}
                  isRequired={true}
                  placeholder='First name'
                  onChange={handleChange}
                />
                <Inputbox
                  type='text'
                  label='Last Name'
                  name='lastName'
                  value={data.lastName}
                  isRequired={true}
                  placeholder='Last name'
                  onChange={handleChange}
                />
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
                label={submitting ? "Creating account..." : "Sign up"}
                type='submit'
                styles='group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-full text-white bg-black dark:bg-rose-800 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 mt-8'
              />
            </form>

            <div className='flex items-center justify-center text-gray-600 dark:text-gray-300'>
              <p>
                Already have an account?{" "}
                <Link to='/signin' className='text-rose-800 font-medium'>
                  Sign In
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

export default SignUpPage;
