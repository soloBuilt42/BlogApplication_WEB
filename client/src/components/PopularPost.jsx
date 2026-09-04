import { Link } from "react-router-dom";
import { getCategoryColor } from "../utils/categories";
import { formatDate } from "../utils";
import fallbackImage from "../assets/hero.png";

const PopularPosts = ({ posts }) => {
  const Card = ({ post }) => (
    <div className='flex gap-3 items-center'>
      <img
        src={post?.img}
        alt={post?.title}
        className='w-14 h-14 rounded object-cover shrink-0'
        onError={(event) => {
          event.currentTarget.src = fallbackImage;
        }}
      />
      <div className='w-full flex flex-col gap-1'>
        <span
          className={`${getCategoryColor(
            post?.cat
          )} w-fit rounded-full px-2 py-0.5 text-white text-[12px] 2xl:text-sm`}
        >
          {post?.cat}
        </span>
        <Link
          to={`/${post?.slug}/${post?._id}`}
          className='text-sm font-medium leading-snug text-black dark:text-white'
        >
          {post?.title}
        </Link>
        <div className='flex flex-wrap gap-2 text-sm'>
          <span className='font-medium'>{post?.user?.name}</span>
          <span className='text-gray-500'>{formatDate(post?.createdAt)}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className='w-full flex flex-col gap-8'>
      <p className='text-xl font-bold -mb-3 text-gray-600 dark:text-slate-500'>
        Popular Articles
      </p>

      {posts?.length ? (
        posts.map((post) => <Card post={post} key={post?._id} />)
      ) : (
        <span className='text-sm text-slate-500'>No popular articles yet.</span>
      )}
    </div>
  );
};

export default PopularPosts;
