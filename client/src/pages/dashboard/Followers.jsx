import { useEffect, useState } from "react";
import { toast } from "sonner";
import useStore from "../../store";
import Pagination from "../../components/Pagination";
import { formatDate } from "../../utils";
import { getWriterFollowers } from "../../utils/apiCalls";
import Profile from "../../assets/profile.png";

const Followers = () => {
  const { user } = useStore();
  const [followers, setFollowers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [numOfPages, setNumOfPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    const fetchFollowers = async () => {
      setLoading(true);

      try {
        const result = await getWriterFollowers(user?.token, page);

        if (ignore) return;

        setFollowers(result?.data ?? []);
        setTotal(result?.total || 0);
        setNumOfPages(result?.numOfPages || 1);
      } catch (error) {
        if (!ignore) toast.error(error.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchFollowers();

    return () => {
      ignore = true;
    };
  }, [user?.token, page]);

  return (
    <div className='flex flex-col gap-6'>
      <h2 className='text-2xl font-semibold text-slate-800 dark:text-white'>
        Followers ({total})
      </h2>

      {loading ? (
        <p className='text-slate-500'>Loading followers...</p>
      ) : followers.length === 0 ? (
        <p className='text-slate-500'>You have no followers yet.</p>
      ) : (
        <>
          <ul className='flex flex-col divide-y divide-slate-100 dark:divide-slate-900'>
            {followers.map((follower) => (
              <li key={follower._id} className='flex items-center gap-4 py-4'>
                <img
                  src={follower?.followerId?.image || Profile}
                  alt={follower?.followerId?.name}
                  className='w-10 h-10 rounded-full object-cover'
                />
                <div className='flex-1 min-w-0'>
                  <p className='text-slate-800 dark:text-white truncate'>
                    {follower?.followerId?.name}
                  </p>
                  <p className='text-sm text-slate-500 truncate'>
                    {follower?.followerId?.email}
                  </p>
                </div>
                <span className='text-sm text-slate-500 shrink-0'>
                  {formatDate(follower?.createdAt)}
                </span>
              </li>
            ))}
          </ul>

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

export default Followers;
