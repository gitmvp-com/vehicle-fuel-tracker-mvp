# Vehicle Fuel Tracker MVP

A simplified MVP version of [zpthanos/Saab](https://github.com/zpthanos/Saab) - A vehicle fuel tracking application built with React, Vite, and Base44.

## Features

✅ **Vehicle Management**: Add and manage your vehicle profile
✅ **Fuel Tracking**: Log fuel fill-ups with detailed information
✅ **Dashboard**: View fuel statistics and recent activity
✅ **Fuel Economy**: Automatic MPG calculations
✅ **Price Trends**: Visualize fuel price changes over time
✅ **Modern UI**: Beautiful dark theme with Tailwind CSS

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Base44** - Backend-as-a-Service for data management
- **TanStack Query** - Data fetching and caching
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **Framer Motion** - Animations
- **Lucide React** - Icons
- **date-fns** - Date formatting

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Base44 account ([Sign up at base44.com](https://base44.com))

### Installation

1. Clone the repository:
```bash
git clone https://github.com/gitmvp-com/vehicle-fuel-tracker-mvp.git
cd vehicle-fuel-tracker-mvp
```

2. Install dependencies:
```bash
npm install
```

3. Set up your Base44 project:
   - Create a new project in Base44
   - Upload the entity schemas from `src/entities/` folder
   - Copy your API key and Project ID

4. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your Base44 credentials:
```env
VITE_BASE44_API_KEY=your_api_key_here
VITE_BASE44_PROJECT_ID=your_project_id_here
```

5. Start the development server:
```bash
npm run dev
```

6. Open your browser at `http://localhost:5173`

## Project Structure

```
src/
├── api/              # Base44 client configuration
├── components/       # React components
│   ├── dashboard/   # Dashboard-specific components
│   └── fuel/        # Fuel tracking components
├── entities/        # Base44 entity schemas
├── pages/           # Page components
│   ├── Dashboard.jsx
│   ├── Fuel.jsx
│   └── VehicleProfile.jsx
├── App.jsx          # Main app component
├── Layout.jsx       # App layout with navigation
└── main.jsx         # Entry point
```

## Base44 Entities

This app uses two Base44 entities:

### Vehicle
- make (string, required)
- model (string, required)
- year (integer, required)
- color (string)
- current_mileage (number)

### FuelLog
- vehicle_id (string, required)
- date (date, required)
- mileage (number, required)
- gallons (number)
- cost_per_gallon (number)
- total_cost (number)
- fuel_type (enum: regular, mid_grade, premium, diesel, electric)
- station (string)
- full_tank (boolean)

## Usage

1. **Add Your Vehicle**: Start by adding your vehicle information in the Vehicle tab
2. **Log Fuel Fill-ups**: Navigate to Fuel tab and add your fill-up details
3. **View Dashboard**: Check your fuel statistics and recent activity
4. **Track MPG**: The app automatically calculates MPG from consecutive full-tank fill-ups
5. **Monitor Prices**: See fuel price trends in the chart

## Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` folder.

## Differences from Parent Repository

This MVP focuses on the core fuel tracking feature and excludes:
- Service records tracking
- Document management
- Authentication system
- Advanced features and customizations
- shadcn/ui components (using plain Tailwind instead)

## License

MIT

## Credits

Based on [zpthanos/Saab](https://github.com/zpthanos/Saab)
