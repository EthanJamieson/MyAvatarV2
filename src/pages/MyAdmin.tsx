import { useEffect, useState } from "react";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Tables } from "@/integrations/supabase/types";

type PricingPlan = Tables<"pricing_plans">;

const formatCurrency = (amount: number) => `R${amount.toLocaleString("en-ZA", { maximumFractionDigits: 0 })}`;

const calculateDiscountedAmount = (amount: number, discountPercent: number | null) => {
  if (!discountPercent || discountPercent <= 0) return amount;
  return Math.round(amount * (1 - discountPercent / 100));
};
const formatExpiryPreview = (plan: PricingPlan) => {
  if (plan.discount_mode !== "expires" || !plan.discount_expires_at) return null;
  return new Date(plan.discount_expires_at).toLocaleString();
};

const getErrorMessage = async (error: unknown, fallback: string) => {
  if (error && typeof error === "object" && "context" in error) {
    const context = (error as { context?: Response }).context;
    if (context && typeof context.json === "function") {
      try {
        const payload = await context.json();
        if (payload?.error && typeof payload.error === "string") return payload.error;
      } catch {
        // no-op, use fallback below
      }
    }
  }
  return fallback;
};

const featuresToTextarea = (features: string[]) => features.join("\n");
const textareaToFeatures = (raw: string) =>
  raw
    .split("\n")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);

type AdminFunctionResult<T> = { data: T | null; error: string | null; status: number };

