import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | Greymatters Eldercare Concierge',
  description: 'Everything you need to know about Care Buddy accompaniment, hospital OPD queues, medical emergency protocols, transparent pricing, and WhatsApp updates for families abroad.',
};

export default function FaqLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
