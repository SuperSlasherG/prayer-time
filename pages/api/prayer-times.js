export default async function handler(req, res) {
  const { city } = req.query;

  try {
    // Fetch latitude and longitude using city name from an external geocoding API
    const geoResponse = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${city}&key=YOUR_OPENCAGE_API_KEY`);
    const geoData = await geoResponse.json();
    if (geoData.results.length === 0) {
      return res.status(400).json({ error: "City not found" });
    }

    const { lat, lng } = geoData.results[0].geometry;

    // Now, fetch prayer times from the Aladhan API using the latitude and longitude
    const response = await fetch(`http://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lng}&method=2`);
    const data = await response.json();

    if (data.code === 200) {
      return res.status(200).json(data);
    } else {
      return res.status(400).json({ error: "Failed to fetch prayer times" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}
