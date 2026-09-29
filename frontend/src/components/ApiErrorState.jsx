import { AlertTriangle, RefreshCw } from "lucide-react";

function ApiErrorState({
  message,
  onRetry,
  title = "Something went wrong",
}) {
  return (
    <div
      role="alert"
      className="rounded-3xl border border-red-200 bg-red-50 px-6 py-12 text-center"
    >
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-500">
        <AlertTriangle size={24} />
      </div>

      <h2 className="mt-5 text-xl font-bold text-zinc-900">
        {title}
      </h2>

      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-red-600">
        {message ||
          "Something went wrong. Please try again."}
      </p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-red-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
        >
          <RefreshCw size={16} />
          Try again
        </button>
      )}
    </div>
  );
}

export default ApiErrorState;