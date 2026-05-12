import { getLeads } from "@/lib/leads";
import { Lead } from "@/types/lead";
import ClientDate from "./components/ClientDate";
import LeadFormButton from "./components/LeadFormButton";

const HEADER_COLUMN_STYLE_MOBILE = "text-xs text-gray-500 uppercase";
const HEADER_COLUMN_STYLE_DESKTOP = "border-b px-4 py-3";

// Force dynamic rendering and disable caching for this page
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function LeadsPage() {
  const { data: leads, error } = await getLeads();

  if (error) {
    console.error("Error loading leads:", error);

    return (
      <main className="p-4 md:p-8">
        <h1 className="text-xl md:text-2xl font-semibold">Leads</h1>
        <p className="mt-4 text-red-600">Could not load leads.</p>
      </main>
    );
  }
  return (
    <main className="p-4 md:p-8">
      <h1 className="mb-6 text-xl md:text-2xl font-semibold text-center">
        Submitted Leads
      </h1>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {leads && leads.length > 0 ? (
          leads.map((lead: Lead) => (
            <div
              key={lead.id}
              className="border border-gray-200 rounded-lg p-4 space-y-3"
            >
              <div>
                <p className={HEADER_COLUMN_STYLE_MOBILE}>Name</p>
                <p className="font-semibold text-sm">{lead.full_name}</p>
              </div>
              <div>
                <p className={HEADER_COLUMN_STYLE_MOBILE}>Email</p>
                <p className="text-sm break-all">{lead.email}</p>
              </div>
              <div>
                <p className={HEADER_COLUMN_STYLE_MOBILE}>Company</p>
                <p className="text-sm">{lead.company || "-"}</p>
              </div>
              <div>
                <p className={HEADER_COLUMN_STYLE_MOBILE}>Source</p>
                <p className="text-sm">{lead.hear_about_us}</p>
              </div>
              <div>
                <p className={HEADER_COLUMN_STYLE_MOBILE}>Submitted</p>
                <p className="text-sm">
                  <ClientDate date={lead.created_at} />
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-gray-500">
            No leads submitted yet.
          </div>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-gray-100 text-black text-center">
            <tr>
              <th className={HEADER_COLUMN_STYLE_DESKTOP}>Name</th>
              <th className={HEADER_COLUMN_STYLE_DESKTOP}>Email</th>
              <th className={HEADER_COLUMN_STYLE_DESKTOP}>Company</th>
              <th className={HEADER_COLUMN_STYLE_DESKTOP}>Source</th>
              <th className={HEADER_COLUMN_STYLE_DESKTOP}>Submitted Date</th>
            </tr>
          </thead>

          <tbody>
            {leads && leads.length > 0 ? (
              leads.map((lead: Lead) => (
                <tr key={lead.id} className="text-center">
                  <td className={HEADER_COLUMN_STYLE_DESKTOP}>
                    {lead.full_name}
                  </td>
                  <td className={HEADER_COLUMN_STYLE_DESKTOP}>{lead.email}</td>
                  <td className={HEADER_COLUMN_STYLE_DESKTOP}>
                    {lead.company || "-"}
                  </td>
                  <td className={HEADER_COLUMN_STYLE_DESKTOP}>
                    {lead.hear_about_us}
                  </td>
                  <td className={HEADER_COLUMN_STYLE_DESKTOP}>
                    <ClientDate date={lead.created_at} />
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

      <LeadFormButton />
    </main>
  );
}
