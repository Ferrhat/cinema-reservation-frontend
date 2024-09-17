# Cinema Reservation Frontend

## Prerequisites
- [Node.js](https://nodejs.org) installed
- [Backend API](https://github.com/Ferrhat/cinema-reservation-backend.git) up and running

## Installation
1. Clone the repository: `git clone https://github.com/Ferrhat/cinema-reservation-frontend.git`
2. Navigate to the project directory: `cd cinema-reservation-frontend`
3. Install dependencies: `npm install`

## Configuration
Set the API URL in the `.env` file:
```
NEXT_PUBLIC_PARTNER_ROOT_API_URL=http://localhost:3000
```

## Usage
To start the application in development mode, run the following command:
```
npm run dev
```

This will start the application in development mode. Open http://localhost:3001 with your browser to see the result. The page auto-updates as you edit the file.

Alternatively, you can set the API URL using the npm command:
```
NEXT_PUBLIC_PARTNER_ROOT_API_URL=http://localhost:3000 npm run dev
```

Replace http://localhost:3000 with the actual URL of your API.


To build the application for production, use the following command:
```
npm run build
```

Then to start the application in production mode, run the following command:
```
npm run start
```
This will start the application in production mode. Open http://localhost:3001 with your browser to see the result.