const invokeAdminFunction = async <T,>(functionName: string, body: unknown): Promise<AdminFunctionResult<T>> => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;
  if (!supabaseUrl || !supabaseAnonKey) {
    return { data: null, error: "Supabase environment variables are missing", status: 500 };
  }

  const response = await fetch(`${supabaseUrl}/functions/v1/${functionName}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
    },
    body: JSON.stringify(body),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    return {
      data: null,
      error: typeof payload?.error === "string" ? payload.error : "Request failed",
      status: response.status,
    };
  }

  return { data: payload as T, error: null, status: response.status };
};

const MyAdmin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [loginStep, setLoginStep] = useState<"credentials" | "otp">("credentials");
  const [loading, setLoading] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sessionExpiry, setSessionExpiry] = useState<string | null>(null);
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [savingPlanId, setSavingPlanId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<"video" | "tutorial">("video");
  const [creatingPlan, setCreatingPlan] = useState(false);
  const [newPlanName, setNewPlanName] = useState("");
  const [newPlanDescription, setNewPlanDescription] = useState("");
  const [newPlanAmount, setNewPlanAmount] = useState<number>(0);
  const [newPlanDiscountPercent, setNewPlanDiscountPercent] = useState<string>("");
  const [newPlanIsActive, setNewPlanIsActive] = useState(true);
  const [newPlanFeatures, setNewPlanFeatures] = useState("");

  const loadPlans = async () => {
    const result = await invokeAdminFunction<{ plans: PricingPlan[] }>("admin-pricing", { action: "list" });
    if (result.error) {
      if (result.status === 401) {
        setIsAuthenticated(false);
        setPlans([]);
      }
      toast.error(result.error || "Failed to load pricing plans");
      return;
    }
    setPlans(Array.isArray(result.data?.plans) ? result.data.plans : []);
  };

  const checkSession = async () => {
    const result = await invokeAdminFunction<{ authenticated: boolean; expiresAt: string }>("admin-pricing", { action: "session" });
    if (result.error || !result.data?.authenticated) {
      setIsAuthenticated(false);
      setSessionExpiry(null);
      setSessionReady(true);
      return;
    }
    setIsAuthenticated(true);
    setSessionExpiry(result.data.expiresAt);
    await loadPlans();
    setSessionReady(true);
  };

  useEffect(() => {
    void checkSession();
  }, []);

  const handleStartLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await invokeAdminFunction<{ success: boolean }>("admin-login-start", {
        username: username.trim(),
        password,
      });
      if (result.error || !result.data?.success) throw new Error(result.error || "Failed to start login");
      setLoginStep("otp");
      toast.success("Verification code sent to studio@myavatar.co.za");
    } catch (err) {
      console.error(err);
      toast.error(await getErrorMessage(err, "Invalid login or failed to send verification code"));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await invokeAdminFunction<{ success: boolean; expiresAt: string }>("admin-login-verify", {
        username: username.trim(),
        code: otpCode.trim(),
      });
      if (result.error || !result.data?.success) throw new Error(result.error || "Verification failed");

      setIsAuthenticated(true);
      setSessionExpiry(result.data.expiresAt);
      setOtpCode("");
      await loadPlans();
      toast.success("Admin login successful");
    } catch (err) {
      console.error(err);
      toast.error(await getErrorMessage(err, "Invalid or expired verification code"));
    } finally {
      setLoading(false);
    }
  };

  const updatePlanField = (id: string, patch: Partial<PricingPlan>) => {
    setPlans((prev) => prev.map((plan) => (plan.id === id ? { ...plan, ...patch } : plan)));
  };

  const savePlan = async (plan: PricingPlan) => {
    setSavingPlanId(plan.id);
    try {
      const result = await invokeAdminFunction<{ plan: PricingPlan }>("admin-pricing", {
        action: "update",
        id: plan.id,
        name: plan.name,
        description: plan.description,
        amountInRands: plan.amount_in_rands,
        discountPercent: plan.discount_percent,
        discountMode: plan.discount_mode,
        durationUnit: plan.discount_duration_unit,
        durationValue: plan.discount_duration_value,
        features: plan.features,
        isActive: plan.is_active,
      });
      if (result.error || !result.data?.plan) throw new Error(result.error || "No updated plan returned");
      updatePlanField(plan.id, result.data.plan);
      toast.success(`${plan.name} updated`);
    } catch (err) {
      console.error(err);
      toast.error(await getErrorMessage(err, "Failed to save plan"));
    } finally {
      setSavingPlanId(null);
    }
  };

  const handleLogout = () => {
    void (async () => {
      await invokeAdminFunction("admin-logout", {});
    })();
    setIsAuthenticated(false);
    setSessionExpiry(null);
    setPlans([]);
    setLoginStep("credentials");
    setPassword("");
    setOtpCode("");
  };

  const filteredPlans = plans.filter((plan) => plan.category === activeCategory);

  const createPlan = async (e: React.FormEvent) => {
    e.preventDefault();

    setCreatingPlan(true);
    try {
      const result = await invokeAdminFunction<{ plan: PricingPlan }>("admin-pricing", {
        action: "create",
        category: activeCategory,
        name: newPlanName,
        description: newPlanDescription,
        amountInRands: newPlanAmount,
        discountPercent: newPlanDiscountPercent === "" ? null : Number(newPlanDiscountPercent),
        features: textareaToFeatures(newPlanFeatures),
        isActive: newPlanIsActive,
      });
      if (result.error || !result.data?.plan) throw new Error(result.error || "No created plan returned");

      setPlans((prev) => [...prev, result.data.plan].sort((a, b) => a.sort_order - b.sort_order));
      setNewPlanName("");
      setNewPlanDescription("");
      setNewPlanAmount(0);
      setNewPlanDiscountPercent("");
      setNewPlanIsActive(true);
      setNewPlanFeatures("");
      toast.success("New pricing package created");
    } catch (err) {
      console.error(err);
      toast.error(await getErrorMessage(err, "Failed to create plan"));
    } finally {
      setCreatingPlan(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-6 max-w-5xl">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">MyAvatar Admin</h1>

          {!sessionReady ? (
            <div className="glass-card p-8 max-w-lg">
              <p className="text-sm text-muted-foreground">Checking admin session...</p>
            </div>
          ) : !isAuthenticated ? (
            <div className="glass-card p-8 max-w-lg">
              {loginStep === "credentials" ? (
                <form onSubmit={handleStartLogin} className="space-y-4">
                  <h2 className="font-display text-xl font-semibold text-foreground">Admin Login</h2>
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1.5">Username</label>
                    <input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-muted/50 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1.5">Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-muted/50 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-press w-full bg-primary text-primary-foreground py-3 rounded-full text-sm font-semibold disabled:opacity-60"
                  >
                    {loading ? "Sending code..." : "Continue"}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <h2 className="font-display text-xl font-semibold text-foreground">Enter 6-digit verification code</h2>
                  <p className="text-sm text-muted-foreground">Code is sent to studio@myavatar.co.za</p>
                  <input
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className="w-full bg-muted/50 px-4 py-3 rounded-xl text-sm tracking-[0.35em] text-center focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                    minLength={6}
                    maxLength={6}
                    inputMode="numeric"
                    pattern="\d{6}"
                  />
                  <button
                    type="submit"
                    disabled={loading || otpCode.length !== 6}
                    className="btn-press w-full bg-primary text-primary-foreground py-3 rounded-full text-sm font-semibold disabled:opacity-60"
                  >
                    {loading ? "Verifying..." : "Verify"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoginStep("credentials")}
                    className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Back to login
                  </button>
                </form>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="glass-card p-2 inline-flex gap-2 rounded-full">
                <button
                  type="button"
                  onClick={() => setActiveCategory("video")}
                  className={`px-4 py-2 rounded-full text-sm transition-colors ${
                    activeCategory === "video"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Video
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCategory("tutorial")}
                  className={`px-4 py-2 rounded-full text-sm transition-colors ${
                    activeCategory === "tutorial"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Tutorial
                </button>
              </div>

              <div className="glass-card p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <p className="text-sm text-foreground font-medium">Admin session active</p>
                  <p className="text-xs text-muted-foreground">
                    Expires: {sessionExpiry ? new Date(sessionExpiry).toLocaleString() : "Unknown"}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="btn-press px-4 py-2 rounded-full text-sm border border-border hover:bg-muted"
                >
                  Logout
                </button>
              </div>

              <form onSubmit={createPlan} className="glass-card p-6 space-y-4">
                <h3 className="font-display text-lg text-foreground">Create new {activeCategory} package</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1.5">Name</label>
                    <input
                      value={newPlanName}
                      onChange={(e) => setNewPlanName(e.target.value)}
                      className="w-full bg-muted/50 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1.5">Amount in rands</label>
                    <input
                      type="number"
                      min={0}
                      step="1"
                      value={newPlanAmount}
                      onChange={(e) => setNewPlanAmount(Number(e.target.value))}
                      className="w-full bg-muted/50 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs text-muted-foreground block mb-1.5">Description</label>
                    <textarea
                      rows={2}
                      value={newPlanDescription}
                      onChange={(e) => setNewPlanDescription(e.target.value)}
                      className="w-full bg-muted/50 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs text-muted-foreground block mb-1.5">Bullet points (one per line)</label>
                    <textarea
                      rows={4}
                      value={newPlanFeatures}
                      onChange={(e) => setNewPlanFeatures(e.target.value)}
                      className="w-full bg-muted/50 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-y"
                      placeholder={"Feature one\nFeature two\nFeature three"}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1.5">Discount percent (%)</label>
                    <input
                      type="number"
                      min={0}
                      max={99.99}
                      step="0.01"
                      value={newPlanDiscountPercent}
                      onChange={(e) => setNewPlanDiscountPercent(e.target.value)}
                      className="w-full bg-muted/50 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder="Optional"
                    />
                  </div>
                  <label className="flex items-center gap-2 text-sm text-foreground md:pt-6">
                    <input
                      type="checkbox"
                      checked={newPlanIsActive}
                      onChange={(e) => setNewPlanIsActive(e.target.checked)}
                    />
                    Active
                  </label>
                </div>
                <button
                  type="submit"
                  disabled={creatingPlan}
                  className="btn-press px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-60"
                >
                  {creatingPlan ? "Creating..." : "Create package"}
                </button>
              </form>

              {filteredPlans.map((plan) => {
                const discountedAmount = calculateDiscountedAmount(plan.amount_in_rands, plan.discount_percent);
                return (
                  <div key={plan.id} className="glass-card p-6">
                    <div className="flex items-center justify-between mb-4 gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">{plan.category}</p>
                        <h3 className="font-display text-xl text-foreground">{plan.name}</h3>
                      </div>
                      <label className="flex items-center gap-2 text-sm text-foreground">
                        <input
                          type="checkbox"
                          checked={plan.is_active}
                          onChange={(e) => updatePlanField(plan.id, { is_active: e.target.checked })}
                        />
                        Active
                      </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-muted-foreground block mb-1.5">Name</label>
                        <input
                          value={plan.name}
                          onChange={(e) => updatePlanField(plan.id, { name: e.target.value })}
                          className="w-full bg-muted/50 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground block mb-1.5">Amount in rands</label>
                        <input
                          type="number"
                          min={0}
                          step="1"
                          value={plan.amount_in_rands}
                          onChange={(e) => updatePlanField(plan.id, { amount_in_rands: Number(e.target.value) })}
                          className="w-full bg-muted/50 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-xs text-muted-foreground block mb-1.5">Description</label>
                        <textarea
                          rows={2}
                          value={plan.description}
                          onChange={(e) => updatePlanField(plan.id, { description: e.target.value })}
                          className="w-full bg-muted/50 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-xs text-muted-foreground block mb-1.5">Bullet points (one per line)</label>
                        <textarea
                          rows={4}
                          value={featuresToTextarea(plan.features)}
                          onChange={(e) => updatePlanField(plan.id, { features: textareaToFeatures(e.target.value) })}
                          className="w-full bg-muted/50 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-y"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground block mb-1.5">Discount percent (%)</label>
                        <input
                          type="number"
                          min={0}
                          max={99.99}
                          step="0.01"
                          value={plan.discount_percent ?? ""}
                          onChange={(e) =>
                            updatePlanField(plan.id, {
                              discount_percent: e.target.value === "" ? null : Number(e.target.value),
                            })
                          }
                          className="w-full bg-muted/50 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                          placeholder="No discount"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground block mb-1.5">Discount duration</label>
                        <select
                          value={plan.discount_mode || "always"}
                          onChange={(e) =>
                            updatePlanField(plan.id, {
                              discount_mode: e.target.value === "expires" ? "expires" : "always",
                              discount_duration_unit: e.target.value === "expires" ? (plan.discount_duration_unit || "days") : null,
                              discount_duration_value: e.target.value === "expires" ? (plan.discount_duration_value || 1) : null,
                              discount_expires_at: e.target.value === "expires" ? plan.discount_expires_at : null,
                            })
                          }
                          className="w-full bg-muted/50 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                          <option value="always">Always</option>
                          <option value="expires">Expires after duration</option>
                        </select>
                      </div>
                      {plan.discount_mode === "expires" && (
                        <>
                          <div>
                            <label className="text-xs text-muted-foreground block mb-1.5">Duration unit</label>
                            <select
                              value={plan.discount_duration_unit || "days"}
                              onChange={(e) =>
                                updatePlanField(plan.id, {
                                  discount_duration_unit: e.target.value === "hours" ? "hours" : "days",
                                })
                              }
                              className="w-full bg-muted/50 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                            >
                              <option value="hours">Hours</option>
                              <option value="days">Days</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-xs text-muted-foreground block mb-1.5">Duration value</label>
                            <input
                              type="number"
                              min={1}
                              max={3650}
                              step="1"
                              value={plan.discount_duration_value ?? 1}
                              onChange={(e) =>
                                updatePlanField(plan.id, {
                                  discount_duration_value: Number(e.target.value),
                                })
                              }
                              className="w-full bg-muted/50 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                          </div>
                        </>
                      )}
                      <div className="flex items-end">
                        <p className="text-sm text-muted-foreground">
                          Old:{" "}
                          <span className="line-through">
                            {formatCurrency(plan.amount_in_rands)}
                          </span>{" "}
                          New: <span className="text-foreground font-semibold">{formatCurrency(discountedAmount)}</span>
                        </p>
                      </div>
                      {plan.discount_mode === "expires" && (
                        <div className="md:col-span-2">
                          <p className="text-xs text-muted-foreground">
                            {formatExpiryPreview(plan)
                              ? `Current expiry: ${formatExpiryPreview(plan)}`
                              : "Expiry will be recalculated when you save this plan."}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="mt-5">
                      <button
                        disabled={savingPlanId === plan.id}
                        onClick={() => savePlan(plan)}
                        className="btn-press px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-60"
                      >
                        {savingPlanId === plan.id ? "Saving..." : "Save changes"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default MyAdmin;
