import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useMemo, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type PolicySection = {
  id: string;
  title: string;
  content: string[];
};

const biometricPolicyText = `MyAvatar
Biometric Data & Likeness Policy
Effective Date: 1 May 2025
Version: 1.0
Governing Entity: MyAvatar (Pty) Ltd
Contact: studio@myavatar.co.za


1. Introduction

MyAvatar's core service involves the creation of photorealistic AI Avatars from Likeness Data — including your facial geometry, voice, and other biometric identifiers. This Biometric Data & Likeness Policy ("Biometric Policy") supplements our Privacy Policy and specifically addresses how we collect, process, store, and delete this highly sensitive category of data.

We recognise that biometric and likeness data deserves the highest level of care and transparency. This policy is designed to comply with the Illinois Biometric Information Privacy Act (BIPA), the EU AI Act, GDPR special category data provisions, the Protection of Personal Information Act (POPIA), and equivalent laws in other jurisdictions.

2. Definitions

•	"Biometric Data" means physiological data used to uniquely identify you, including facial geometry maps, voice prints, and lip-sync motion data.
•	"Likeness Data" means any visual, audio, or physical characteristic submitted to create an Avatar, including photographs, video recordings, and voice samples.
•	"Avatar Model" means the trained digital representation derived from your Likeness Data.
•	"Digital Twin" means a personalised Avatar Model capable of rendering your likeness in photorealistic video.

3. What Biometric and Likeness Data We Collect

When you use MyAvatar to create an Avatar, we collect and process the following:

•	Facial geometry data derived from submitted images or video;
•	Voice recordings and extracted voice characteristics for voice synthesis;
•	Lip movement and facial expression data for lip-sync and animation;
•	Skin tone, texture, and physical feature data necessary for photorealistic rendering.

We collect only the minimum Likeness Data necessary to deliver the requested Avatar quality.
4. Consent

Your explicit, informed consent is required before we collect or process any Biometric or Likeness Data. Specifically:

•	Consent is obtained through a clear, affirmative action (a dedicated consent checkbox) during the Avatar creation process;
•	The consent form describes exactly what data is collected, how it is used, how long it is retained, and your rights;
•	Consent is required separately from your acceptance of our Terms of Service;
•	You may withdraw consent at any time, subject to Section 7 (Deletion and Withdrawal of Consent) below.

If you are creating an Avatar based on another person's likeness, you must obtain and retain written consent from that person before submitting their data. You are legally responsible for that consent.

5. How We Use Your Likeness Data

5.1 Primary Use

Your Likeness Data is used solely to:

•	Generate and render your personalised Avatar;
•	Animate and synchronise your Avatar with supplied audio or scripts; and
•	Produce the final video Output as requested.

5.2 AI Model Training

We do not use your identifiable Likeness Data or Avatar Model to train our AI models without your separate, explicit opt-in consent. You will be asked independently if you wish to participate in our model improvement programme. This is entirely optional and has no effect on the quality of your Avatar.

5.3 Prohibited Uses

We will never:

•	Sell, lease, or trade your Biometric or Likeness Data to third parties;
•	Use your likeness for advertising or promotional purposes without your express written permission;
•	Share your Likeness Data beyond the sub-processors required to deliver the Service.

6. Storage and Security

6.1 Encryption

All Biometric and Likeness Data is encrypted at rest using AES-256 and in transit using TLS 1.3. Your Avatar Model is stored in an encrypted, access-controlled environment isolated from general platform data.

6.2 Access Controls

Access to Biometric and Likeness Data is strictly limited to authorised personnel on a need-to-know basis. All access is logged and audited.

6.3 Infrastructure

Data is processed and stored in Tier-3 certified data centres with 24/7 physical security, redundant power, and environmental controls.

6.4 Sub-Processors

A limited number of sub-processors (such as GPU rendering infrastructure providers) may process your data on our behalf. All sub-processors are bound by data processing agreements with equivalent data protection standards. A current list of sub-processors is available in our Sub-Processor Policy.

7. Retention and Deletion

7.1 Default Retention

Likeness Data and Avatar Models are retained for as long as your account is active and for up to 90 days following account closure, to allow for any final processing or dispute resolution.

7.2 Withdrawal of Consent and Deletion Requests

You may request deletion of your Biometric Data and Avatar Model at any time by:

•	Using the "Delete My Avatar" option in your account settings dashboard; or
•	Emailing studio@myavatar.co.za with the subject "Biometric Data Deletion Request."

Upon a verified deletion request, we will permanently delete your Biometric Data, Likeness Data, and Avatar Model from our systems within 30 days, and confirm deletion in writing.


7.3 Exceptions

Deletion may be delayed or limited where required by law, active legal proceedings, or fraud investigations. We will inform you of any such limitations.

8. Your Rights

In addition to the rights described in our Privacy Policy, with respect to your Biometric and Likeness Data you have the right to:

•	Know exactly what Biometric Data we have collected about you;
•	Receive a copy of your stored Likeness Data in a portable format;
•	Request correction of inaccurately stored biometric information;
•	Demand deletion and receive written confirmation (Illinois BIPA, GDPR Article 17);
•	Object to any use of your Likeness Data for model training at any time; and
•	Withdraw consent to Biometric Data processing at any time.

9. Children

We do not collect Biometric or Likeness Data from any person under the age of 18. If we discover that a child's Likeness Data has been submitted without parental consent, we will immediately delete it and notify you.

10. Jurisdiction-Specific Rights

Illinois (BIPA)

If you are a resident of Illinois, USA, you have specific rights under the Illinois Biometric Information Privacy Act, including the right to know the specific purpose and length of term for which your biometric data is being collected and the right to have your biometric data destroyed in accordance with the retention schedules described herein.

European Union (GDPR)

Biometric data constitutes special category data under GDPR Article 9. We process such data only with your explicit consent. You may lodge complaints with your national supervisory authority.

South Africa (POPIA)

Special personal information, including biometric data, is processed in compliance with POPIA Section 26 and 27, requiring explicit consent and legitimate purpose.
11. Contact

For questions or requests related to your Biometric or Likeness Data:

•	Email: studio@myavatar.co.za
•	Subject Line: "Biometric Data Enquiry"
•	Response Time: Within 10 business days`;

