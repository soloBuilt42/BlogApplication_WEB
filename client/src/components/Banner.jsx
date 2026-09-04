import Markdown from "markdown-to-jsx";
import { Link } from "react-router-dom";
import { formatDate } from "../utils";
import Profile from "../assets/profile.png";

const truncate = (value = "", length) =>
  value.length > length ? `${value.slice(0, length)}...` : value;

const Banner = ({ post }) => {
  if (!post) return null;

  return (
    <div className='w-full mb-10'>
      <div className='relative w-full h-[500px] 2xl:h-[600px] flex px-0 lg:px-20'>
        <Link to={`/${post?.slug}/${post?._id}`} className='w-full'>
          <img
            src={post?.img}
            alt='Banner'
            className='w-full md:w-3/4 h-64 md:h-[420px] 2xl:h-[560px] rounded object-cover'
          />
        </Link>

        <div className='absolute flex flex-col md:right-10 bottom-10 md:bottom-2 w-full md:w-2/4 lg:w-1/3 2xl:w-[480px] bg-white dark:bg-[#05132b] shadow-2xl p-5 rounded-lg gap-3'>
          <Link to={`/${post?.slug}/${post?._id}`}>
            <h1 className='font-semibold text-2xl text-black dark:text-white'>
              {truncate(post?.title ?? "", 60)}
            </h1>
          </Link>

          <div className='flex-1 overflow-hidden text-gray-600 dark:text-slate-500 text-sm text-justify'>
            <Markdown options={{ wrapper: "article" }}>
              {truncate(post?.desc ?? "", 160)}
            </Markdown>
          </div>

          <Link
            to={`/${post?.slug}/${post?._id}`}
            className='w-fit bg-rose-600 bg-opacity-20 text-rose-700 px-4 py-1 rounded-full text-sm cursor-pointer'
          >
            Read more...
          </Link>

          <Link
            to={`/writer/${post?.user?._id}`}
            className='flex gap-3 mt-4 items-center'
          >
            <img
              src={post?.user?.image || Profile}
              alt='User profile'
              className='object-cover w-10 h-10 rounded-full'
            />
            <span className='font-medium text-gray-700 dark:text-slate-500'>
              {post?.user?.name}
            </span>
            <span className='text-gray-500 dark:text-gray-600'>
              {formatDate(post?.createdAt)}
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Banner;
