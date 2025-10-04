import { motion } from "framer-motion";
import { ArrowLeft, Github, MessageSquare, Calendar } from "lucide-react";
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

export function Reviews() {
  const [comments, setComments] = useState<Comment[]>([]);
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
                Want to leave a comment? Create a new issue on the GitHub repository with the proper format below. 
                Comments with invalid format will be ignored.
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
                    <span>Use the JSON format shown below in the issue body</span>
                  </li>
                </ol>
              </div>

              <div className="p-6 rounded-xl bg-black/20 border border-white/10">
                <h4 className="text-lg font-semibold text-white mb-3">Required JSON Format</h4>
                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-green-400 text-sm font-mono whitespace-pre">
{`{
  "author": {
    "name": "Your Name",
    "username": "your-github-username",
    "avatar": "https://github.com/your-username.png",
    "profileUrl": "https://github.com/your-username"
  },
  "content": "Your comment text here...",
  "rating": 5
}`}
                  </pre>
                </div>
                <div className="mt-4 text-white/60 text-sm">
                  <p><strong>Rating:</strong> Use 1-5 stars (1=⭐, 2=⭐⭐, 3=⭐⭐⭐, 4=⭐⭐⭐⭐, 5=⭐⭐⭐⭐⭐)</p>
                  <p><strong>Note:</strong> Issues without proper JSON format or missing the <code className="px-1 bg-white/10 rounded">portfolio-comment</code> label will be ignored.</p>
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

        {!loadingComments && comments.length === 0 && (
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
      </div>
    </div>
  );
}