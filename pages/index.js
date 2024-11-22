import { useState, useEffect } from "react";

export default function Home() {
  const [location, setLocation] = useState(null);
  const [masjids, setMasjids] = useState([]);
  const [prayerTimes, setPrayerTimes] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });

        // Fetch masjids and prayer times
        const masjidsData = await fetchMasjids(latitude, longitude);
        setMasjids(masjidsData);

        const prayerTimesData = await fetchPrayerTimes(latitude, longitude);
        setPrayerTimes(prayerTimesData);
      });
    }
  }, []);

  const fetchMasjids = async (lat, lng) => {
    const response = await fetch(`/api/masjids?lat=${lat}&lng=${lng}`);
    return response.json();
  };

  const fetchPrayerTimes = async (lat, lng) => {
    const response = await fetch(`/api/prayer-times?lat=${lat}&lng=${lng}`);
    return response.json();
  };

  return (
    <div>
      <h1>Local Masjids and Prayer Times</h1>
      {location && (
        <div>
          <h2>Your Location: {location.latitude}, {location.longitude}</h2>
          <h3>Masjids Nearby:</h3>
          <ul>
            {masjids.map((masjid, index) => (
              <li key={index}>{masjid.name} - {masjid.vicinity}</li>
            ))}
          </ul>
          <h3>Prayer Times:</h3>
          {prayerTimes && (
            <ul>
              {Object.entries(prayerTimes).map(([key, time]) => (
                <li key={key}>{key}: {time}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
