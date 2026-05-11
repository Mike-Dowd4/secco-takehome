import LeadForm from '@/components/LeadForm';

export default function Page() {
  return (
    <main className="mx-auto max-w-xl p-8">
      <h1 className="mb-2 text-2xl font-bold">Lead Capture</h1>
      <p className="mb-6 text-gray-600">
        Fill out the form below and we will follow up with you.
      </p>

      <LeadForm />
    </main>
  );
}