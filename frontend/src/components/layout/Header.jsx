import { LogOut } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export default function Header() {

    const { user, logout } = useAuth();

    return (
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 md:px-6">

            <div>
                <h1 className="text-lg font-semibold text-slate-900">
                    JIRA
                </h1>
            </div>

            <div className="flex items-center gap-4">

                <div className="hidden text-right sm:block">
                    <p className="text-sm font-medium text-slate-900">
                        {user?.fullName}
                    </p>

                    <p className="text-xs text-slate-500">
                        {user?.email}
                    </p>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
                    {user?.fullName?.charAt(0)?.toUpperCase()}
                </div>

                <button
                    onClick={logout}
                    className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                    title="Logout"
                >
                    <LogOut size={18} />
                </button>

            </div>

        </header>
    );
}