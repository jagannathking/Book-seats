# Simple Train Seat Booking App

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) <!-- Optional license badge -->

A web application demonstrating a simple train seat booking system featuring user authentication, seat visualization, and booking logic based on availability and proximity.

## Live Demo

*   **Frontend:** [https://book-seats-yo4q.vercel.app/](https://book-seats-yo4q.vercel.app/)
*   **Backend API Base:** [https://book-seats-alpha.vercel.app/api/](https://book-seats-alpha.vercel.app/api/)

*(Note: Backend API base URL provided. Specific endpoints are documented below or can be inferred from usage.)*

## Features

*   **User Authentication:** Secure user registration and login functionality using JWT.
*   **Seat Visualization:** Displays the 80-seat coach layout (11 rows of 7 seats, 1 final row of 3 seats).
*   **Real-time Status:** Clearly indicates booked vs. available seats with distinct colors.
*   **Booking Logic:**
    *   Allows booking up to 7 seats per request.
    *   Prioritizes booking contiguous seats within the same row.
    *   If single-row booking isn't possible, books the first available nearby seats.
*   **Booking Management:** Only logged-in users can book seats. Booked seats are reserved until reset.
*   **Reset Functionality:** Allows clearing all bookings (protected route).
*   **Responsive Design:** Basic responsiveness for usability across different devices (ensure your CSS supports this).

## Tech Stack

*   **Frontend:**
    *   React.js (using Vite or Create React App - *adjust if using Next.js*)
    *   Tailwind CSS (for styling)
    *   Axios (for API requests)
    *   React Router DOM (for navigation)
    *   Lucide React (for icons)
    *   Context API (for authentication state management)
*   **Backend:**
    *   Node.js
    *   Express.js
    *   MongoDB (Database)
    *   Mongoose (ODM)
    *   JSON Web Token (JWT for authentication)
    *   bcryptjs (for password hashing)
    *   cors (for enabling cross-origin requests)
    *   dotenv (for environment variables)
*   **Database:**
    *   MongoDB Atlas (or local MongoDB instance) - *Requires a Replica Set for transactions*
*   **Deployment:**
    *   Vercel (for both Frontend and Backend based on provided URLs)

## Screenshots / Demo Video

*(**TODO:** Add screenshots of the login page, seat layout, booking process, etc.)*

*(**TODO:** Add a link to your presentation video if required.)*
*   [Link to Presentation Video](#) <--- Replace '#' with your video link

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   [Node.js](https://nodejs.org/) (v16 or later recommended)
*   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
*   [Git](https://git-scm.com/)
*   [MongoDB](https://www.mongodb.com/try/download/community) installed locally OR a MongoDB Atlas account (Replica Set required for transactions).

### Backend Setup

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd <your-repository-name>/server # Navigate to the backend directory
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```
3.  **Set up Environment Variables:**
    *   Create a `.env` file in the `/server` directory.
    *   Copy the contents of `.env.example` (if you create one) or add the following variables:
        ```dotenv
        # .env file (in /server directory)

        # MongoDB Connection String (replace with your actual URI)
        # Ensure it points to a replica set if using transactions
        MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority
        # Or for local MongoDB: MONGODB_URI=mongodb://localhost:27017/trainBookingApp

        # Port for the backend server
        PORT=5001

        # JWT Secret Key (choose a strong, random string)
        JWT_SECRET=your_very_strong_secret_key_here
        ```
    *   **Important:** Replace placeholders with your actual MongoDB connection string and choose a strong JWT secret. **Do not commit your `.env` file to Git.**
4.  **Run the backend server:**
    ```bash
    npm run dev
    # or if you have a start script:
    # npm start
    ```
    The backend should now be running, typically on `http://localhost:5001`.

### Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd ../client # Assuming 'client' directory from the repo root
    # or cd <path-to-your-frontend-directory>
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```
3.  **(Optional) Environment Variables:** If your frontend needs environment variables (like the API base URL, though you've hardcoded it), create a `.env` file in the `/client` directory following your framework's convention (e.g., `VITE_API_BASE_URL` for Vite, `REACT_APP_API_BASE_URL` for CRA).
    ```dotenv
    # .env file (in /client directory - Example for Vite)
    VITE_API_BASE_URL=http://localhost:5001/api
    ```
    *Update your frontend code (e.g., `BookPage.jsx`) to use `import.meta.env.VITE_API_BASE_URL` or `process.env.REACT_APP_API_BASE_URL` instead of the hardcoded URL.*
4.  **Run the frontend development server:**
    ```bash
    npm run dev # or yarn dev (for Vite)
    # or
    # npm start # or yarn start (for CRA)
    ```
    The frontend should now be running, typically on `http://localhost:5173` (Vite) or `http://localhost:3000` (CRA). Open this URL in your browser.

## API Endpoints

Base URL: `/api`

*   **Authentication (`/api/users`)**
    *   `POST /register`: Register a new user (`{name, email, password}`)
    *   `POST /login`: Login an existing user (`{email, password}`) - Returns JWT token.
*   **Booking/Seats (`/api/seats`)** *(Note: Mounted under `/api/seats` in your code)*
    *   `GET /all-booked-seats`: (Protected) Get the status of all 80 seats. Requires Bearer Token.
    *   `POST /create-book`: (Protected) Book seats. Requires Bearer Token. Body: `{ "numSeats": number }` (1-7).
    *   `DELETE /reset`: (Protected) Reset all bookings, making all seats available. Requires Bearer Token.

## Deployment

*   **Backend:** Deployed on Vercel. Connected to MongoDB Atlas.
*   **Frontend:** Deployed on Vercel. Configured to communicate with the deployed backend API.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change. Please make sure to update tests as appropriate. *(Adjust this section based on your preferences)*

## License

[MIT](https://opensource.org/licenses/MIT) *(Assuming MIT license, change if different)*
