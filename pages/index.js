import { useEffect, useState } from "react";

export default function Home() {
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [error, setError] = useState(null);
  const [city, setCity] = useState(""); // Store the city name
  const [loading, setLoading] = useState(true);

  // Function to fetch the city name from latitude and longitude
  const getCityFromCoordinates = async (latitude, longitude) => {
    const apiKey = "YOUR_OPENCAGE_API_KEY"; // Replace with your OpenCage API key
    try {
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`
      );
      const data = await response.json();
      if (data.results.length > 0) {
        const city = data.results[0].components.city || data.results[0].components.town;
        setCity(city);
        return city;
      } else {
        throw new Error("City not found");
      }
    } catch (error) {
      setError("Failed to fetch city: " + error.message);
      return null;
    }
  };

  // Fetch prayer times based on the user's location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const cityName = await getCityFromCoordinates(latitude, longitude);
        if (cityName) {
          try {
            // Fetch prayer times from your API using the city name
            const response = await fetch(`/api/prayer-times?city=${cityName}`);
            if (!response.ok) {
              throw new Error("Failed to fetch prayer times");
            }

            // Parse and set the prayer times
            const data = await response.json();
            setPrayerTimes(data.data.timings); // Assuming this structure in the API response
          } catch (err) {
            setError("Failed to fetch prayer times: " + err.message);
          }
        }
        setLoading(false);
      },
      (err) => {
        setError("Failed to get location: " + err.message);
        setLoading(false);
      }
    );
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!prayerTimes) {
    return <p>No prayer times available</p>;
  }

  return (
    <div>
      <h1>Prayer Times for {city}</h1>
      <ul>
        {/* Loop through the timings and display each prayer time */}
        {Object.entries(prayerTimes).map(([prayer, time]) => (
          <li key={prayer}>
            {prayer}: {time}
          </li>
        ))}
      </ul>
    </div>
  );
}
