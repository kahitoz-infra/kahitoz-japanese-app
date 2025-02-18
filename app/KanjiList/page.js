"use client"
import { useState, useEffect } from "react"
import { toRomaji } from "wanakana";

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
            const get_tags = await fetch(`/api/tags`);
            let raw_tags = await get_tags.json();
            setLabel(raw_tags['result']);
            set_label_load(false);
        };

        get_label();
    }, []);
    useEffect(() => {
        const get_data = async () => {
            if (selectedLabel === 'All') {
                let raw_kanji = await fetch(`/api/get_kanji?label=${selectedLabel}`);
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
                let raw_kanji = await fetch(`/api/get_kanji?label=${selectedLabel}`);
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
        <div >
            <div>
                <select
                    value={level} // Ensure this is a single string
                    onChange={(e) => setLevel(e.target.value)} // Update with a single value
                    className="p-2 border border-gray-300 rounded-lg text-black"
                >
                    <option value="">Select Level</option>
                    {["JLPT N5 Kanji", "JLPT N4 Kanji"].map((tag, index) => (
                        <option key={index} value={tag}>
                            {tag}
                        </option>
                    ))}
                </select>

            </div>
            <div >
                <select
                    value={selectedLabel}
                    onChange={handleLabelChange}
                    className="p-2 border border-gray-300 rounded-lg text-black"
                >
                    <option value="">Select a label</option>
                    {!label_load && label.map((tag, index) => (

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
                        <div key={index} className="border p-2 my-2">
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
                                            <td className="border border-gray-400 p-2">{i + 1}</td>
                                            <td className="border border-gray-400 p-2 font-bold">{kanji.kanji}</td>
                                            <td className="border border-gray-400 p-2 text-purple-500 font-bold hover:cursor-pointer" onClick={() => handleWordClick(kanji.h_o)} >{kanji.onyomi}</td>
                                            <td className="border border-gray-400 p-2 text-purple-500 font-bold hover:cursor-pointer" onClick={() => handleWordClick(kanji.h_k)}>{kanji.kunyomi}</td>
                                            <td className="border border-gray-400 p-2">{kanji.meaning}</td>
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
    )
}