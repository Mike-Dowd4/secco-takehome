import Link from "next/link";

export default function LeadFormButton() {
  return (
    <div className="flex justify-center mt-4">
      <Link
        href="/"
        className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
      >
        Input Leads
      </Link>
    </div>
  );
}
