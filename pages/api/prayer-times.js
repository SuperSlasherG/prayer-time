export default async function handler(req, res) {
  const { lat, lng } = req.query;

  try {
    // Step 1: Reverse geocoding to get the city and country name from coordinates
    const locationResponse = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
    );

    if (!locationResponse.ok) {
      return res
        .status(500)
        .json({ error: "Failed to retrieve location information" });
    }

    const locationData = await locationResponse.json();

    // Log location data for debugging
    console.log("Location Data:", locationData);

    const city = locationData.address.city || locationData.address.town;
    const country = locationData.address.country;

    if (!city || !country) {
      return res.status(404).json({ error: "City or country not found from coordinates" });
    }

    // Step 2: Fetch prayer times using Aladhan API for the city and country
    const prayerTimesResponse = await fetch(
      `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=2`
    );

    if (!prayerTimesResponse.ok) {
      return res
        .status(500)
        .json({ error: "Failed to fetch prayer times from Aladhan API" });
    }

    const prayerTimesData = await prayerTimesResponse.json();

    // Step 3: Return the prayer times
    res.status(200).json(prayerTimesData);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
}
