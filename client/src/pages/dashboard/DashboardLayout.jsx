import { NavLink, Navigate, Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import { MdOutlineAnalytics, MdOutlineArticle } from "react-icons/md";
import { FiUsers } from "react-icons/fi";
import { BiEditAlt } from "react-icons/bi";
import useStore from "../../store";

const LINKS = [
  { to: "/dashboard", label: "Analytics", icon: <MdOutlineAnalytics />, end: true },
  { to: "/dashboard/contents", label: "Contents", icon: <MdOutlineArticle /> },
  { to: "/dashboard/followers", label: "Followers", icon: <FiUsers /> },
  { to: "/dashboard/create-post", label: "Write a post", icon: <BiEditAlt /> },
];

const DashboardLayout = () => {
  const { user } = useStore();

  if (!user?.token) return <Navigate to='/signin' replace />;

  if (user?.user?.accountType !== "Writer") {
    return (
      <div className='w-full py-20 flex flex-col items-center gap-3'>
        <span className='text-xl font-semibold text-slate-700 dark:text-white'>
          Writers only
        </span>
        <p className='text-slate-500 text-center max-w-md'>
          The dashboard is available to writer accounts. Create a writer account
          to publish posts and track your audience.
        </p>
      </div>
    );
  }

  return (
    <div className='w-full flex flex-col md:flex-row gap-8 py-8'>
      <aside className='w-full md:w-56 shrink-0'>
        <nav className='flex md:flex-col gap-2 overflow-x-auto'>
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-md text-sm whitespace-nowrap ${
                  isActive
                    ? "bg-black dark:bg-rose-800 text-white"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#0b1c33]"
                }`
              }
            >
              {link.icon}
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <section className='flex-1 min-w-0'>
        <Outlet />
      </section>

      <Toaster richColors />
    </div>
  );
};

export default DashboardLayout;
