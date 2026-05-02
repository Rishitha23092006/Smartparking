// Dashboard functionality

document.addEventListener('DOMContentLoaded', function() {
    loadSlots();
    loadUserVehicles();
    setupEventListeners();
});

async function loadSlots() {
    const slotsGrid = document.getElementById('slots-grid');
    const loadingSpinner = document.getElementById('loading-spinner');
    const slotSelect = document.getElementById('slot-select');

    Loading.show(loadingSpinner);
    slotsGrid.innerHTML = '';

    try {
        const availableSlots = await API.get('/slots/available/');
        const allSlots = await API.get('/slots/all/');

        // Create slot cards
        allSlots.forEach(slot => {
            const isAvailable = availableSlots.some(avail => avail.id === slot.id);
            const status = isAvailable ? 'available' : 'occupied';

            const slotCard = document.createElement('div');
            slotCard.className = `slot-card ${status}`;
            slotCard.innerHTML = `
                <div class="slot-number">${slot.location}</div>
                <div class="slot-status">${status.charAt(0).toUpperCase() + status.slice(1)}</div>
            `;

            slotsGrid.appendChild(slotCard);
        });

        // Populate slot select
        slotSelect.innerHTML = '<option value="">Choose a slot...</option>';
        availableSlots.forEach(slot => {
            const option = document.createElement('option');
            option.value = slot.id;
            option.textContent = `Slot ${slot.location}`;
            slotSelect.appendChild(option);
        });

    } catch (error) {
        console.error('Error loading slots:', error);
        Toast.show('Failed to load parking slots', 'error');
    } finally {
        Loading.hide(loadingSpinner);
    }
}

async function loadUserVehicles() {
    const vehicleSelect = document.getElementById('vehicle-select');

    try {
        const vehicles = await API.get('/vehicles/');

        vehicleSelect.innerHTML = '<option value="">Choose your vehicle...</option>';
        vehicles.forEach(vehicle => {
            const option = document.createElement('option');
            option.value = vehicle.id;
            option.textContent = vehicle.number;
            vehicleSelect.appendChild(option);
        });

    } catch (error) {
        console.error('Error loading vehicles:', error);
        // If not authenticated, hide the release form
        document.querySelector('.card:nth-child(3)').style.display = 'none';
    }
}

function setupEventListeners() {
    // Booking form
    document.getElementById('booking-form').addEventListener('submit', async function(e) {
        e.preventDefault();

        const formData = new FormData(this);
        const data = {
            vehicle_number: formData.get('vehicle_number'),
            slot: parseInt(formData.get('slot_id'))
        };

        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Booking...';

        try {
            const result = await API.post('/vehicle/', data);
            Toast.show('Slot booked successfully!', 'success');
            this.reset();
            loadSlots(); // Refresh slots
            loadUserVehicles(); // Refresh vehicles
        } catch (error) {
            console.error('Booking error:', error);
            Toast.show(error.message || 'Failed to book slot', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    });

    // Release form
    document.getElementById('release-form').addEventListener('submit', async function(e) {
        e.preventDefault();

        const vehicleId = document.getElementById('vehicle-select').value;
        if (!vehicleId) return;

        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Releasing...';

        try {
            // Get parking entries for the user
            const entries = await API.get('/entries/');
            const entry = entries.find(e => e.vehicle.id == vehicleId);

            if (entry) {
                await API.post(`/exit/${entry.id}/`);
                Toast.show('Slot released successfully!', 'success');
                this.reset();
                loadSlots();
                loadUserVehicles();
            } else {
                Toast.show('No active parking session found for this vehicle', 'error');
            }
        } catch (error) {
            console.error('Release error:', error);
            Toast.show(error.message || 'Failed to release slot', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    });
}