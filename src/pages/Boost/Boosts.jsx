import React, { useState, useCallback, useEffect } from 'react'
import axios from "axios";

function Boosts() {
  const [boots, setBoots] = useState([]);
  const [filteredBoots, setFilteredBoots] = useState([]); // For search functionality
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const BaseUrl = process.env.REACT_APP_API_URL;

  // Fetch services from API
  const fetchBoots = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BaseUrl}/boost/all`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("Auth-Token")}`,
        },
      });
      console.log(response);
      setBoots(response.data.sales || []);
      setFilteredBoots(response.data.sales || []);
    } catch (err) {
      setError("Failed to fetch boots.");
    } finally {
      setLoading(false);
    }
  }, [BaseUrl]);

  useEffect(() => {
    fetchBoots();
  }, [fetchBoots]);

  return (
    <div>Boosts</div>
  )
}

export default Boosts