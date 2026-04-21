import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type PolicySection = {
  id: string;
  title: string;
  content: string[];
};

const policySections: PolicySection[] = [
  {
    id: "policy-1",
    title: "Policy 1",
    content: [
      "Policy content pending import from the approved document.",
    ],
  },
  {
    id: "policy-2",
    title: "Policy 2",
    content: [
      "Policy content pending import from the approved document.",
    ],
  },
  {
    id: "policy-3",
    title: "Policy 3",
    content: [
      "Policy content pending import from the approved document.",
    ],
  },
  {
    id: "policy-4",
    title: "Policy 4",
    content: [
      "Policy content pending import from the approved document.",
    ],
  },
];

const Policies = () => {
  const defaultPolicy = policySections[0]?.id ?? "";

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-32 pb-24">
        <section className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <p className="text-primary font-mono text-sm tracking-widest uppercase mb-3">
              Legal
            </p>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Policies and Procedures
            </h1>
            <p className="text-muted-foreground mb-10">
              Review all policy documents below. Use the tabs to navigate between each policy.
            </p>

            <Tabs defaultValue={defaultPolicy} className="w-full">
              <TabsList className="w-full h-auto grid grid-cols-2 md:grid-cols-4 gap-2 bg-muted/60 p-2">
                {policySections.map((policy) => (
                  <TabsTrigger key={policy.id} value={policy.id} className="w-full">
                    {policy.title}
                  </TabsTrigger>
                ))}
              </TabsList>

              {policySections.map((policy) => (
                <TabsContent
                  key={policy.id}
                  value={policy.id}
                  className="mt-6 glass-card p-6 md:p-8 space-y-4"
                >
                  <h2 className="font-display text-2xl font-semibold text-foreground">
                    {policy.title}
                  </h2>
                  {policy.content.map((paragraph) => (
                    <p key={paragraph} className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {paragraph}
                    </p>
                  ))}
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Policies;
