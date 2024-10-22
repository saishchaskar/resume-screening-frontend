import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [jobDesc, setJobDesc] = useState('');
    const [resumes, setResumes] = useState(null);
    const [taskId, setTaskId] = useState(null);
    const [progress, setProgress] = useState({ current: 0, total: 0, filename: '' });
    const [loading, setLoading] = useState(false);
    const [rankedCandidates, setRankedCandidates] = useState([]);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);
    const navigate = useNavigate(); // Hook for navigation

    const handleJobDescChange = (e) => setJobDesc(e.target.value);
    const handleResumesChange = (e) => setResumes(e.target.files[0]);

    const triggerFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click(); // Trigger the file input click
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!resumes) {
            setError('Please upload a resume file.');
            return;
        }
        setLoading(true);
        setError('');
        setRankedCandidates([]);
        setTaskId(null);
        setProgress({ current: 0, total: 0, filename: '' });

        const formData = new FormData();
        formData.append('job_description', jobDesc);
        formData.append('resumes_zip', resumes);

        try {
            const response = await axios.post('http://localhost:5000/api/process', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            const { task_id } = response.data;
            setTaskId(task_id);
            pollTaskStatus(task_id);
        } catch (error) {
            console.error('Error processing resumes:', error);
            setError(error.response?.data?.error || 'Failed to process resumes. Please try again.');
            setLoading(false);
        }
    };

    const pollTaskStatus = (task_id) => {
        const interval = setInterval(async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/result/${task_id}`);
                const data = response.data;

                if (data.state === 'processing') {
                    setProgress({
                        current: data.progress.current,
                        total: data.progress.total,
                        filename: data.progress.filename,
                    });
                } else if (data.state === 'completed') {
                    setRankedCandidates(data.ranked_candidates);
                    setLoading(false);
                    clearInterval(interval);
                } else if (data.state === 'failed') {
                    setError(data.error || 'An error occurred during processing.');
                    setLoading(false);
                    clearInterval(interval);
                }
            } catch (error) {
                console.error('Error fetching task status:', error);
                setError('Failed to fetch task status. Please try again.');
                setLoading(false);
                clearInterval(interval);
            }
        }, 5000); // Poll every 5 seconds
    };

    const handleSeeResults = () => {
        const history = JSON.parse(localStorage.getItem('resultsHistory')) || [];
        const newEntry = {
            timestamp: new Date().toISOString(),
            candidates: rankedCandidates,
        };
        history.push(newEntry);
        localStorage.setItem('resultsHistory', JSON.stringify(history));

        navigate('/results', { state: { candidates: rankedCandidates } }); // Pass candidates to results
    };

    return (
        <div className="bg-sky-100 rounded-xl flex flex-col lg:flex-row justify-center items-center min-h-screen p-10">


            {/* Right Side: Form Container */}
            <div className="w-full lg:w-1/2 bg-white p-8 lg:p-16 rounded-xl shadow-md flex flex-col justify-center">
                {/* Header */}
                <div className="text-center mb-6">
                    <h2 className="text-3xl font-semibold text-gray-900">Resume Processing  </h2>
                    <p className="mt-2 text-sm text-gray-500">
                        Paste the Job Description and Upload Resume Zip File
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Job Description */}
                    <div>
                        <label htmlFor="jobDescription" className="block text-sm font-bold text-gray-700 mb-2">
                            Job Description
                        </label>
                        <textarea
                            id="jobDescription"
                            name="jobDesc"
                            rows="5"
                            value={jobDesc}
                            onChange={handleJobDescChange}
                            placeholder="Enter the job description here..."
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                        />
                    </div>

                    {/* File Upload */}
                    <div>
                        <label className="flex flex-col rounded-lg border-4 border-dashed border-gray-400 w-full h-60 p-10 group text-center cursor-pointer">
                            <div className="h-full w-full flex flex-col items-center justify-center">
                                <div className="flex flex-auto p-2 max-h-48 w-2/5 mx-auto -mt-10">
                                    <img
                                        className="object-center h-26"
                                        src="https://img.freepik.com/free-vector/image-upload-concept-landing-page_52683-27130.jpg?size=338&ext=jpg"
                                        alt="Upload concept"
                                    />
                                </div>
                                <p className="pointer-events-none text-gray-500 mt-4">
                                    <span className="text-sm">Drag and drop</span> files here <br />
                                    or <button type="button" onClick={triggerFileInput} className="text-blue-600 hover:underline">select a file</button> from your computer
                                </p>
                            </div>
                            <input
                                type="file"
                                accept=".zip"
                                onChange={handleResumesChange}
                                className="hidden"
                                required
                                ref={fileInputRef}
                            />
                        </label>
                    </div>

                    {/* File Type Info */}
                    <p className="text-sm text-gray-500">
                        <span>File type: Zip</span>
                    </p>

                    {/* Upload Button */}
                    <div>
                        <button
                            type="submit"
                            className={`w-full flex justify-center bg-blue-500 text-gray-100 p-4 rounded-full tracking-wide font-semibold focus:outline-none focus:shadow-outline hover:bg-blue-600 shadow-lg transition ease-in duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : 'Upload'}
                        </button>
                    </div>
                </form>

                {/* Error Message */}
                {error && (
                    <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
                        {error}
                    </div>
                )}

                {/* Progress Indicator */}
                {loading && taskId && (
                    <div className="mt-4 p-3 bg-yellow-100 text-yellow-700 rounded">
                        <p>
                            Processing file {progress.current} of {progress.total}: {progress.filename}
                        </p>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                            <div
                                className="bg-blue-600 h-2.5 rounded-full"
                                style={{ width: `${(progress.current / progress.total) * 100}%` }}
                            ></div>
                        </div>
                        <p className="mt-2">
                            Estimated time remaining:{' '}
                            {progress.total > 0
                                ? `${Math.max(60 - (progress.current / progress.total) * 60, 0).toFixed(0)} seconds`
                                : 'Calculating...'}
                        </p>
                    </div>
                )}

                {/* See Results Button */}
                {rankedCandidates.length > 0 && !loading && (
                    <div className="mt-6">
                        <button
                            type="button"
                            className="w-full flex justify-center bg-green-500 text-white p-4 rounded-full tracking-wide font-semibold focus:outline-none focus:shadow-outline hover:bg-green-600 shadow-lg transition ease-in duration-300"
                            onClick={handleSeeResults}
                        >
                            See Results
                        </button>
                    </div>
                )}
            </div>
        </div>

    );
};

export default Dashboard;
