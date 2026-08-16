# GlowAlchemy Frontend

This project is built with [React](https://reactjs.org/) and [Vite](https://vitejs.dev/).

## Prerequisites

- Node.js 18+ recommended
- npm or yarn

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_PROXY_TARGET=http://localhost:5000
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXX
VITE_META_PIXEL_ID=1851696042154850
VITE_META_CAPI_ENABLED=true
```

## Available Scripts

### `npm run dev`

Runs the app in development mode with Vite.
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes with HMR (Hot Module Replacement).

### `npm run build`

Builds the app for production to the `dist` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.
Your app is ready to be deployed!

### `npm run preview`

Previews the production build locally.
Open [http://localhost:4173](http://localhost:4173) to view the production build.

## Tech Stack

- **React 19.2.8** - UI library
- **React DOM 19.2.8** - React rendering for DOM
- **Vite 8.2.1** - Build tool and dev server
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **Material UI 7.2.0** - React component library
- **React Router DOM 6.22.3** - Routing
- **Axios 1.13.2** - HTTP client
- **Socket.IO Client 4.8.3** - WebSocket client
- **Swiper 11.2.10** - Touch slider

## Features

- E-commerce product catalog
- Shopping cart and wishlist
- User authentication
- Order tracking
- Admin dashboard
- Meta Pixel integration
- Real-time notifications via Socket.IO

## Backend API

The frontend expects a backend API running on `http://localhost:5000` by default.
Ensure the backend server is running before starting the development server.
