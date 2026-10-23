import { useEffect, useMemo, useState } from "react";
import {
  Heart,
  MessageCircle,
  Send,
  Search,
  Users,
  MapPin,
  Sprout,
  Loader2,
} from "lucide-react";

import Footer from "../../components/layout/Footer";
import { useAuth } from "../../context/AuthContext";

import {
  getPosts,
  createPost,
  toggleLike,
  addComment,
} from "../../api/posts";

function getInitials(name) {
  if (!name) return "U";

  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
}

function formatTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();

  const difference = Math.floor(
    (now.getTime() - date.getTime()) / 1000
  );

  if (difference < 60) {
    return "Just now";
  }

  if (difference < 3600) {
    return `${Math.floor(
      difference / 60
    )} minutes ago`;
  }

  if (difference < 86400) {
    return `${Math.floor(
      difference / 3600
    )} hours ago`;
  }

  if (difference < 172800) {
    return "Yesterday";
  }

  return date.toLocaleDateString();
}

function Community() {
  const { user } = useAuth();

  const [posts, setPosts] = useState([]);

  const [newPost, setNewPost] = useState("");

  const [search, setSearch] = useState("");

  const [commentText, setCommentText] =
    useState({});

  const [openComments, setOpenComments] =
    useState([]);

  const [loading, setLoading] = useState(true);

  const [posting, setPosting] = useState(false);

  const [commenting, setCommenting] =
    useState(null);

  const [error, setError] = useState("");

  const [likedPosts, setLikedPosts] =
    useState([]);

  // ==========================================
  // LOAD POSTS
  // ==========================================

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getPosts();

        setPosts(data.posts || []);
      } catch (err) {
        console.error(
          "Community Load Error:",
          err
        );

        setError(
          err.message ||
            "Failed to load community posts"
        );
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  // ==========================================
  // CREATE POST
  // ==========================================

  const handlePost = async (event) => {
    event.preventDefault();

    if (!newPost.trim()) {
      return;
    }

    try {
      setPosting(true);
      setError("");

      const data = await createPost({
        text: newPost.trim(),
        tag: "Farmer Update",
      });

      setPosts((currentPosts) => [
        data.post,
        ...currentPosts,
      ]);

      setNewPost("");
    } catch (err) {
      console.error(
        "Create Post Error:",
        err
      );

      setError(
        err.message ||
          "Failed to create post"
      );
    } finally {
      setPosting(false);
    }
  };

  // ==========================================
  // LIKE / UNLIKE
  // ==========================================

  const handleLike = async (postId) => {
    try {
      const data = await toggleLike(postId);

      setPosts((currentPosts) =>
        currentPosts.map((post) => {
          if (post._id !== postId) {
            return post;
          }

          const currentUserId =
            user?.id || user?._id;

          let updatedLikes = [
            ...(post.likes || []),
          ];

          if (data.liked) {
            const alreadyExists =
              updatedLikes.some(
                (id) =>
                  id?.toString() ===
                  currentUserId?.toString()
              );

            if (!alreadyExists) {
              updatedLikes.push(
                currentUserId
              );
            }
          } else {
            updatedLikes =
              updatedLikes.filter(
                (id) =>
                  id?.toString() !==
                  currentUserId?.toString()
              );
          }

          return {
            ...post,
            likes: updatedLikes,
          };
        })
      );

      setLikedPosts((currentLikes) =>
        data.liked
          ? currentLikes.includes(postId)
            ? currentLikes
            : [...currentLikes, postId]
          : currentLikes.filter(
              (id) => id !== postId
            )
      );
    } catch (err) {
      console.error(
        "Like Error:",
        err
      );

      setError(
        err.message ||
          "Failed to update like"
      );
    }
  };

  // ==========================================
  // TOGGLE COMMENTS
  // ==========================================

  const toggleComments = (postId) => {
    setOpenComments((current) =>
      current.includes(postId)
        ? current.filter(
            (id) => id !== postId
          )
        : [...current, postId]
    );
  };

  // ==========================================
  // COMMENT INPUT
  // ==========================================

  const handleCommentChange = (
    postId,
    value
  ) => {
    setCommentText((current) => ({
      ...current,
      [postId]: value,
    }));
  };

  // ==========================================
  // ADD COMMENT
  // ==========================================

  const handleAddComment = async (
    event,
    postId
  ) => {
    event.preventDefault();

    const text =
      commentText[postId]?.trim();

    if (!text) {
      return;
    }

    try {
      setCommenting(postId);
      setError("");

      const data = await addComment(
        postId,
        text
      );

      setPosts((currentPosts) =>
        currentPosts.map((post) =>
          post._id === postId
            ? data.post
            : post
        )
      );

      setCommentText((current) => ({
        ...current,
        [postId]: "",
      }));
    } catch (err) {
      console.error(
        "Comment Error:",
        err
      );

      setError(
        err.message ||
          "Failed to add comment"
      );
    } finally {
      setCommenting(null);
    }
  };

  // ==========================================
  // SEARCH
  // ==========================================

  const filteredPosts = useMemo(() => {
    const searchText =
      search.toLowerCase().trim();

    if (!searchText) {
      return posts;
    }

    return posts.filter((post) => {
      const text =
        post.text?.toLowerCase() || "";

      const tag =
        post.tag?.toLowerCase() || "";

      const name =
        post.userId?.name?.toLowerCase() ||
        "";

      return (
        text.includes(searchText) ||
        tag.includes(searchText) ||
        name.includes(searchText)
      );
    });
  }, [posts, search]);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2
            size={40}
            className="animate-spin text-green-600 mx-auto mb-3"
          />

          <p className="text-gray-500">
            Loading community...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50">

      <main className="py-10 px-4">

        <div className="max-w-6xl mx-auto">

          {/* PAGE HEADER */}

          <div className="mb-8">

            <p className="text-green-700 font-semibold flex items-center gap-2">
              <Users size={20} />
              Farmer Network
            </p>

            <h1 className="text-4xl font-bold text-slate-900 mt-2">
              AgriVerse Community
            </h1>

            <p className="text-slate-600 mt-2">
              Connect, share farming knowledge,
              and get advice from other farmers.
            </p>

          </div>

          {/* ERROR */}

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
              {error}
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-6">

            {/* MAIN FEED */}

            <section className="lg:col-span-2 space-y-6">

              {/* CREATE POST */}

              <form
                onSubmit={handlePost}
                className="bg-white rounded-2xl shadow-sm border border-green-100 p-5"
              >

                <h2 className="font-bold text-lg text-slate-800 mb-3">
                  Share with the community
                </h2>

                <textarea
                  value={newPost}
                  onChange={(event) =>
                    setNewPost(
                      event.target.value
                    )
                  }
                  placeholder="Share a farming tip, ask a question, or post an update..."
                  maxLength={1000}
                  className="w-full min-h-28 border border-slate-200 rounded-xl p-4 outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                />

                <div className="flex items-center justify-between mt-3">

                  <p className="text-xs text-gray-400">
                    {newPost.length}/1000
                  </p>

                  <button
                    type="submit"
                    disabled={
                      posting ||
                      !newPost.trim()
                    }
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-xl font-semibold transition"
                  >

                    {posting ? (
                      <>
                        <Loader2
                          size={18}
                          className="animate-spin"
                        />
                        Publishing...
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        Publish Post
                      </>
                    )}

                  </button>

                </div>

              </form>

              {/* POSTS */}

              {filteredPosts.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-10 text-center">

                  <div className="text-5xl mb-4">
                    🌱
                  </div>

                  <h2 className="text-xl font-bold text-gray-800">
                    No posts found
                  </h2>

                  <p className="text-gray-500 mt-2">
                    Be the first farmer to
                    start a discussion.
                  </p>

                </div>
              ) : (
                filteredPosts.map((post) => {

                  const postUser =
                    post.userId;

                  const userId =
                    user?.id || user?._id;

                  const isLiked =
                    likedPosts.includes(
                      post._id
                    ) ||
                    (post.likes || []).some(
                      (id) =>
                        id?.toString() ===
                        userId?.toString()
                    );

                  const likesCount =
                    post.likes?.length || 0;

                  const commentsCount =
                    post.comments?.length || 0;

                  const commentsOpen =
                    openComments.includes(
                      post._id
                    );

                  return (
                    <article
                      key={post._id}
                      className="bg-white rounded-2xl shadow-sm border border-green-100 p-6"
                    >

                      {/* AUTHOR */}

                      <div className="flex items-start gap-3">

                        <div className="w-11 h-11 rounded-full bg-green-700 text-white flex items-center justify-center font-bold">
                          {getInitials(
                            postUser?.name
                          )}
                        </div>

                        <div>

                          <h2 className="font-bold text-slate-900">
                            {postUser?.name ||
                              "Farmer"}
                          </h2>

                          <p className="text-sm text-slate-500 flex items-center gap-1">
                            <MapPin
                              size={14}
                            />

                            {postUser?.accountType ||
                              "Farmer"}{" "}
                            ·{" "}
                            {formatTime(
                              post.createdAt
                            )}
                          </p>

                        </div>

                      </div>

                      {/* TAG */}

                      <span className="inline-block mt-4 bg-green-100 text-green-700 text-sm font-medium px-3 py-1 rounded-full">
                        {post.tag}
                      </span>

                      {/* CONTENT */}

                      <p className="text-slate-700 leading-7 mt-3 whitespace-pre-wrap">
                        {post.text}
                      </p>

                      {/* ACTIONS */}

                      <div className="border-t mt-5 pt-4 flex items-center gap-6">

                        {/* LIKE */}

                        <button
                          type="button"
                          onClick={() =>
                            handleLike(
                              post._id
                            )
                          }
                          className={`flex items-center gap-2 transition ${
                            isLiked
                              ? "text-red-500"
                              : "text-slate-500 hover:text-red-500"
                          }`}
                        >

                          <Heart
                            size={20}
                            fill={
                              isLiked
                                ? "currentColor"
                                : "none"
                            }
                          />

                          {likesCount} Likes

                        </button>

                        {/* COMMENTS */}

                        <button
                          type="button"
                          onClick={() =>
                            toggleComments(
                              post._id
                            )
                          }
                          className={`flex items-center gap-2 transition ${
                            commentsOpen
                              ? "text-green-700"
                              : "text-slate-500 hover:text-green-700"
                          }`}
                        >

                          <MessageCircle
                            size={20}
                          />

                          {commentsCount} Comments

                        </button>

                      </div>

                      {/* COMMENT SECTION */}

                      {commentsOpen && (
                        <div className="mt-5 pt-5 border-t border-gray-100">

                          {/* EXISTING COMMENTS */}

                          {commentsCount > 0 ? (
                            <div className="space-y-4 mb-5">

                              {post.comments.map(
                                (
                                  comment,
                                  index
                                ) => (
                                  <div
                                    key={
                                      comment._id ||
                                      index
                                    }
                                    className="flex gap-3"
                                  >

                                    <div className="w-9 h-9 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-semibold text-sm flex-shrink-0">
                                      {getInitials(
                                        comment
                                          .userId
                                          ?.name
                                      )}
                                    </div>

                                    <div className="bg-gray-50 rounded-xl px-4 py-3 flex-1">

                                      <p className="font-semibold text-sm text-gray-800">
                                        {comment
                                          .userId
                                          ?.name ||
                                          "Farmer"}
                                      </p>

                                      <p className="text-gray-600 text-sm mt-1">
                                        {
                                          comment.text
                                        }
                                      </p>

                                    </div>

                                  </div>
                                )
                              )}

                            </div>
                          ) : (
                            <p className="text-sm text-gray-400 mb-5">
                              No comments yet.
                              Be the first to
                              comment.
                            </p>
                          )}

                          {/* ADD COMMENT */}

                          <form
                            onSubmit={(event) =>
                              handleAddComment(
                                event,
                                post._id
                              )
                            }
                            className="flex gap-3"
                          >

                            <input
                              type="text"
                              value={
                                commentText[
                                  post._id
                                ] || ""
                              }
                              onChange={(event) =>
                                handleCommentChange(
                                  post._id,
                                  event.target
                                    .value
                                )
                              }
                              maxLength={500}
                              placeholder="Write a comment..."
                              className="flex-1 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                            />

                            <button
                              type="submit"
                              disabled={
                                commenting ===
                                  post._id ||
                                !commentText[
                                  post._id
                                ]?.trim()
                              }
                              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white px-4 rounded-xl transition"
                            >

                              {commenting ===
                              post._id ? (
                                <Loader2
                                  size={20}
                                  className="animate-spin"
                                />
                              ) : (
                                <Send
                                  size={20}
                                />
                              )}

                            </button>

                          </form>

                        </div>
                      )}

                    </article>
                  );
                })
              )}

            </section>

            {/* RIGHT SIDEBAR */}

            <aside className="space-y-6">

              {/* SEARCH */}

              <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-5">

                <h2 className="font-bold text-lg text-slate-800 mb-4">
                  Find discussions
                </h2>

                <div className="relative">

                  <Search
                    size={19}
                    className="absolute left-3 top-3 text-slate-400"
                  />

                  <input
                    type="text"
                    placeholder="Search community..."
                    value={search}
                    onChange={(event) =>
                      setSearch(
                        event.target.value
                      )
                    }
                    className="w-full border border-slate-200 rounded-xl py-2.5 pl-10 pr-3 outline-none focus:ring-2 focus:ring-green-500"
                  />

                </div>

              </div>

              {/* COMMUNITY STATS */}

              <div className="bg-green-700 text-white rounded-2xl p-6">

                <Sprout size={30} />

                <h2 className="font-bold text-xl mt-4">
                  Grow together
                </h2>

                <p className="text-green-100 mt-2 leading-6">
                  Share practical farming
                  experiences and support
                  fellow farmers.
                </p>

                <p className="text-3xl font-bold mt-5">
                  {posts.length}
                </p>

                <p className="text-green-100 text-sm">
                  Community posts
                </p>

              </div>

              {/* POPULAR TOPICS */}

              <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-5">

                <h2 className="font-bold text-lg text-slate-800 mb-3">
                  Popular topics
                </h2>

                <div className="flex flex-wrap gap-2">

                  {[
                    "Crop Care",
                    "Weather",
                    "Organic Farming",
                    "Market Prices",
                    "Irrigation",
                  ].map((topic) => (
                    <span
                      key={topic}
                      className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full text-sm"
                    >
                      #{topic}
                    </span>
                  ))}

                </div>

              </div>

            </aside>

          </div>

        </div>

      </main>

      <Footer />

    </div>
  );
}

export default Community;