import ProjectCard from '@/components/ProjectCard';
import { projects } from '@/lib/data';

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      
      {/* Hero Section */}
      <div className="text-center py-20 mb-12 border-b border-gray-800">
        <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-600 mb-6">
          We make small games, apps & stupid ideas.
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
          Welcome to our lab. Explore our latest creations, leave feedback, and tell us what you want to see next.
        </p>
        <a href="#projects" className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10 transition-colors">
          Explore Projects
        </a>
      </div>

      {/* Projects Section */}
      <div id="projects" className="scroll-mt-24">
        <h2 className="text-3xl font-bold mb-8">All Projects</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
          
          {/* Coming Soon Card */}
          <div className="bg-gray-900/50 border border-gray-800 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center opacity-70">
            <div className="text-4xl bg-gray-800/50 w-16 h-16 rounded-xl flex items-center justify-center mb-4">
              🎮
            </div>
            <h3 className="text-xl font-bold text-gray-300">More Games</h3>
            <p className="text-gray-500 mt-1">Coming Soon...</p>
          </div>
        </div>
      </div>
      
    </div>
  );
}
