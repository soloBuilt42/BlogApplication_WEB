import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaUserCheck } from "react-icons/fa";
import { Toaster, toast } from "sonner";
import useStore from "../store";
import { formatNumber } from "../utils";
import Button from "../components/Button";
import Card from "../components/Card";
import Pagination from "../components/Pagination";
import PopularPosts from "../components/PopularPost";
import PopularWriters from "../components/PopularWriters";
import Profile from "../assets/profile.png";
import {
  followWriter as followWriterApi,
  getPopular,
  getPosts,
  getWriter,
} from "../utils/apiCalls";

const WriterPage = () => {
  const { user } = useStore();
  const { id } = useParams();

  const [writer, setWriter] = useState(null);
  const [posts, setPosts] = useState([]);
  const [popular, setPopular] = useState({ posts: [], writers: [] });
  const [page, setPage] = useState(1);
  const [numOfPages, setNumOfPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    let ignore = false;

    const fetchWriter = async () => {
      setLoading(true);

      try {
        const result = await getWriter(id);

        if (ignore) return;

        setWriter(result?.data ?? null);
        setFollowing(
          Boolean(
            result?.data?.followers?.some(
              (item) => String(item?.followerId) === String(user?.user?._id)
            )
          )
        );
      } catch {
        if (!ignore) setWriter(null);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    if (id) fetchWriter();

    return () => {
      ignore = true;
    };
  }, [id, user?.user?._id]);

  useEffect(() => {
    let ignore = false;

    getPosts({ page, limit: 5, writerId: id })
      .then((result) => {
        if (ignore) return;

        setPosts(result?.data ?? []);
        setNumOfPages(result?.numOfPages || 1);
      })
      .catch(() => {});

    return () => {
      ignore = true;
    };
  }, [id, page]);

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

  const handleFollow = async () => {
    if (!user?.token) return toast.error("Please sign in first");

    try {
      const result = await followWriterApi(id, user.token);

      setFollowing(Boolean(result?.following));
      setWriter((prev) =>
        prev
          ? {
              ...prev,
              followers: result?.following
                ? [...(prev.followers ?? []), { followerId: user?.user?._id }]
                : (prev.followers ?? []).filter(
                    (item) => String(item?.followerId) !== String(user?.user?._id)
                  ),
            }
          : prev
      );
      toast.success(result?.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handlePageChange = (value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className='w-full h-full py-8 flex items-center justify-center'>
        <span className='text-lg text-slate-500'>Loading writer...</span>
      </div>
    );
  }

  if (!writer) {
    return (
      <div className='w-full h-full py-8 flex items-center justify-center'>
        <span className='text-lg text-slate-500'>Writer not found.</span>
      </div>
    );
  }

  return (
    <div className='px-0 2xl:px-20'>
      <div className='w-full md:h-60 flex flex-col gap-5 items-center md:flex-row bg-black dark:bg-gradient-to-r from-[#020b19] to-[#020b19] mt-5 mb-10 rounded-md p-5 md:px-20'>
        <img
          src={writer?.image || Profile}
          alt={writer?.name}
          className='w-48 h-48 rounded-full object-cover border-4 border-slate-400'
        />

        <div className='w-full h-full flex flex-col gap-y-5 md:gap-y-8 items-center justify-center'>
          <h2 className='text-white text-4xl 2xl:text-3xl font-bold'>
            {writer?.name}
          </h2>

          <div className='flex gap-10'>
            <div className='flex flex-col items-center'>
              <p className='text-gray-300 text-2xl font-semibold'>
                {formatNumber(writer?.followers?.length ?? 0)}
              </p>
              <span className='text-gray-500'>Followers</span>
            </div>
            <div className='flex flex-col items-center'>
              <p className='text-gray-300 text-2xl font-semibold'>
                {formatNumber(posts.length)}
              </p>
              <span className='text-gray-500'>Posts</span>
            </div>
          </div>

          {user?.token && String(user?.user?._id) !== String(id) && (
            <div>
              {!following ? (
                <Button
                  label='Follow'
                  onClick={handleFollow}
                  styles='text-slate-800 font-semibold md:mt-4 px-6 py-1 rounded-full bg-white'
                />
              ) : (
                <button
                  onClick={handleFollow}
                  className='flex items-center justify-center gap-2 text-white font-semibold md:mt-4 px-6 py-1 rounded-full border'
                >
                  <span>Following</span>
                  <FaUserCheck />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className='w-full flex flex-col md:flex-row gap-10 2xl:gap-20'>
        <div className='w-full md:w-2/3 flex flex-col gap-10'>
          {posts.length === 0 ? (
            <div className='w-full h-full py-8 flex justify-center'>
              <span className='text-lg text-slate-500'>
                No post available for this writer
              </span>
            </div>
          ) : (
            <>
              {posts.map((post) => (
                <Card key={post?._id} post={post} />
              ))}

              <div className='w-full flex items-center justify-center'>
                <Pagination
                  currentPage={page}
                  totalPages={numOfPages}
                  onPageChange={handlePageChange}
                />
              </div>
            </>
          )}
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

export default WriterPage;
