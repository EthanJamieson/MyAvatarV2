import { useState, useEffect } from "react";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ShieldCheck, PenTool, Zap, RefreshCw, Mic, Languages, Sparkles } from "lucide-react";

const checkoutSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(100),
  email: z.string().trim().email("Please enter a valid email address").max(255),
});

const addOns = [
  { name: "Digital Twin Upgrade", price: "R1,500", amount: 1500, icon: Sparkles },
  { name: "Script Writing", price: "R500", amount: 500, icon: PenTool },
  { name: "Express Delivery (24 hrs)", price: "R400", amount: 400, icon: Zap },
  { name: "Additional Revisions", price: "R150", amount: 150, icon: RefreshCw },
  { name: "Voice Enhancement", price: "R250", amount: 250, icon: Mic },
  { name: "Foreign Language (Non-English)", price: "R500", amount: 500, icon: Languages },
];

interface CheckoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string, name: string, finalAmount?: number, finalProduct?: string) => void;
  loading: boolean;
  productName: string;
  formattedPrice: string;
  baseAmount: number;
}

const CheckoutDialog = ({ isOpen, onClose, onSubmit, loading, productName, formattedPrice, baseAmount }: CheckoutDialogProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);

  const addOnsTotal = selectedAddOns.reduce((sum, n) => sum + (addOns.find((a) => a.name === n)?.amount ?? 0), 0);
  const totalAmount = baseAmount + addOnsTotal;
  const totalFormatted = `R${totalAmount.toLocaleString()}`;

  useEffect(() => {
    if (isOpen) {
      setSelectedAddOns([]);
    }
  }, [isOpen]);

  const toggleAddOn = (addonName: string) => {
    setSelectedAddOns((prev) =>
      prev.includes(addonName) ? prev.filter((n) => n !== addonName) : [...prev, addonName]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = checkoutSchema.safeParse({ name, email });
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({ name: fieldErrors.name?.[0], email: fieldErrors.email?.[0] });
      return;
    }
    setErrors({});
    const addOnNames = selectedAddOns.length ? ` + ${selectedAddOns.join(", ")}` : "";
    onSubmit(result.data.email, result.data.name, totalAmount, `${productName}${addOnNames}`);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open && !loading) {
      setName("");
      setEmail("");
      setErrors({});
      setSelectedAddOns([]);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md glass-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl text-foreground">Complete your purchase</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Enter your details to proceed to secure payment.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg bg-muted/50 p-4 mb-2">
          <p className="text-sm text-muted-foreground">Product</p>
          <p className="font-display font-semibold text-foreground">{productName}</p>
          <p className="font-display text-2xl font-bold text-primary mt-1">{formattedPrice}</p>
        </div>

        {/* Add-Ons */}
        <div className="rounded-lg border border-border p-4 mb-2">
          <p className="text-sm font-semibold text-foreground mb-3">Add extras to your order:</p>
          <div className="space-y-2">
            {addOns.map((addon) => {
              const selected = selectedAddOns.includes(addon.name);
              return (
                <label
                  key={addon.name}
                  className={`flex items-center justify-between cursor-pointer rounded-lg px-3 py-2 transition-all duration-150 border ${
                    selected ? "border-primary/40 bg-primary/5" : "border-transparent hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => toggleAddOn(addon.name)}
                      className="accent-primary w-4 h-4 rounded"
                    />
                    <addon.icon className="w-3.5 h-3.5 text-primary" />
                    <span className="text-sm text-foreground">{addon.name}</span>
                  </div>
                  <span className="text-xs font-mono text-primary font-semibold">{addon.price}</span>
                </label>
              );
            })}
          </div>
          {selectedAddOns.length > 0 && (
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
              <span className="text-sm font-semibold text-foreground">Total</span>
              <span className="font-display text-lg font-bold text-primary">{totalFormatted}</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="checkout-name" className="text-foreground">Full name</Label>
            <Input
              id="checkout-name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: undefined })); }}
              disabled={loading}
              autoFocus
              className="bg-background border-border"
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="checkout-email" className="text-foreground">Email address</Label>
            <Input
              id="checkout-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: undefined })); }}
              disabled={loading}
              className="bg-background border-border"
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
          </div>

          <button
            type="submit"
            disabled={loading || !email || !name}
            className="btn-press w-full py-3 rounded-full text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
            ) : (
              <>Pay {totalFormatted}</>
            )}
          </button>
        </form>

        <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Secured by Paystack · Your card details are never stored</span>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutDialog;
