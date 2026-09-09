import Link from 'next/link';
import { Project } from '@/lib/data';
import { ArrowRight } from 'lucide-react';

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 transition-all hover:border-gray-700 hover:shadow-lg hover:-translate-y-1">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <div className="text-4xl bg-gray-800 w-16 h-16 rounded-xl flex items-center justify-center shadow-inner">
            {project.icon}
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{project.title}</h3>
            <p className="text-gray-400 mt-1 text-sm">{project.tagline}</p>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <Link href={`/project/${project.id}`} className="inline-flex items-center text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
          Open App <ArrowRight className="ml-2 w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
