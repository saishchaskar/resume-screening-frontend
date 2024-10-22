import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const Results = () => {
    const location = useLocation();
    const [resultsHistory, setResultsHistory] = useState([]);
    const [selectedResult, setSelectedResult] = useState(null);

    useEffect(() => {
        // Load results history from local storage
        const history = JSON.parse(localStorage.getItem('resultsHistory')) || [];
        setResultsHistory(history);
        console.log('Loaded history:', history);

        // Check if new candidates are passed via location state
        if (location.state && location.state.candidates) {
            const newEntry = {
                timestamp: new Date(),
                candidates: location.state.candidates,
            };

            // Prevent duplicate entries (optional)
            const isDuplicate = history.some(
                (entry) => JSON.stringify(entry.candidates) === JSON.stringify(newEntry.candidates)
            );

            if (!isDuplicate) {
                // Update history by adding the new entry
                const updatedHistory = [...history, newEntry];
                setResultsHistory(updatedHistory);
                setSelectedResult(newEntry);

                // Save updated history to local storage
                localStorage.setItem('resultsHistory', JSON.stringify(updatedHistory));
                console.log('Added new entry:', newEntry);
            } else {
                // If duplicate, just select the existing entry
                const existingEntry = history.find(
                    (entry) => JSON.stringify(entry.candidates) === JSON.stringify(newEntry.candidates)
                );
                setSelectedResult(existingEntry);
            }
        } else {
            // If no new candidates passed, select the latest entry if any
            if (history.length > 0) {
                setSelectedResult(history[history.length - 1]);
                console.log('Selected latest entry:', history[history.length - 1]);
            }
        }
    }, [location]);

    const handleResultClick = (result) => {
        setSelectedResult(result);
        console.log('Selected result:', result);
    };

    const handleDelete = (index) => {
        const updatedHistory = [...resultsHistory];
        const deletedEntry = updatedHistory.splice(index, 1);
        setResultsHistory(updatedHistory);
        localStorage.setItem('resultsHistory', JSON.stringify(updatedHistory));
        console.log('Deleted entry:', deletedEntry);

        // If the deleted entry was the selected one, update the selection
        if (selectedResult === resultsHistory[index]) {
            if (updatedHistory.length > 0) {
                setSelectedResult(updatedHistory[updatedHistory.length - 1]);
            } else {
                setSelectedResult(null);
            }
        }
    };

    return (
        <div className="flex min-h-screen">
            {/* Sidebar for Previous Results */}
            <div className="w-1/4 bg-gray-200 p-4 overflow-y-auto">
                <h2 className="text-lg font-bold mb-4">Previous Results</h2>
                <ul>
                    {resultsHistory.map((result, index) => (
                        <li
                            key={index}
                            className={`flex justify-between items-center p-2 mb-2 rounded cursor-pointer hover:bg-gray-300 ${selectedResult === result ? 'bg-gray-300' : ''
                                }`}
                            onClick={() => handleResultClick(result)}
                        >
                            <span>
                                {new Date(result.timestamp).toLocaleString()} - {result.candidates.length} Candidates
                            </span>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent triggering the click on the list item
                                    handleDelete(index);
                                }}
                                className="text-red-500 hover:text-red-700"
                                title="Delete this entry"
                            >
                                &#10005; {/* Cross (X) symbol */}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Main Content for Current Results */}
            <div className="flex-1 p-4 overflow-x-auto">
                <h2 className="text-2xl font-bold mb-4">Current Ranked Candidates</h2>
                {selectedResult && selectedResult.candidates.length > 0 ? (
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                            <tr className="bg-gray-800 text-white">
                                <th className="py-2 px-4 border-b">Sr. No.</th>
                                <th className="py-2 px-4 border-b">Candidate Name</th>
                                <th className="py-2 px-4 border-b">Similarity Score</th>
                                <th className="py-2 px-4 border-b">Resume</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedResult.candidates.map((candidate, index) => (
                                <tr key={index} className="text-center hover:bg-gray-100">
                                    <td className="py-2 px-4 border-b">{index + 1}</td>
                                    <td className="py-2 px-4 border-b">{candidate.name}</td>
                                    <td className="py-2 px-4 border-b">{candidate.score.toFixed(4)}</td>
                                    <td className="py-2 px-4 border-b">
                                        {candidate.url ? (
                                            <a
                                                href={candidate.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline"
                                            >
                                                View Resume
                                            </a>
                                        ) : (
                                            'No Resume Available'
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No candidates available.</p>
                )}
            </div>
        </div>
    );
};

export default Results;
