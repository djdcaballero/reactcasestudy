import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/styles/NotFoundPage.css';

function NotFoundPage() {
  return (
    <div className="not-found">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>Sorry, the page you are looking for could not be found.</p>
      <a href="../../index.html">Go back to Home</a>
    </div>
  );
}

export default NotFoundPage;
