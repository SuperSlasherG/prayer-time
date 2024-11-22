import { useState, useEffect } from 'react';

const PrayerTimesPage = () => {
  const [city, setCity] = useState('');
  const [error, setError] = useState('');
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [dateInfo, setDateInfo] = useState(null);

  const apiKey = 'b02a6ab6b76d4327865baaba2c100d6b'; // Your OpenCage API key

  useEffect(() => {
    // Get the user's location from browser geolocation
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        // Get city name from coordinates using OpenCage API
        const response = await fetch(
          `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`
        );
        const data = await response.json();

        if (data.results.length > 0) {
          const city = data.results[0].components.city || data.results[0].components.town;
          if (city) {
            setCity(city);
            getPrayerTimes(city); // Fetch prayer times after getting the city
          } else {
            setError("City not found in the geocoding response.");
          }
        } else {
          setError("City not found in the geocoding response.");
        }
      },
      (error) => setError("Failed to get geolocation.")
    );
  }, []);

  // Fetch prayer times using Aladhan API based on the city
  const getPrayerTimes = async (city) => {
    const formattedCity = city.replace(" ", "+"); // Replace spaces in city names with '+'
    const prayerApiUrl = `http://api.aladhan.com/v1/timingsByCity?city=${formattedCity}&country=GB&method=2`; // Assuming country is GB for now

    const response = await fetch(prayerApiUrl);
    const data = await response.json();

    if (data.code === 200 && data.status === "OK") {
      setPrayerTimes(data.data.timings);
      setDateInfo(data.data.date); // Store the date information for display
    } else {
      setError("Failed to fetch prayer times.");
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Prayer Times for {city}</h1>
      {dateInfo && (
        <p>
          <strong>Date:</strong> {dateInfo.gregorian.date} ({dateInfo.gregorian.weekday.en}, {dateInfo.gregorian.month.en} {dateInfo.gregorian.year})
        </p>
      )}
      {prayerTimes ? (
        <ul>
          <li><strong>Fajr:</strong> {prayerTimes.Fajr}</li>
          <li><strong>Sunrise:</strong> {prayerTimes.Sunrise}</li>
          <li><strong>Dhuhr:</strong> {prayerTimes.Dhuhr}</li>
          <li><strong>Asr:</strong> {prayerTimes.Asr}</li>
          <li><strong>Sunset:</strong> {prayerTimes.Sunset}</li>
          <li><strong>Maghrib:</strong> {prayerTimes.Maghrib}</li>
          <li><strong>Isha:</strong> {prayerTimes.Isha}</li>
        </ul>
      ) : (
        <p>Loading prayer times...</p>
      )}
    </div>
  );
};

export default PrayerTimesPage;
