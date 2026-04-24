import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type PolicySection = {
  id: string;
  title: string;
  content: string[];
};

const privacyPolicyText = `MyAvatar
Privacy Policy
Effective Date: 1 May 2025
Version: 1.0
Governing Entity: MyAvatar (Pty) Ltd
Contact: studio@myavatar.co.za


1. Introduction

MyAvatar (Pty) Ltd ("MyAvatar," "we," "us," or "our") is committed to protecting your personal information. This Privacy Policy explains how we collect, use, store, share, and protect your data when you use the MyAvatar platform and services.

This policy applies to all users worldwide and is designed to comply with the General Data Protection Regulation (GDPR), the Protection of Personal Information Act (POPIA), the California Consumer Privacy Act (CCPA), and other applicable data protection laws.

2. Data Controller

MyAvatar (Pty) Ltd is the data controller for personal information processed through the Service.

3. Information We Collect

3.1 Information You Provide

•	Account Information: Name, email address, country, and password when you register.
•	Profile Information: Profile photo, display name, and preferences.
•	Payment Information: Billing details processed securely through our payment partners (we do not store full card numbers).
•	Likeness Data: Facial images, voice recordings, and related biometric data submitted for Avatar creation (governed separately by our Biometric Data & Likeness Policy).
•	Communications: Emails, support tickets, or feedback you send to us.

3.2 Information Collected Automatically

•	Device and Technical Data: IP address, browser type, operating system, device identifiers.
•	Usage Data: Pages visited, features used, rendering jobs submitted, session duration, and clickstream data.
•	Cookies and Tracking: As described in our Cookie Policy.

3.3 Information from Third Parties

•	Single Sign-On: If you register via Google, Apple, or other OAuth providers, we receive basic profile data from those providers.
•	Analytics Partners: Aggregated, anonymised usage data from analytics platforms.

4. Legal Basis for Processing (GDPR)

For users in the European Economic Area (EEA) and UK, our legal bases for processing your personal data are:

•	Contract Performance: Processing necessary to provide the Service you have requested.
•	Legitimate Interests: Improving our Service, fraud prevention, security monitoring, and business operations.
•	Consent: For biometric/Likeness Data processing, marketing communications, and cookies (where required).
•	Legal Obligation: Compliance with applicable laws and regulatory requirements.

5. How We Use Your Information

•	To create and manage your account and provide the Service;
•	To process payments and manage credits;
•	To generate AI Avatars and Outputs based on your Likeness Data;
•	To improve, develop, and personalise our AI models and Service features;
•	To communicate with you about your account, transactions, and updates;
•	To send marketing communications (with your consent, where required);
•	To detect, investigate, and prevent fraud, abuse, and security incidents;
•	To comply with legal obligations and enforce our Terms; and
•	To conduct analytics and improve user experience.

6. Data Sharing and Disclosure

We do not sell your personal data. We may share your information with:

6.1 Service Providers

Third-party vendors who process data on our behalf, including cloud infrastructure providers, payment processors, analytics platforms, and customer support tools. All sub-processors are bound by data processing agreements.
6.2 Legal Requirements

We may disclose your information if required by law, court order, or government authority, or to protect the rights, property, or safety of MyAvatar, our users, or the public.

6.3 Business Transfers

In connection with a merger, acquisition, or sale of assets, your data may be transferred. We will provide notice before your data is transferred to a new entity.

6.4 With Your Consent

We may share your data for any other purpose with your explicit consent.

7. International Data Transfers

MyAvatar operates globally with infrastructure in multiple regions. Your data may be processed in countries outside your country of residence, including countries that may not have equivalent data protection laws.

For transfers from the EEA, UK, or Switzerland, we rely on:
•	Standard Contractual Clauses (SCCs) approved by the European Commission;
•	Adequacy decisions where applicable; or
•	Other lawful transfer mechanisms.

8. Data Retention

We retain your personal data for as long as necessary to provide the Service and fulfil the purposes described in this policy, or as required by law. Specifically:

•	Account Data: Retained for the duration of your account and up to 3 years thereafter;
•	Likeness Data: Retained only as long as necessary for Avatar generation and deleted upon your request or account deletion (see Biometric Data & Likeness Policy for details);
•	Usage Logs: Retained for up to 12 months for security and analytics;
•	Financial Records: Retained for up to 7 years as required by tax and financial regulations.

9. Your Rights

Depending on your jurisdiction, you may have the following rights regarding your personal data:

•	Access: Request a copy of the personal data we hold about you.
•	Rectification: Request correction of inaccurate or incomplete data.
•	Erasure: Request deletion of your data, subject to legal retention requirements.
•	Restriction: Request that we limit processing of your data.
•	Portability: Receive your data in a structured, machine-readable format.
•	Objection: Object to processing based on legitimate interests or for direct marketing.
•	Withdraw Consent: Withdraw consent at any time where processing is based on consent.
•	Non-Discrimination (CCPA): The right not to be discriminated against for exercising your privacy rights.

To exercise your rights, contact us at studio@myavatar.co.za. We will respond within 30 days (or as required by applicable law).

10. Security

We implement industry-standard security measures to protect your data, including:

•	AES-256 encryption of data at rest;
•	TLS 1.3 encryption of data in transit;
•	Tier-3 data centre infrastructure with physical security controls;
•	Role-based access controls and audit logging;
•	Regular security assessments and penetration testing.

Despite these measures, no system is completely secure. Please notify us immediately at studio@myavatar.co.za if you suspect a security breach.

11. Children's Privacy

The Service is not directed to individuals under the age of 18. We do not knowingly collect personal data from children. If you believe we have inadvertently collected data from a child, please contact us at studio@myavatar.co.za and we will take immediate steps to delete it.

12. Updates to This Policy

We may update this Privacy Policy from time to time. We will notify you of material changes by email or through a prominent notice on our website. The updated policy will be effective upon posting.

13. Contact and Complaints

For privacy-related enquiries:

•	Email: studio@myavatar.co.za

If you are in the EEA and believe we have not addressed your concern, you have the right to lodge a complaint with your local supervisory authority. In South Africa, complaints may be directed to the Information Regulator at inforeg.org.za.`;

