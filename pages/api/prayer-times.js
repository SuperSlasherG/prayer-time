export default async function handler(req, res) {
  const { lat, lng } = req.query;

  try {
    // Step 1: Reverse geocoding to get the city name
    const locationResponse = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
    );

    if (!locationResponse.ok) {
      return res
        .status(500)
        .json({ error: "Failed to retrieve location information" });
    }

    const locationData = await locationResponse.json();
    const city = locationData.address.city || locationData.address.town;

    if (!city) {
      return res.status(404).json({ error: "City not found from coordinates" });
    }

    // Step 2: Fetch prayer times using Aladhan API for the city
    const prayerTimesResponse = await fetch(
      `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${locationData.address.country}&method=2`
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
    res.status(500).json({ error: error.message });
  }
}
