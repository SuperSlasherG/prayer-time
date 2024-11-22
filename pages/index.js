import { useEffect, useState } from "react";

export default function Home() {
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [error, setError] = useState(null);

  // Fetch prayer times based on the user's location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // Fetch prayer times from your API
          const response = await fetch(`/api/prayer-times?lat=${latitude}&lng=${longitude}`);
          if (!response.ok) {
            throw new Error("Failed to fetch prayer times");
          }

          // Parse and set the prayer times
          const data = await response.json();
          setPrayerTimes(data.data.timings); // Assuming this structure in the API response
        } catch (err) {
          setError(err.message);
        }
      },
      (err) => {
        setError("Failed to get location: " + err.message);
      }
    );
  }, []);

  // Display an error message if there is an issue
  if (error) {
    return <p>Error: {error}</p>;
  }

  // Display a loading message while fetching prayer times
  if (!prayerTimes) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Prayer Times</h1>
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
