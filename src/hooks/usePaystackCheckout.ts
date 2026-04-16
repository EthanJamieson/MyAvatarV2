import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CheckoutState {
  isOpen: boolean;
  productName: string;
  amountInRands: number;
  formattedPrice: string;
}

export const usePaystackCheckout = () => {
  const [loading, setLoading] = useState(false);
  const [checkoutState, setCheckoutState] = useState<CheckoutState>({
    isOpen: false,
    productName: "",
    amountInRands: 0,
    formattedPrice: "",
  });

  const openCheckout = useCallback((productName: string, amountInRands: number, formattedPrice: string) => {
    setCheckoutState({ isOpen: true, productName, amountInRands, formattedPrice });
  }, []);

  const updateCheckout = useCallback((amountInRands: number, productName: string) => {
    setCheckoutState((s) => ({ ...s, amountInRands, productName, formattedPrice: `R${amountInRands.toLocaleString()}` }));
  }, []);

  const closeCheckout = useCallback(() => {
    setCheckoutState((s) => ({ ...s, isOpen: false }));
  }, []);

  const processPayment = async (email: string, name: string, finalAmount?: number, finalProduct?: string) => {
    setLoading(true);
    const amount = finalAmount ?? checkoutState.amountInRands;
    const product = finalProduct ?? checkoutState.productName;
    try {
      const { data, error } = await supabase.functions.invoke("initialize-payment", {
        body: {
          email,
          amount,
          metadata: { product, customer_name: name },
          callback_url: window.location.origin + "/payment-callback",
        },
      });

      if (error) throw error;

      if (data?.data?.authorization_url) {
        window.location.href = data.data.authorization_url;
      } else {
        throw new Error("No payment URL returned");
      }
    } catch (err: unknown) {
      console.error("Checkout error:", err);
      toast.error("Payment initialization failed. Please try again.");
      setLoading(false);
    }
  };

  return { openCheckout, closeCheckout, processPayment, loading, checkoutState, updateCheckout };
};
