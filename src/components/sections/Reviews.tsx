import { motion } from "framer-motion";
import { ArrowLeft, Github, MessageSquare, Send, Calendar, LogOut } from "lucide-react";
import { useState, useEffect } from "react";

interface Comment {
  id: string;
  author: {
    name: string;
    username: string;
    avatar: string;
    profileUrl: string;
  };
  content: string;
  timestamp: Date;
}

interface GitHubUser {
  login: string;
  name: string;
  avatar_url: string;
  html_url: string;
}

export function Reviews() {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingComments, setLoadingComments] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const GITHUB_OWNER = 'KerYagciHTL';
  const GITHUB_REPO = 'kxrim-dev';
  const COMMENT_LABEL = 'portfolio-comment';

  useEffect(() => {
    loadComments();
  }, []);

  const loadComments = async () => {
    setLoadingComments(true);
    setError(null);
    
    try {
      const response = await fetch(
        `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues?labels=${COMMENT_LABEL}&state=open&sort=created&direction=desc`,
        {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
          },
        }
      );

      if (response.ok) {
        const issues = await response.json();
        const commentsData = issues.map((issue: any) => {
          try {
            const commentData = JSON.parse(issue.body);
            return {
              id: issue.id.toString(),
              author: commentData.author,
              content: commentData.content,
              timestamp: new Date(issue.created_at)
            };
          } catch (parseError) {
            return {
              id: issue.id.toString(),
              author: {
                name: issue.user.login,
                username: issue.user.login,
                avatar: issue.user.avatar_url,
                profileUrl: issue.user.html_url
              },
              content: issue.body,
              timestamp: new Date(issue.created_at)
            };
          }
        });
        setComments(commentsData);
      } else {
        throw new Error('Failed to load comments');
      }
    } catch (error) {
      console.error('Error loading comments:', error);
      setError('Failed to load comments. Please refresh the page.');
      setComments([]);
    } finally {
      setLoadingComments(false);
    }
  };

  const saveComments = async (comment: Comment) => {
    try {
      const response = await fetch(
        `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues`,
        {
          method: 'POST',
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: `Comment by ${comment.author.name}`,
            body: JSON.stringify({
              author: comment.author,
              content: comment.content,
              timestamp: comment.timestamp.toISOString()
            }),
            labels: [COMMENT_LABEL]
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to save comment');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error saving comment:', error);
      throw error;
    }
  };

  const handleGitHubAuth = async () => {
    setIsLoading(true);
    try {
      const username = prompt("Enter your GitHub username to continue:");
      if (!username) {
        setIsLoading(false);
        return;
      }

      const response = await fetch(`https://api.github.com/users/${username}`);
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        alert("GitHub user not found. Please check your username.");
      }
    } catch (error) {
      console.error('GitHub auth error:', error);
      alert("Failed to connect to GitHub. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!user || !newComment.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const commentData: Comment = {
        id: Date.now().toString(),
        author: {
          name: user.name || user.login,
          username: user.login,
          avatar: user.avatar_url,
          profileUrl: user.html_url
        },
        content: newComment,
        timestamp: new Date()
      };

      await saveComments(commentData);
      
      setComments([commentData, ...comments]);
      setNewComment('');
      
      setTimeout(() => {
        loadComments();
      }, 1000);
    } catch (error) {
      console.error('Error submitting comment:', error);
      setError('Failed to submit comment. Please try again.');
      await loadComments();
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSubmitComment();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="fixed inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5"></div>
      </div>
      
      <div className="relative z-10 px-6 py-12">
        <motion.div
          className="max-w-4xl mx-auto mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-8">
            <motion.a
              href="/"
              className="flex items-center gap-2 text-white/70 hover:text-white transition-colors group"
              whileHover={{ x: -5 }}
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span>Back to Portfolio</span>
            </motion.a>

            {user && (
              <motion.button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <LogOut size={16} />
                <span>Logout</span>
              </motion.button>
            )}
          </div>
          
          <h1 className="text-6xl font-black bg-gradient-to-r from-white via-cyan-400 to-purple-400 bg-clip-text text-transparent mb-6">
            Visitor Comments
          </h1>
          
          <p className="text-xl text-white/70 max-w-3xl">
            Share your thoughts, feedback, or just say hello! Connect with GitHub to leave a comment.
          </p>

          {error && (
            <motion.div
              className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.div>
          )}

          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl text-center">
              <div className="text-3xl font-bold text-cyan-400 mb-2">{comments.length}</div>
              <div className="text-white/70">Total Comments</div>
            </div>
            <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">
                {new Set(comments.map(c => c.author.username)).size}
              </div>
              <div className="text-white/70">Unique Visitors</div>
            </div>
          </div>
        </motion.div>

        <div className="max-w-4xl mx-auto mb-12">
          {!user ? (
            <motion.div
              className="text-center p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <MessageSquare size={48} className="mx-auto text-cyan-400 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">
                Connect with GitHub to Comment
              </h3>
              <p className="text-white/70 mb-6 max-w-2xl mx-auto">
                To ensure authenticity and prevent spam, please connect your GitHub account to leave a comment.
              </p>
              <motion.button
                onClick={handleGitHubAuth}
                disabled={isLoading}
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-gray-800 to-black text-white font-semibold rounded-2xl hover:from-gray-700 hover:to-gray-900 transition-all duration-300 disabled:opacity-50"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Github size={24} />
                <span>{isLoading ? 'Connecting...' : 'Connect with GitHub'}</span>
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={user.avatar_url}
                  alt={user.name || user.login}
                  className="w-12 h-12 rounded-full border-2 border-cyan-400"
                />
                <div>
                  <h3 className="text-white font-semibold">{user.name || user.login}</h3>
                  <p className="text-white/60 text-sm">@{user.login}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Write your comment... (Ctrl+Enter to submit)"
                  className="w-full h-32 p-4 rounded-xl bg-white/5 border border-white/20 text-white placeholder-white/50 resize-none focus:outline-none focus:border-cyan-400/50 transition-colors"
                />
                
                <div className="flex justify-between items-center">
                  <p className="text-white/50 text-sm">
                    Tip: Use Ctrl+Enter to submit quickly
                  </p>
                  <motion.button
                    onClick={handleSubmitComment}
                    disabled={!newComment.trim() || isLoading}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Send size={16} className={isLoading ? "animate-pulse" : ""} />
                    <span>{isLoading ? 'Posting...' : 'Post Comment'}</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {loadingComments && (
          <div className="max-w-4xl mx-auto text-center py-12">
            <motion.div
              className="inline-flex items-center gap-3 text-white/60"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <MessageSquare size={24} />
              <span>Loading comments...</span>
            </motion.div>
          </div>
        )}

        {!loadingComments && comments.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <MessageSquare size={24} className="text-cyan-400" />
              Recent Comments ({comments.length})
            </h2>
            
            <div className="space-y-6">
              {comments.map((comment, index) => (
                <motion.div
                  key={comment.id}
                  className="group relative p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all duration-500"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
                  
                  <div className="relative">
                    <div className="flex items-center gap-4 mb-4">
                      <a 
                        href={comment.author.profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:scale-105 transition-transform"
                      >
                        <img
                          src={comment.author.avatar}
                          alt={comment.author.name}
                          className="w-10 h-10 rounded-full border-2 border-cyan-400/50"
                        />
                      </a>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <a
                            href={comment.author.profileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-white hover:text-cyan-400 transition-colors"
                          >
                            {comment.author.name}
                          </a>
                          <span className="text-white/60 text-sm">@{comment.author.username}</span>
                        </div>
                        <div className="flex items-center gap-1 text-white/50 text-sm">
                          <Calendar size={12} />
                          <span>{comment.timestamp.toLocaleDateString()} at {comment.timestamp.toLocaleTimeString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-white/80 leading-relaxed whitespace-pre-wrap">
                      {comment.content}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {!loadingComments && comments.length === 0 && user && (
          <motion.div
            className="max-w-4xl mx-auto text-center p-12 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <MessageSquare size={48} className="mx-auto text-white/40 mb-4" />
            <h3 className="text-xl font-semibold text-white/70 mb-2">No comments yet</h3>
            <p className="text-white/50">Be the first to leave a comment!</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}