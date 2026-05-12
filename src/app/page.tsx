import { 
  MessageSquare, 
  BookOpen, 
  GraduationCap, 
  ArrowRight,
  Zap,
  CheckCircle
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Welkom terug!</h2>
        <p className="mt-2 text-slate-500">Your journey to B1 Dutch is moving fast. Here's your status.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-orange-50 rounded-lg">
              <Zap className="h-6 w-6 text-orange-500" />
            </div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Level</span>
          </div>
          <h3 className="text-2xl font-bold">Past A2</h3>
          <div className="mt-4 h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-orange-500 rounded-full" style={{ width: '65%' }}></div>
          </div>
          <p className="mt-2 text-sm text-slate-500">35% more to reach B1</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <BookOpen className="h-6 w-6 text-blue-500" />
            </div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Words</span>
          </div>
          <h3 className="text-2xl font-bold">842 / 2,000</h3>
          <p className="mt-4 text-sm text-slate-500 italic">"Focus on sub-clauses today."</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-50 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Streak</span>
          </div>
          <h3 className="text-2xl font-bold">12 Days</h3>
          <p className="mt-4 text-sm text-slate-500">Perfect attendance this month.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-900 rounded-2xl p-8 text-white relative overflow-hidden group">
          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-4">Start Talking</h3>
            <p className="text-slate-400 mb-6 max-w-sm">
              Speak with your AI tutor. Gemini will help you perfect your grammar and vocabulary at a B1 level.
            </p>
            <Link 
              href="/chat"
              className="inline-flex items-center px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 transition-colors font-semibold"
            >
              Enter Chat Room <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
          <MessageSquare className="absolute -right-8 -bottom-8 h-48 w-48 text-slate-800 rotate-12 group-hover:rotate-0 transition-transform duration-500" />
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-8 relative overflow-hidden group">
          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-4 text-slate-900">Grammar Focus</h3>
            <p className="text-slate-500 mb-6 max-w-sm">
              Today's challenge: Master the usage of <code className="bg-slate-100 px-1 rounded">om ... te</code> and sub-clauses.
            </p>
            <Link 
              href="/grammar"
              className="inline-flex items-center px-6 py-3 rounded-xl border-2 border-slate-200 hover:bg-slate-50 transition-colors font-semibold text-slate-900"
            >
              Start Lesson <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
          <GraduationCap className="absolute -right-8 -bottom-8 h-48 w-48 text-slate-50 rotate-12 group-hover:rotate-0 transition-transform duration-500" />
        </div>
      </div>
    </div>
  );
}
