import { useParams } from "react-router-dom";
import { FaUserCheck } from "react-icons/fa"; 
import useStore from "../store";
import { popular, posts, writer } from "../utils/dummyData";
import { formatNumber } from "../utils";
import Button from "../components/Button";
import Card from "../components/Card";
import PopularPosts from "../components/PopularPost";
import PopularWriters from "../components/PopularWriters";
import { Pagination } from "../components";
import { useMemo, useState } from "react";

const WriterPage = () => {
  const { user } = useStore();
  const { id } = useParams();
  const postsPerPage = 2;
  const [page, setPage] = useState(1);
  const currentWriter = id === writer?._id ? writer : null;
  const writerPosts = useMemo(
    () => posts.filter((post) => post?.user?._id === id),
    [id]
  );
  const totalPages = Math.ceil(writerPosts.length / postsPerPage);
  const startIndex = (page - 1) * postsPerPage;
  const currentPosts = writerPosts.slice(startIndex, startIndex + postsPerPage);
  const followersIds = currentWriter?.followers?.map((f) => f.followerId) || [];

  const handleFollow = () => {};

  const handlePageChange = (val) => {
    setPage(val);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

   if(!currentWriter){
      return (
         <div className="w-full h-full py-8 flex items-center justify-center">
              <span className=" text-lg text-slate-500 ">
                Writer not found.
              </span>
         </div>
      )
   }
  return (
    <div className=" px-0 2xl:px-20">
           <div className="w-full md:h-60 flex flex-col gap-5 items-center md:flex-row bg-black dark:bg-gradient-to-r from-[#020b19] to-[#020b19] mt-5 mb-10 rounded-md p-5 md:px-20 ">
              <img src = {currentWriter?.image} alt={currentWriter?.name} className=" w-48 h-48 rounded-full object-cover border-4 border-slate-400 " />
               
               <div className="w-full h-full  flex flex-col gap-y-5 md:gap-y-8 items-center justify-center">
  
                  <h2 className="text-white text-4xl 2xl:text-3xl font-bold">{currentWriter?.name}</h2>

                  <div className="flex gap-10">
                     <div className="flex flex-col items-col ">
                        <p className="text-gray-300 text-2xl font-semibold "> {formatNumber(currentWriter?.followers?.length ?? 0 )}</p>
                         <span className="text-gray-500">Followers</span>
                     </div>
                       <div className="flex flex-col items-col ">
                        <p className="text-gray-300 text-2xl font-semibold "> {formatNumber(writerPosts.length)}</p>
                         <span className="text-gray-500">Posts</span>
                     </div>
                  </div>
                  {
                     user?.token && <div>
                        {
                          !followersIds.includes(user?.user?._id) ? (
                            <Button label="follow" onClick={ () => handleFollow()}
                             styles = 'text-slate-800 text-semibold md:mt-4 px-6 py-1 rounded-full bg-white'
                            />
                          ) :(
                             <div className="flex items-center justify-center gap-2 text-white text-semibold md:mt-4 px-6 py-1 rounded-full text-white text-semibold md:mt-4 px-6 py-1 rounded-full border">
                                 <span>Following</span>
                                 <FaUserCheck/>
                             </div>
                          )
                        }
                     </div>
                  }
               </div>

           </div>
           <div className="w-full flex flex-col md:flex-row gap-10 2xl:gap-20">
               <div className="w-full md:w-2/3 flex flex-col gap-10">
                   {
                    writerPosts?.length ===0 ?(
                       <div className="w-full h-full py-8 flex justify-center">
                          <span className=" text-lg text-slate-500">
                             No Post Availablable for this writer
                          </span>
                         
                       </div>
                    ) :(
                      <>
                         {currentPosts?.map((post,index) =>( 
                           <Card key={post?._id} post={post} index={startIndex + index} />
                         ))}

                         <div className="w-full flex items-center justify-center">
                            <Pagination
                              currentPage={page}
                              totalPages={totalPages}
                              onPageChange={handlePageChange}
                            />
                           
                         </div>
                      </>
                    )
                   }
               </div>

               <div className=" w-full md:w-1/4 flex flex-col gap-y-12">
                   <PopularPosts posts={popular?.posts}/>
                   <PopularWriters data={popular?.writers}/>
               </div>
           </div>
    </div>
  )
}

export default WriterPage
