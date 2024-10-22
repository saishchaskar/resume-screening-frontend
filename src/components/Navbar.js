import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { auth, logout } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <nav className="flex justify-between bg-gray-900 text-white w-screen shadow-lg">
            <div className="px-5 xl:px-12 py-3 flex w-full items-center">
                {/* Logo */}
                <Link to="/dashboard" className="text-3xl font-semibold font-heading">
                    Automated Resume Ranking Tool
                </Link>

                {/* Nav Links for larger screens */}
                <ul className="hidden md:flex px-4 mx-auto font-semibold font-heading space-x-12">
                    {auth.token && (
                        <li>
                            {/* <Link
                                to="/results"
                                className="text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Results
                            </Link> */}
                        </li>
                    )}
                    {/* Add more nav links here if needed */}
                </ul>

                {/* Authentication Buttons */}
                <div className="ml-4 flex items-center">
                    {auth.token ? (
                        <>
                            {auth.token && (
                                <Link
                                    to="/results"
                                    className="text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors mr-4 hidden md:block"
                                >
                                    Results
                                </Link>
                            )}
                            <button
                                onClick={logout}
                                className="text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            {/* <Link
                                to="/"
                                className="text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Login
                            </Link>
                            <Link
                                to="/signup"
                                className="text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors ml-2"
                            >
                                Signup
                            </Link> */}
                        </>
                    )}
                </div>
            </div>

            {/* Responsive Navbar for small screens */}
            <button className="xl:hidden flex mr-6 items-center" onClick={toggleMenu}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 hover:text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden absolute top-16 left-0 w-full bg-gray-900 text-white py-4">
                    <ul className="flex flex-col space-y-4 px-4">
                        {auth.token && (
                            <li>
                                <Link
                                    to="/results"
                                    className="block text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Results
                                </Link>
                            </li>
                        )}
                        {/* Add more mobile nav links here if needed */}
                        {auth.token ? (
                            <li>
                                <button
                                    onClick={() => {
                                        logout();
                                        setIsOpen(false);
                                    }}
                                    className="text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full text-left"
                                >
                                    Logout
                                </button>
                            </li>
                        ) : (
                            <>
                                <li>
                                    <Link
                                        to="/"
                                        className="block text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Login
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/signup"
                                        className="block text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Signup
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            )}
        </nav>
    );
};

export default Navbar;