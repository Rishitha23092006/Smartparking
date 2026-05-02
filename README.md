# Smart Parking System

A modern, responsive web application for managing parking slots built with Django and vanilla JavaScript.

## Features

- **Dashboard**: Visual grid display of parking slots with real-time status
- **Booking System**: Book available parking slots
- **Release System**: Release occupied slots
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Clean, professional interface with smooth animations

## Tech Stack

- **Backend**: Django 6.0, Django REST Framework
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Database**: SQLite (development)
- **Styling**: Custom CSS with Font Awesome icons

## Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd smartparking
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   venv\Scripts\activate  # Windows
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run migrations**
   ```bash
   python manage.py migrate
   ```

5. **Create superuser**
   ```bash
   python manage.py createsuperuser
   ```

6. **Collect static files**
   ```bash
   python manage.py collectstatic
   ```

7. **Run the server**
   ```bash
   python manage.py runserver
   ```

8. **Access the application**
   - Main app: http://127.0.0.1:8000/
   - Admin panel: http://127.0.0.1:8000/admin/

## API Endpoints

- `GET /slots/available/` - Get available slots
- `GET /slots/all/` - Get all slots
- `POST /vehicle/` - Add vehicle and book slot
- `GET /vehicles/` - Get user's vehicles
- `GET /entries/` - Get user's active parking entries
- `POST /exit/<id>/` - Release a parking slot

## Project Structure

```
smartparking/
├── app/
│   ├── templates/app/
│   │   ├── base.html
│   │   └── home.html
│   ├── static/app/
│   │   ├── css/style.css
│   │   └── js/
│   │       ├── app.js
│   │       └── dashboard.js
│   ├── models.py
│   ├── views.py
│   ├── urls.py
│   └── serializers.py
├── smartparking/
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── staticfiles/  # Collected static files
├── db.sqlite3
├── manage.py
└── requirements.txt
```

## Features Overview

### Dashboard
- Grid layout showing all parking slots
- Color-coded status: Green (Available), Red (Occupied)
- Real-time updates after booking/releasing

### Booking
- Form to enter vehicle number
- Dropdown to select available slot
- Confirmation with success/error messages

### Release
- Dropdown to select user's parked vehicle
- One-click release functionality

### UI/UX
- Modern gradient backgrounds
- Smooth hover effects and transitions
- Toast notifications for feedback
- Loading spinners during API calls
- Fully responsive design

## Development

The application uses Django templates for server-side rendering. Static files are served via Django's static file handling. The frontend communicates with the backend via REST API calls using fetch API.

## License

MIT License