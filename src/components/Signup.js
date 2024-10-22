// src/components/Signup.js
import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
    const { signup } = useContext(AuthContext);
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState({
        username: '',
        password: '',
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setUserInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await signup(userInfo);
        if (result.success) {
            navigate('/login');
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="bg-sky-100 flex justify-center items-center min-h-screen">
            {/* Left: Image */}
            <div className="w-1/2 h-screen hidden lg:block">
                <img
                    src="https://img.freepik.com/fotos-premium/imagen-fondo_910766-187.jpg?w=826"
                    alt=""
                    className="object-cover w-full h-full"
                />
            </div>
            {/* Right: Signup Form */}
            <div className="lg:p-36 md:p-52 sm:p-20 p-8 w-full lg:w-1/2 flex justify-center items-center">
                <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
                    <h1 className="text-2xl font-semibold mb-4 text-center">Signup</h1>
                    {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        {/* Username Input */}
                        <div className="mb-4">
                            <label htmlFor="username" className="block text-gray-600 mb-2">Username</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={userInfo.username}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                                autoComplete="off"
                                required
                            />
                        </div>
                        {/* Password Input */}
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-gray-800 mb-2">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={userInfo.password}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                                autoComplete="off"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="bg-red-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full transition-colors"
                        >
                            Signup
                        </button>
                    </form>
                    {/* Login Link */}
                    <div className="mt-6 text-green-500 text-center">
                        <Link to="/login" className="hover:underline">Already have an account? Login here</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
