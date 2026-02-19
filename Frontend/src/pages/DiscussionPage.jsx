import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import plantService from '../services/plantService';


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
    <div className="min-h-[calc(100vh-70px)] bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <button className="flex items-center gap-2 text-primary hover:text-primary-dark font-medium mb-6 transition-colors cursor-pointer" onClick={() => navigate('/forum')}>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back to Forum
          </button>
          <h1 className="text-3xl font-bold text-gray-800">{post.title}</h1>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                  {(post.author?.username || 'U').charAt(0).toUpperCase()}
                </div>
                <span className="font-medium text-gray-800">{post.author?.username || 'Unknown User'}</span>
              </div>
              <span className="text-sm text-gray-500">{formatDate(post.createdAt)}</span>
            </div>
            <div className="space-y-4 mb-8">
              <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">{post.content}</p>
            </div>
            <div className="flex gap-6 pt-4 border-t border-gray-100">
              <button
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${isPostLikedByUser
                  ? 'text-primary bg-primary/5'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
                  }`}
                onClick={handleLike}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={`w-5 h-5 ${isPostLikedByUser ? 'fill-current' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                </svg>
                <span className="font-medium">{post.likes?.length || 0} Likes</span>
              </button>
              <div className="flex items-center gap-2 text-gray-600 px-3 py-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
                <span className="font-medium">{post.comments?.length || 0} Comments</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Comments</h2>

            <form onSubmit={handleCommentSubmit} className="mb-10">
              <div className="mb-4">
                <textarea
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows="3"
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none ${commentError ? 'border-red-300' : 'border-gray-200'}`}
                ></textarea>
                {commentError && <span className="text-xs text-red-500 mt-1 block">{commentError}</span>}
              </div>
              <div className="flex justify-end">
                <button type="submit" className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors cursor-pointer shadow-sm">Post Comment</button>
              </div>
            </form>

            {post.comments && post.comments.length > 0 ? (
              <div className="space-y-6">
                {post.comments.map(comment => {
                  const isCommentLikedByUser = comment.likes?.some(like => like.user === currentUser.id);
                  const isCommentAuthor = comment.author?._id === currentUser.id;

                  return (
                    <div key={comment._id} className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-800">{comment.author?.username || 'Unknown User'}</span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
                        </div>
                      </div>
                      <div className="mb-4">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{comment.content}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <button
                          className={`flex items-center gap-1.5 text-sm font-medium transition-colors cursor-pointer ${isCommentLikedByUser
                            ? 'text-primary'
                            : 'text-gray-500 hover:text-primary'
                            }`}
                          onClick={() => handleCommentLike(comment._id)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className={`w-4 h-4 ${isCommentLikedByUser ? 'fill-current' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                          </svg>
                          <span>{comment.likes?.length || 0}</span>
                        </button>
                        {isCommentAuthor && (
                          <button
                            className="flex items-center gap-1.5 text-sm font-medium text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                            onClick={() => handleDeleteComment(comment._id)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
              <div className="text-center py-12 text-gray-500">
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
