// src/components/Ranking.js
import React from 'react';

const Ranking = ({ rankedResumes }) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg">
                <thead>
                    <tr>
                        <th className="py-3 px-4 bg-blue-500 text-white">Sr. No.</th>
                        <th className="py-3 px-4 bg-blue-500 text-white">Candidate Name</th>
                        <th className="py-3 px-4 bg-blue-500 text-white">Similarity Score</th>
                        <th className="py-3 px-4 bg-blue-500 text-white">Resume</th>
                    </tr>
                </thead>
                <tbody>
                    {rankedResumes.map((candidate, index) => (
                        <tr key={index} className="border-b hover:bg-gray-100">
                            <td className="py-2 px-4 text-center">{index + 1}</td>
                            <td className="py-2 px-4">{candidate.name}</td>
                            <td className="py-2 px-4 text-center">{candidate.score.toFixed(4)}</td>
                            <td className="py-2 px-4 text-center">
                                <a
                                    href={candidate.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline"
                                >
                                    View Resume
                                </a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Ranking;