const aiDisclosurePolicyText = `MyAvatar
AI-Generated Content Disclosure Policy
Effective Date: 1 May 2025
Version: 1.0
Governing Entity: MyAvatar (Pty) Ltd
Contact: studio@myavatar.co.za


1. Purpose

This AI-Generated Content Disclosure Policy ("Disclosure Policy") establishes MyAvatar's commitments and requirements regarding the transparent disclosure of AI-generated content. As a producer of synthetic media, MyAvatar is committed to promoting transparency, combating disinformation, and complying with emerging laws and platform requirements worldwide.

2. Regulatory Context

This policy is designed to support compliance with:

•	EU AI Act (Regulation (EU) 2024/1689): Articles 50 and 52 require that AI-generated audio, image, and video content be marked in a machine-readable format and disclosed to viewers;
•	FTC Guidelines (USA): Require clear and conspicuous disclosure of AI-generated commercial content;
•	Digital Services Act (EU): Transparency obligations for very large online platforms hosting AI content;
•	National laws in an increasing number of jurisdictions requiring disclosure of synthetic media, particularly in political advertising and news.

3. MyAvatar's Disclosure Commitments

3.1 Technical Watermarking

All video Outputs generated by MyAvatar are embedded with:

•	An invisible, robust digital watermark encoding the AI origin, generation timestamp, and MyAvatar platform identifier;
•	Content Authenticity Initiative (CAI) / C2PA provenance metadata where technically supported, enabling third-party verification of AI origin.


3.2 Visual Disclosure

Outputs exported for public distribution include an optional visible disclosure label. We strongly recommend enabling the "AI-Generated" badge overlay before publishing to social or broadcast media.

3.3 Platform Metadata

Downloadable Outputs include embedded metadata (EXIF/XMP fields) indicating AI origin, generation date, and platform attribution, compatible with emerging platform verification systems (Meta, YouTube, TikTok).

4. User Disclosure Obligations

By using the MyAvatar Service, you agree to the following disclosure obligations when publishing or distributing Outputs:

4.1 General Publishing

•	Clearly disclose that any publicly shared Output is AI-generated, using language such as "AI-Generated Video" or "Created with MyAvatar AI";
•	Do not remove, alter, or obscure watermarks or provenance metadata embedded in Outputs;
•	Comply with the disclosure policies of any platform on which you publish Outputs.

4.2 Commercial Advertising

•	All AI-generated content used in commercial advertising must include clear, prominent disclosure as required by applicable advertising standards (ASA, FTC, etc.);
•	Disclosures must appear at the start of video advertisements or in a clearly visible position throughout.

4.3 News and Journalistic Content

•	AI-generated video content must never be presented as authentic news footage without express disclosure;
•	Any use of MyAvatar Outputs in journalism or documentary content requires clear identification as AI-generated.

4.4 Political Content

•	AI-generated political content must include a disclosure label in accordance with applicable electoral laws;
•	In jurisdictions where AI disclosure in political advertising is legally mandated, you are solely responsible for compliance.

5. Prohibited Misuse of Outputs

You may not:

•	Publish Outputs in a manner designed to deceive viewers about whether the content is real or AI-generated;
•	Remove or circumvent MyAvatar's watermarking or provenance metadata;
•	Use Outputs in contexts where the absence of disclosure could cause material harm (e.g., fabricated news, fraud, evidence manipulation);
•	Represent AI-generated Outputs as authentic evidence in legal, regulatory, or judicial proceedings.

6. Content Authenticity and Verification

MyAvatar participates in and supports the Content Authenticity Initiative (CAI) and the Coalition for Content Provenance and Authenticity (C2PA). Where technically feasible, Outputs include signed C2PA manifests that allow any viewer to independently verify:

•	That the content was AI-generated;
•	The date and time of generation;
•	The platform and model used; and
•	Whether the content has been altered after generation.

7. Complaints and Enforcement

If you become aware of MyAvatar-generated content being distributed without appropriate disclosure, please report it to:

•	Email: studio@myavatar.co.za
•	Subject: "Undisclosed AI Content Report"

Users who violate this Disclosure Policy are subject to account suspension, content removal, and legal action in accordance with our Acceptable Use Policy and Terms of Service.




8. Policy Updates

This Disclosure Policy will be updated as regulatory requirements evolve globally. We commit to monitoring and responding to changes in the AI content disclosure regulatory landscape, including new guidance from the EU AI Office, FTC, and other bodies.`;

