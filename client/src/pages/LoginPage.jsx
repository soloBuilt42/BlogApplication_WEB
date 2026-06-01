
import Logo from "../components/Logo.jsx";
import { Link } from "react-router-dom";
import {Toaster ,toast} from "sonner";
import { useState } from "react";
import {FcGoogle} from "react-icons/fc"
import { useGoogleLogin } from "@react-oauth/google";
import Button from "../components/Button.jsx";
import Divider from "../components/Divider.jsx";
import Inputbox from "../components/Inputbox.jsx";



const LoginPage = () => {
  const user = {};
   const [data , setData] = useState({
     email:"",
     password:""
   })
    const handleChange = (e) =>{
       const { name, value } = e.target;
       setData({...data , [name]:value,})
    }
    const googleLogin = async()=>{}
    const handleSubmit = async (e) => {
      e.preventDefault();
      console.log(data);
    };
  if (user.token) window.location.replace("/");
  toast.error("Login");
  return (
    <div key="fresh-layout-fix" className="flex w-full min-h-screen overflow-hidden">
      <div className="hidden md:flex flex-col gap-y-4 w-1/4 min-h-screen bg-black items-center justify-center">
        <Logo type="login" />
        <span className="text-xl font-semibold text-white">Welcome, back!</span>
      </div>
      <div className="flex w-full md:flex-1 min-h-screen bg-white dark:bg-gradient-to-b md:dark:bg-gradient-to-r from-black via-[#071b3e] to-black items-center px-10 md:px-20 lg:px-40">
         <div className="w-full flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
             <div className=" block mb-10 md:hidden ">
                 <Logo/>
             </div>
             <div className="max-w-md w-full space-y-8">
                  <div className="">
                     <h2 className=" mt-6 text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white">
                           
                           Sign in to your Account
                     </h2>
                  </div>
                  <Button label="Sign in with Google"
                   icon={<FcGoogle className=""/>}
                    onClick={()=>googleLogin()}
                   styles="w-full flex flex-row-reverse gap-4 bg-white dark:bg-transparent text-black dark:text-white px-5 py-2.5 rounded-full border border-gray-300 dark:border-gray-600"
                  />
                  <Divider label ="or signIn in with email "/>
                  <form className="mt-8 space-y-6" onSubmit ={handleSubmit}>
                       <div className=" flex flex-col rounded-md shadow-md space-y-px gap-5">
                          <Inputbox
                           type = "email"
                           label = "Email Address"
                           name ="email"
                           value = {data?.email}
                           isRequired={true}
                           placeholder='you@example.com'
                          onChange ={handleChange}
                          />
                           <Inputbox
                           type = "password"
                           label = "password"
                           name ="password"
                           value = {data?.password}
                           isRequired={true}
                           placeholder='password'
                          onChange ={handleChange}
                          />
                       </div>
                       <Button
                        label="Sign in"
                        type  = "submit"
                        styles =" group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-full text-white bg-black dark:bg-rose-800 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 mt-8"
                       />
                     </form>
                      <div className=" flex items-center justify-center text-gray-600 dark:text-gray-300">
                            <p>
                                Don't have an account?{" "}
                                <Link to = '/signup' className="text-rose-800 font-medium">
                                    signUp
                                </Link>
                                   
                            </p>
                        </div>
              </div>
         </div>
      </div>
      <Toaster richColors/>
    </div>
  );
};

export default LoginPage;
