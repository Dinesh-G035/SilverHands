# SilverHands

SilverHands is an AI-assisted livelihood platform for connecting senior citizens and homemakers with customers through services, products, bookings, messaging, and payments.

## Project Structure

- `backend/` - Express, MongoDB, authentication, OTP, marketplace, booking, and payment APIs
- `frontend/` - React and Vite web application
- `docs/` - API collection and integration documentation

## Run Locally

Install dependencies in each application directory:

```powershell
cd backend
npm install
npm run dev
```

In a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

The backend runs on `http://localhost:5000` and the frontend runs on `http://localhost:5173`.

## Configuration

Configure MongoDB, JWT secrets, and OTP delivery in `backend/.env`. Use `OTP_PROVIDER=mock` for local development, or configure SMTP values for email OTP delivery.

Never commit `.env` files or real credentials. Rotate any credential exposed outside the local machine.

## Tests

```powershell
cd backend
npm test
```
