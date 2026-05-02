# Smart Parking Frontend (React + Vite)

A modern React-based frontend for the Smart Parking booking system that integrates with the Django backend.

## Features

- **User Authentication**: Login with JWT tokens
- **Vehicle Management**: Add and manage your vehicles
- **Real-time Slot Availability**: View available parking slots
- **Booking System**: Multi-step booking process
- **Responsive Design**: Works on desktop and mobile devices

## Project Structure

```
src/
├── api/
│   ├── axiosInstance.js    # Axios instance with JWT interceptors
│   └── parkingApi.js       # API endpoints wrapper
├── components/
│   ├── Login.jsx           # Login page
│   ├── BookingForm.jsx     # Main booking interface
│   ├── AvailableSlots.jsx  # Slot selection
│   ├── VehicleManager.jsx  # Vehicle management
│   └── [Component].css     # Styling
├── App.jsx                 # Main app component
├── main.jsx                # Entry point
└── index.css               # Global styles
```

## Setup Instructions

### Prerequisites
- Node.js 16+
- npm or yarn
- Django backend running on `http://localhost:8000`

### Installation

```bash
# Navigate to the frontend directory
cd app/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
npm run preview
```

## Backend API Endpoints

The frontend communicates with these backend endpoints:

- `POST /api/token/` - Get JWT token (login)
- `POST /api/token/refresh/` - Refresh JWT token
- `GET /slots/available/` - Get available parking slots
- `POST /vehicle/` - Add a new vehicle
- `POST /park/` - Park a vehicle in a slot
- `POST /exit/<id>/` - Exit a vehicle from parking
- `POST /slot/` - Create a new parking slot (admin)

## Environment Setup

Update the API base URL in [src/api/axiosInstance.js](src/api/axiosInstance.js) if your backend is running on a different URL:

```javascript
const API_BASE_URL = 'http://localhost:8000';  // Change this if needed
```

## Usage

### Login
1. Enter your username and password
2. Click Login
3. JWT tokens are stored in localStorage

### Book a Parking Spot
1. Add your vehicle (if not already added)
2. Select vehicle from your vehicles list
3. Choose an available parking slot
4. Confirm the booking

### View Available Slots
- Slots refresh automatically every 10 seconds
- Click the "Refresh" button to manually refresh

## Features Coming Soon

- Exit vehicle from parking
- View booking history
- Admin panel for slot management
- Email/SMS notifications
- Payment integration

## Troubleshooting

### CORS Issues
If you get CORS errors, ensure your Django backend has:
```python
INSTALLED_APPS = [
    ...
    'corsheaders',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    ...
]

CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
]
```

### Token Expiration
The app automatically refreshes expired tokens. If refresh fails, you'll be logged out.

## Development

- Uses React 18
- Vite for fast build and dev experience
- Axios for API calls with JWT support
- CSS for styling (no CSS framework)

## License

MIT
