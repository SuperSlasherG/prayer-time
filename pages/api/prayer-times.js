export default async function handler(req, res) {
  const { lat, lng } = req.query;
  const response = await fetch(
    `https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lng}&method=2`
  );
  const data = await response.json();
  res.status(200).json(data.data.timings);
}
