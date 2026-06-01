import { Outlet, NavLink } from "react-router";
import { Plane, Map, Calendar, Settings, LogOut } from "lucide-react";

export function Layout() {
  return (
    <div className="fixed inset-0 flex bg-slate-50 text-slate-800 overflow-hidden selection:bg-teal-100">
      {/* Background decorative blobs - Teal/Green pastel */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-teal-100/50 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-100/50 blur-[120px] pointer-events-none" />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 h-full overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}

function NavItem({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 group ${
          isActive
            ? "bg-white/70 shadow-sm text-indigo-600 font-semibold"
            : "text-slate-500 hover:bg-white/40 hover:text-slate-800 font-medium"
        }`
      }
    >
      <span className="group-hover:scale-110 transition-transform">{icon}</span>
      <span className="hidden md:block">{label}</span>
    </NavLink>
  );
}
