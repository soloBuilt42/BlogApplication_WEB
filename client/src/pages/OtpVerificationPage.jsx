import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Toaster, toast } from "sonner";
import Logo from "../components/Logo";
import Button from "../components/Button";
import Inputbox from "../components/Inputbox";
import useStore from "../store";
import { resendOtp, verifyOtp } from "../utils/apiCalls";

const OtpVerificationPage = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { signIn } = useStore();

  const [otp, setOtp] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting) return;
    setSubmitting(true);

    try {
      const result = await verifyOtp(userId, otp.trim());

      signIn({ user: result.user, token: result.token });
      toast.success(result.message);
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (resending) return;
    setResending(true);

    try {
      const result = await resendOtp(userId);
      toast.success(result.message);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className='flex w-full min-h-screen items-center justify-center bg-white dark:bg-[#020b19] px-6'>
      <div className='w-full max-w-md flex flex-col gap-8'>
        <div className='flex flex-col items-center gap-2'>
          <Logo />
          <h2 className='text-2xl font-semibold text-gray-900 dark:text-white'>
            Verify your email
          </h2>
          <p className='text-sm text-center text-gray-600 dark:text-gray-400'>
            Enter the 6 digit one time password that was sent to your email
            address. Writer accounts must be verified before signing in.
          </p>
        </div>

        <form className='flex flex-col gap-6' onSubmit={handleSubmit}>
          <Inputbox
            type='text'
            label='One Time Password'
            name='otp'
            value={otp}
            isRequired={true}
            placeholder='123456'
            onChange={(e) => setOtp(e.target.value)}
          />

          <Button
            label={submitting ? "Verifying..." : "Verify email"}
            type='submit'
            styles='w-full flex justify-center py-2.5 px-4 text-sm font-medium rounded-full text-white bg-black dark:bg-rose-800 hover:bg-rose-700'
          />
        </form>

        <div className='flex flex-col items-center gap-2 text-sm text-gray-600 dark:text-gray-400'>
          <button
            type='button'
            onClick={handleResend}
            className='text-rose-700 font-medium disabled:opacity-60'
            disabled={resending}
          >
            {resending ? "Sending..." : "Resend the OTP"}
          </button>
          <Link to='/signin' className='underline'>
            Back to sign in
          </Link>
        </div>
      </div>

      <Toaster richColors />
    </div>
  );
};

export default OtpVerificationPage;
