import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className='flex flex-col md:flex-row w-full py-8 items-center justify-between gap-3 text-[14px] text-gray-700 dark:text-gray-500'>
      <p>© {new Date().getFullYear()} Blog Wave. All rights reserved.</p>
      <div className='flex gap-5'>
        <Link to='/'>Contact</Link>
        <Link to='/'>Terms of Service</Link>
        <Link to='/'>Privacy Policy</Link>
      </div>
    </div>
  );
};

export default Footer;
