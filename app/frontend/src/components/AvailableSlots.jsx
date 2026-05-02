import { useState, useEffect } from 'react';
import parkingAPI from '../api/parkingApi';
import './AvailableSlots.css';

export default function AvailableSlots({ onSlotSelected }) {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    fetchSlots();
    // Refresh slots every 10 seconds
    const interval = setInterval(fetchSlots, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchSlots = async () => {
    try {
      const response = await parkingAPI.getAvailableSlots();
      setSlots(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch available slots');
    } finally {
      setLoading(false);
    }
  };

  const handleSlotClick = (slot) => {
    setSelectedSlot(slot);
    onSlotSelected(slot);
  };

  if (loading) return <div className="loading">Loading available slots...</div>;

  return (
    <div className="slots-container">
      <h3>Available Parking Slots</h3>
      {error && <div className="error-message">{error}</div>}
      
      {slots.length === 0 ? (
        <div className="no-slots">No available slots at the moment</div>
      ) : (
        <div className="slots-grid">
          {slots.map((slot) => (
            <div
              key={slot.id}
              className={`slot-card ${selectedSlot?.id === slot.id ? 'selected' : ''}`}
              onClick={() => handleSlotClick(slot)}
            >
              <div className="slot-number">Slot {slot.id}</div>
              <div className="slot-location">{slot.location || 'Building A'}</div>
              <button className="select-btn">Select</button>
            </div>
          ))}
        </div>
      )}
      <button onClick={fetchSlots} className="refresh-btn">
        Refresh Slots
      </button>
    </div>
  );
}
