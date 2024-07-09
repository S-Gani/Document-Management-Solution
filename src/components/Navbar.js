import React from 'react';

function Navbar({ setRole, isLoggedIn }) {
return (
<nav>
<button onClick={() => setRole('user')}>User</button>
{isLoggedIn ? (
<button onClick={() => setRole('admin')}>Admin</button>
) : (
<button onClick={() => setRole('admin')}>Admin Login</button>
)}
</nav>
);
}

export default Navbar;