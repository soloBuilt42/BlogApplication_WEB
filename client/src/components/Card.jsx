import Markdown from "markdown-to-jsx";
import { AiOutlineArrowRight } from "react-icons/ai";
import { Link } from "react-router-dom";
import { formatDate } from "../utils";

const truncate = (value = "", length) =>
  value.length > length ? `${value.slice(0, length)}...` : value;

const Card = ({ post }) => {
  return (
    <div className='w-full flex flex-col gap-8 items-center rounded md:flex-row'>
      <Link
        to={`/${post?.slug}/${post?._id}`}
        className='w-full h-auto md:h-64 md:w-2/4'
      >
        <img
          src={post?.img}
          alt={post?.title}
          className='object-cover w-full h-full rounded'
        />
      </Link>

      <div className='w-full md:w-2/4 flex flex-col gap-3'>
        <div className='flex gap-2'>
          <span className='text-sm text-gray-600'>
            {formatDate(post?.createdAt)}
          </span>
          <span className='text-sm text-rose-600 font-semibold'>{post?.cat}</span>
        </div>

        <h6 className='text-xl 2xl:text-3xl font-semibold text-black dark:text-white'>
          {post?.title}
        </h6>

        <div className='flex-1 overflow-hidden text-gray-600 dark:text-slate-500 text-sm text-justify'>
          <Markdown options={{ wrapper: "article" }}>
            {truncate(post?.desc ?? "", 250)}
          </Markdown>
        </div>

        <Link
          to={`/${post?.slug}/${post?._id}`}
          className='flex items-center gap-2 text-black dark:text-white'
        >
          <span className='underline'>Read More</span> <AiOutlineArrowRight />
        </Link>
      </div>
    </div>
  );
};

export default Card;
