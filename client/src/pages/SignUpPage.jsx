import { Link } from "react-router-dom"
import { useState } from "react"
import {BiImages} from "react-icons/bi"
import {FcGoogle} from "react-icons/fc"
import Logo from "../components/Logo"
import Button from "../components/Button.jsx"
import Divider from "../components/Divider.jsx"
import Inputbox from "../components/Inputbox.jsx"
import {Toaster ,toast} from "sonner";
const SignUpPage = () => {
  const user = {};
  const [data,setData] = useState({
    firstName:"",
    lastName:"",
    email:"",
    password:"",
  });
  const [file,setFile] = useState("");
  const [fileURL ,setFileURL] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setFileURL(URL.createObjectURL(selectedFile));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ ...data, file });
  };

  if(user.token) window.location.replace("/");
   

  return (
    <div className="flex w-full min-h-screen overflow-hidden">
        <div className="hidden md:flex flex-col gap-y-4 w-1/4 min-h-screen bg-black items-center justify-center">
            <Logo type ="sign-in"/>
            <span className="text-xl font-semibold text-white">Create your account</span>
        </div>
        <div className="flex w-full md:flex-1 min-h-screen bg-white dark:bg-gradient-to-b md:dark:bg-gradient-to-r from-black via-[#071b3e] to-black items-center px-10 md:px-20 lg:px-40">
          <div className="w-full flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="block mb-10 md:hidden">
                <Logo/>
            </div>
            <div className="max-w-md w-full space-y-8">
              <div>
                <h2 className="mt-6 text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white">
                  Sign up for an Account
                </h2>
              </div>

              <Button
                label="Sign up with Google"
                icon={<FcGoogle />}
                onClick={() => {}}
                styles="w-full flex flex-row-reverse gap-4 bg-white dark:bg-transparent text-black dark:text-white px-5 py-2.5 rounded-full border border-gray-300 dark:border-gray-600"
              />

              <Divider label="or sign up with email" />

              <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <div className="flex flex-col rounded-md shadow-md space-y-px gap-5">
                  <div className="flex flex-col items-center gap-3">
                    <label
                      htmlFor="profile-photo"
                      className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 dark:border-gray-600 dark:bg-transparent dark:text-gray-300 overflow-hidden"
                    >
                      {fileURL ? (
                        <img
                          src={fileURL}
                          alt="Profile preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <BiImages className="h-8 w-8" />
                      )}
                    </label>
                    <input
                      id="profile-photo"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>

                  <Inputbox
                    type="text"
                    label="First Name"
                    name="firstName"
                    value={data.firstName}
                    isRequired={true}
                    placeholder="First name"
                    onChange={handleChange}
                  />
                  <Inputbox
                    type="text"
                    label="Last Name"
                    name="lastName"
                    value={data.lastName}
                    isRequired={true}
                    placeholder="Last name"
                    onChange={handleChange}
                  />
                  <Inputbox
                    type="email"
                    label="Email Address"
                    name="email"
                    value={data.email}
                    isRequired={true}
                    placeholder="you@example.com"
                    onChange={handleChange}
                  />
                  <Inputbox
                    type="password"
                    label="Password"
                    name="password"
                    value={data.password}
                    isRequired={true}
                    placeholder="password"
                    onChange={handleChange}
                  />
                </div>

                <Button
                  label="Sign up"
                  type="submit"
                  styles="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-full text-white bg-black dark:bg-rose-800 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 mt-8"
                />
              </form>

              <div className="flex items-center justify-center text-gray-600 dark:text-gray-300">
                <p>
                  Already have an account?{" "}
                  <Link to="/signin" className="text-rose-800 font-medium">
                    Sign In
                  </Link>
                </p>
              </div>
            </div>
           </div>
        </div>
        
    </div>
  )
}

export default SignUpPage