const ipOwnershipPolicyText = `MyAvatar
Intellectual Property & Avatar Ownership Policy
Effective Date: 1 May 2025
Version: 1.0
Governing Entity: MyAvatar (Pty) Ltd
Contact: studio@myavatar.co.za


1. Purpose

This Intellectual Property & Avatar Ownership Policy clarifies who owns what when you use MyAvatar to create AI Avatars, what rights you receive to the Outputs, what rights MyAvatar retains, and what you can and cannot do with the content you generate.

We believe in clarity: you should know exactly what you own before you publish, commercialise, or share your Avatar content.

2. Ownership of Input Content

2.1 Your Content

You retain full ownership of all original content you upload to the Service, including source photographs, video recordings, voice samples, scripts, and any other materials you provide ("Input Content").

2.2 Licence to MyAvatar

By uploading Input Content, you grant MyAvatar a limited, non-exclusive, royalty-free licence to process, reproduce, and modify your Input Content solely for the purpose of providing the requested Service to you. This licence does not permit MyAvatar to use your Input Content for any other purpose without your separate consent.

3. Ownership of AI-Generated Outputs

3.1 General Rule

Subject to your compliance with these Terms and payment of applicable credits, you own the creative Outputs you generate using the MyAvatar Service. "Output" means the final rendered video or asset delivered to you.


3.2 Licence Grant to You

MyAvatar grants you a perpetual, worldwide, royalty-free, non-exclusive licence to use, reproduce, display, distribute, and create derivative works from your Outputs for both personal and commercial purposes, subject to the restrictions set out in Section 5.

3.3 Limitations on Ownership Claim

MyAvatar makes no representation that AI-generated Outputs are eligible for copyright protection in every jurisdiction. In some jurisdictions, copyright law may not protect content that lacks sufficient human authorship. You are responsible for obtaining independent legal advice regarding the copyright status of Outputs in your jurisdiction.

4. MyAvatar's Retained Rights

4.1 Technology and Platform

MyAvatar owns all intellectual property rights in:

•	The AI models, neural rendering technology, and algorithms used to generate Avatars;
•	The underlying Avatar model architecture (as distinct from your personalised Avatar Model);
•	The MyAvatar platform, interface, branding, and proprietary tooling;
•	All improvements, developments, and derivative works of MyAvatar's technology.

4.2 Anonymised Data

MyAvatar may retain and use aggregated, anonymised, de-identified data derived from rendering operations to improve our AI systems. This data does not identify you individually and is not subject to the ownership restrictions in this policy.

4.3 Opt-In Training Data

If you choose to participate in our optional model improvement programme, you grant MyAvatar an additional licence to use your Likeness Data and Outputs as training data, on terms described in the opt-in consent form.

5. What You Can Do With Outputs

With the licence granted in Section 3.2, you may:

•	Use Outputs in your own personal or professional video content;
•	Publish Outputs on social media, YouTube, TikTok, and other platforms (subject to those platforms' terms);
•	Use Outputs in commercial advertising, marketing, and corporate presentations;
•	Broadcast Outputs on television, streaming platforms, or at live events;
•	License Outputs to third parties as part of your creative work or service delivery.

6. What You Cannot Do With Outputs

You may not:

•	Claim that Outputs were produced entirely by human effort without AI, in any context where that claim would be material or deceptive;
•	Resell or sublicense raw Avatar Models (the trained AI model of a person's likeness) as a standalone product;
•	Use Outputs to misrepresent the identity or statements of any real person (see Acceptable Use Policy);
•	Remove watermarks, C2PA provenance data, or any MyAvatar attribution embedded in Outputs;
•	Use Outputs to train competing AI systems or commercial AI models without prior written agreement with MyAvatar;
•	Use Outputs in violation of any applicable law, including defamation, privacy, intellectual property, or consumer protection laws.

7. Third-Party Intellectual Property

You are solely responsible for ensuring that:

•	Any music, text, images, or other third-party content included in your rendering inputs does not infringe third-party intellectual property rights;
•	You hold the necessary licences, permissions, and consents for all third-party content used alongside MyAvatar Outputs; and
•	Your Outputs do not infringe any trade mark, copyright, publicity right, or other proprietary right of any third party.

MyAvatar accepts no liability for third-party IP infringement arising from your Outputs.

8. Personalised Avatar Model Ownership

Your personalised Avatar Model (the trained digital representation derived from your Likeness Data) is linked to your account. Key points:

•	The Avatar Model is stored securely in your account and may not be transferred, exported, or commercialised as a standalone asset without a separate Enterprise Agreement;
•	You may delete your Avatar Model at any time via your account settings;
•	Upon account deletion or expiry, your Avatar Model is deleted in accordance with the Biometric Data & Likeness Policy.

9. Feedback and Suggestions

If you submit feedback, feature requests, or ideas to MyAvatar, you acknowledge that MyAvatar may use such feedback for any purpose without compensation or attribution to you, and such feedback will not be treated as confidential.

10. Disputes

Any intellectual property disputes shall be resolved in accordance with the governing law and dispute resolution provisions of MyAvatar's Terms of Service. For IP-related enquiries, contact studio@myavatar.co.za.`;

