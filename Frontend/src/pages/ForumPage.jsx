import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import plantService from '../services/plantService';


const ForumPage = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [editingPost, setEditingPost] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const userJson = localStorage.getItem('user');
    if (!userJson) {
      navigate('/login');
      return;
    }

    setCurrentUser(JSON.parse(userJson));
    fetchPosts();
  }, [navigate]);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const data = await plantService.getPosts();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async (postId, e) => {
    e.stopPropagation();
    try {
      await plantService.likePost(postId);
      fetchPosts(); // Refresh posts after liking
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPost(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!newPost.title.trim()) {
      errors.title = 'Title is required';
    }
    if (!newPost.content.trim()) {
      errors.content = 'Content is required';
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    // Clear any previous errors
    setErrors({});

    try {
      if (editingPost) {
        // Update existing post
        await plantService.updatePost(editingPost._id, {
          title: newPost.title,
          content: newPost.content
        });
        setEditingPost(null);
      } else {
        // Create new post
        await plantService.createPost({
          title: newPost.title,
          content: newPost.content
        });
      }

      // Refresh posts
      fetchPosts();

      // Reset form
      setNewPost({
        title: '',
        content: ''
      });
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setNewPost({
      title: post.title,
      content: post.content
    });
    window.scrollTo(0, 0);
  };

  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await plantService.deletePost(postId);
        fetchPosts();
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingPost(null);
    setNewPost({
      title: '',
      content: ''
    });
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="min-h-[calc(100vh-70px)] bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Community Forum</h1>
          <p className="text-gray-500">Connect with fellow plant enthusiasts, share experiences, and get advice</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-8">
          {/* New Post Section / Sidebar */}
          <div className="lg:order-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-800 mb-6">{editingPost ? 'Edit Post' : 'Create a New Post'}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={newPost.title}
                    onChange={handleChange}
                    placeholder="What's your topic?"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${errors.title ? 'border-red-300' : 'border-gray-200'}`}
                  />
                  {errors.title && <span className="text-xs text-red-500 mt-1 block">{errors.title}</span>}
                </div>
                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                  <textarea
                    id="content"
                    name="content"
                    value={newPost.content}
                    onChange={handleChange}
                    rows="5"
                    placeholder="Share your thoughts, questions, or experiences..."
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none ${errors.content ? 'border-red-300' : 'border-gray-200'}`}
                  ></textarea>
                  {errors.content && <span className="text-xs text-red-500 mt-1 block">{errors.content}</span>}
                </div>
                <div className="flex gap-3 pt-2">
                  {editingPost && (
                    <button
                      type="button"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </button>
                  )}
                  <button type="submit" className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors cursor-pointer shadow-sm">
                    {editingPost ? 'Update Post' : 'Post to Forum'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Posts Section */}
          <div className="lg:order-2">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              Recent Discussions
              <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{posts.length}</span>
            </h2>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
                <p>Loading discussions...</p>
              </div>
            ) : posts.length > 0 ? (
              <div className="space-y-6">
                {posts.map(post => (
                  <div key={post._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="p-6 border-b border-gray-50">
                      <h3 className="text-lg font-bold text-gray-800 mb-2 hover:text-primary transition-colors cursor-pointer" onClick={() => navigate(`/forum/${post._id}`)}>
                        {post.title}
                      </h3>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                            {(post.author?.username || 'U').charAt(0).toUpperCase()}
                          </div>
                          <span>{post.author?.username || 'Unknown User'}</span>
                        </div>
                        <span>{formatDate(new Date(post.createdAt))}</span>
                      </div>
                    </div>

                    <div className="p-6">
                      <p className="text-gray-600 leading-relaxed line-clamp-3 mb-4">{post.content}</p>
                      <button className="text-primary hover:text-primary-dark text-sm font-medium hover:underline inline-flex items-center gap-1 cursor-pointer" onClick={() => navigate(`/forum/${post._id}`)}>
                        Read more
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                      </button>
                    </div>

                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center flex-wrap gap-4">
                      <div className="flex items-center gap-4">
                        <button
                          className={`flex items-center gap-1.5 text-sm font-medium transition-colors cursor-pointer px-3 py-1.5 rounded-lg hover:bg-white ${post.likes?.some(like => like.user === currentUser?.id)
                            ? 'text-primary'
                            : 'text-gray-500 hover:text-primary'
                            }`}
                          onClick={(e) => handleLike(post._id, e)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className={`w-4 h-4 ${post.likes?.some(like => like.user === currentUser?.id) ? 'fill-current' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                          </svg>
                          {post.likes?.length || 0} Likes
                        </button>
                        <button
                          className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-primary transition-colors cursor-pointer px-3 py-1.5 rounded-lg hover:bg-white"
                          onClick={() => navigate(`/forum/${post._id}`)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                          </svg>
                          {post.comments?.length || 0} Comments
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        {currentUser && post.author && currentUser.id === post.author._id && (
                          <>
                            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer" onClick={() => handleEdit(post)} title="Edit">
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                            </button>
                            <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer" onClick={() => handleDelete(post._id)} title="Delete">
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-sm border border-gray-100 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-gray-300 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No discussions yet</h3>
                <p className="text-gray-500 max-w-xs mx-auto mb-6">Be the first to start a discussion in our community forum!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForumPage;
