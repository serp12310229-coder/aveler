import { GlassCard } from "../components/GlassCard";
import { Calendar as CalendarIcon } from "lucide-react";

export function Calendar() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center">
      <GlassCard className="max-w-md w-full p-12 flex flex-col items-center">
        <div className="w-20 h-20 bg-indigo-50 text-indigo-500 rounded-3xl flex items-center justify-center mb-6 shadow-sm border border-indigo-100">
          <CalendarIcon className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Calendar View</h2>
        <p className="text-slate-500">
          This feature is coming soon. You'll be able to see all your saved itineraries on a monthly calendar here.
        </p>
      </GlassCard>
    </div>
  );
}
