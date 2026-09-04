import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import Banner from "../components/Banner";
import Card from "../components/Card";
import Pagination from "../components/Pagination";
import PopularPosts from "../components/PopularPost";
import PopularWriters from "../components/PopularWriters";
import { CATEGORIES } from "../utils/categories";
import { getPopular, getPosts } from "../utils/apiCalls";
import useStore from "../store";

const POSTS_PER_PAGE = 5;

const Home = () => {
  const { setIsLoading } = useStore();
  const [posts, setPosts] = useState([]);
  const [popular, setPopular] = useState({ posts: [], writers: [] });
  const [page, setPage] = useState(1);
  const [numOfPages, setNumOfPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    const fetchPosts = async () => {
      setLoading(true);
      setIsLoading(true);

      try {
        const result = await getPosts({ page, limit: POSTS_PER_PAGE });

        if (ignore) return;

        setPosts(result?.data ?? []);
        setNumOfPages(result?.numOfPages || 1);
      } catch (error) {
        if (!ignore) toast.error(error.message);
      } finally {
        if (!ignore) {
          setLoading(false);
          setIsLoading(false);
        }
      }
    };

    fetchPosts();

    return () => {
      ignore = true;
    };
  }, [page, setIsLoading]);

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

  const handlePageChange = (value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const bannerPost = page === 1 ? posts[0] : null;
  const listPosts = bannerPost ? posts.slice(1) : posts;

  return (
    <div className='py-10 2xl:py-5'>
      {bannerPost && <Banner post={bannerPost} />}

      <div className='px-0 lg:px-20 2xl:px-20'>
        <div className='mt-6 md:mt-0'>
          <p className='text-2xl font-semibold text-gray-600 dark:text-white'>
            Popular Categories
          </p>

          <div className='w-full flex flex-wrap py-10 gap-8'>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.label}
                to={`/category?cat=${cat.label}`}
                className={`flex items-center justify-center gap-3 ${cat.color} text-white font-semibold text-base px-4 py-2 rounded cursor-pointer`}
              >
                <cat.Icon />
                <span>{cat.label}</span>
              </Link>
            ))}
          </div>

          <div className='w-full flex flex-col md:flex-row gap-10 2xl:gap-20'>
            <div className='w-full md:w-2/3 flex flex-col gap-10 gap-y-20'>
              {loading ? (
                <div className='w-full py-8 flex justify-center'>
                  <span className='text-lg text-slate-500'>Loading posts...</span>
                </div>
              ) : posts.length === 0 ? (
                <div className='w-full py-8 flex justify-center'>
                  <span className='text-lg text-slate-500'>
                    No post available yet.
                  </span>
                </div>
              ) : (
                <>
                  {listPosts.map((post, index) => (
                    <Card key={post?._id} post={post} index={index} />
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
        </div>
      </div>
    </div>
  );
};

export default Home;
