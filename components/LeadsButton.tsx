import Link from "next/link";

export default function LeadsButton() {
  return (
    <div className="flex justify-center mt-4">
      <Link
        href="/leads"
        className=" md:absolute md:top-0 md:right-5 mt-4 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
      >
        View Leads
      </Link>
    </div>
  );
}
