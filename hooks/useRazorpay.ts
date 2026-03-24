// Razorpay hook — loads the SDK (already in index.html) and opens the payment modal

declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface RazorpayOptions {
  amount: number;          // in paise (₹ × 100)
  currency?: string;
  name: string;
  description: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  onSuccess: (response: RazorpayResponse) => void;
  onFailure?: (error: any) => void;
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

const RAZORPAY_KEY_ID = 'rzp_test_SPOrR8y66LGYgr';

export function useRazorpay() {
  const openPayment = (opts: RazorpayOptions) => {
    if (!window.Razorpay) {
      alert('Razorpay SDK not loaded. Please check your internet connection.');
      return;
    }

    const rzp = new window.Razorpay({
      key: RAZORPAY_KEY_ID,
      amount: opts.amount,
      currency: opts.currency ?? 'INR',
      name: opts.name,
      description: opts.description,
      image: '/favicon.ico',
      prefill: {
        name: opts.prefill?.name ?? '',
        email: opts.prefill?.email ?? '',
        contact: opts.prefill?.contact ?? '',
      },
      theme: {
        color: '#dc2626',   // matches the site's red brand colour
      },
      modal: {
        ondismiss: () => {
          opts.onFailure?.({ message: 'Payment cancelled by user.' });
        },
      },
      handler: (response: RazorpayResponse) => {
        opts.onSuccess(response);
      },
    });

    rzp.on('payment.failed', (response: any) => {
      opts.onFailure?.(response.error);
    });

    rzp.open();
  };

  return { openPayment };
}
