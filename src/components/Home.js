import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
return (
<div className="home">
<h1 className="home-title">Welcome to Shopping App</h1>
<div className="home-buttons">
<Link to="/user" className="home-button">Shopping</Link>
<Link to="/admin" className="home-button">Admin</Link>
</div>
</div>
);
}

export default Home;