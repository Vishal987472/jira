import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Login() {

    const navigate = useNavigate();
    const { login } = useAuth();

    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {

        setForm({
            ...form,
            [event.target.name]: event.target.value
        });
    };

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setLoading(true);

        try {

            await login(form);

            navigate("/dashboard", {
                replace: true
            });

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Invalid email or password"
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">

            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">

                <div className="mb-8 text-center">

                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white">
                        J
                    </div>

                    <h1 className="text-2xl font-bold text-slate-900">
                        Welcome User
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        Sign in to your task manager
                    </p>

                </div>

                {error && (
                    <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            required
                            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            required
                            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-blue-600 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading
                            ? "Signing in..."
                            : "Sign in"}
                    </button>

                </form>

                <p className="mt-6 text-center text-sm text-slate-500">

                    Don't have an account?{" "}

                    <Link
                        to="/register"
                        className="font-medium text-blue-600 hover:text-blue-700"
                    >
                        Create account
                    </Link>

                </p>

            </div>

        </div>
    );
}