const cookiePolicyText = `MyAvatar
Cookie Policy
Effective Date: 1 May 2025
Version: 1.0
Governing Entity: MyAvatar (Pty) Ltd
Contact: studio@myavatar.co.za


1. Introduction

This Cookie Policy explains how MyAvatar (Pty) Ltd uses cookies and similar tracking technologies on our website and platform (myavatar.co.za). This policy is designed to comply with the GDPR, EU ePrivacy Directive, and equivalent laws in other jurisdictions.

By clicking "Accept All" on our cookie banner, you consent to our use of cookies as described in this policy.

2. What Are Cookies?

Cookies are small text files placed on your device when you visit a website. They allow the website to recognise your device on subsequent visits and remember information about your preferences and interactions. Similar technologies include:

•	Local Storage and Session Storage: Browser-based storage mechanisms used to retain data between sessions;
•	Pixel Tags / Web Beacons: Tiny image files that track user interactions with emails or web pages;
•	Device Fingerprinting: Technical methods of identifying devices based on browser and hardware characteristics.

3. Categories of Cookies We Use

3.1 Strictly Necessary Cookies

These cookies are essential for the platform to function and cannot be switched off. They are set in response to your actions (e.g., logging in, setting privacy preferences, completing payments).

•	Session authentication cookies;
•	CSRF protection tokens;
•	Load balancing and security cookies.

Legal basis: Legitimate interest / essential to service delivery. No consent required.

3.2 Functional Cookies

These cookies enable enhanced features and personalisation, such as remembering your language preference, rendering quality settings, and account preferences.

Legal basis: Consent (where required).

3.3 Analytics Cookies

These cookies allow us to understand how visitors interact with our platform, enabling us to improve performance and user experience. We currently use:

•	Hotjar (session recording and heatmaps — opt-in only).

Legal basis: Consent.

3.4 Marketing and Advertising Cookies

These cookies track your browsing activity across websites to enable relevant advertising and measure campaign effectiveness. Third parties (such as Google Ads and Meta Pixel) may set these cookies.

Legal basis: Consent.

3.5 Third-Party Cookies

Some third-party services integrated into our platform may set their own cookies. We do not control these cookies. Please refer to those third parties' privacy policies for details.

4. Cookie Retention Periods

•	Session Cookies: Deleted when you close your browser.
•	Persistent Cookies: Retained for periods ranging from 30 days (analytics) to 2 years (marketing preferences), depending on the specific cookie.

5. Managing Your Cookie Preferences

5.1 Browser Settings

Most browsers allow you to refuse cookies or delete cookies already stored. Browser-based cookie management typically covers:

•	Chrome: Settings > Privacy and Security > Cookies;
•	Firefox: Settings > Privacy & Security;
•	Safari: Preferences > Privacy;
•	Edge: Settings > Cookies and Site Permissions.

Please note that disabling cookies may affect the functionality of the MyAvatar platform.

5.2 Opt-Out Tools

•	Google Analytics: tools.google.com/dlpage/gaoptout
•	Your Online Choices (EU): youronlinechoices.eu
•	Digital Advertising Alliance (USA): optout.aboutads.info

6. Do Not Track

Some browsers include a "Do Not Track" (DNT) feature. Our platform currently does not respond to DNT signals, as there is no uniform standard for how websites should respond.

7. Updates to This Policy

We may update this Cookie Policy as our use of cookies evolves or as regulations change. We will notify you of material changes through a cookie banner notice or email.

8. Contact

•	Email: studio@myavatar.co.za`;

