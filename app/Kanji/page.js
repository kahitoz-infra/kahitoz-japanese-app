"use client";
import { ReactSketchCanvas } from "react-sketch-canvas";
import { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { toRomaji } from "wanakana";

import "react-toastify/dist/ReactToastify.css";

const Kanji = () => {

  let api = process.env.NEXT_PUBLIC_BASE_API;

  const canvasRef = useRef(null);
  const [isEraser, setIsEraser] = useState(false);
  const [label, setLabel] = useState([]); // Store the list of labels
  const [selectedLabel, setSelectedLabel] = useState(''); // Store the selected label
  const [label_load, set_label_load] = useState(true);
  const [onyomi, setOnyomi] = useState('example');
  const [kunyomi, setKunyomi] = useState('example');
  const [kanji, setKanji] = useState('example');
  const [meaning, setMeaning] = useState('example');
  const [number, setNumber] = useState(0);
  const [count, setCount] = useState(0);
  const [kanjiData, setKanjiData] = useState([])
  const [random, setRandom] = useState(false)
  const [hearOnyo, setHearOnyo] = useState("")
  const [hearKunyo, setHearKunyo] = useState("")
  const [counter, setCoutner] = useState(0)
  const [length, setLength] = useState(0)
  const [totalSave, setTotalSave] = useState(0)
  const [totalFail, setTotalFail] = useState(0)

  // Toggle between Draw Mode & Eraser Mode
  const toggleEraser = () => {
    setIsEraser((prev) => !prev);
  };

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
    const get_kanji = async () => {
      if (!selectedLabel) return;
      setCoutner(0)
      const raw_kanji = await fetch(`/api/get_kanji?label=${selectedLabel}`);
      let kanji = await raw_kanji.json();
      setKanjiData(kanji)
      let length = kanji.length
      setCount(length)
      if (length > 0) {
        setLength(length)
        // const randomNumber = Math.floor(Math.random() * length);
        // console.log("This is the random number - ",randomNumber)
        const get_element = kanji[0]
        let onyo = get_element.onyomi ? `${get_element.onyomi} (${toRomaji(get_element.onyomi)})` : "N/A";
        let kunyo = get_element.kunyomi ? `${get_element.kunyomi} (${toRomaji(get_element.kunyomi)})` : "N/A";
        setKanji(get_element.kanji)
        setOnyomi(onyo)
        setHearOnyo(get_element.onyomi)
        setHearKunyo(get_element.kunyomi)
        setKunyomi(kunyo)
        setMeaning(get_element.english)
      }
    }
    get_kanji()
  }, [selectedLabel])

  useEffect(() => {
    const get_total_available = async () => {

      const numbers = await fetch(`/api/total_samples?folder_name=${kanji}`)
      let total_number = await numbers.json()
      setNumber(total_number.result)
    }
    get_total_available()

  }, [kanji])

  const onClickNext = () => {

    let kanji = kanjiData
    let length = kanji.length
    if (length > 0) {
      if (random) {
        const randomNumber = Math.floor(Math.random() * length);
        const get_element = kanji[randomNumber]
        let onyo = get_element.onyomi ? get_element.onyomi + " (" + toRomaji(get_element.onyomi) + ")" : "N/A";
        let kunyo = get_element.kunyomi ? get_element.kunyomi + " (" + toRomaji(get_element.kunyomi) + ")" : "N/A";

        setKanji(get_element.kanji)
        setHearOnyo(get_element.onyomi)
        setHearKunyo(get_element.kunyomi)
        setOnyomi(onyo)
        setKunyomi(kunyo)
        setMeaning(get_element.english)
      }
      else {
        setCoutner((prevCounter) => {
          let newCounter = prevCounter + 1;

          if (newCounter < kanjiData.length) {
            const get_element = kanjiData[newCounter];
            console.log(kanjiData.length, newCounter);

            let onyo = get_element.onyomi ? `${get_element.onyomi} (${toRomaji(get_element.onyomi)})` : "N/A";
            let kunyo = get_element.kunyomi ? `${get_element.kunyomi} (${toRomaji(get_element.kunyomi)})` : "N/A";

            setKanji(get_element.kanji);
            setOnyomi(onyo);
            setHearOnyo(get_element.onyomi)
            setHearKunyo(get_element.kunyomi)
            setKunyomi(kunyo);
            setMeaning(get_element.english);

            return newCounter;
          }

          return prevCounter; // Prevents counter from exceeding array length
        });
      }
    }
  }

  const onClickPrev = () => {
    setCoutner((prevCounter) => {
      let newCounter = prevCounter - 1;

      if (newCounter >= 0) {
        const get_element = kanjiData[newCounter];

        let onyo = get_element.onyomi ? `${get_element.onyomi} (${toRomaji(get_element.onyomi)})` : "N/A";
        let kunyo = get_element.kunyomi ? `${get_element.kunyomi} (${toRomaji(get_element.kunyomi)})` : "N/A";

        setKanji(get_element.kanji);
        setHearOnyo(get_element.onyomi)
        setHearKunyo(get_element.kunyomi)
        setOnyomi(onyo);
        setKunyomi(kunyo);
        setMeaning(get_element.english);

        return newCounter;
      }

      return prevCounter; // Prevents counter from going negative
    });
  };


  // Handle dropdown change
  const handleLabelChange = (event) => {
    setSelectedLabel(event.target.value);
    // You can add additional logic here to fetch data based on the selected label
  };



  const handleClear = () => {
    if (canvasRef.current) {
      canvasRef.current.clearCanvas();
    }
  };

  // Save sketch to FastAPI server for character training
  const handleSave = async () => {
    if (!canvasRef.current) return;
    handleClear();

    try {
      const imageData = await canvasRef.current.exportImage("png");
      const blob = await fetch(imageData).then((res) => res.blob());

      const formData = new FormData();
      formData.append("file", blob, "character.png");

      // Send to Next.js API instead of backend directly
      const response = await fetch(`/api/upload?file_name=${encodeURIComponent(kanji)}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      const result = await response.json();
      setTotalSave(totalSave + 1)
    } catch (error) {
      setTotalFail(totalFail + 1)
    }
  };


  const randomOnClick = () => {
    setRandom(!random)
  }


  const handleWordClick = (word) => {
    if (window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(word);
  
      utterance.lang = 'ja-JP'
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Text to speech not supported in this browser')
    }
  }

  return (
    <div className="flex flex-col items-center lg:justify-center min-h-screen p-4">
      <ToastContainer />
      <div className="flex gap-x-2">
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
        <div>
          {!random ? (<button className="p-1 rounded-lg bg-blue-500" onClick={() => setRandom(!random)}>Serialized</button>) : (<button className="p-1 rounded-lg bg-red-500" onClick={() => setRandom(!random)}>Randomized</button>)}

        </div>

      </div>

      <div>
        Total Kanji Available for the selected label - {count}
      </div>


      <div className="flex items-center mt-4">
        <p className="text-3xl"><b> {kanji}</b> </p>
        <p>({meaning})</p>
      </div>
      <div className="flex gap-x-4 mb-2">
        <p onClick={() => handleWordClick(hearOnyo)}>
          Onyomi - <b className="text-purple-500 hover:cursor-pointer">{onyomi}</b>
        </p>
        <p onClick={() => handleWordClick(hearKunyo)}>
          Kunyomi - <b className="text-purple-500 hover:cursor-pointer">{kunyomi}</b>
        </p>

      </div>
      <div className="flex flex-row-reverse">
        <div className="relative w-[90vw] max-w-[400px] h-[90vw] max-h-[400px] border border-gray-300 shadow-lg bg-gray-200 rounded-lg">
          <ReactSketchCanvas
            ref={canvasRef}
            strokeWidth={isEraser ? 20 : 4}
            strokeColor={isEraser ? "white" : "black"}
            width="100%"
            height="100%"
            className="rounded-lg"
          />
        </div>

        <div className="flex flex-col items-center justify-center gap-y-2 lg:me-4">
          <button
            onClick={toggleEraser}
            className={`px-1 py-1 text-white rounded-lg shadow-md ${isEraser ? "bg-gray-700" : "bg-green-500"
              }`}
          >
            {isEraser ? " Draw" : "Erase"}
          </button>



          <button
            onClick={handleClear}
            className="px-1 py-1 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-700"
          >
            Clear
          </button>
        </div>
      </div>
      <div className="flex gap-x-2 mt-4">
        {!random && (
          <button className="bg-blue-500 p-2 rounded-xl border border-white" onClick={() => onClickPrev()}>
            Prev
          </button>
        )}
        <button
          onClick={handleSave}
          className="px-1 py-1 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-700"
        >
          Save
        </button>

        <button className="bg-blue-500 p-2 rounded-xl border border-white" onClick={() => onClickNext()}>
          Next
        </button>
      </div>
      <div className="mt-4 flex flex-col justify-center items-center">
        <p>
          Kanji Info stats
        </p>
        <p>
          Number of sample available in the dataset - {number}
        </p>
        <p>
          Saved - {totalSave} \-/
          Failed - {totalFail}
        </p>
      </div>
    </div>
  );
};

export default Kanji;