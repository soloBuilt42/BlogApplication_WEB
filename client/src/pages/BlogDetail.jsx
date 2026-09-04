import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Markdown from "markdown-to-jsx";
import { Toaster, toast } from "sonner";
import PopularPosts from "../components/PopularPost";
import PopularWriters from "../components/PopularWriters";
import PostComments from "../components/PostComment";
import { getPopular, getSinglePost } from "../utils/apiCalls";
import { formatDate } from "../utils";
import Profile from "../assets/profile.png";

const BlogDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [popular, setPopular] = useState({ posts: [], writers: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    const fetchPost = async () => {
      setLoading(true);
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });

      try {
        const result = await getSinglePost(id);

        if (!ignore) setPost(result?.data ?? null);
      } catch (error) {
        if (!ignore) {
          setPost(null);
          toast.error(error.message);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    if (id) fetchPost();

    return () => {
      ignore = true;
    };
  }, [id]);

  useEffect(() => {
    let ignore = false;

    getPopular()
      .then((result) => {
        if (!ignore) setPopular(result?.data ?? { posts: [], writers: [] });
      })
      .catch(() => {});

    return () => {
      ignore = true;
    };
  }, []);

  if (loading) {
    return (
      <div className='w-full h-full py-8 flex items-center justify-center'>
        <span className='text-xl text-slate-500'>Loading post...</span>
      </div>
    );
  }

  if (!post) {
    return (
      <div className='w-full h-full py-8 flex items-center justify-center'>
        <span className='text-xl text-slate-500'>Post not found.</span>
      </div>
    );
  }

  return (
    <div className='w-full px-0 md:px-10 py-8 2xl:px-20'>
      <div className='w-full flex flex-col-reverse md:flex-row gap-2 gap-y-5 items-center'>
        <div className='w-full md:w-1/2 flex flex-col gap-8'>
          <h1 className='text-3xl md:text-5xl font-bold text-slate-800 dark:text-white'>
            {post?.title}
          </h1>

          <div className='w-full flex items-center'>
            <span className='flex-1 text-rose-600 font-semibold'>{post?.cat}</span>

            <span className='flex flex-1 items-baseline text-2xl font-medium text-slate-700 dark:text-gray-400'>
              {post?.views?.length || 0}
              <span className='text-base text-rose-600 ml-1'>Views</span>
            </span>
          </div>

          <Link to={`/writer/${post?.user?._id}`} className='flex gap-3'>
            <img
              src={post?.user?.image || Profile}
              alt={post?.user?.name}
              className='object-cover w-12 h-12 rounded-full'
            />
            <div>
              <p className='text-slate-800 dark:text-white font-medium'>
                {post?.user?.name}
              </p>
              <span className='text-slate-600'>{formatDate(post?.createdAt)}</span>
            </div>
          </Link>
        </div>

        <img
          src={post?.img}
          alt={post?.title}
          className='w-full md:w-1/2 h-auto md:h-[360px] 2xl:h-[460px] rounded object-cover'
        />
      </div>

      <div className='w-full flex flex-col md:flex-row gap-10 2xl:gap-20 mt-10'>
        <div className='w-full md:w-2/3 flex flex-col text-black dark:text-gray-500'>
          {post?.desc && (
            <Markdown
              options={{ wrapper: "article" }}
              className='leading-8 2xl:leading-[3rem] text-base 2xl:text-[20px]'
            >
              {post.desc}
            </Markdown>
          )}

          <div className='w-full'>
            <PostComments postId={post?._id} />
          </div>
        </div>

        <div className='w-full md:w-1/4 flex flex-col gap-y-12'>
          <PopularPosts posts={popular?.posts} />
          <PopularWriters data={popular?.writers} />
        </div>
      </div>

      <Toaster richColors />
    </div>
  );
};

export default BlogDetail;
