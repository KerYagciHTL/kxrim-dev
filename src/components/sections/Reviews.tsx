import { motion } from "framer-motion";
import { ArrowLeft, Github, MessageSquare, Calendar, MapPin, Building } from "lucide-react";
import { useState, useEffect } from "react";
import { fetchPortfolioComments } from "../../utils/github-api";

interface Comment {
  id: string;
  author: {
    name: string;
    username: string;
    avatar: string;
    profileUrl: string;
    bio: string | null;
    location: string | null;
    company: string | null;
  };
  content: string;
  timestamp: Date;
  issueUrl: string;
  issueNumber: number;
}

export function Reviews() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const GITHUB_OWNER = 'KerYagciHTL';
  const GITHUB_REPO = 'kxrim-dev';

  useEffect(() => {
    loadComments();
  }, []);

  const loadComments = async () => {
    setLoadingComments(true);
    setError(null);
    
    try {
      const commentsData = await fetchPortfolioComments(GITHUB_OWNER, GITHUB_REPO);
      setComments(commentsData);
    } catch (error) {
      console.error('Error loading comments:', error);
      
      let errorMessage = 'Failed to load comments. Please refresh the page.';
      
      if (error instanceof Error) {
        if (error.name === 'RateLimitError') {
          errorMessage = error.message;
        } else if (error.message.includes('403')) {
          errorMessage = 'GitHub API rate limit exceeded. This happens when many people visit the site. Please try again in a few minutes.';
        } else if (error.message.includes('404')) {
          errorMessage = 'Comments repository not found. Please check the configuration.';
        }
      }
      
      setError(errorMessage);
      setComments([]);
    } finally {
      setLoadingComments(false);
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
          <div className="mb-8">
            <motion.a
              href="/"
              className="flex items-center gap-2 text-white/70 hover:text-white transition-colors group"
              whileHover={{ x: -5 }}
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span>Back to Portfolio</span>
            </motion.a>
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
          <motion.div
            className="p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="text-center mb-8">
              <MessageSquare size={48} className="mx-auto text-cyan-400 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">
                Leave a Comment via GitHub Issues
              </h3>
              <p className="text-white/70 mb-6 max-w-2xl mx-auto">
                Want to leave a comment? Simply create a GitHub issue with the <code className="px-2 py-1 bg-white/10 rounded text-cyan-300">portfolio-comment</code> label. 
                Your GitHub profile information will be automatically pulled, and the issue content will be displayed as your comment.
              </p>
            </div>

            <div className="space-y-6">
              <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Github size={20} className="text-cyan-400" />
                  How to Comment
                </h4>
                <ol className="space-y-3 text-white/70">
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-cyan-500 text-white text-sm rounded-full flex items-center justify-center font-semibold">1</span>
                    <span>Go to <a href={`https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/issues/new`} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 underline">GitHub Issues</a></span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-cyan-500 text-white text-sm rounded-full flex items-center justify-center font-semibold">2</span>
                    <span>Add the label <code className="px-2 py-1 bg-white/10 rounded text-cyan-300">portfolio-comment</code></span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-cyan-500 text-white text-sm rounded-full flex items-center justify-center font-semibold">3</span>
                    <span>Write your comment in the issue description - that's it!</span>
                  </li>
                </ol>
              </div>

              <div className="p-6 rounded-xl bg-black/20 border border-white/10">
                <h4 className="text-lg font-semibold text-white mb-3">Example Comment</h4>
                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-green-400 text-sm font-mono whitespace-pre">
{`Title: Great work on the portfolio!

Hey Kerim, I really love the design of your portfolio website! 
The animations are smooth and the dark theme looks fantastic. 
Keep up the great work! 🚀

Looking forward to seeing more of your projects.`}
                  </pre>
                </div>
                <div className="mt-4 text-white/60 text-sm">
                  <p><strong>Automatic Features:</strong></p>
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    <li>Your GitHub profile information (name, avatar, bio, location, company) is automatically fetched</li>
                    <li>The issue content becomes your comment text</li>
                    <li>Comments are sorted by creation date (newest first)</li>
                    <li>Only issues with the <code className="px-1 bg-white/10 rounded">portfolio-comment</code> label are displayed</li>
                  </ul>
                </div>
              </div>

              <div className="text-center">
                <motion.a
                  href={`https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/issues/new`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-gray-800 to-black text-white font-semibold rounded-2xl hover:from-gray-700 hover:to-gray-900 transition-all duration-300"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Github size={24} />
                  <span>Create GitHub Issue</span>
                </motion.a>
              </div>
            </div>
          </motion.div>
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
                    <div className="flex items-start gap-4 mb-4">
                      <a 
                        href={comment.author.profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:scale-105 transition-transform flex-shrink-0"
                      >
                        <img
                          src={comment.author.avatar}
                          alt={comment.author.name}
                          className="w-12 h-12 rounded-full border-2 border-cyan-400/50"
                        />
                      </a>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
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
                        
                        {/* Bio, Location, Company */}
                        <div className="mt-1 space-y-1">
                          {comment.author.bio && (
                            <p className="text-white/60 text-sm italic">{comment.author.bio}</p>
                          )}
                          <div className="flex items-center gap-4 text-white/50 text-xs">
                            {comment.author.location && (
                              <div className="flex items-center gap-1">
                                <MapPin size={10} />
                                <span>{comment.author.location}</span>
                              </div>
                            )}
                            {comment.author.company && (
                              <div className="flex items-center gap-1">
                                <Building size={10} />
                                <span>{comment.author.company}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 mt-2 text-white/50 text-xs">
                          <div className="flex items-center gap-1">
                            <Calendar size={10} />
                            <span>{comment.timestamp.toLocaleDateString()} at {comment.timestamp.toLocaleTimeString()}</span>
                          </div>
                          <a
                            href={comment.issueUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 hover:text-cyan-400 transition-colors"
                          >
                            <Github size={10} />
                            <span>Issue #{comment.issueNumber}</span>
                          </a>
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

        {!loadingComments && comments.length === 0 && !error && (
          <motion.div
            className="max-w-4xl mx-auto text-center p-12 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <MessageSquare size={48} className="mx-auto text-white/40 mb-4" />
            <h3 className="text-xl font-semibold text-white/70 mb-2">No comments yet</h3>
            <p className="text-white/50">Be the first to leave a comment via GitHub Issues!</p>
          </motion.div>
        )}

        {!loadingComments && error && (
          <motion.div
            className="max-w-4xl mx-auto text-center p-12 rounded-2xl border border-red-500/20 bg-red-500/5 backdrop-blur-xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <MessageSquare size={48} className="mx-auto text-red-400/60 mb-4" />
            <h3 className="text-xl font-semibold text-red-400 mb-2">Unable to Load Comments</h3>
            <p className="text-red-400/80 mb-4 max-w-2xl mx-auto leading-relaxed">{error}</p>
            <button
              onClick={loadComments}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 font-medium"
            >
              Try Again
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}