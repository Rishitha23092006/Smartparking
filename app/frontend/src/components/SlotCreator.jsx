import { useState } from 'react';
import parkingAPI from '../api/parkingApi';
import './SlotCreator.css';

export default function SlotCreator({ onSlotCreated }) {
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateSlot = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await parkingAPI.createSlot({ location: location });
      setSuccess('Slot created successfully!');
      setLocation('');
      setTimeout(() => {
        onSlotCreated();
        setSuccess('');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create slot');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="slot-creator">
      <h3>Create New Parking Slot</h3>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <form onSubmit={handleCreateSlot}>
        <div className="form-group">
          <label>Slot Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            placeholder="e.g., Building A, Floor 2"
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Slot'}
        </button>
      </form>
    </div>
  );
}
