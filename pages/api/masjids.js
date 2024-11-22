export default async function handler(req, res) {
  const { lat, lng } = req.query;

  // Query Overpass API for masjids near the location
  const query = `
    [out:json];
    node
      [amenity=place_of_worship]
      ["religion"="muslim"]
      (around:5000,${lat},${lng});
    out body;
  `;

  const response = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    body: query,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  const data = await response.json();

  // Extract relevant details
  const masjids = data.elements.map((element) => ({
    name: element.tags.name || "Unnamed Masjid",
    address: element.tags["addr:full"] || "No address available",
  }));

  res.status(200).json(masjids);
}
