import { getLeads } from '@/lib/leads';
import { Lead } from '@/types/lead';

// Force dynamic rendering and disable caching for this page
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function LeadsPage() {
    const { data: leads, error } = await getLeads();

    if (error) {
    console.error('Error loading leads:', error);

    return (
        <main className="p-8">
        <h1 className="text-2xl font-semibold">Leads</h1>
        <p className="mt-4 text-red-600">Could not load leads.</p>
        </main>
    );
    }
    return (
        <main className="p-8">
        <h1 className="mb-6 text-2xl font-semibold text-center">Submitted Leads</h1>

        <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-gray-100 text-black text-center">
            <tr>
                <th className="border-b px-4 py-3">Name</th>
                <th className="border-b px-4 py-3">Email</th>
                <th className="border-b px-4 py-3">Company</th>
                <th className="border-b px-4 py-3">Source</th>
                <th className="border-b px-4 py-3">Submitted Date</th>
            </tr>
            </thead>

            <tbody>
            {leads && leads.length > 0 ? (
                leads.map((lead: Lead) => (
                <tr key={lead.id} className="text-center">
                    <td className="border-b px-4 py-3">{lead.full_name}</td>
                    <td className="border-b px-4 py-3">{lead.email}</td>
                    <td className="border-b px-4 py-3">
                    {lead.company || '-'}
                    </td>
                    <td className="border-b px-4 py-3">{lead.hear_about_us}</td>
                    <td className="border-b px-4 py-3">
                    {new Date(lead.created_at).toLocaleString()}
                    </td>
                </tr>
                ))
            ) : (
                <tr>
                <td className="px-4 py-6 text-gray-500" colSpan={5}>
                    No leads submitted yet.
                </td>
                </tr>
            )}
            </tbody>
        </table>
        </div>
    </main>
    );
}