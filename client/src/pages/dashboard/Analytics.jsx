import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import useStore from "../../store";
import { getAnalytics } from "../../utils/apiCalls";
import { formatDate, formatNumber } from "../../utils";
import Profile from "../../assets/profile.png";

const RANGES = [
  { label: "7 days", value: 7 },
  { label: "28 days", value: 28 },
  { label: "90 days", value: 90 },
];

const StatCard = ({ label, value }) => (
  <div className='flex flex-col gap-1 rounded-lg border border-slate-200 dark:border-slate-800 p-5'>
    <span className='text-sm text-slate-500'>{label}</span>
    <span className='text-3xl font-semibold text-slate-800 dark:text-white'>
      {formatNumber(value)}
    </span>
  </div>
);

const BarChart = ({ title, data }) => {
  const max = Math.max(1, ...data.map((item) => item.Total));

  return (
    <div className='rounded-lg border border-slate-200 dark:border-slate-800 p-5'>
      <p className='text-sm font-medium text-slate-600 dark:text-slate-300 mb-4'>
        {title}
      </p>

      {data.length === 0 ? (
        <p className='text-sm text-slate-500'>No data for this period yet.</p>
      ) : (
        <div className='flex items-end gap-1 h-40 overflow-x-auto'>
          {data.map((item) => (
            <div
              key={item._id}
              className='flex flex-col items-center justify-end gap-1 h-full min-w-[26px]'
              title={`${item._id}: ${item.Total}`}
            >
              <span className='text-[10px] text-slate-500'>{item.Total}</span>
              <div
                className='w-4 rounded-t bg-rose-600'
                style={{ height: `${(item.Total / max) * 100}%` }}
              />
              <span className='text-[9px] text-slate-500 rotate-45 origin-left w-4'>
                {item._id.slice(5)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Analytics = () => {
  const { user } = useStore();
  const [stats, setStats] = useState(null);
  const [range, setRange] = useState(28);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    const fetchStats = async () => {
      setLoading(true);

      try {
        const result = await getAnalytics(user?.token, range);

        if (!ignore) setStats(result);
      } catch (error) {
        if (!ignore) toast.error(error.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchStats();

    return () => {
      ignore = true;
    };
  }, [user?.token, range]);

  if (loading) {
    return <p className='text-slate-500'>Loading analytics...</p>;
  }

  if (!stats) {
    return <p className='text-slate-500'>No analytics available.</p>;
  }

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-wrap items-center justify-between gap-4'>
        <h2 className='text-2xl font-semibold text-slate-800 dark:text-white'>
          Analytics
        </h2>

        <div className='flex gap-2'>
          {RANGES.map((item) => (
            <button
              key={item.value}
              onClick={() => setRange(item.value)}
              className={`px-3 py-1.5 rounded text-sm border ${
                range === item.value
                  ? "border-rose-600 bg-rose-600 text-white"
                  : "border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
        <StatCard label='Total Posts' value={stats.totalPosts} />
        <StatCard label='Total Views' value={stats.totalViews} />
        <StatCard label='Followers' value={stats.followers} />
        <StatCard label='Writers' value={stats.totalWriters} />
      </div>

      <div className='grid md:grid-cols-2 gap-4'>
        <BarChart title='Views' data={stats.viewStats ?? []} />
        <BarChart title='New followers' data={stats.followersStats ?? []} />
      </div>

      <div className='grid md:grid-cols-2 gap-4'>
        <div className='rounded-lg border border-slate-200 dark:border-slate-800 p-5'>
          <p className='text-sm font-medium text-slate-600 dark:text-slate-300 mb-4'>
            Latest posts
          </p>

          {stats.last5Posts?.length ? (
            <ul className='flex flex-col gap-3'>
              {stats.last5Posts.map((post) => (
                <li key={post._id} className='flex justify-between gap-3 text-sm'>
                  <Link
                    to={`/${post.slug}/${post._id}`}
                    className='text-slate-800 dark:text-white truncate'
                  >
                    {post.title}
                  </Link>
                  <span className='text-slate-500 shrink-0'>
                    {formatDate(post.createdAt)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className='text-sm text-slate-500'>You have not published yet.</p>
          )}
        </div>

        <div className='rounded-lg border border-slate-200 dark:border-slate-800 p-5'>
          <p className='text-sm font-medium text-slate-600 dark:text-slate-300 mb-4'>
            Latest followers
          </p>

          {stats.last5Followers?.length ? (
            <ul className='flex flex-col gap-3'>
              {stats.last5Followers.map((follower) => (
                <li key={follower._id} className='flex items-center gap-3 text-sm'>
                  <img
                    src={follower?.followerId?.image || Profile}
                    alt={follower?.followerId?.name}
                    className='w-8 h-8 rounded-full object-cover'
                  />
                  <span className='text-slate-800 dark:text-white'>
                    {follower?.followerId?.name}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className='text-sm text-slate-500'>No followers yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
