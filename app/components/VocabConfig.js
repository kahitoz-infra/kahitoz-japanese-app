"use client";
import React, { useState, useEffect } from 'react';
import Switch from '@mui/material/Switch';

const LS_SELECTED_LEVELS = "vocab_selected_levels";

export default function VocabConfig({ onClose, VocabData, onFilterChange }) {
    const [enableTurnSound, setEnabledTurnSound] = useState(false);
    const [enableFlipSound, setEnableFlipSound] = useState(false);
    const [enableTurnAnimation, setEnabledTurnAnimation] = useState(false);
    const [enableFlipAnimation, setEnableFlipAnimation] = useState(false);
    const [CardEnabled, setCardEnabled] = useState(true);
    const [CardFrontFace, setCardFrontFace] = useState(true);
    const [ShowFurigana, setShowFurigana] = useState(true);
    const [ShowRomaji, setShowRomaji] = useState(true);
    const [levelOptions, setLevelOptions] = useState([]);
    const [selectedLevels, setSelectedLevels] = useState([]);
    const [filteredData, setFilteredData] = useState([]);

    // Extract levels and select all by default
    useEffect(() => {
        if (VocabData && VocabData.length > 0) {
            const uniqueLevels = [...new Set(
                VocabData.map(item => item.level).filter(Boolean)
            )];
            setLevelOptions(uniqueLevels);
    
            const savedLevels = JSON.parse(localStorage.getItem(LS_SELECTED_LEVELS));
            if (Array.isArray(savedLevels) && savedLevels.length > 0) {
                setSelectedLevels(savedLevels);
            } else if (uniqueLevels.includes("N5")) {
                setSelectedLevels(["N5"]);
            } else {
                setSelectedLevels([uniqueLevels[0]]); // fallback if N5 not in data
            }
        }
    }, [VocabData]);
    

    // Update filtered data whenever selectedLevels change
    useEffect(() => {
        if (selectedLevels.length === 0) {
            setFilteredData([]);
            if (onFilterChange) onFilterChange([]);
        } else {
            const filtered = VocabData.filter(item => selectedLevels.includes(item.level));
            setFilteredData(filtered);
            if (onFilterChange) onFilterChange(filtered);
        }
    }, [selectedLevels, VocabData]);

    const handleLevelChange = (e) => {
        const selected = Array.from(e.target.selectedOptions, option => option.value);
        setSelectedLevels(selected);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-white dark:bg-black dark:text-white p-6 rounded-md shadow-md w-full max-w-md relative overflow-auto max-h-96" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl">
                    &times;
                </button>

                <h2 className="text-lg font-bold mb-4">Vocabulary Config</h2>
                <ul className='gap-y-2 flex flex-col'>
                    <p>View Configuration</p>
                    <div className='flex flex-row-reverse items-center justify-center'>
                        <p>Card View</p>
                        <Switch checked={CardEnabled} onChange={() => setCardEnabled(!CardEnabled)} />
                        <p>Table View</p>
                    </div>

                    {CardEnabled && (
                        <div>
                            <p>Card Settings</p>
                            <div className='flex items-center justify-center'>
                                <p>Show Front Face:</p>
                                <Switch checked={CardFrontFace} onChange={() => setCardFrontFace(!CardFrontFace)} />
                            </div>
                            <div className='flex items-center justify-center'>
                                <p>Show Furigana:</p>
                                <Switch checked={ShowFurigana} onChange={() => setShowFurigana(!ShowFurigana)} />
                            </div>
                            <div className='flex items-center justify-center'>
                                <p>Show Romaji:</p>
                                <Switch checked={ShowRomaji} onChange={() => setShowRomaji(!ShowRomaji)} />
                            </div>
                        </div>
                    )}

                    <div>
                        <p>Vocab Settings</p>
                        <div>
                            <p className="mb-2">Filter by Level:</p>
                            <select
                                multiple
                                size={levelOptions.length > 4 ? 5 : levelOptions.length}
                                value={selectedLevels}
                                onChange={handleLevelChange}
                                className="w-full border rounded p-2 text-black dark:text-white dark:bg-black"
                            >
                                {levelOptions.map(level => (
                                    <option key={level} value={level}>
                                        {level}
                                    </option>
                                ))}
                            </select>
                            <div className="text-xs mt-1">
                                Selected: {selectedLevels.length ? selectedLevels.join(', ') : 'None'}
                            </div>
                        </div>
                    </div>

                    <p>System Settings</p>
                    <ol>
                        <li className='flex items-center justify-between text-sm gap-x-2 w-full'>
                            <p>Enable Turn Audio</p>
                            <Switch checked={enableTurnSound} onChange={() => setEnabledTurnSound(!enableTurnSound)} />
                        </li>
                        <li className='flex items-center justify-between text-sm gap-x-2 w-full'>
                            <p>Enable Flip Audio</p>
                            <Switch checked={enableFlipSound} onChange={() => setEnableFlipSound(!enableFlipSound)} />
                        </li>
                        <li className='flex items-center justify-between text-sm gap-x-2 w-full'>
                            <p>Enable Turn Animation</p>
                            <Switch checked={enableTurnAnimation} onChange={() => setEnabledTurnAnimation(!enableTurnAnimation)} />
                        </li>
                        <li className='flex items-center justify-between text-sm gap-x-2 w-full'>
                            <p>Enable Flip Animation</p>
                            <Switch checked={enableFlipAnimation} onChange={() => setEnableFlipAnimation(!enableFlipAnimation)} />
                        </li>
                    </ol>
                </ul>
            </div>
        </div>
    );
}
