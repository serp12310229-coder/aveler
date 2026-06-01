import { GlassCard } from "../components/GlassCard";
import { Settings as SettingsIcon } from "lucide-react";

export function Settings() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center">
      <GlassCard className="max-w-md w-full p-12 flex flex-col items-center">
        <div className="w-20 h-20 bg-pink-50 text-pink-500 rounded-3xl flex items-center justify-center mb-6 shadow-sm border border-pink-100">
          <SettingsIcon className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Settings</h2>
        <p className="text-slate-500">
          Settings configuration will be available here, such as default currency, preferred language, and theme options.
        </p>
      </GlassCard>
    </div>
  );
}