const subProcessorPolicyText = `MyAvatar
Sub-Processor Policy
Effective Date: 1 May 2025
Version: 1.0
Governing Entity: MyAvatar (Pty) Ltd
Contact: studio@myavatar.co.za


1. Introduction

In providing the MyAvatar Service, we engage certain third-party companies ("Sub-Processors") who process personal data on our behalf. This Sub-Processor Policy is provided in accordance with GDPR Article 28(3)(d) and equivalent provisions under other data protection laws.

All Sub-Processors are required to enter into data processing agreements (DPAs) with MyAvatar and are bound by obligations no less protective than those we commit to under our Privacy Policy.

2. Sub-Processor Selection and Due Diligence

Before engaging any Sub-Processor, MyAvatar conducts due diligence to assess:

•	Technical and organisational security measures;
•	Data protection compliance and certifications (e.g., ISO 27001, SOC 2 Type II);
•	Data residency and international transfer safeguards; and
•	Incident response and breach notification procedures.

3. Current Sub-Processors

The following table lists our current Sub-Processors, the nature of processing, and the location of processing:

3.1 Core Platform Infrastructure

•	Supabase — Database, authentication, storage, and serverless functions — Regional cloud infrastructure (project-configured region)

3.2 Payment Processing

•	Paystack — Payment processing and transaction verification — South Africa / regional infrastructure

3.3 Analytics and Monitoring

•	Hotjar — Website analytics, session insights, and UX monitoring (where enabled) — EU/Global infrastructure

3.4 Email and Communications

•	SendGrid (Twilio) — Transactional email delivery — USA

4. International Transfers

Several of our Sub-Processors are located in countries outside the EEA. We ensure lawful transfer through:

•	EU Standard Contractual Clauses (SCCs, 2021 version) incorporated into all relevant DPAs;
•	Adequacy decisions where applicable; and
•	Transfer Impact Assessments (TIAs) conducted for Sub-Processors in high-risk jurisdictions.

5. Notification of Sub-Processor Changes

We will provide at least 30 days' prior written notice to Enterprise customers before engaging a new Sub-Processor or making material changes to an existing Sub-Processor's role. Notice will be provided via:

•	Email to your registered account address; and/or
•	In-platform notifications for material changes.

Free and standard tier users are subject to reasonable notice via our policy update mechanism.
6. Objection Rights (GDPR)

Enterprise customers who have executed a Data Processing Agreement with MyAvatar may object to the addition of a new Sub-Processor within the 30-day notice period by emailing studio@myavatar.co.za. We will work in good faith to accommodate objections, though we cannot guarantee that all objections can be accommodated without affecting Service delivery.

7. Data Processing Agreements

Enterprise customers may request a copy of MyAvatar's standard Data Processing Agreement (DPA) by contacting studio@myavatar.co.za. The DPA governs:

•	Scope and nature of processing;
•	Sub-processor obligations;
•	Data subject rights assistance;
•	Security and incident notification requirements; and
•	Audit rights.

8. Contact

•	Email: studio@myavatar.co.za
•	Subject: "Sub-Processor Enquiry"`;

