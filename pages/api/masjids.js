export default async function handler(req, res) {
  const { lat, lng } = req.query;
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&type=mosque&key=YOUR_API_KEY`
  );
  const data = await response.json();
  res.status(200).json(data.results);
}
