import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, UserPlus } from "lucide-react";
import { register } from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setFieldErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    setServerError("");
  }

  function validateForm() {
    const errors = {};

    const fullName = formData.full_name.trim();
    const email = formData.email.trim();
    const password = formData.password;

    if (!fullName) {
      errors.full_name = "Please enter your full name.";
    } else if (fullName.length < 2) {
      errors.full_name = "Full name must be at least 2 characters.";
    }

    if (!email) {
      errors.email = "Please enter your email address.";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      errors.email = "Please enter a valid email address.";
    }

    if (!password) {
      errors.password = "Please enter a password.";
    } else if (password.length < 8) {
      errors.password = "Password must be at least 8 characters.";
    }

    setFieldErrors(errors);

    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setServerError("");
    setSuccessMessage("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await register({
        full_name: formData.full_name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      setSuccessMessage(
        "Account created successfully. Redirecting to login..."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      setServerError(
        error.message || "Unable to create your account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-zinc-50 px-4 py-12">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08)] md:grid-cols-2">
        {/* LEFT */}
        <div className="hidden bg-[#df6951] p-10 text-white md:flex md:flex-col md:justify-between">
          <div>
            <div className="mb-10 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
              <UserPlus size={22} />
            </div>

            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
              Explore Vietnam
            </p>

            <h1 className="max-w-md text-4xl font-bold leading-tight">
              Your next journey starts here.
            </h1>

            <p className="mt-5 max-w-md text-sm leading-7 text-white/80">
              Create your account and discover destinations, tours and
              personalized travel recommendations across Vietnam.
            </p>
          </div>

          <div className="text-sm text-white/70">
            Travel smarter. Discover more.
          </div>
        </div>

        {/* RIGHT */}
        <div className="p-6 sm:p-10 md:p-12">
          <div className="mx-auto max-w-md">
            <div className="mb-8">
              <p className="mb-2 text-sm font-semibold text-[#df6951]">
                CREATE ACCOUNT
              </p>

              <h2 className="text-3xl font-bold tracking-tight text-zinc-900">
                Join us today
              </h2>

              <p className="mt-2 text-sm text-zinc-500">
                Create your account to start planning your next trip.
              </p>
            </div>

            {/* SERVER ERROR */}
            {serverError && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {serverError}
              </div>
            )}

            {/* SUCCESS */}
            {successMessage && (
              <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-600">
                {successMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* FULL NAME */}
              <div>
                <label
                  htmlFor="full_name"
                  className="mb-2 block text-sm font-medium text-zinc-800"
                >
                  Full name
                </label>

                <input
                  id="full_name"
                  name="full_name"
                  type="text"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={`w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition ${
                    fieldErrors.full_name
                      ? "border-red-400 ring-4 ring-red-100"
                      : "border-zinc-200 focus:border-[#df6951] focus:ring-4 focus:ring-[#df6951]/10"
                  }`}
                />

                {fieldErrors.full_name && (
                  <p className="mt-2 text-xs font-medium text-red-500">
                    {fieldErrors.full_name}
                  </p>
                )}
              </div>

              {/* EMAIL */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-zinc-800"
                >
                  Email address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={`w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition ${
                    fieldErrors.email
                      ? "border-red-400 ring-4 ring-red-100"
                      : "border-zinc-200 focus:border-[#df6951] focus:ring-4 focus:ring-[#df6951]/10"
                  }`}
                />

                {fieldErrors.email && (
                  <p className="mt-2 text-xs font-medium text-red-500">
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              {/* PASSWORD */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-zinc-800"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter at least 8 characters"
                    className={`w-full rounded-xl border bg-white px-4 py-3 pr-12 text-sm outline-none transition ${
                      fieldErrors.password
                        ? "border-red-400 ring-4 ring-red-100"
                        : "border-zinc-200 focus:border-[#df6951] focus:ring-4 focus:ring-[#df6951]/10"
                    }`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>

                {fieldErrors.password && (
                  <p className="mt-2 text-xs font-medium text-red-500">
                    {fieldErrors.password}
                  </p>
                )}

                {!fieldErrors.password && (
                  <p className="mt-2 text-xs text-zinc-400">
                    Use at least 8 characters.
                  </p>
                )}
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#df6951] px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#cd5b45] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    <UserPlus size={18} />
                    Create account
                  </>
                )}
              </button>
            </form>

            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-zinc-200" />
              <span className="text-xs text-zinc-400">OR</span>
              <div className="h-px flex-1 bg-zinc-200" />
            </div>

            <p className="text-center text-sm text-zinc-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-[#df6951] transition hover:text-[#c7543e]"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;