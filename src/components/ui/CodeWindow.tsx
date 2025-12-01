import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Terminal } from "lucide-react";

export function CodeWindow() {
  const [currentLine, setCurrentLine] = useState(0);
  const codeLines = [
    "class Developer {",
    "  constructor() {",
    "    this.name = 'KerYagciHTL';",
    "    this.school = 'HTL Leonding';",
    "    this.languages = [",
    "      'C', 'C++', 'C#', 'Java',",
    "      'JavaScript', 'TypeScript'",
    "    ];",
    "    this.passion = 'Clean Code';",
    "  }",
    "",
    "  async buildFuture() {",
    "    return 'Amazing Projects';",
    "  }",
    "}",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLine((prev) => (prev + 1) % (codeLines.length + 2));
    }, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-white/10 bg-white/5">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <div className="flex items-center gap-2 text-white/60 text-sm">
          <Terminal size={16} />
          <span>developer.ts</span>
        </div>
      </div>
      
      <div className="p-6 font-mono text-sm">
        {codeLines.map((line, index) => (
          <motion.div
            key={index}
            className={`flex items-center gap-4 py-1 ${
              index <= currentLine ? 'text-white' : 'text-white/20'
            }`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ 
              opacity: index <= currentLine ? 1 : 0.2,
              x: 0 
            }}
            transition={{ delay: index * 0.1 }}
          >
            <span className="text-white/30 text-xs w-6 text-right">{index + 1}</span>
            <span className={`whitespace-pre ${
              line.includes('class') || line.includes('constructor') || line.includes('async') ? 'text-purple-400' :
              line.includes("'") || line.includes('"') ? 'text-green-400' :
              line.includes('this.') ? 'text-cyan-400' :
              line.includes('{') || line.includes('}') || line.includes('[') || line.includes(']') ? 'text-yellow-400' :
              'text-white'
            }`}>
              {line}
            </span>
            {index === currentLine && (
              <motion.div
                className="w-2 h-5 bg-cyan-400"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}