const termsOfServiceText = `MyAvatar
Terms of Service
Effective Date: 1 May 2025
Version: 1.0
Governing Entity: MyAvatar (Pty) Ltd
Contact: studio@myavatar.co.za


1. Introduction and Acceptance
Welcome to MyAvatar.

These Terms of Service (“Terms”) constitute a legally binding agreement between you (“User,” “you,” or “your”) and MyAvatar (Pty) Ltd (“MyAvatar,” “we,” “us,” or “our”), governing your access to and use of the MyAvatar platform, including our AI avatar generation services, website, APIs, and all associated tools and content (collectively, the “Service”).

By accessing or using the Service, you confirm that you have read, understood, and agree to be bound by these Terms and our Privacy Policy.

2. Definitions

•	“Avatar” means a photorealistic AI-generated digital representation of a person, created using MyAvatar’s neural rendering technology.
•	“Content” means any video, audio, image, text, or other material generated through or uploaded to the Service.
•	“Likeness Data” means any biometric or personal visual/audio data used to create an Avatar, including facial geometry, voice samples, and motion data.
•	“Credits” means the non-refundable digital units purchased to access paid features of the Service.
•	“Output” means the final rendered video or asset produced by the Service.

3. Eligibility

You must be at least 18 years of age to use the Service. By using the Service, you represent and warrant that:
•	You are at least 18 years of age;
•	You have the legal capacity to enter into a binding contract in your jurisdiction;
•	You are not barred from using the Service under any applicable law; and
•	If using the Service on behalf of a company or organisation, you have the authority to bind that entity to these Terms.

4. Account Registration

To access certain features of the Service, you must create an account. You agree to:

•	Provide accurate, current, and complete registration information;
•	Maintain and promptly update your account information;
•	Keep your login credentials confidential and not share them with third parties;
•	Accept responsibility for all activities that occur under your account; and
•	Notify us immediately at studio@myavatar.co.za of any unauthorised use of your account.

MyAvatar reserves the right to suspend or terminate accounts that provide inaccurate, fraudulent, or incomplete information.

5. Licence Grant and Restrictions

5.1 Licence to You

Subject to your compliance with these Terms, MyAvatar grants you a limited, non-exclusive, non-transferable, revocable licence to access and use the Service for your personal or internal business purposes.

5.2 Restrictions

You may not, and may not permit any third party to:

•	Copy, modify, distribute, sell, or lease any part of the Service;
•	Reverse engineer, decompile, or attempt to extract source code from the Service;
•	Use the Service to build a competing product or service;
•	Circumvent any technical limitations, security measures, or access controls;
•	Scrape, crawl, or use automated means to access or collect data from the Service;
•	Sublicense, resell, or commercialise Outputs without prior written permission from MyAvatar; or
•	Use the Service in any manner that violates applicable laws or these Terms.

6. Intellectual Property

6.1 MyAvatar Technology

All intellectual property rights in the Service, including our AI models, neural rendering technology, proprietary algorithms, software, branding, and platform design, are owned by or licensed to MyAvatar. Nothing in these Terms transfers ownership of any MyAvatar intellectual property to you.

6.2 User Content and Outputs

You retain ownership of any original content you upload to the Service. With respect to AI-generated Outputs:

•	You are granted a perpetual, royalty-free licence to use Outputs for lawful purposes, subject to these Terms;
•	MyAvatar retains a non-exclusive licence to use anonymised Output data to improve our AI models, unless you opt out in your account settings;
•	You are solely responsible for ensuring you have all necessary rights, consents, and permissions for any Likeness Data or content you submit.

6.3 Feedback

If you provide feedback, suggestions, or ideas regarding the Service, you grant MyAvatar a perpetual, irrevocable, royalty-free licence to use such feedback for any purpose without compensation to you.

7. Payments, Credits, and Pricing

7.1 Pay-Per-Video Model

MyAvatar operates on a pay-per-video credit model. Credits are purchased in advance and consumed upon each rendering job.

7.2 Pricing

Current pricing, credit packs, and any applicable taxes are detailed on our Pricing page at myavatar.co.za/pricing. Prices are subject to change with reasonable notice.

7.3 No Subscriptions

We do not offer subscription plans. Credits do not expire and have no recurring billing.

7.4 Taxes

You are responsible for all applicable taxes, levies, and duties associated with your purchase, except where MyAvatar is required to collect and remit taxes under applicable law.

7.5 Billing Disputes

Any billing disputes must be raised within 30 days of the charge. Please contact studio@myavatar.co.za.

8. Acceptable Use

Your use of the Service is subject to our Acceptable Use Policy, which is incorporated into these Terms by reference. You agree not to use the Service to create content that is illegal, deceptive, harmful, or violates the rights of others. Please review the full Acceptable Use Policy for detailed requirements.

9. Privacy and Data

Our collection, use, and protection of your personal data is governed by our Privacy Policy and Biometric Data & Likeness Policy, both of which are incorporated by reference. By using the Service, you consent to the data practices described in those policies.

10. Third-Party Services

The Service may integrate with or contain links to third-party services, platforms, or content. MyAvatar does not control and is not responsible for third-party services. Your use of third-party services is at your own risk and subject to those parties’ terms and privacy policies.

11. Disclaimers and Limitation of Liability

11.1 Service Provided “As Is”

The service is provided on an “as is” and “as available” basis without warranties of any kind, express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, and non-infringement.

11.2 Limitation of Liability

To the maximum extent permitted by applicable law, MyAvatar and its affiliates, officers, employees, agents, and licensors shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits, data, or business opportunities, arising out of or in connection with these terms or your use of the service.

11.3 Cap on Liability

MyAvatar’s total cumulative liability to you for all claims arising out of or relating to these terms shall not exceed the greater of (a) the amount you paid to MyAvatar in the 12 months preceding the claim, or (b) USD $100.

12. Indemnification

You agree to indemnify, defend, and hold harmless MyAvatar and its affiliates, officers, directors, employees, and agents from any claims, losses, damages, liabilities, costs, and expenses (including reasonable legal fees) arising from:

•	Your use of or access to the Service;
•	Your violation of these Terms or any applicable law;
•	Your infringement of any third-party rights, including intellectual property or privacy rights; or
•	Any content or Likeness Data you submit to the Service.

13. Termination

Either party may terminate these Terms at any time. MyAvatar may suspend or terminate your access to the Service immediately, without notice or liability, if you breach these Terms or for any other reason at our discretion.

Upon termination: (a) your licence to use the Service ceases immediately; (b) unused Credits are subject to the Refund Policy; (c) we may retain your data as required by law or legitimate business purposes. Sections 6, 11, 12, 14, and 15 survive termination.

14. Governing Law and Dispute Resolution

These Terms are governed by the laws of the Republic of South Africa, without regard to conflict of law principles. Any dispute arising from these Terms shall first be attempted to be resolved through good-faith negotiation. If unresolved within 30 days, disputes shall be submitted to binding arbitration in accordance with the rules of the Arbitration Foundation of Southern Africa (AFSA).
Notwithstanding the above, MyAvatar may seek injunctive or other equitable relief in any court of competent jurisdiction.

15. General Provisions

•	Entire Agreement: These Terms, together with the Privacy Policy, Biometric Data & Likeness Policy, Acceptable Use Policy, and Refund Policy, constitute the entire agreement between you and MyAvatar.
•	Severability: If any provision of these Terms is found to be unenforceable, the remaining provisions remain in full force.
•	Waiver: Failure to enforce any provision of these Terms does not constitute a waiver.
•	Assignment: You may not assign your rights under these Terms without our prior written consent. MyAvatar may assign these Terms freely.
•	Amendments: We may update these Terms from time to time. We will notify you of material changes by email or prominent notice on the Service. Your continued use after the effective date constitutes acceptance.

16. Contact Us

For questions about these Terms, please contact:

•	Email: studio@myavatar.co.za
•	Website: myavatar.co.za`;

