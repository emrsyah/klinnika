"use client";
import { AlertCircle, X } from "lucide-react";
import * as React from "react";
import { toast, ToastBar, Toaster, ToastOptions } from "react-hot-toast";

export default function Toast() {
  return (
    <div>
      <Toaster
        reverseOrder={false}
        position="top-center"
        toastOptions={{
          style: {
            borderRadius: "8px",
            background: "#E8F0E0",
            color: "#8AB364",
          },
        }}
      >
        {(t) => (
          <ToastBar toast={t}>
            {({ icon, message }) => (
              <>
                {icon}
                {message}
                {t.type !== "loading" && (
                  <button
                    className="rounded-full p-1 ring-primary-400 transition hover:bg-[#444] focus:outline-none focus-visible:ring"
                    onClick={() => toast.dismiss(t.id)}
                  >
                    <X />
                  </button>
                )}
              </>
            )}
          </ToastBar>
        )}
      </Toaster>
    </div>
  );
}

const DEFAULT_TOAST: ToastOptions = {
  style: {
    background: "#F0F2F5",
    color: "#9AA2B1",
  },
  icon: <AlertCircle />,
  className: "w-[375px] [&>div]:justify-start",
  position: "top-center",
  duration: 5000,
};

const createCustomToast = (options: ToastOptions) => {
  return { ...DEFAULT_TOAST, ...options };
};

const showToast = (message: string, options?: ToastOptions) => {
  return toast(message, options || DEFAULT_TOAST);
};

export { createCustomToast, showToast };

const SUCCESS_TOAST = createCustomToast({
  style: {
    background: "#3DA9FC",
    color: "#ffffff",
  },
  icon: <AlertCircle size={30} />,
  className: "w-[375px] [&>div]:justify-start",
  position: "top-center",
  duration: 5000,
});
const DANGER_TOAST = createCustomToast({
  style: {
    background: "#F87171",
    color: "#ffffff",
  },
  icon: <AlertCircle size={30} />,
  className: "w-[375px] [&>div]:justify-start",
  position: "top-center",
  duration: 5000,
});

const WARNING_TOAST = createCustomToast({
  style: {
    background: "#4D84E0",
    color: "#ffffff",
  },
  icon: <AlertCircle size={30} />,
  className: "w-[375px] [&>div]:justify-start",
  position: "top-center",
  duration: 5000,
});

const showPromiseToast = (
  promise: Promise<any>,
  message: string,
  successMessage: string = "Operation succeeded"
) => {
  return promise
    .then(() => {
      showToast(successMessage, SUCCESS_TOAST);
    })
    .catch((error) => {
      showToast(message, DANGER_TOAST);
    });
};

export { DANGER_TOAST, SUCCESS_TOAST, WARNING_TOAST, showPromiseToast };
