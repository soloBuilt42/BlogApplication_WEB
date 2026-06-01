import { popular, posts } from "../utils/dummyData"
import { useMemo, useState } from "react";
import Banner from "../components/Banner";
import { Link } from "react-router-dom";
import { CATEGORIES } from "../utils/dummyData";
import Card from "../components/Card";
import { Pagination } from "../components";
import PopularPosts from "../components/PopularPost";
import PopularWriters from "../components/PopularWriters";


const Home = () => {
  const postsPerPage = 2;
  const [page ,setPage] = useState(1);
  
  const bannerPost = useMemo(() => {
    if (posts.length < 1) return null;
    return posts[Math.floor(Math.random() * posts.length)];
  }, []);
  const totalPages = Math.ceil(posts.length / postsPerPage);
  const startIndex = (page - 1) * postsPerPage;
  const currentPosts = posts.slice(startIndex, startIndex + postsPerPage);

  const handlePageChange = (val) => {
    setPage(val);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  if(posts.length < 1) return ( <div className="w-full h-full px-8 flex place-items-center justify-center">
    
    <span className=" text-lg text-slate-500">No Post Available</span>
  </div>
   );
 
  return (
    <div className=" py-10 2xl:py-5 ">
        <Banner post = {bannerPost}/>
        <div className=" px-0  lg:px-20 2xl:px-20">
            <div className="mt-6 md:mt-0">
               <p className="text-2xl font-semibold text-gray-600 dark:text-white">Popular Categories</p>

               <div className="w-full flex flex-wrap py-10 gap-8">
                  {
                    CATEGORIES.map((cat) =>(
                       <Link
                         key={cat.label}
                         to={`/category?cat=${cat.label}`}
                         className={`flex items-center justify-center gap-3 ${cat.color} text-white font-semibold text-base px-4 py-2 rounded cursor-pointer`}
                       >
                       {cat.icon}
                       <span>{cat.label}</span>
                       </Link>
                    ))
                  }
               </div>
               <div className=" w-full flex flex-col md:flex-row gap-10 2xl:gap-20 ">
                  <div className=" w-full md:w-2/3 flex flex-col gap-10 gap-y-20">
                      {
                         currentPosts?.map((post,index) =>(
                            <Card key={post?._id} post={post} index={startIndex + index}/>
                         ))
                      }
                      <div className="w-full flex items-center justify-center">
                          <Pagination
                            currentPage={page}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                          />
                      </div>
                        </div>
                        <div className=" w-full md:w-1/4 flex flex-col gap-y-12">
                           {/*popular post */}
                            <PopularPosts posts ={popular?.posts}/>
                            <PopularWriters data ={popular?.writers}/>

                        </div>
                  </div>
               </div>
            </div>
        </div>
    
  )
}

export default Home
