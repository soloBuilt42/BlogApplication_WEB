import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import Card from "../components/Card";
import Pagination from "../components/Pagination";
import PopularPosts from "../components/PopularPost";
import PopularWriters from "../components/PopularWriters";
import { getPopular, getPosts } from "../utils/apiCalls";

const CategoriesPage = () => {
  const [searchParams] = useSearchParams();
  const cat = searchParams.get("cat") || "";

  const [posts, setPosts] = useState([]);
  const [popular, setPopular] = useState({ posts: [], writers: [] });
  const [page, setPage] = useState(1);
  const [numOfPages, setNumOfPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Reset to the first page whenever the category changes.
  const [activeCat, setActiveCat] = useState(cat);

  if (activeCat !== cat) {
    setActiveCat(cat);
    setPage(1);
  }

  useEffect(() => {
    let ignore = false;

    const fetchPosts = async () => {
      setLoading(true);

      try {
        const result = await getPosts({ page, limit: 5, cat });

        if (ignore) return;

        setPosts(result?.data ?? []);
        setNumOfPages(result?.numOfPages || 1);
      } catch (error) {
        if (!ignore) toast.error(error.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchPosts();

    return () => {
      ignore = true;
    };
  }, [cat, page]);

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

  return (
    <div className='px-0 2xl:px-20'>
      <div className='py-5'>
        <h2 className='text-4xl 2xl:text-5xl font-semibold text-slate-600 dark:text-white'>
          {cat || "All Posts"}
        </h2>
      </div>

      <div className='w-full flex flex-col md:flex-row gap-10 2xl:gap-20'>
        <div className='w-full md:w-2/3 flex flex-col gap-10'>
          {loading ? (
            <div className='w-full py-8 flex justify-center'>
              <span className='text-lg text-slate-500'>Loading posts...</span>
            </div>
          ) : posts.length === 0 ? (
            <div className='w-full py-8 flex justify-center'>
              <span className='text-lg text-slate-500'>
                No post available for this category
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
    </div>
  );
};

export default CategoriesPage;
