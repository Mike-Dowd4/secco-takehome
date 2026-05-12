"use client";

// Component to display a date string in the client's local timezone and format
// Otherwise, on depploy the date will be the server's datetime rather than the client's
export default function ClientDate({ date }: { date: string }) {
  const clientDate = new Date(date);

  return (
    <>
      <span>{clientDate.toLocaleString()}</span>
    </>
  );
}
