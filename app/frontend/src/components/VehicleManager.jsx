import { useState } from 'react';
import parkingAPI from '../api/parkingApi';
import './VehicleManager.css';

export default function VehicleManager({ onVehicleAdded }) {
  const [number, setNumber] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [assignedSlot, setAssignedSlot] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setAssignedSlot(null);
    setLoading(true);

    try {
      const response = await parkingAPI.addVehicle({ number: number });
      
      if (response.data.assigned_slot) {
        setSuccess(`Vehicle added successfully! Assigned to slot: ${response.data.assigned_slot.location}`);
        setAssignedSlot(response.data.assigned_slot);
      } else {
        setSuccess('Vehicle added but no slots available for parking');
      }
      
      setNumber('');
      setTimeout(() => {
        onVehicleAdded();
        setSuccess('');
        setAssignedSlot(null);
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to add vehicle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vehicle-manager">
      <h3>Add Your Vehicle</h3>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      {assignedSlot && (
        <div className="assigned-slot-info">
          <strong>✓ Slot Assigned: {assignedSlot.location}</strong>
        </div>
      )}
      
      <form onSubmit={handleAddVehicle}>
        <div className="form-group">
          <label>Number Plate</label>
          <input
            type="text"
            value={number}
            onChange={(e) => setNumber(e.target.value.toUpperCase())}
            required
            placeholder="e.g., ABC1234"
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Vehicle'}
        </button>
      </form>
    </div>
  );
}
