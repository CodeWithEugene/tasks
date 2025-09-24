import React, { useState } from 'react';
import Login from './components/Login';

interface User {
    name: string;
    picture: string;
    email: string;
}

const App: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);

    console.log('App render - user:', user);

    const handleSignIn = (userData: User) => {
        console.log('User signed in:', userData);
        setUser(userData);
    };
    
    if (!user) {
        console.log('Rendering Login component');
        return <Login onSignIn={handleSignIn} />;
    }
    
    console.log('Rendering Dashboard (placeholder)');
    return (
        <div style={{ padding: '20px' }}>
            <h1>Welcome, {user.name}!</h1>
            <p>You are logged in. Dashboard will be here.</p>
            <button onClick={() => setUser(null)}>Sign Out</button>
        </div>
    );
};

export default App;