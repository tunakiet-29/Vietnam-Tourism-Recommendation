import { useCallback, useEffect, useState } from "react";
import {
  CheckCircle2,
  Edit3,
  ImageOff,
  Loader2,
  MapPin,
  Plus,
  Search,
  Star,
  Users,
  X,
} from "lucide-react";

import {
  createAdminTour,
  getAdminTours,
  updateAdminTour,
  updateAdminTourStatus,
} from "../services/api";
import ApiErrorState from "../components/ApiErrorState";

const INITIAL_FORM = {
  title: "",
  description: "",
  destination_id: "",
  duration_days: "",
  price: "",
  max_guests: "",
  image: "",
};

function formatCurrency(value) {
  const amount = Number(value);

  return Number.isNaN(amount)
    ? "—"
    : `${amount.toLocaleString("vi-VN")} ₫`;
}

function formatDate(value) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("vi-VN");
}

function createFormFromTour(tour) {
  return {
    title: tour.title ?? "",
    description: tour.description ?? "",
    destination_id: tour.destination_id ?? "",
    duration_days: String(tour.duration_days ?? ""),
    price: String(tour.price ?? ""),
    max_guests: String(tour.max_guests ?? ""),
    image: tour.image ?? "",
  };
}

function AdminTours() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingTour, setEditingTour] = useState(null);

  const [filters, setFilters] = useState({
    search: "",
    status: "",
    is_active: "",
    destination_id: "",
  });

  const [form, setForm] = useState(INITIAL_FORM);

  const loadTours = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getAdminTours(filters);
      setTours(data);
    } catch (err) {
      setError(
        err.message || "Unable to load admin tours."
      );
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadTours();
  }, [loadTours]);

  function updateFilter(key, value) {
    setFilters((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function updateForm(key, value) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function openCreateForm() {
    setEditingTour(null);
    setForm(INITIAL_FORM);
    setFormError("");
    setShowForm(true);
  }

  function openEditForm(tour) {
    setEditingTour(tour);
    setForm(createFormFromTour(tour));
    setFormError("");
    setShowForm(true);
  }

  function closeForm() {
    if (saving) {
      return;
    }

    setShowForm(false);
    setEditingTour(null);
    setForm(INITIAL_FORM);
    setFormError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setFormError("");
    setSaving(true);

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      destination_id: form.destination_id.trim(),
      duration_days: Number(form.duration_days),
      price: Number(form.price),
      max_guests: Number(form.max_guests),
      image: form.image.trim(),
    };

    if (!payload.title) {
      setFormError("Tour title is required.");
      setSaving(false);
      return;
    }

    if (!payload.description) {
      setFormError("Tour description is required.");
      setSaving(false);
      return;
    }

    if (!payload.destination_id) {
      setFormError("Destination ID is required.");
      setSaving(false);
      return;
    }

    if (
      !Number.isFinite(payload.duration_days) ||
      payload.duration_days <= 0
    ) {
      setFormError(
        "Duration must be greater than 0."
      );
      setSaving(false);
      return;
    }

    if (
      !Number.isFinite(payload.price) ||
      payload.price < 0
    ) {
      setFormError("Price must be 0 or greater.");
      setSaving(false);
      return;
    }

    if (
      !Number.isFinite(payload.max_guests) ||
      payload.max_guests <= 0
    ) {
      setFormError(
        "Maximum guests must be greater than 0."
      );
      setSaving(false);
      return;
    }

    try {
      if (editingTour) {
        await updateAdminTour(
          editingTour.id,
          payload
        );
      } else {
        await createAdminTour(payload);
      }

      closeForm();
      await loadTours();
    } catch (err) {
      setFormError(
        err.message ||
          "Unable to save this tour."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleStatus(tour) {
    const nextStatus = !tour.is_active;

    setUpdatingId(tour.id);
    setError("");

    try {
      await updateAdminTourStatus(
        tour.id,
        nextStatus
      );

      await loadTours();
    } catch (err) {
      setError(
        err.message ||
          "Unable to update tour status."
      );
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <main className="min-h-screen bg-[#faf9f7]">
      {/* HEADER */}
      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#df6951]">
                Administration
              </p>

              <h1 className="mt-3 text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
                Tour Management
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-500 sm:text-base">
                Create, update, and manage the tours
                available on Vietinerary.
              </p>
            </div>

            <button
              type="button"
              onClick={openCreateForm}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#df6951] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#cf5d47]"
            >
              <Plus size={17} />
              Add tour
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
        {/* FORM */}
        {showForm && (
          <section className="mb-8 rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#df6951]">
                  {editingTour
                    ? "Edit tour"
                    : "New tour"}
                </p>

                <h2 className="mt-2 text-2xl font-bold text-zinc-900">
                  {editingTour
                    ? "Update tour information"
                    : "Create a new tour"}
                </h2>

                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  Keep the tour information clear,
                  complete, and consistent with the
                  public tour experience.
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                className="rounded-xl p-2 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Close form"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-8"
            >
              <div className="grid gap-5 lg:grid-cols-2">
                <label className="lg:col-span-2">
                  <span className="text-sm font-medium text-zinc-700">
                    Tour title
                  </span>

                  <input
                    value={form.title}
                    onChange={(event) =>
                      updateForm(
                        "title",
                        event.target.value
                      )
                    }
                    maxLength={200}
                    placeholder="e.g. Da Nang Discovery"
                    className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-[#df6951] focus:ring-2 focus:ring-[#df6951]/10"
                  />
                </label>

                <label className="lg:col-span-2">
                  <span className="text-sm font-medium text-zinc-700">
                    Description
                  </span>

                  <textarea
                    value={form.description}
                    onChange={(event) =>
                      updateForm(
                        "description",
                        event.target.value
                      )
                    }
                    rows={5}
                    placeholder="Describe the tour..."
                    className="mt-2 w-full resize-y rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm leading-6 text-zinc-900 outline-none transition focus:border-[#df6951] focus:ring-2 focus:ring-[#df6951]/10"
                  />
                </label>

                <label>
                  <span className="text-sm font-medium text-zinc-700">
                    Destination ID
                  </span>

                  <input
                    value={form.destination_id}
                    onChange={(event) =>
                      updateForm(
                        "destination_id",
                        event.target.value
                      )
                    }
                    maxLength={50}
                    placeholder="e.g. da-nang"
                    className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-[#df6951] focus:ring-2 focus:ring-[#df6951]/10"
                  />

                  <p className="mt-2 text-xs leading-5 text-zinc-400">
                    Use an existing active destination
                    ID.
                  </p>
                </label>

                <label>
                  <span className="text-sm font-medium text-zinc-700">
                    Image URL
                  </span>

                  <input
                    value={form.image}
                    onChange={(event) =>
                      updateForm(
                        "image",
                        event.target.value
                      )
                    }
                    maxLength={500}
                    placeholder="https://..."
                    className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-[#df6951] focus:ring-2 focus:ring-[#df6951]/10"
                  />
                </label>

                <label>
                  <span className="text-sm font-medium text-zinc-700">
                    Duration (days)
                  </span>

                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={form.duration_days}
                    onChange={(event) =>
                      updateForm(
                        "duration_days",
                        event.target.value
                      )
                    }
                    placeholder="3"
                    className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-[#df6951] focus:ring-2 focus:ring-[#df6951]/10"
                  />
                </label>

                <label>
                  <span className="text-sm font-medium text-zinc-700">
                    Price (VND)
                  </span>

                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={form.price}
                    onChange={(event) =>
                      updateForm(
                        "price",
                        event.target.value
                      )
                    }
                    placeholder="3190000"
                    className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-[#df6951] focus:ring-2 focus:ring-[#df6951]/10"
                  />
                </label>

                <label>
                  <span className="text-sm font-medium text-zinc-700">
                    Maximum guests
                  </span>

                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={form.max_guests}
                    onChange={(event) =>
                      updateForm(
                        "max_guests",
                        event.target.value
                      )
                    }
                    placeholder="20"
                    className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-[#df6951] focus:ring-2 focus:ring-[#df6951]/10"
                  />
                </label>
              </div>

              {formError && (
                <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-600">
                  {formError}
                </div>
              )}

              <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-semibold text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#df6951] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#cf5d47] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <Loader2
                        size={16}
                        className="animate-spin"
                      />
                      Saving...
                    </>
                  ) : (
                    <>
                      {editingTour
                        ? "Save changes"
                        : "Create tour"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>
        )}

        {/* FILTERS */}
        <div className="grid gap-3 rounded-2xl border border-zinc-200 bg-white p-4 md:grid-cols-[1fr_180px_180px_180px]">
          <label className="flex items-center gap-2 rounded-xl border border-zinc-200 px-3 text-zinc-400">
            <Search size={17} />

            <input
              value={filters.search}
              onChange={(event) =>
                updateFilter(
                  "search",
                  event.target.value
                )
              }
              placeholder="Search tours or destinations"
              className="w-full py-3 text-sm text-zinc-800 outline-none"
            />
          </label>

          <select
            value={filters.status}
            onChange={(event) =>
              updateFilter(
                "status",
                event.target.value
              )
            }
            className="rounded-xl border border-zinc-200 bg-white px-3 py-3 text-sm text-zinc-700 outline-none"
          >
            <option value="">
              All statuses
            </option>
            <option value="ACTIVE">
              Active
            </option>
            <option value="INACTIVE">
              Inactive
            </option>
          </select>

          <select
            value={String(filters.is_active)}
            onChange={(event) => {
              const value = event.target.value;

              updateFilter(
                "is_active",
                value === ""
                  ? ""
                  : value === "true"
              );
            }}
            className="rounded-xl border border-zinc-200 bg-white px-3 py-3 text-sm text-zinc-700 outline-none"
          >
            <option value="">
              All visibility
            </option>
            <option value="true">
              Visible
            </option>
            <option value="false">
              Hidden
            </option>
          </select>

          <input
            value={filters.destination_id}
            onChange={(event) =>
              updateFilter(
                "destination_id",
                event.target.value
              )
            }
            placeholder="Destination ID"
            className="rounded-xl border border-zinc-200 bg-white px-3 py-3 text-sm text-zinc-700 outline-none"
          />
        </div>

        {error && (
          <div className="mt-6">
            <ApiErrorState
              message={error}
              onRetry={loadTours}
            />
          </div>
        )}

        {/* SUMMARY */}
        {!loading && !error && (
          <div className="mb-6 mt-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#df6951]">
                Available records
              </p>

              <h2 className="mt-2 text-2xl font-bold text-zinc-900 sm:text-3xl">
                {tours.length}{" "}
                {tours.length === 1
                  ? "tour"
                  : "tours"}
              </h2>
            </div>
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-2xl border border-zinc-200 bg-white"
              >
                <div className="h-52 animate-pulse bg-zinc-100" />

                <div className="space-y-4 p-5">
                  <div className="h-3 w-24 animate-pulse rounded bg-zinc-100" />
                  <div className="h-6 w-3/4 animate-pulse rounded bg-zinc-100" />
                  <div className="h-4 w-full animate-pulse rounded bg-zinc-100" />
                  <div className="h-4 w-2/3 animate-pulse rounded bg-zinc-100" />
                  <div className="h-10 w-full animate-pulse rounded-xl bg-zinc-100" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* EMPTY */}
        {!loading &&
          !error &&
          tours.length === 0 && (
            <div className="mt-6 rounded-3xl border border-dashed border-zinc-300 bg-white px-6 py-20 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#df6951]/10 text-[#df6951]">
                <MapPin size={24} />
              </div>

              <h2 className="mt-5 text-xl font-bold text-zinc-900">
                No tours found
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500">
                Try another search or filter, or
                create a new tour.
              </p>

              <button
                type="button"
                onClick={openCreateForm}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#df6951] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#cf5d47]"
              >
                <Plus size={16} />
                Add tour
              </button>
            </div>
          )}

        {/* TOURS */}
        {!loading &&
          !error &&
          tours.length > 0 && (
            <div className="grid gap-5 lg:grid-cols-2">
              {tours.map((tour) => (
                <article
                  key={tour.id}
                  className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm"
                >
                  <div className="relative h-56 bg-zinc-100">
                    {tour.image ? (
                      <img
                        src={tour.image}
                        alt={tour.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-zinc-400">
                        <div className="text-center">
                          <ImageOff
                            size={28}
                            className="mx-auto"
                          />

                          <p className="mt-2 text-sm">
                            No image
                          </p>
                        </div>
                      </div>
                    )}

                    <span
                      className={`absolute left-4 top-4 rounded-full px-3 py-1.5 text-xs font-semibold backdrop-blur ${
                        tour.is_active
                          ? "bg-white/90 text-emerald-700"
                          : "bg-zinc-900/75 text-white"
                      }`}
                    >
                      {tour.is_active
                        ? "Active"
                        : "Inactive"}
                    </span>
                  </div>

                  <div className="p-5">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-[0.15em] text-[#df6951]">
                          {tour.destination_name ||
                            tour.destination_id}
                        </p>

                        <h2 className="mt-1 text-2xl font-bold leading-tight text-zinc-900">
                          {tour.title}
                        </h2>
                      </div>

                      <div className="flex items-start gap-1.5 text-sm font-semibold text-zinc-700">
                        <Star
                          size={16}
                          fill="currentColor"
                          className="mt-0.5 text-[#df6951]"
                        />
                        {tour.rating}
                      </div>
                    </div>

                    <p className="mt-4 text-sm leading-6 text-zinc-500">
                      {tour.description}
                    </p>

                    <div className="mt-5 grid gap-3 rounded-xl bg-zinc-50 p-4 sm:grid-cols-3">
                      <div>
                        <p className="text-xs text-zinc-400">
                          Duration
                        </p>

                        <p className="mt-1 font-semibold text-zinc-800">
                          {tour.duration_days} days
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-zinc-400">
                          Max guests
                        </p>

                        <p className="mt-1 flex items-center gap-1.5 font-semibold text-zinc-800">
                          <Users
                            size={15}
                            className="text-[#df6951]"
                          />
                          {tour.max_guests}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-zinc-400">
                          Price
                        </p>

                        <p className="mt-1 font-semibold text-zinc-800">
                          {formatCurrency(
                            tour.price
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-col gap-3 border-t border-zinc-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-xs text-zinc-400">
                        Created{" "}
                        {formatDate(
                          tour.created_at
                        )}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            openEditForm(tour)
                          }
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-700 transition hover:border-[#df6951]/40 hover:text-[#df6951]"
                        >
                          <Edit3 size={15} />
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleToggleStatus(tour)
                          }
                          disabled={
                            updatingId === tour.id
                          }
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#df6951] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#cf5d47] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {updatingId ===
                          tour.id ? (
                            <Loader2
                              size={15}
                              className="animate-spin"
                            />
                          ) : (
                            <CheckCircle2
                              size={15}
                            />
                          )}

                          {tour.is_active
                            ? "Deactivate"
                            : "Activate"}
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
      </section>
    </main>
  );
}

export default AdminTours;