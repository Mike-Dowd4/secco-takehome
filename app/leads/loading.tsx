export default function LoadingLeads() {
  return (
    <main className="p-8">
      <h1 className="mb-6 text-center text-2xl font-semibold">
        Submitted Leads
      </h1>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-gray-100 text-center text-black">
            <tr>
              <th className="border-b px-4 py-3">Name</th>
              <th className="border-b px-4 py-3">Email</th>
              <th className="border-b px-4 py-3">Company</th>
              <th className="border-b px-4 py-3">Source</th>
              <th className="border-b px-4 py-3">Submitted Date</th>
            </tr>
          </thead>

          <tbody>
            {[1, 2, 3, 4, 5].map((row) => (
              <tr key={row} className="text-center">
                <td className="border-b px-4 py-3">
                  <div className="mx-auto h-4 w-24 animate-pulse rounded bg-gray-200" />
                </td>
                <td className="border-b px-4 py-3">
                  <div className="mx-auto h-4 w-40 animate-pulse rounded bg-gray-200" />
                </td>
                <td className="border-b px-4 py-3">
                  <div className="mx-auto h-4 w-28 animate-pulse rounded bg-gray-200" />
                </td>
                <td className="border-b px-4 py-3">
                  <div className="mx-auto h-4 w-20 animate-pulse rounded bg-gray-200" />
                </td>
                <td className="border-b px-4 py-3">
                  <div className="mx-auto h-4 w-36 animate-pulse rounded bg-gray-200" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}