const refundPolicyText = `MyAvatar
Refund Policy
Effective Date: 1 May 2025
Version: 1.0
Governing Entity: MyAvatar (Pty) Ltd
Contact: studio@myavatar.co.za


1. Overview

MyAvatar operates on a pay-per-video credit model with no subscriptions. This Refund Policy explains when refunds may be issued, how to request them, and the conditions that apply. We are committed to fair, transparent treatment of every customer.

2. Credit Purchases

2.1 General Rule

All credit purchases are final and non-refundable once credits have been consumed by a completed rendering job. Credits that have not been used remain in your account and do not expire.

2.2 Eligible Refund Situations

Refunds for unused credits will be considered in the following circumstances:

•	Technical Failure: A rendering job fails due to a platform error on MyAvatar's side, and the credits were deducted but no usable Output was delivered.
•	Duplicate Payment: You were charged more than once for the same credit pack due to a billing system error.
•	Unauthorised Transaction: Credits were purchased on your account without your authorisation (subject to verification).
•	Service Unavailability: The Service was unavailable for a continuous period exceeding 48 hours, materially impacting your use.
•	Statutory Rights: Where applicable consumer protection law in your jurisdiction grants a right to a refund.

2.3 Non-Refundable Situations

Refunds will not be issued in the following circumstances:

•	Credits consumed by successfully completed rendering jobs, regardless of your satisfaction with the Output;
•	Credits purchased during a promotional period unless the promotion expressly states otherwise;
•	Credits in accounts suspended or terminated due to a violation of our Terms of Service or Acceptable Use Policy;
•	Change of mind after purchase where the Service has been available and functioning correctly.

3. Failed Rendering Jobs

If a rendering job fails due to a MyAvatar platform error:

•	Credits consumed by the failed job will be automatically reinstated to your account within 24 hours;
•	If automatic reinstatement does not occur, please contact studio@myavatar.co.za with your Job ID and account email;
•	We may require a minimum of 3 business days to investigate and process credit reinstatements.

Note: Failed jobs resulting from user-submitted content issues (e.g., unsuitable file formats, content policy violations, or insufficient input quality) are not eligible for credit reinstatement.

4. How to Request a Refund

To request a refund or credit reinstatement, please follow these steps:

•	Step 1: Email studio@myavatar.co.za with the subject line "Refund Request – [Your Account Email]";
•	Step 2: Include your account email, the date of purchase, the amount charged, and a description of the issue;
•	Step 3: Attach any supporting documentation (e.g., payment receipts, error screenshots, Job IDs);
•	Step 4: Allow up to 10 business days for our team to investigate and respond.

Refund requests must be submitted within 60 days of the original transaction date.

5. Refund Processing

5.1 Method

Approved refunds will be returned to the original payment method used at the time of purchase. We are unable to issue refunds to a different card, bank account, or payment method.

5.2 Timing

Once approved, refunds typically appear within 5–10 business days, depending on your payment provider. MyAvatar is not responsible for delays caused by banks or payment processors.

5.3 Currency

Refunds are processed in the same currency as the original transaction. Exchange rate fluctuations are not MyAvatar's responsibility.

6. Consumer Rights

Nothing in this Refund Policy limits or excludes any rights you may have under applicable consumer protection legislation in your jurisdiction, including:

•	The Consumer Protection Act 68 of 2008 (South Africa);
•	The Consumer Rights Act 2015 (United Kingdom);
•	Consumer guarantees under Australian Consumer Law; or
•	Other applicable national consumer protection laws.

Where your statutory rights provide greater protection than this policy, your statutory rights take precedence.

7. Disputes

If you are unsatisfied with our response to your refund request, you may escalate the matter by emailing studio@myavatar.co.za. We are committed to resolving disputes fairly and in good faith.

8. Changes to This Policy

We may update this Refund Policy from time to time. Changes will be posted to our website with a revised effective date. Purchases made prior to the effective date of any change are governed by the policy in effect at the time of purchase.

9. Contact

•	Email: studio@myavatar.co.za
•	Response Time: Within 3 business days`;

