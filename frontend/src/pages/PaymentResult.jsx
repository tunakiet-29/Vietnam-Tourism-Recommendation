import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { CheckCircle2, Clock3, XCircle } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

import { getPaymentStatus } from "../services/api";
import ApiErrorState from "../components/ApiErrorState";

function formatCurrency(value) {
  const amount = Number(value);

  if (Number.isNaN(amount)) {
    return "—";
  }

  return `${amount.toLocaleString("vi-VN")} ₫`;
}

function getPaymentState(status) {
  switch (status?.toUpperCase()) {
    case "PAID":
      return {
        title: "Payment successful",
        description:
          "Your payment has been confirmed and your booking is ready.",
        className: "border-emerald-200 bg-emerald-50 text-emerald-700",
        icon: CheckCircle2,
      };

    case "FAILED":
    case "EXPIRED":
    case "CANCELLED":
      return {
        title: "Payment was not completed",
        description:
          "No payment was confirmed. You can try again from My Bookings.",
        className: "border-red-200 bg-red-50 text-red-600",
        icon: XCircle,
      };

    default:
      return {
        title: "Confirming payment",
        description:
          "We are waiting for the payment provider to confirm your transaction.",
        className: "border-amber-200 bg-amber-50 text-amber-700",
        icon: Clock3,
      };
  }
}

function PaymentResult() {
  const [searchParams] = useSearchParams();
  const txnRef = searchParams.get("vnp_TxnRef");

  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(Boolean(txnRef));
  const [error, setError] = useState("");
  const pollingAttemptsRef = useRef(0);

  const loadPayment = useCallback(async () => {
    if (!txnRef) {
      setLoading(false);
      setError("Payment reference is missing.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const paymentData = await getPaymentStatus(txnRef);
      setPayment(paymentData);
    } catch (err) {
      setError(
        err.message ||
          "Unable to verify the payment. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [txnRef]);

  useEffect(() => {
    const timeoutId = window.setTimeout(loadPayment, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadPayment]);

  useEffect(() => {
    pollingAttemptsRef.current = 0;
  }, [txnRef]);

  useEffect(() => {
    if (payment?.status !== "PENDING") {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      if (pollingAttemptsRef.current >= 10) {
        window.clearInterval(intervalId);
        return;
      }

      pollingAttemptsRef.current += 1;
      loadPayment();
    }, 3000);

    return () => window.clearInterval(intervalId);
  }, [loadPayment, payment?.status]);

  const paymentState = useMemo(
    () => getPaymentState(payment?.status),
    [payment?.status]
  );
  const StateIcon = paymentState.icon;

  return (
    <main className="min-h-screen bg-[#faf9f7] px-5 py-16 sm:px-8">
      <section className="mx-auto max-w-xl rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#df6951]">
          Payment
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
          Payment status
        </h1>

        {loading ? (
          <div className="mt-8 rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
            <div className="h-5 w-40 animate-pulse rounded bg-zinc-200" />
            <div className="mt-4 h-4 w-full animate-pulse rounded bg-zinc-100" />
          </div>
        ) : error ? (
          <div className="mt-8">
            <ApiErrorState message={error} onRetry={loadPayment} />
          </div>
        ) : (
          <>
            <div
              className={`mt-8 rounded-2xl border p-5 ${paymentState.className}`}
            >
              <div className="flex items-start gap-3">
                <StateIcon size={22} className="mt-0.5 shrink-0" />
                <div>
                  <h2 className="font-bold">{paymentState.title}</h2>
                  <p className="mt-1 text-sm leading-6">
                    {paymentState.description}
                  </p>
                </div>
              </div>
            </div>

            <dl className="mt-6 grid gap-4 rounded-2xl bg-zinc-50 p-5 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-zinc-400">Booking</dt>
                <dd className="mt-1 font-semibold text-zinc-800">
                  #{payment.booking_id}
                </dd>
              </div>
              <div>
                <dt className="text-zinc-400">Amount</dt>
                <dd className="mt-1 font-semibold text-zinc-800">
                  {formatCurrency(payment.amount)}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-zinc-400">Payment reference</dt>
                <dd className="mt-1 break-all font-semibold text-zinc-800">
                  {payment.txn_ref}
                </dd>
              </div>
            </dl>
          </>
        )}

        <Link
          to="/bookings"
          className="mt-8 inline-flex rounded-xl bg-[#df6951] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#cf5d47]"
        >
          View my bookings
        </Link>
      </section>
    </main>
  );
}

export default PaymentResult;
