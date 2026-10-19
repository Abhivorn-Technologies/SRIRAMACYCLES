import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import {
  Shield,
  Lock,
  FileText,
  Mail,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  UserCheck,
  Database,
  Eye,
  Trash2,
  HelpCircle,
  Building,
} from 'lucide-react';
import { STORE_CONTACT, APP_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Privacy Policy | DPDP Act 2023 Compliant',
  description:
    'Comprehensive DPDPA-compliant Privacy Policy for Sri Rama Cycle & Auto Spare Parts. Learn how your personal data is collected, processed, protected, and your rights under the Digital Personal Data Protection Act, 2023.',
};

export default function PrivacyPolicyPage() {
  const lastUpdated = 'October 19, 2026';
  const effectiveDate = 'October 19, 2026';

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-6 font-medium">
          <Link href="/" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-slate-900 dark:text-white font-semibold">Privacy Policy</span>
        </nav>

        {/* Header Hero */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-slate-800 shadow-sm mb-10">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <Shield className="w-3.5 h-3.5" />
              DPDP Act, 2023 Compliant
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-400 border border-brand-200 dark:border-brand-800">
              <Clock className="w-3.5 h-3.5" />
              Last Updated: {lastUpdated}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-slate-950 dark:text-white tracking-tight leading-tight">
            Privacy Policy & Data Protection Notice
          </h1>
          
          <p className="mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Welcome to <strong>{STORE_CONTACT.businessName}</strong>. This Privacy Policy is formulated in strict accordance with the <strong>Digital Personal Data Protection Act, 2023 (DPDP Act, 2023)</strong> of India, the Information Technology Act, 2000, and applicable e-commerce guidelines. It outlines how we, as a Data Fiduciary, collect, process, store, and safeguard your digital personal data when you visit our website, register an account, or purchase bicycles and auto spare parts.
          </p>

          <div className="mt-6 p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900 text-amber-900 dark:text-amber-200 text-xs sm:text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Your Consent Matters:</strong> By accessing our website, creating an account, or placing an order, you confirm that you have read, understood, and consented to the collection and processing of your personal data as described in this notice. You reserve the right to withdraw your consent at any time.
            </p>
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-10">

          {/* 1. Data Fiduciary Details */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 flex items-center justify-center shrink-0">
                <Building className="w-5 h-5" />
              </div>
              <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white">
                1. Identity of the Data Fiduciary
              </h2>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Under the Digital Personal Data Protection Act, 2023, the <strong>Data Fiduciary</strong> responsible for determining the purpose and means of processing your personal data is:
            </p>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 text-xs sm:text-sm space-y-1.5">
              <p><strong>Business Name:</strong> {STORE_CONTACT.businessName}</p>
              <p><strong>Proprietor:</strong> {STORE_CONTACT.proprietor}</p>
              <p><strong>Registered Address:</strong> {STORE_CONTACT.address}</p>
              <p><strong>Support Email:</strong> <a href={`mailto:${STORE_CONTACT.supportEmail}`} className="text-brand-600 dark:text-brand-400 font-semibold hover:underline">{STORE_CONTACT.supportEmail}</a></p>
              <p><strong>Phone / Helpline:</strong> <a href={`tel:${STORE_CONTACT.rawPhone}`} className="text-brand-600 dark:text-brand-400 font-semibold hover:underline">{STORE_CONTACT.phone}</a></p>
            </div>
          </section>

          {/* 2. Personal Data We Collect */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 flex items-center justify-center shrink-0">
                <Database className="w-5 h-5" />
              </div>
              <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white">
                2. Categories of Personal Data Collected
              </h2>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              We collect only the minimum personal data necessary to provide our cycle store services, fulfill deliveries, and comply with statutory laws:
            </p>
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-1" />
                <div>
                  <strong className="text-slate-900 dark:text-white">Contact & Identity Data:</strong> Full name, telephone/mobile number, email address, and delivery/billing address.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-1" />
                <div>
                  <strong className="text-slate-900 dark:text-white">Account Authentication Data:</strong> Encrypted password hashes (using industry-standard bcrypt) and account preferences. We never store plain-text passwords.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-1" />
                <div>
                  <strong className="text-slate-900 dark:text-white">Order & Transactional Data:</strong> Cycles and spare parts purchased, order dates, payment statuses, GST invoice records, and delivery tracking details.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-1" />
                <div>
                  <strong className="text-slate-900 dark:text-white">Payment Information:</strong> Handled securely by RBI-authorized payment aggregator <em>Razorpay</em>. We do <strong>not</strong> collect or store credit/debit card numbers, CVVs, or UPI PINs on our servers.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-1" />
                <div>
                  <strong className="text-slate-900 dark:text-white">Technical & Usage Data:</strong> IP address, device type, browser information, and session cookies used for shopping cart maintenance and security.
                </div>
              </li>
            </ul>
          </section>

          {/* 3. Lawful Purposes for Processing */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white">
                3. Purposes for Processing Personal Data
              </h2>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              In accordance with Section 4 and Section 6 of the DPDP Act 2023, your personal data is collected and processed solely for specified, explicit, and lawful purposes:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
                <strong className="text-slate-900 dark:text-white block mb-1">Order Fulfillment & Assembly:</strong>
                Processing your bicycle orders, assembly tuning, dispatching via courier/local delivery, and door-step delivery.
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
                <strong className="text-slate-900 dark:text-white block mb-1">Customer Communication:</strong>
                Sending order confirmations, tracking updates via SMS/WhatsApp/Email, and responding to service requests.
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
                <strong className="text-slate-900 dark:text-white block mb-1">Invoicing & Tax Compliance:</strong>
                Generating valid GST tax invoices, accounting records, and complying with Indian commercial tax laws.
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
                <strong className="text-slate-900 dark:text-white block mb-1">Warranty & Repairs:</strong>
                Tracking manufacturer warranty claims for cycle frames, gear systems, disc brakes, and spare parts.
              </div>
            </div>
          </section>

          {/* 4. Third-Party Data Processors */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white">
                4. Third-Party Service Providers (Data Processors)
              </h2>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              We do not sell, rent, or trade your personal information. We only share personal data with trusted third-party Data Processors bound by contractual privacy and security obligations:
            </p>
            <div className="space-y-2.5 text-xs sm:text-sm">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3">
                <span className="font-bold text-brand-600 shrink-0">Razorpay:</span>
                <span>Payment gateway aggregator for processing UPI, credit/debit cards, and net banking payments under PCI-DSS Level 1 compliance.</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3">
                <span className="font-bold text-brand-600 shrink-0">MongoDB Atlas:</span>
                <span>Encrypted cloud database storage with enterprise-grade encryption at rest and in transit.</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3">
                <span className="font-bold text-brand-600 shrink-0">Logistics & Courier Partners:</span>
                <span>Local and national delivery partners who receive solely the customer name, address, and phone number required for delivery.</span>
              </div>
            </div>
          </section>

          {/* 5. Data Retention & Erasure */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white">
                5. Data Retention and Deletion Practices
              </h2>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Under Section 8(7) of the DPDP Act 2023, personal data will not be retained longer than necessary to fulfill the specified purpose for which it was collected, or as mandated by law:
            </p>
            <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-300 space-y-2">
              <li><strong>Order and Tax Records:</strong> Retained for a minimum of 7 years in accordance with Indian commercial tax, GST, and statutory accounting requirements.</li>
              <li><strong>User Account Information:</strong> Maintained until the user requests account deletion, provided there are no active orders or outstanding liabilities.</li>
              <li><strong>Inquiry & Contact Messages:</strong> Retained for up to 12 months from resolution to facilitate follow-up customer care.</li>
            </ul>
          </section>

          {/* 6. Your Rights under DPDP Act 2023 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 flex items-center justify-center shrink-0">
                <UserCheck className="w-5 h-5" />
              </div>
              <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white">
                6. Rights of Data Principals (Your Rights)
              </h2>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              As a Data Principal under the Digital Personal Data Protection Act, 2023, you have the following enforceable rights:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-1">
                  <Eye className="w-4 h-4 text-brand-600" />
                  Right to Access Information
                </div>
                <p className="text-slate-600 dark:text-slate-300">You may request a summary of the personal data processed by us and the identities of data processors involved.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-1">
                  <CheckCircle className="w-4 h-4 text-brand-600" />
                  Right to Correction & Updating
                </div>
                <p className="text-slate-600 dark:text-slate-300">You may request correction of inaccurate or incomplete personal data held in your account.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-1">
                  <Trash2 className="w-4 h-4 text-brand-600" />
                  Right to Erasure
                </div>
                <p className="text-slate-600 dark:text-slate-300">You may request deletion of personal data when the purpose is fulfilled and legal retention is no longer mandatory.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-1">
                  <AlertCircle className="w-4 h-4 text-brand-600" />
                  Right to Withdraw Consent
                </div>
                <p className="text-slate-600 dark:text-slate-300">You have the right to withdraw your consent at any time. Withdrawal does not affect lawful processing conducted prior to withdrawal.</p>
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              To exercise any of these rights, email your request to <a href={`mailto:${STORE_CONTACT.supportEmail}`} className="text-brand-600 dark:text-brand-400 font-semibold underline">{STORE_CONTACT.supportEmail}</a> with the subject line <em>"DPDP Data Subject Request"</em>.
            </p>
          </section>

          {/* 7. Children's Data */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white">
                7. Protection of Children's Personal Data
              </h2>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              In adherence to Section 9 of the DPDP Act 2023, we do not knowingly collect or process personal data of children under the age of 18 without verifiable parental or lawful guardian consent. While we sell junior and kids bicycles, all purchases must be made by an adult parent or guardian. We do not track or engage in targeted advertising directed at minors.
            </p>
          </section>

          {/* 8. Technical & Security Safeguards */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white">
                8. Technical & Organizational Security Measures
              </h2>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              We implement comprehensive security measures in compliance with Section 8(5) of the DPDP Act 2023 to prevent personal data breaches:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 text-center">
                <div className="font-bold text-slate-900 dark:text-white mb-1">HTTPS / TLS 1.3</div>
                <div className="text-slate-600 dark:text-slate-300 text-xs">All web traffic encrypted in transit via SSL/TLS.</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 text-center">
                <div className="font-bold text-slate-900 dark:text-white mb-1">Bcrypt Salt Hashing</div>
                <div className="text-slate-600 dark:text-slate-300 text-xs">Passwords stored with salted one-way hashes.</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 text-center">
                <div className="font-bold text-slate-900 dark:text-white mb-1">Access Control</div>
                <div className="text-slate-600 dark:text-slate-300 text-xs">Strict role-based least privilege administrative access.</div>
              </div>
            </div>
          </section>

          {/* 9. Grievance Redressal Mechanism */}
          <section className="space-y-4 bg-brand-50/50 dark:bg-brand-950/20 p-6 rounded-2xl border border-brand-200 dark:border-brand-900">
            <div className="flex items-center gap-3 border-b border-brand-200/70 dark:border-brand-900/60 pb-3">
              <div className="w-9 h-9 rounded-xl bg-brand-600 text-white flex items-center justify-center shrink-0">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white">
                  9. Grievance Redressal Officer
                </h2>
                <p className="text-xs text-brand-700 dark:text-brand-300 font-medium">
                  Statutory requirement under Section 6(2)(c) & Section 13 of DPDP Act 2023
                </p>
              </div>
            </div>
            
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              If you have any questions, complaints, or grievances regarding the processing of your personal data or this Privacy Policy, please contact our designated Grievance Officer:
            </p>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-brand-200/80 dark:border-brand-800 text-xs sm:text-sm space-y-2">
              <p><strong>Designated Officer:</strong> {STORE_CONTACT.proprietor}</p>
              <p><strong>Entity:</strong> {STORE_CONTACT.businessName}</p>
              <p><strong>Office Address:</strong> {STORE_CONTACT.address}</p>
              <p><strong>Email:</strong> <a href={`mailto:${STORE_CONTACT.supportEmail}`} className="text-brand-600 font-bold hover:underline">{STORE_CONTACT.supportEmail}</a></p>
              <p><strong>Phone:</strong> <a href={`tel:${STORE_CONTACT.rawPhone}`} className="text-brand-600 font-bold hover:underline">{STORE_CONTACT.phone}</a></p>
              <p><strong>Resolution Timeline:</strong> Grievances will be acknowledged within 48 hours and resolved within 30 days as stipulated by law.</p>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              If you are not satisfied with the resolution provided by our Grievance Officer, you have the right under the DPDP Act, 2023 to appeal to the <strong>Data Protection Board of India (DPBI)</strong>.
            </p>
          </section>

          {/* 10. Policy Updates */}
          <section className="space-y-3 pt-2">
            <h2 className="text-base sm:text-lg font-black text-slate-950 dark:text-white">
              10. Changes and Updates to this Policy
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              We may update this Privacy Policy from time to time to reflect operational, legal, or regulatory requirements. Any modifications will be posted on this page with an updated "Last Updated" date. Continued use of our store after changes constitutes acceptance of the updated terms.
            </p>
          </section>

        </div>

        {/* Quick Links Card */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs sm:text-sm">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Related Legal Documents:</span>
          <div className="flex flex-wrap items-center gap-4 font-bold text-brand-600 dark:text-brand-400">
            <Link href="/terms-and-conditions" className="hover:underline">Terms & Conditions</Link>
            <span>•</span>
            <Link href="/refund-policy" className="hover:underline">Refund & Cancellation</Link>
            <span>•</span>
            <Link href="/cookie-policy" className="hover:underline">Cookie Policy</Link>
            <span>•</span>
            <Link href="/contact" className="hover:underline">Contact Support</Link>
          </div>
        </div>

      </div>
    </div>
  );
}
