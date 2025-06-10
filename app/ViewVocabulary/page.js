"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import VocabConfig from "../components/VocabConfig";
import VocabCardView from "../components/VocabCardHolder";
import Link from "next/link";
import { authFetch } from "../middleware";

const api = process.env.NEXT_PUBLIC_API_URL;

function check_vocab_validity() {
  let time_cache = localStorage.getItem("vocab_time_cache");
  if (time_cache === null) {
    localStorage.setItem("vocab_time_cache", new Date().toISOString());
    return true;
  } else {
    let cachedTime = new Date(time_cache);
    let currentTime = new Date();
    let diffInMs = currentTime - cachedTime;
    let diffInHours = diffInMs / (1000 * 60 * 60);
    return diffInHours > 12;
  }
}

export default function MainVocabHandler() {
  const [vocabStore, setVocabStore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [configModal, setConfigModal] = useState(false);
  const [filteredVocab, setFilteredVocab] = useState([]);

  useEffect(() => {
    async function get_vocab_data() {
      setLoading(true);
      const cached_data = localStorage.getItem("cached_vocab_data");
      const check_cache_refresh = check_vocab_validity();

      if (!cached_data || check_cache_refresh) {
        try {
          const response = await authFetch(`${api}/flagged_vocab`);
          if (!response.ok) throw new Error("Failed to fetch vocab data");

          const vocab_data = await response.json();
          localStorage.setItem("cached_vocab_data", JSON.stringify(vocab_data));
          localStorage.setItem("vocab_time_cache", new Date().toISOString());
          setVocabStore(vocab_data);
        } catch (err) {
          console.error("Error fetching vocab:", err);
        }
      } else {
        setVocabStore(JSON.parse(cached_data));
      }
      setLoading(false);
    }

    get_vocab_data();
  }, []);

  const handleFilteredData = (filtered) => {
    setFilteredVocab(filtered);
    console.log("Filtered Data from Modal:", filtered);
  };

    
    return (
        <div>
            <nav className="fixed top-0 left-0 w-full dark:bg-[#2a2a2a] z-20">
                <div className="flex items-center justify-between w-full px-4 py-2">
                    <Link href='/Dashboard'>
                     <Image src={"/icons/back.svg"} width={20} height={20} alt="back" />
                    </Link>
                    
                    {!loading && (
                        <button onClick={() => setConfigModal(true)}>
                            <Image src={"/icons/settings.svg"} width={20} height={20} alt="settings" />
                        </button>
                    )}
                </div>
            </nav>

            {loading && (
                <div className="w-screen h-screen flex items-center justify-center">
                    <Image
                        src="/icons/loading.svg"
                        alt="loading"
                        width={60}
                        height={60}
                        className="animate-spin"
                    />
                </div>
            )}
            <div className="hidden">
            <VocabConfig
                    onClose={() => setConfigModal(false)}
                    VocabData={vocabStore}
                    onFilterChange={handleFilteredData}
                />
            </div>

            {configModal && vocabStore && (
                <VocabConfig
                    onClose={() => setConfigModal(false)}
                    VocabData={vocabStore}
                    onFilterChange={handleFilteredData}
                />
            )}

            {!loading && 
            <div className="w-screen h-screen flex items-center justify-center">
                <VocabCardView vocabList={filteredVocab}/>
            </div>
            }

            {/* Optional: Render filtered vocab preview */}
            {/* {filteredVocab?.length > 0 && (
                <div className="mt-4 p-4 text-sm text-white">
                    <h3 className="font-bold">Filtered Vocabulary:</h3>
                    <ul className="list-disc list-inside">
                        {filteredVocab.map((item) => (
                            <li key={item.index}>{item.index} -{item.word} - {item.meaning}</li>
                        ))}
                    </ul>
                </div>
            )} */}
        </div>
    );
}
