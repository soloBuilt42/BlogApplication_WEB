import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import useStore from "../../store";
import Pagination from "../../components/Pagination";
import { formatDate } from "../../utils";
import {
  deletePost as deletePostApi,
  getWriterContent,
  updatePost,
} from "../../utils/apiCalls";

const Contents = () => {
  const { user } = useStore();
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [numOfPages, setNumOfPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchContent = async (targetPage) => {
    setLoading(true);

    try {
      const result = await getWriterContent(user?.token, targetPage);

      setPosts(result?.data ?? []);
      setNumOfPages(result?.numOfPages || 1);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;

    getWriterContent(user?.token, page)
      .then((result) => {
        if (ignore) return;

        setPosts(result?.data ?? []);
        setNumOfPages(result?.numOfPages || 1);
      })
      .catch((error) => {
        if (!ignore) toast.error(error.message);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [user?.token, page]);

  const handleToggleStatus = async (post) => {
    try {
      const result = await updatePost(
        post._id,
        { status: !post.status },
        user?.token
      );

      setPosts((prev) =>
        prev.map((item) => (item._id === post._id ? result.data : item))
      );
      toast.success(result.data.status ? "Post published" : "Post unpublished");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this post? This cannot be undone.")) return;

    try {
      await deletePostApi(id, user?.token);
      toast.success("Post deleted");
      await fetchContent(page);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex items-center justify-between gap-4'>
        <h2 className='text-2xl font-semibold text-slate-800 dark:text-white'>
          Your Contents
        </h2>

        <Link
          to='/dashboard/create-post'
          className='bg-black dark:bg-rose-800 text-white text-sm px-4 py-2 rounded-full'
        >
          Write a post
        </Link>
      </div>

      {loading ? (
        <p className='text-slate-500'>Loading your posts...</p>
      ) : posts.length === 0 ? (
        <p className='text-slate-500'>You have not written any post yet.</p>
      ) : (
        <>
          <div className='w-full overflow-x-auto'>
            <table className='w-full text-left text-sm'>
              <thead className='text-slate-500 border-b border-slate-200 dark:border-slate-800'>
                <tr>
                  <th className='py-3 pr-4 font-medium'>Title</th>
                  <th className='py-3 pr-4 font-medium'>Category</th>
                  <th className='py-3 pr-4 font-medium'>Views</th>
                  <th className='py-3 pr-4 font-medium'>Comments</th>
                  <th className='py-3 pr-4 font-medium'>Created</th>
                  <th className='py-3 pr-4 font-medium'>Status</th>
                  <th className='py-3 font-medium'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr
                    key={post._id}
                    className='border-b border-slate-100 dark:border-slate-900'
                  >
                    <td className='py-3 pr-4 max-w-[220px]'>
                      <Link
                        to={`/${post.slug}/${post._id}`}
                        className='text-slate-800 dark:text-white line-clamp-1'
                      >
                        {post.title}
                      </Link>
                    </td>
                    <td className='py-3 pr-4 text-slate-500'>{post.cat}</td>
                    <td className='py-3 pr-4 text-slate-500'>
                      {post.views?.length || 0}
                    </td>
                    <td className='py-3 pr-4 text-slate-500'>
                      {post.comments?.length || 0}
                    </td>
                    <td className='py-3 pr-4 text-slate-500'>
                      {formatDate(post.createdAt)}
                    </td>
                    <td className='py-3 pr-4'>
                      <button
                        onClick={() => handleToggleStatus(post)}
                        className={`px-2 py-0.5 rounded-full text-xs ${
                          post.status
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {post.status ? "Published" : "Draft"}
                      </button>
                    </td>
                    <td className='py-3 flex gap-3'>
                      <Link
                        to={`/dashboard/edit-post/${post._id}`}
                        state={{ post }}
                        className='text-blue-600'
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(post._id)}
                        className='text-rose-600'
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className='w-full flex items-center justify-center'>
            <Pagination
              currentPage={page}
              totalPages={numOfPages}
              onPageChange={setPage}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Contents;
