import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import plantService from '../services/plantService';
import './DiscussionPage.css';

const DiscussionPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [commentError, setCommentError] = useState('');

  useEffect(() => {
    const userJson = localStorage.getItem('user');
    if (!userJson) {
      navigate('/login');
      return;
    }
    
    setCurrentUser(JSON.parse(userJson));
    fetchPostDetails();
  }, [navigate, postId]);

  const fetchPostDetails = async () => {
    setIsLoading(true);
    try {
      const data = await plantService.getPostById(postId);
      setPost(data);
    } catch (error) {
      console.error('Error fetching post details:', error);
      setError('Failed to load discussion. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      await plantService.likePost(postId);
      fetchPostDetails(); 
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    if (!newComment.trim()) {
      setCommentError('Comment cannot be empty');
      return;
    }
    
    setCommentError('');
    
    try {
      await plantService.addComment(postId, { content: newComment });
      setNewComment(''); // Clear comment input
      fetchPostDetails(); // Refresh post data
    } catch (error) {
      console.error('Error adding comment:', error);
      setCommentError('Failed to add comment. Please try again.');
    }
  };

  const handleCommentLike = async (commentId) => {
    try {
      await plantService.likeComment(postId, commentId);
      fetchPostDetails(); // Refresh post data
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await plantService.deleteComment(postId, commentId);
        fetchPostDetails(); // Refresh post data
      } catch (error) {
        console.error('Error deleting comment:', error);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString));
  };

  if (isLoading) {
    return (
      <div className="discussion-page">
        <div className="container">
          <div className="loading-spinner">Loading discussion...</div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="discussion-page">
        <div className="container">
          <div className="error-message">
            <h2>Error</h2>
            <p>{error || 'Discussion not found'}</p>
            <button className="btn btn-primary" onClick={() => navigate('/forum')}>
              Return to Forum
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isPostLikedByUser = post.likes?.some(like => like.user === currentUser.id);

  return (
    <div className="discussion-page">
      <div className="container">
        <div className="discussion-header">
          <button className="btn btn-back" onClick={() => navigate('/forum')}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back to Forum
          </button>
          <h1>{post.title}</h1>
        </div>

        <div className="discussion-content">
          <div className="post-details">
            <div className="post-meta">
              <div className="post-author">
                <span className="author-name">{post.author?.username || 'Unknown User'}</span>
              </div>
              <span className="post-date">{formatDate(post.createdAt)}</span>
            </div>
            <div className="post-body">
              <p>{post.content}</p>
            </div>
            <div className="post-actions">
              <button 
                className={`like-button ${isPostLikedByUser ? 'liked' : ''}`} 
                onClick={handleLike}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                </svg>
                <span>{post.likes?.length || 0} Likes</span>
              </button>
              <div className="comment-count">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
                <span>{post.comments?.length || 0} Comments</span>
              </div>
            </div>
          </div>

          <div className="comments-section">
            <h2>Comments</h2>
            
            <form className="comment-form" onSubmit={handleCommentSubmit}>
              <div className="form-group">
                <textarea
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows="3"
                ></textarea>
                {commentError && <span className="error-text">{commentError}</span>}
              </div>
              <button type="submit" className="btn btn-primary">Post Comment</button>
            </form>

            {post.comments && post.comments.length > 0 ? (
              <div className="comments-list">
                {post.comments.map(comment => {
                  const isCommentLikedByUser = comment.likes?.some(like => like.user === currentUser.id);
                  const isCommentAuthor = comment.author?._id === currentUser.id;
                  
                  return (
                    <div key={comment._id} className="comment-card">
                      <div className="comment-header">
                        <span className="comment-author">{comment.author?.username || 'Unknown User'}</span>
                        <span className="comment-date">{formatDate(comment.createdAt)}</span>
                      </div>
                      <div className="comment-body">
                        <p>{comment.content}</p>
                      </div>
                      <div className="comment-actions">
                        <button 
                          className={`like-button ${isCommentLikedByUser ? 'liked' : ''}`} 
                          onClick={() => handleCommentLike(comment._id)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                          </svg>
                          <span>{comment.likes?.length || 0}</span>
                        </button>
                        {isCommentAuthor && (
                          <button 
                            className="delete-button" 
                            onClick={() => handleDeleteComment(comment._id)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6"></polyline>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                            <span>Delete</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="no-comments">
                <p>No comments yet. Be the first to comment!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscussionPage;