const acceptableUsePolicyText = `MyAvatar
Acceptable Use Policy
Effective Date: 1 May 2025
Version: 1.0
Governing Entity: MyAvatar (Pty) Ltd
Contact: studio@myavatar.co.za


1. Purpose

This Acceptable Use Policy ("AUP") sets out the standards of conduct that all users of the MyAvatar platform must adhere to. MyAvatar provides powerful AI avatar and video generation technology. With that power comes responsibility and this policy exists to ensure the Service is used ethically, lawfully, and in a manner that respects the rights and dignity of all people.

Violation of this AUP may result in immediate suspension or permanent termination of your account, without refund of any unused credits, and may be referred to law enforcement where appropriate.

2. Prohibited Content

You may not use the MyAvatar Service to create, distribute, or facilitate any content that:

2.1 Is Illegal

•	Violates any applicable local, national, or international law or regulation;
•	Constitutes or facilitates child sexual abuse material (CSAM) or any sexualisation of minors in any form;
•	Promotes, glorifies, or incites violence, terrorism, or extremist activity;
•	Facilitates human trafficking, exploitation, or modern slavery.

2.2 Is Deceptive or Fraudulent

•	Impersonates any real person without their explicit, documented consent;
•	Creates synthetic media ("deepfakes") intended to deceive viewers about the identity, actions, or statements of a real individual;
•	Is designed to spread disinformation, propaganda, or fabricated news;
•	Is used in connection with fraud, scams, phishing, or identity theft.

2.3 Is Harmful or Abusive

•	Constitutes harassment, stalking, bullying, or targeted abuse of any individual;
•	Contains hate speech, including content that dehumanises individuals based on race, ethnicity, nationality, religion, gender, sexual orientation, disability, or other protected characteristics;
•	Facilitates non-consensual intimate imagery (NCII) or "revenge porn";
•	Is designed to cause psychological harm or distress to any individual.

2.4 Violates Third-Party Rights

•	Infringes any copyright, trade mark, patent, or other intellectual property rights;
•	Violates any person's right to privacy or data protection rights;
•	Misappropriates a person's likeness, voice, or persona without lawful authorisation.

3. Consent Requirements

When using any real person's likeness, voice, or identity to create an Avatar, you must:

•	Have obtained clear, informed, and freely given written consent from the individual;
•	Ensure the consent covers the specific use case intended;
•	Retain records of consent and make them available to MyAvatar upon request;
•	Immediately remove content if consent is withdrawn by the individual.

You may use your own likeness to create your personal Avatar without additional consent requirements.

4. Election and Political Content

The use of MyAvatar to create political content is highly restricted. You must not:

•	Create synthetic media of political candidates, elected officials, or public figures in connection with any election campaign without explicit, documented consent;
•	Create content designed to suppress voter participation or spread electoral disinformation;
•	Use MyAvatar Outputs in political advertising without clear disclosure that the content is AI-generated.

Any permitted political content must include a prominent disclosure label stating: "This video contains AI-generated content produced using MyAvatar technology."

5. AI Disclosure Requirements

You acknowledge that AI-generated content produced by MyAvatar may be subject to disclosure obligations under applicable law (including the EU AI Act and FTC guidelines). You agree to:

•	Clearly and prominently disclose that any published Output is AI-generated, using language such as "AI-Generated" or "Created with MyAvatar AI";
•	Not remove, obscure, or alter any watermarks or provenance data embedded in Outputs by MyAvatar;
•	Comply with platform-specific disclosure requirements of any third-party platform where Outputs are published (e.g., YouTube, TikTok, Meta).

6. Commercial and Enterprise Use

Commercial use of MyAvatar Outputs (including use in paid advertising, broadcast media, or commercial licensing) is permitted subject to the following:

•	You must hold a valid commercial licence tier (where applicable) in your account settings;
•	You must comply with all consent requirements under Section 3 above;
•	Resale or sublicensing of raw Avatar models or underlying Likeness Data is strictly prohibited;
•	White-labelling or API integration for commercial redistribution requires a separate Enterprise Agreement with MyAvatar.

7. Security and Platform Integrity

You must not:

•	Attempt to probe, scan, or test the vulnerability of any MyAvatar system or network;
•	Circumvent, disable, or interfere with any security or authentication features;
•	Use automated scripts, bots, or crawlers to access the Service without prior written approval;
•	Introduce malware, viruses, or other malicious code into the Service;
•	Attempt to gain unauthorised access to any account, system, or data.

8. Reporting Violations

If you become aware of any use of the MyAvatar Service that violates this AUP, please report it to:

•	Email: studio@myavatar.co.za
•	Subject Line: "AUP Violation Report"

We investigate all reports in good faith and maintain whistleblower confidentiality where reasonably possible.

9. Enforcement

MyAvatar reserves the right, in its sole discretion, to:

•	Remove any content that violates this AUP without notice;
•	Suspend or permanently terminate your account;
•	Withhold or void unused credits without refund;
•	Report violations to law enforcement or regulatory authorities; and
•	Pursue civil or criminal legal action where appropriate.

10. Amendments

We may update this AUP at any time. Significant changes will be communicated via email or platform notice. Continued use of the Service after changes are posted constitutes acceptance of the revised AUP.`;

const policySections: PolicySection[] = [
  {
    id: "terms-of-service",
    title: "Terms of Service",
    content: termsOfServiceText.split("\n\n"),
  },
  {
    id: "privacy-policy",
    title: "Privacy Policy",
    content: privacyPolicyText.split("\n\n"),
  },
  {
    id: "refund-policy",
    title: "Refund Policy",
    content: refundPolicyText.split("\n\n"),
  },
  {
    id: "acceptable-use-policy",
    title: "Acceptable Use Policy",
    content: acceptableUsePolicyText.split("\n\n"),
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
