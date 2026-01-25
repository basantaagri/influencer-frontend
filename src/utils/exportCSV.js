export function exportToCSV(data, filename = "influencers.csv") {
  if (!Array.isArray(data) || data.length === 0) {
    alert("No data to export");
    return;
  }

  const headers = [
    "Username",
    "Platform",
    "Niche",
    "Followers",
    "Engagement Rate",
    "Price",
    "Audit Score",
  ];

  const rows = data.map((inf) => [
    inf.username,
    inf.platform,
    inf.niche,
    inf.followers,
    inf.engagement_rate,
    inf.price,
    inf.audit_score ?? "",
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((r) => r.join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
}
