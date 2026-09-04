import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Markdown from "markdown-to-jsx";
import { BiImages } from "react-icons/bi";
import { toast } from "sonner";
import useStore from "../../store";
import Button from "../../components/Button";
import Inputbox from "../../components/Inputbox";
import { CATEGORIES } from "../../utils/categories";
import { compressImage } from "../../utils";
import { createPost, getSinglePost, updatePost } from "../../utils/apiCalls";

const emptyPost = { title: "", cat: CATEGORIES[0].label, desc: "", img: "" };

const PostEditor = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const { user } = useStore();

  const isEdit = Boolean(id);

  const [post, setPost] = useState(location.state?.post ?? emptyPost);
  const [loading, setLoading] = useState(isEdit && !location.state?.post);
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    let ignore = false;

    if (!isEdit || location.state?.post) return;

    getSinglePost(id)
      .then((result) => {
        if (!ignore) setPost(result.data);
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
  }, [id, isEdit, location.state?.post]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setPost((prev) => ({ ...prev, img: "" }));
      const dataUrl = await compressImage(file, 1000, 0.75);
      setPost((prev) => ({ ...prev, img: dataUrl }));
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting) return;

    if (!post.title || !post.desc || !post.img || !post.cat) {
      return toast.error("Title, category, cover image and content are required");
    }

    setSubmitting(true);

    try {
      if (isEdit) {
        await updatePost(
          id,
          {
            title: post.title,
            desc: post.desc,
            img: post.img,
            cat: post.cat,
          },
          user?.token
        );
        toast.success("Post updated");
      } else {
        await createPost(post, user?.token);
        toast.success("Post created");
      }

      navigate("/dashboard/contents");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className='text-slate-500'>Loading post...</p>;

  return (
    <div className='flex flex-col gap-6 max-w-3xl'>
      <h2 className='text-2xl font-semibold text-slate-800 dark:text-white'>
        {isEdit ? "Edit post" : "Write a post"}
      </h2>

      <form className='flex flex-col gap-5' onSubmit={handleSubmit}>
        <Inputbox
          type='text'
          label='Title'
          name='title'
          value={post.title}
          isRequired={true}
          placeholder='An interesting title'
          onChange={handleChange}
        />

        <div className='w-full flex flex-col gap-1'>
          <label className='text-slate-900 dark:text-gray-500'>Category</label>
          <select
            name='cat'
            value={post.cat}
            onChange={handleChange}
            className='dark:bg-transparent block w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-md focus:outline-none'
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.label} value={cat.label} className='text-black'>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div className='w-full flex flex-col gap-2'>
          <label className='text-slate-900 dark:text-gray-500'>Cover image</label>
          <label
            htmlFor='cover-image'
            className='flex h-40 w-full cursor-pointer items-center justify-center rounded-md border border-dashed border-gray-300 dark:border-gray-600 overflow-hidden text-gray-500'
          >
            {post.img ? (
              <img
                src={post.img}
                alt='Cover preview'
                className='h-full w-full object-cover'
              />
            ) : (
              <span className='flex flex-col items-center gap-2'>
                <BiImages className='h-8 w-8' />
                Choose a cover image
              </span>
            )}
          </label>
          <input
            id='cover-image'
            type='file'
            accept='image/*'
            onChange={handleFileChange}
            className='hidden'
          />
        </div>

        <div className='w-full flex flex-col gap-1'>
          <div className='flex items-center justify-between'>
            <label className='text-slate-900 dark:text-gray-500'>
              Content (markdown supported)
            </label>
            <button
              type='button'
              onClick={() => setPreview((prev) => !prev)}
              className='text-sm text-rose-700'
            >
              {preview ? "Edit" : "Preview"}
            </button>
          </div>

          {preview ? (
            <div className='min-h-[240px] p-3 border border-gray-300 dark:border-gray-600 rounded-md text-slate-800 dark:text-slate-300'>
              <Markdown options={{ wrapper: "article" }}>
                {post.desc || "Nothing to preview yet."}
              </Markdown>
            </div>
          ) : (
            <textarea
              name='desc'
              value={post.desc}
              onChange={handleChange}
              rows={12}
              required
              placeholder='## Start writing...'
              className='dark:bg-transparent block w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-md focus:outline-none'
            />
          )}
        </div>

        <div className='flex gap-3'>
          <Button
            type='submit'
            label={
              submitting
                ? "Saving..."
                : isEdit
                  ? "Save changes"
                  : "Publish post"
            }
            styles='bg-black dark:bg-rose-800 text-white px-6 py-2.5 rounded-full'
          />
          <Button
            label='Cancel'
            onClick={() => navigate("/dashboard/contents")}
            styles='border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 px-6 py-2.5 rounded-full'
          />
        </div>
      </form>
    </div>
  );
};

export default PostEditor;
