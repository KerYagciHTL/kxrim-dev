import { motion } from "framer-motion";
import { Star, Quote, ArrowLeft } from "lucide-react";


interface Review {
  id: number;
  name: string;
  role: string;
  company: string;
  rating: number;
  date: string;
  content: string;
  avatar?: string;
  project?: string;
}

export function Reviews() {

  const reviews: Review[] = [
    {
      id: 1,
      name: "Max Mustermann",
      role: "Project Manager",
      company: "TechCorp GmbH",
      rating: 5,
      date: "2024-09-15",
      content: "Kerimcan delivered exceptional work on our accounting software. His attention to clean code and documentation standards exceeded our expectations. The C# implementation was robust and well-structured.",
      project: "KCY-Accounting"
    },
    {
      id: 2,
      name: "Sarah Johnson",
      role: "Lead Developer",
      company: "Innovation Labs",
      rating: 5,
      date: "2024-08-22",
      content: "Working with Kerimcan was a pleasure. His expertise in modern web technologies and his commitment to best practices made our collaboration smooth and productive.",
      project: "Web Application"
    },
    {
      id: 3,
      name: "Dr. Andreas Weber",
      role: "CTO",
      company: "StartupXYZ",
      rating: 4,
      date: "2024-07-10",
      content: "Kerimcan's work on our React frontend was impressive. Clean, maintainable code with excellent TypeScript implementation. Great communication throughout the project.",
      project: "Frontend Development"
    },
    {
      id: 4,
      name: "Lisa Chen",
      role: "Software Architect",
      company: "DevSolutions",
      rating: 5,
      date: "2024-06-30",
      content: "Outstanding performance optimization work. Kerimcan's deep understanding of performance bottlenecks and his systematic approach to solving them was exactly what we needed.",
      project: "Performance Optimization"
    },
    {
      id: 5,
      name: "Thomas Müller",
      role: "Product Owner",
      company: "FinTech Pro",
      rating: 5,
      date: "2024-05-18",
      content: "Kerimcan's contribution to our open-source library was invaluable. His code quality and documentation standards set a new benchmark for our team.",
      project: "Kerlib Library"
    },
    {
      id: 6,
      name: "Emma Rodriguez",
      role: "Senior Developer",
      company: "CloudFirst",
      rating: 4,
      date: "2024-04-25",
      content: "Reliable, professional, and delivers quality work on time. Kerimcan's Linux expertise and Git workflow knowledge made him a valuable team member.",
      project: "DevOps Integration"
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-400"}
      />
    ));
  };

  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5"></div>
      </div>
      
      <div className="relative z-10 px-6 py-12">
        {/* Header */}
        <motion.div
          className="max-w-6xl mx-auto mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-4 mb-8">
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
            Client Reviews
          </h1>
          
          <p className="text-xl text-white/70 max-w-3xl">
            Feedback from clients and collaborators who have worked with me on various projects.
          </p>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl text-center">
              <div className="text-3xl font-bold text-cyan-400 mb-2">{reviews.length}</div>
              <div className="text-white/70">Total Reviews</div>
            </div>
            <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-3xl font-bold text-yellow-400">{averageRating.toFixed(1)}</span>
                <Star size={24} className="text-yellow-400 fill-yellow-400" />
              </div>
              <div className="text-white/70">Average Rating</div>
            </div>
            <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">
                {Math.round((reviews.filter(r => r.rating === 5).length / reviews.length) * 100)}%
              </div>
              <div className="text-white/70">5-Star Reviews</div>
            </div>
          </div>
        </motion.div>

        {/* Reviews Grid */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              className="group relative"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-105" />
              
              <div className="relative p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all duration-500 h-full">
                {/* Quote Icon */}
                <motion.div
                  className="absolute top-6 right-6 text-cyan-400/30"
                  whileHover={{ scale: 1.2, rotate: 15 }}
                >
                  <Quote size={32} />
                </motion.div>

                {/* Header */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                    {review.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-white">{review.name}</h3>
                    <p className="text-white/80">{review.role}</p>
                    <p className="text-white/60 text-sm">{review.company}</p>
                    {review.project && (
                      <span className="inline-block mt-2 px-3 py-1 text-xs bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 rounded-full border border-cyan-400/30">
                        {review.project}
                      </span>
                    )}
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex gap-1">
                    {renderStars(review.rating)}
                  </div>
                  <span className="text-white/60 text-sm">
                    {new Date(review.date).toLocaleDateString()}
                  </span>
                </div>

                {/* Content */}
                <p className="text-white/80 leading-relaxed">
                  "{review.content}"
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          className="max-w-4xl mx-auto mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Work Together?
            </h2>
            <p className="text-white/70 mb-6 max-w-2xl mx-auto">
              Join these satisfied clients and let's create something amazing together. 
              I'm always excited to take on new challenges and deliver exceptional results.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <motion.a
                href="/#contact"
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                Get In Touch
              </motion.a>
              <motion.a
                href="/#projects"
                className="px-8 py-4 border-2 border-white/20 text-white font-semibold rounded-2xl hover:bg-white/5 transition-all duration-300"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                View My Work
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}