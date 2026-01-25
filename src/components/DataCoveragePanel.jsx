export default function DataCoveragePanel() {
  return (
    <div className="mt-4 rounded-md border bg-gray-50 p-3 text-sm">
      <h4 className="mb-2 font-medium text-gray-800">
        Data Coverage
      </h4>

      <ul className="space-y-1 text-gray-700">
        <li>✔ Followers: Available</li>
        <li>✔ Engagement Rate: Available</li>
        <li>✖ Audience Demographics: Not Available</li>
        <li>✖ Private Analytics: Not Available</li>
      </ul>

      <p className="mt-3 text-xs text-gray-500">
        Audit is limited to the data listed above. Missing data is not inferred.
      </p>
    </div>
  );
}
