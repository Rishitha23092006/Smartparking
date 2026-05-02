import { useState, useEffect } from 'react';
import parkingAPI from '../api/parkingApi';
import AvailableSlots from './AvailableSlots';
import VehicleManager from './VehicleManager';
import './BookingForm.css';

export default function BookingForm() {
  const [step, setStep] = useState(1); // 1: vehicle, 2: slot, 3: confirm
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [vehiclesLoading, setVehiclesLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    fetchUserInfo();
    fetchUserVehicles();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const response = await parkingAPI.getUserInfo();
      setIsAdmin(response.data.is_staff || response.data.is_admin);
    } catch (err) {
      console.error('Failed to fetch user info:', err);
    } finally {
      setUserLoading(false);
    }
  };

  const fetchUserVehicles = async () => {
    try {
      setVehiclesLoading(true);
      const response = await parkingAPI.getUserVehicles();
      setVehicles(response.data);
    } catch (err) {
      console.error('Failed to fetch vehicles:', err);
    } finally {
      setVehiclesLoading(false);
    }
  };

  const handleVehicleAdded = () => {
    fetchUserVehicles();
  };

  const handleSlotCreated = () => {
    // This will trigger a refresh of available slots
    // when a new slot is created
  };

  const handleSlotSelected = (slot) => {
    setSelectedSlot(slot);
    setStep(3);
  };

  const handleConfirmBooking = async () => {
    if (!selectedVehicle || !selectedSlot) {
      setMessage('Please select both vehicle and slot');
      return;
    }

    setLoading(true);
    try {
      await parkingAPI.parkVehicle(selectedSlot.id, selectedVehicle.id);
      setMessage('✓ Parking booked successfully!');
      setTimeout(() => {
        setStep(1);
        setSelectedVehicle(null);
        setSelectedSlot(null);
        setMessage('');
      }, 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || err.response?.data?.error || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-form-container">
      <div className="booking-form">
        <h2>Parking Booking System</h2>

        {message && <div className="info-message">{message}</div>}

      <div className="steps">
        <div className={`step ${step >= 1 ? 'active' : ''}`}>
          <span>1</span> Vehicle
        </div>
        <div className={`step ${step >= 2 ? 'active' : ''}`}>
          <span>2</span> Slot
        </div>
        <div className={`step ${step >= 3 ? 'active' : ''}`}>
          <span>3</span> Confirm
        </div>
      </div>

      {step === 1 && (
        <div className="step-content">
          <VehicleManager onVehicleAdded={handleVehicleAdded} />
          
          {vehiclesLoading ? (
            <div className="loading">Loading your vehicles...</div>
          ) : vehicles.length > 0 ? (
            <>
              <h4>Your Vehicles:</h4>
              <div className="vehicles-list">
                {vehicles.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className={`vehicle-item ${selectedVehicle?.id === vehicle.id ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedVehicle(vehicle);
                      setStep(2);
                    }}
                  >
                    {vehicle.number}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="no-vehicles">
              <p>No vehicles added yet. Add one above to get started!</p>
            </div>
          )}
        </div>
      )}

      {step === 2 && (
        <div className="step-content">
          <AvailableSlots onSlotSelected={handleSlotSelected} />
          <button onClick={() => setStep(1)} className="back-btn">
            ← Back
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="step-content confirmation">
          <h3>Confirm Booking</h3>
          <div className="confirmation-details">
            <p>
              <strong>Vehicle:</strong> {selectedVehicle?.number}
            </p>
            <p>
              <strong>Slot:</strong> Slot {selectedSlot?.id}
            </p>
            {selectedSlot?.location && (
              <p>
                <strong>Location:</strong> {selectedSlot.location}
              </p>
            )}
          </div>
          <div className="confirmation-buttons">
            <button onClick={() => setStep(2)} className="cancel-btn">
              Cancel
            </button>
            <button
              onClick={handleConfirmBooking}
              disabled={loading}
              className="confirm-btn"
            >
              {loading ? 'Confirming...' : 'Confirm Booking'}
            </button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
