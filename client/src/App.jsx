import { useEffect } from 'react'
import { Routes, Route, Outlet } from 'react-router-dom'
import Home from './pages/Home.jsx'
import CategoriesPage from './pages/CategoriesPage.jsx'
import BlogDetail from './pages/BlogDetail.jsx'
import WriterPage from './pages/WriterPage.jsx'
import SignUpPage from './pages/SignUpPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import OtpVerificationPage from './pages/OtpVerificationPage.jsx'
import DashboardLayout from './pages/dashboard/DashboardLayout.jsx'
import Analytics from './pages/dashboard/Analytics.jsx'
import Contents from './pages/dashboard/Contents.jsx'
import Followers from './pages/dashboard/Followers.jsx'
import PostEditor from './pages/dashboard/PostEditor.jsx'
import Loading from './components/Loading.jsx'
import NavBar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import useStore from './store/index.js'

function Layout() {
  return (
    <div className='w-full flex flex-col min-h-screen px-4 md:px-10 2xl:px-28'>
      <NavBar />
      <div className='flex-1'>
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}

function App() {
  const { theme, isLoading } = useStore();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <main className={theme}>
      <div className="w-full min-h-screen relative bg-white text-slate-950 dark:bg-[#020b19] dark:text-white">
        <Routes>
          <Route element={<Layout />}>
            <Route path='/' element={<Home />} />
            <Route path='/category' element={<CategoriesPage />} />
            <Route path='/writer/:id' element={<WriterPage />} />

            <Route path='/dashboard' element={<DashboardLayout />}>
              <Route index element={<Analytics />} />
              <Route path='contents' element={<Contents />} />
              <Route path='followers' element={<Followers />} />
              <Route path='create-post' element={<PostEditor />} />
              <Route path='edit-post/:id' element={<PostEditor />} />
            </Route>

            <Route path='/:slug/:id?' element={<BlogDetail />} />
          </Route>

          <Route path='/signup' element={<SignUpPage />} />
          <Route path='/signin' element={<LoginPage />} />
          <Route path='/verify/:userId' element={<OtpVerificationPage />} />
        </Routes>
        {isLoading && <Loading />}
      </div>
    </main>
  )
}

export default App;
