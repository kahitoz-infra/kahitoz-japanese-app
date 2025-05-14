"use client"
import { useState, useEffect } from "react"
import { toRomaji } from "wanakana";
import Link from 'next/link';

export default function KanjiList() {
    const [level, setLevel] = useState("JLPT N5 Kanji"); // Store a single selected value
    const levelHandler = () => {
        alert("Hardcoded backend in dev")
    }
    const [label, setLabel] = useState([]); // Store the list of labels
    const [selectedLabel, setSelectedLabel] = useState(''); // Store the selected label
    const [label_load, set_label_load] = useState(true);
    const [table, setTable] = useState([])

    useEffect(() => {
        const get_label = async () => {
            const get_tags = await fetch(`https://apizenkanji.kahitoz.com/v1/tags`);
            let raw_tags = await get_tags.json();
            console.log("raw_tags", raw_tags);
            setLabel(raw_tags['result']);
            set_label_load(false);
        };

        get_label();
    }, []);
    useEffect(() => {
        const get_data = async () => {
            if (selectedLabel === 'All') {
                let raw_kanji = await fetch(`https://apizenkanji.kahitoz.com/v1/get_kanji?label=${selectedLabel}`);
                let raw_data = await raw_kanji.json()
                let list = []
                for (let i = 0; i < label.length; i++) {

                    if (label[i] !== 'All') {
                        let s_label = label[i]
                        let kanji = []
                        for (let j = 0; j < raw_data.length; j++) {
                            if (label[i] === raw_data[j].tags) {
                                let get_kanji = raw_data[j].kanji
                                let meaning = raw_data[j].english
                                let onyo = raw_data[j].onyomi ? raw_data[j].onyomi + " (" + toRomaji(raw_data[j].onyomi) + ")" : "N/A";
                                let kunyo = raw_data[j].kunyomi ? raw_data[j].kunyomi + " (" + toRomaji(raw_data[j].kunyomi) + ")" : "N/A";
                                let h_onyo = raw_data[j].onyomi
                                let h_kunyo = raw_data[j].kunyomi
                                let json_data = { 'kanji': get_kanji, 'meaning': meaning, 'onyomi': onyo, 'kunyomi': kunyo, 'h_o': h_onyo, 'h_k': h_kunyo }
                                kanji.push(json_data)
                            }
                        }
                        let final_json = { 'label': s_label, 'data': kanji }
                        list.push(final_json)
                    }
                }
                setTable(list)
            }
            else {
                let raw_kanji = await fetch(`https://apizenkanji.kahitoz.com/v1/get_kanji?label=${selectedLabel}`);
                let raw_data = await raw_kanji.json()
                let list = []
                let kanji = []
                for (let j = 0; j < raw_data.length; j++) {
                    let get_kanji = raw_data[j].kanji
                    let meaning = raw_data[j].english
                    let onyo = raw_data[j].onyomi ? raw_data[j].onyomi + " (" + toRomaji(raw_data[j].onyomi) + ")" : "N/A";
                    let kunyo = raw_data[j].kunyomi ? raw_data[j].kunyomi + " (" + toRomaji(raw_data[j].kunyomi) + ")" : "N/A";
                    let h_onyo = raw_data[j].onyomi
                    let h_kunyo = raw_data[j].kunyomi
                    let json_data = { 'kanji': get_kanji, 'meaning': meaning, 'onyomi': onyo, 'kunyomi': kunyo, 'h_o': h_onyo, 'h_k': h_kunyo }
                    kanji.push(json_data)
                }
                let final_json = { 'label': selectedLabel, 'data': kanji }
                list.push(final_json)
                console.log("This is the label - ", selectedLabel)
                if (selectedLabel.length != 0) {
                    setTable(list)
                }


            }
        }
        get_data()
    }, [selectedLabel])

    const handleWordClick = (word) => {
        if (window.speechSynthesis) {
            const utterance = new SpeechSynthesisUtterance(word);

            utterance.lang = 'ja-JP'
            window.speechSynthesis.speak(utterance);
        } else {
            alert('Text to speech not supported in this browser')
        }
    }


    const handleLabelChange = (event) => {
        setSelectedLabel(event.target.value);

    };

    return (
        <div className="h-full">
            {/* Top fixed bar */}
            <div className="fixed top-0 left-0 right-0 z-10 h-8 bg-black">
            </div>

            {/* Scrollable content area */}
            <div className="h-full pt-8 pb-24 overflow-y-auto">
                <div className="w-full px-2 md:px-4 lg:px-12 py-0 md:py-4 ">
                    <div className="h-full">
                        <div className={'flex justify-between'}>
                            <Link href="/" passHref>
                            <button className={'bg-blue-500 text-white p-2 rounded-lg '}>
                                back
                            </button>
                            </Link>
                            <select
                                value={selectedLabel}
                                onChange={handleLabelChange}
                                className="p-2 border border-gray-300 rounded-lg text-black"
                            >
                                <option value="">Select a label</option>
                                {!label_load &&
                                    label.map((tag, index) => (
                                        <option key={index} value={tag}>
                                            {tag}
                                        </option>
                                    ))}
                            </select>
                        </div>

                        <p>{console.log(table)}</p>

                        <div>
                            {table.length > 0 ? (
                                table.map((item, index) => (
                                    <div key={index} className="p-0 my-2">
                                        <h3 className="font-bold text-center p-4">{item.label}</h3>
                                        <table className="border-collapse border border-gray-400 w-full">
                                            <thead>
                                            <tr className="bg-blue-500">
                                                <th className="border border-gray-400 p-2">SNo.</th>
                                                <th className="border border-gray-400 p-2">Kanji</th>
                                                <th className="border border-gray-400 p-2">Onyomi</th>
                                                <th className="border border-gray-400 p-2">Kunyomi</th>
                                                <th className="border border-gray-400 p-2">Meaning</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {item.data.map((kanji, i) => (
                                                <tr key={i} className="text-center">
                                                    <td className="border border-gray-400 p-1">{i + 1}</td>
                                                    <td className="border border-gray-400 p-1 font-bold">{kanji.kanji}</td>

                                                    {/* Onyomi */}
                                                    <td className="border border-gray-400 p-1 text-purple-500 font-bold">
                                                        <ul>
                                                            {JSON.parse(kanji.h_o).map((reading, idx) => (
                                                                <li
                                                                    key={idx}
                                                                    onClick={() => handleWordClick(reading)}
                                                                    className="hover:underline hover:cursor-pointer"
                                                                >
                                                                    {reading} ({toRomaji(reading)})
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </td>

                                                    {/* Kunyomi */}
                                                    <td className="border border-gray-400 p-1 text-purple-500 font-bold">
                                                        <ul>
                                                            {JSON.parse(kanji.h_k).map((reading, idx) => (
                                                                <li
                                                                    key={idx}
                                                                    onClick={() => handleWordClick(reading)}
                                                                    className="hover:underline hover:cursor-pointer"
                                                                >
                                                                    {reading} ({toRomaji(reading)})
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </td>

                                                    {/* Meaning */}
                                                    <td className="border border-gray-400 p-1">
                                                        <ul>
                                                            {kanji.meaning.split(";").map((meaning, idx) => (
                                                                <li key={idx}>{meaning.trim()}</li>
                                                            ))}
                                                        </ul>
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ))
                            ) : (
                                <p>No data available</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Optional bottom fixed bar (just like your chat input) */}
            {/*
        <div className="px-4 lg:px-32 fixed bottom-4 w-full">
            Bottom Fixed Content (if you need)
        </div>
        */}
        </div>
    );


}