const dmcaPolicyText = `MyAvatar
DMCA & Copyright Takedown Policy
Effective Date: 1 May 2025
Version: 1.0
Governing Entity: MyAvatar (Pty) Ltd
Contact: studio@myavatar.co.za


1. Introduction

MyAvatar respects intellectual property rights and expects users of our platform to do the same. This DMCA & Copyright Takedown Policy describes our process for receiving, evaluating, and acting on notices of alleged copyright infringement in accordance with the Digital Millennium Copyright Act (DMCA), 17 U.S.C. § 512, and equivalent international copyright frameworks.

2. Reporting Copyright Infringement

If you believe that content generated through or hosted on the MyAvatar platform infringes your copyright, please submit a written notice to our designated Copyright Agent containing the following:

•	A physical or electronic signature of the copyright owner or a person authorised to act on their behalf;
•	A description of the copyrighted work that you claim has been infringed;
•	A description of the allegedly infringing material and sufficient information for us to locate it (e.g., URL or Job ID);
•	Your contact information, including your name, address, telephone number, and email address;
•	A statement that you have a good faith belief that the disputed use is not authorised by the copyright owner, their agent, or the law;
•	A statement, made under penalty of perjury, that the information in your notice is accurate and that you are the copyright owner or are authorised to act on behalf of the copyright owner.

3. Copyright Agent Contact Details

•	Email: studio@myavatar.co.za
•	Subject Line: "DMCA Takedown Notice"

Please note that notices submitted via channels other than those above may not receive the attention or legal protection that a properly submitted DMCA notice receives.


4. Our Response to Takedown Notices

Upon receipt of a valid takedown notice, MyAvatar will:

•	Promptly review the notice for completeness and validity;
•	Remove or disable access to the allegedly infringing content as soon as reasonably practicable;
•	Notify the user who uploaded or generated the content of the takedown;
•	Maintain records of the notice in accordance with our legal obligations; and
•	Where applicable, terminate the accounts of repeat infringers.

5. Counter-Notice Procedure

If you believe your content was removed or disabled as a result of a mistake or misidentification, you may submit a counter-notice to our Copyright Agent containing:

•	Your physical or electronic signature;
•	Identification of the material that was removed and its location before removal;
•	A statement under penalty of perjury that you have a good faith belief that the material was removed by mistake or misidentification;
•	Your name, address, telephone number, and email address; and
•	A statement that you consent to jurisdiction in the applicable court and will accept service of process from the original complainant.

Upon receipt of a valid counter-notice, we will provide a copy to the original complainant and may restore the content within 10–14 business days unless the complainant files a court action.

6. Repeat Infringer Policy

MyAvatar has a policy of terminating, in appropriate circumstances, the accounts of users who repeatedly infringe copyright. We will evaluate repeat infringement based on the number, nature, and validity of takedown notices received against a particular account.

7. AI-Generated Content and Copyright

MyAvatar acknowledges that the copyright status of AI-generated content is an evolving area of law. We note the following:

•	AI-generated content may or may not attract copyright protection depending on the jurisdiction and the degree of human creative input;
•	MyAvatar is not responsible for any third-party intellectual property rights that may be reflected in AI Outputs due to training data;
•	Users are responsible for ensuring their use of Outputs does not infringe third-party rights.

If you believe that MyAvatar's underlying AI models were trained on your copyrighted content and that this constitutes infringement, please contact studio@myavatar.co.za with the subject "AI Training Data Copyright Enquiry." We will review such enquiries on a case-by-case basis.

8. Misrepresentation

Please be aware that knowingly misrepresenting that content is infringing or that content was removed by mistake may expose you to civil liability under the DMCA, including damages, costs, and attorneys' fees.

9. Contact

•	Copyright Agent Email: studio@myavatar.co.za
•	General Legal: studio@myavatar.co.za
•	Response Time: Within 5 business days for valid notices`;

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
    id: "biometric-data-likeness-policy",
    title: "Biometric Data & Likeness Policy",
    content: biometricPolicyText.split("\n\n"),
  },
  {
    id: "privacy-policy",
    title: "Privacy Policy",
    content: privacyPolicyText.split("\n\n"),
  },
  {
    id: "ai-generated-content-disclosure-policy",
    title: "AI-Generated Content Disclosure Policy",
    content: aiDisclosurePolicyText.split("\n\n"),
  },
  {
    id: "intellectual-property-avatar-ownership-policy",
    title: "Intellectual Property & Avatar Ownership Policy",
    content: ipOwnershipPolicyText.split("\n\n"),
  },
  {
    id: "cookie-policy",
    title: "Cookie Policy",
    content: cookiePolicyText.split("\n\n"),
  },
  {
    id: "sub-processor-policy",
    title: "Sub-Processor Policy",
    content: subProcessorPolicyText.split("\n\n"),
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
  {
    id: "dmca-copyright-takedown-policy",
    title: "DMCA & Copyright Takedown Policy",
    content: dmcaPolicyText.split("\n\n"),
  },
];

const Policies = () => {
  const defaultPolicy = policySections[0]?.id ?? "";
  const [selectedPolicyId, setSelectedPolicyId] = useState(defaultPolicy);
  const selectedPolicy = useMemo(
    () => policySections.find((policy) => policy.id === selectedPolicyId) ?? policySections[0],
    [selectedPolicyId],
  );

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
              Review all policy documents below. Use the selector to view each policy.
            </p>

            <div className="space-y-6">
              <div className="max-w-xl">
                <Select value={selectedPolicyId} onValueChange={setSelectedPolicyId}>
                  <SelectTrigger className="h-11 rounded-xl bg-muted/60 border-border text-foreground">
                    <SelectValue placeholder="Select a policy" />
                  </SelectTrigger>
                  <SelectContent>
                    {policySections.map((policy) => (
                      <SelectItem key={policy.id} value={policy.id}>
                        {policy.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedPolicy && (
                <div className="glass-card p-6 md:p-8 space-y-4">
                  <h2 className="font-display text-2xl font-semibold text-foreground">
                    {selectedPolicy.title}
                  </h2>
                  {selectedPolicy.content.map((paragraph, idx) => (
                    <p key={`${selectedPolicy.id}-${idx}`} className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Policies;
