export const API_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "http://localhost:8000";

/**
 * Thin fetch wrapper around the Blog Wave API.
 * Resolves with the parsed JSON body, rejects with an Error carrying the
 * server supplied message.
 */
export const apiRequest = async ({ url, method = "GET", data, token }) => {
  const headers = { "Content-Type": "application/json" };

  if (token) headers.Authorization = `Bearer ${token}`;

  let response;

  try {
    response = await fetch(`${API_URL}${url}`, {
      method: method.toUpperCase(),
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });
  } catch {
    throw new Error(
      "Unable to reach the server. Make sure the API is running on " + API_URL
    );
  }

  const result = await response.json().catch(() => ({}));

  if (!response.ok || result?.success === false) {
    throw new Error(result?.message || "Something went wrong");
  }

  return result;
};

/* ------------------------------ auth ------------------------------ */

export const registerUser = (data) =>
  apiRequest({ url: "/auth/register", method: "POST", data });

export const loginUser = (data) =>
  apiRequest({ url: "/auth/login", method: "POST", data });

export const googleSignup = (data) =>
  apiRequest({ url: "/auth/google-signup", method: "POST", data });

export const verifyOtp = (userId, otp) =>
  apiRequest({ url: `/users/verify/${userId}/${otp}`, method: "POST" });

export const resendOtp = (userId) =>
  apiRequest({ url: `/users/resend-link/${userId}`, method: "POST" });

/* ------------------------------ posts ------------------------------ */

export const getPosts = ({ page = 1, limit = 5, cat = "", writerId = "" } = {}) => {
  const params = new URLSearchParams({ page, limit });

  if (cat) params.set("cat", cat);
  if (writerId) params.set("writerId", writerId);

  return apiRequest({ url: `/posts?${params.toString()}` });
};

export const getPopular = () => apiRequest({ url: "/posts/popular" });

export const getSinglePost = (postId) => apiRequest({ url: `/posts/${postId}` });

export const getPostComments = (postId) =>
  apiRequest({ url: `/posts/comments/${postId}` });

export const commentOnPost = (postId, desc, token) =>
  apiRequest({
    url: `/posts/comment/${postId}`,
    method: "POST",
    data: { desc },
    token,
  });

export const deleteComment = (id, postId, token) =>
  apiRequest({ url: `/posts/comment/${id}/${postId}`, method: "DELETE", token });

/* ---------------------------- writer area --------------------------- */

export const getAnalytics = (token, query = 28) =>
  apiRequest({
    url: "/posts/admin-analytics",
    method: "POST",
    data: { query },
    token,
  });

export const getWriterContent = (token, page = 1) =>
  apiRequest({ url: `/posts/admin-content?page=${page}`, method: "POST", token });

export const getWriterFollowers = (token, page = 1) =>
  apiRequest({ url: `/posts/admin-followers?page=${page}`, method: "POST", token });

export const createPost = (data, token) =>
  apiRequest({ url: "/posts/create-post", method: "POST", data, token });

export const updatePost = (id, data, token) =>
  apiRequest({ url: `/posts/update/${id}`, method: "PATCH", data, token });

export const deletePost = (id, token) =>
  apiRequest({ url: `/posts/${id}`, method: "DELETE", token });

/* ------------------------------ users ------------------------------ */

export const getWriter = (id) => apiRequest({ url: `/users/get-user/${id}` });

export const followWriter = (id, token) =>
  apiRequest({ url: `/users/follower/${id}`, method: "POST", token });

export const updateProfile = (data, token) =>
  apiRequest({ url: "/users/update-user", method: "PUT", data, token });
