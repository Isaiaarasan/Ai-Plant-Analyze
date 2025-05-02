import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import plantService from '../services/plantService';
import './ForumPage.css';

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
    <div className="forum-page">
      <div className="container">
        <div className="forum-header">
          <h1>Community Forum</h1>
          <p>Connect with fellow plant enthusiasts, share experiences, and get advice</p>
        </div>

        <div className="forum-content">
          <div className="new-post-section">
            <h2>{editingPost ? 'Edit Post' : 'Create a New Post'}</h2>
            <form className="new-post-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={newPost.title}
                  onChange={handleChange}
                  placeholder="What's your topic?"
                />
                {errors.title && <span className="error-text">{errors.title}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="content">Content</label>
                <textarea
                  id="content"
                  name="content"
                  value={newPost.content}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Share your thoughts, questions, or experiences..."
                ></textarea>
                {errors.content && <span className="error-text">{errors.content}</span>}
              </div>
              <div className="form-actions">
                {editingPost && (
                  <button 
                    type="button" 
                    className="btn btn-outline" 
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </button>
                )}
                <button type="submit" className="btn btn-primary">
                  {editingPost ? 'Update Post' : 'Post to Forum'}
                </button>
              </div>
            </form>
          </div>

          <div className="posts-section">
            <h2>Recent Discussions</h2>
            {isLoading ? (
              <div className="loading-spinner">Loading...</div>
            ) : posts.length > 0 ? (
              <div className="posts-grid">
                {posts.map(post => (
                  <div key={post._id} className="post-card">
                    <div className="post-header">
                      <h3 className="post-title">{post.title}</h3>
                      <div className="post-meta">
                        <span className="post-author">{post.author?.username || 'Unknown User'}</span>
                        <span className="post-date">{formatDate(new Date(post.createdAt))}</span>
                      </div>
                    </div>
                    <div className="post-content">
                      <p>{post.content}</p>
                    </div>
                    <div className="post-footer">
                      <div className="post-stats">
                        <button 
                          className={`post-likes ${post.likes?.some(like => like.user === currentUser?.id) ? 'liked' : ''}`}
                          onClick={(e) => handleLike(post._id, e)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                          </svg>
                          {post.likes?.length || 0} Likes
                        </button>
                        <button 
                          className="post-comments"
                          onClick={() => navigate(`/forum/${post._id}`)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                          </svg>
                          {post.comments?.length || 0} Comments
                        </button>
                      </div>
                      <div className="post-actions">
                        <button className="btn btn-primary btn-sm" onClick={() => navigate(`/forum/${post._id}`)}>View Discussion</button>
                        {currentUser && post.author && currentUser.id === post.author._id && (
                          <div className="author-actions">
                            <button className="btn btn-edit btn-sm" onClick={() => handleEdit(post)}>Edit</button>
                            <button className="btn btn-delete btn-sm" onClick={() => handleDelete(post._id)}>Delete</button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-posts">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <h3>No discussions yet</h3>
                <p>Be the first to start a discussion in our community forum!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForumPage;
