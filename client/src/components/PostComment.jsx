import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Toaster, toast } from "sonner";
import useStore from "../store";
import Button from "./Button";
import Profile from "../assets/profile.png";
import { formatDate } from "../utils";
import {
  commentOnPost,
  deleteComment as deleteCommentApi,
  getPostComments,
} from "../utils/apiCalls";

const PostComments = ({ postId }) => {
  const { user } = useStore();
  const [comments, setComments] = useState([]);
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let ignore = false;

    const fetchComments = async () => {
      setLoading(true);

      try {
        const result = await getPostComments(postId);

        if (!ignore) setComments(result?.data ?? []);
      } catch {
        if (!ignore) setComments([]);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    if (postId) fetchComments();

    return () => {
      ignore = true;
    };
  }, [postId]);

  const handleSubmitComment = async (event) => {
    event.preventDefault();

    const trimmed = desc.trim();
    if (!trimmed || submitting) return;

    setSubmitting(true);

    try {
      const result = await commentOnPost(postId, trimmed, user?.token);

      setComments((prev) => [result.data, ...prev]);
      setDesc("");
      toast.success("Comment published");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (id) => {
    try {
      await deleteCommentApi(id, postId, user?.token);

      setComments((prev) => prev.filter((comment) => comment?._id !== id));
      toast.success("Comment deleted");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className='w-full py-10'>
      <p className='text-lg text-slate-700 dark:text-slate-500 mb-6'>
        Post Comments ({comments.length})
      </p>

      {user?.token ? (
        <form className='flex flex-col mb-6' onSubmit={handleSubmitComment}>
          <textarea
            name='desc'
            onChange={(e) => setDesc(e.target.value)}
            value={desc}
            required
            placeholder='Add a comment...'
            className='bg-transparent w-full p-2 border border-gray-300 focus:outline-none focus:border-blue-600 focus:ring-blue-600 rounded'
          ></textarea>

          <div className='w-full flex justify-end mt-2'>
            <Button
              type='submit'
              label={submitting ? "Submitting..." : "Submit"}
              styles='bg-blue-600 text-white py-2 px-5 rounded disabled:opacity-60'
            />
          </div>
        </form>
      ) : (
        <Link to='/signin' className='flex flex-col py-10'>
          <Button
            label='Sign in to comment'
            styles='flex items-center justify-center bg-white dark:bg-transparent text-black dark:text-gray-500 px-4 py-1.5 rounded-full border'
          />
        </Link>
      )}

      <div className='w-full h-full flex flex-col gap-10 2xl:gap-y-14 px-2'>
        {loading ? (
          <span className='text-base text-slate-600'>Loading comments...</span>
        ) : comments.length === 0 ? (
          <span className='text-base text-slate-600'>
            No comment, be the first to comment
          </span>
        ) : (
          comments.map((el) => (
            <div key={el?._id} className='w-full flex gap-4 items-start'>
              <img
                src={el?.user?.image || Profile}
                alt={el?.user?.name}
                className='w-10 h-10 rounded-full object-cover'
              />
              <div className='w-full -mt-2'>
                <div className='w-full flex items-center gap-2'>
                  <p className='text-slate-700 dark:text-gray-400 font-medium'>
                    {el?.user?.name}
                  </p>
                  <span className='text-slate-700 text-xs italic'>
                    {formatDate(el?.createdAt)}
                  </span>
                </div>

                <div className='flex flex-col gap-2'>
                  <span className='text-sm'>{el?.desc}</span>

                  {user?.user?._id === el?.user?._id && (
                    <span
                      className='text-base text-red-600 cursor-pointer w-fit'
                      onClick={() => handleDeleteComment(el?._id)}
                    >
                      Delete
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Toaster richColors />
    </div>
  );
};

export default PostComments;
