import { authFetch } from "../middleware";

const vocab_api = process.env.NEXT_PUBLIC_API_URL + "/flagged_vocab";
const update_vocab_api = process.env.NEXT_PUBLIC_API_URL + "/update_vocab_flag";
const kanji_api = process.env.NEXT_PUBLIC_API_URL + "/flagged_kanjis";
const update_kanji_api = process.env.NEXT_PUBLIC_API_URL + "/update_flag";
const grammar_api = process.env.NEXT_PUBLIC_API_URL + "/flagged_grammar";
const update_grammar_api = process.env.NEXT_PUBLIC_API_URL + "/update_grammar_flag";
const verb_api = process.env.NEXT_PUBLIC_API_URL + "/flagged_verb";
const update_verb_api = process.env.NEXT_PUBLIC_API_URL + "/update_verb_flag";

export async function fetch_vocab_data() {
  const CACHE_KEY = "cacheVocab";
  const TIMESTAMP_KEY = "cacheVocabTimestamp";
  const CACHE_DURATION = 12 * 60 * 60 * 1000;
  const now = Date.now();
  const cachedTimestamp = localStorage.getItem(TIMESTAMP_KEY);
  const cachedData = localStorage.getItem(CACHE_KEY);

  // If cache exists and is valid
  if (
    cachedTimestamp &&
    cachedData &&
    now - parseInt(cachedTimestamp, 10) < CACHE_DURATION
  ) {
    return JSON.parse(cachedData);
  }

  try {
    const res = await authFetch(vocab_api);
    if (!res.ok) {
      throw new Error("Failed to fetch vocab data");
    }

    const data = await res.json();

    // Cache the data and timestamp
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    localStorage.setItem(TIMESTAMP_KEY, now.toString());

    return data;
  } catch (err) {
    console.error("Error fetching vocab data:", err);
    // Fallback to cached data if available
    if (cachedData) {
      return JSON.parse(cachedData);
    }
    return null;
  }
}

export async function update_bookmark_fetch(
  operation_type,
  uid,
  type = "vocab"
) {
  const json_body = {
    operation_type: operation_type,
    t_id: uid,
  };

  let apiUrl;

  switch (type) {
    case "kanji":
      apiUrl = update_kanji_api;
      break;
    case "vocab":
      apiUrl = update_vocab_api;
      break;
    case "grammar":
      apiUrl = update_grammar_api;
      break;
    case "verb":
      apiUrl = update_verb_api;
      break;
    default:
      console.error(`Unknown type: ${type}`);
      throw new Error(`Unsupported type: ${type}`);
  }

  try {
    const res = await authFetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(json_body),
    });

    if (!res.ok) {
      console.error(`Failed to update bookmark: ${res.status}`);
    }

    return res;
  } catch (err) {
    console.error("Error updating bookmark:", err);
    throw err;
  }
}

export async function fetch_kanji_data() {
  const CACHE_KEY = "cacheKanji";
  const TIMESTAMP_KEY = "cacheKanjiTimestamp";
  const CACHE_DURATION = 12 * 60 * 60 * 1000;
  const now = Date.now();
  const cachedTimestamp = localStorage.getItem(TIMESTAMP_KEY);
  const cachedData = localStorage.getItem(CACHE_KEY);

  // If cache exists and is valid
  if (
    cachedTimestamp &&
    cachedData &&
    now - parseInt(cachedTimestamp, 10) < CACHE_DURATION
  ) {
    return JSON.parse(cachedData);
  }

  try {
    const res = await authFetch(kanji_api);
    if (!res.ok) {
      throw new Error("Failed to fetch kanji data");
    }

    const data = await res.json();

    // Cache the data and timestamp
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    localStorage.setItem(TIMESTAMP_KEY, now.toString());

    return data;
  } catch (err) {
    console.error("Error fetching kanji data:", err);
    // Fallback to cached data if available
    if (cachedData) {
      return JSON.parse(cachedData);
    }
    return null;
  }
}


export async function fetch_grammar_data() {
  const CACHE_KEY = "cacheGrammar";
  const TIMESTAMP_KEY = "cacheGrammarTimestamp";
  const CACHE_DURATION = 12 * 60 * 60 * 1000;
  const now = Date.now();
  const cachedTimestamp = localStorage.getItem(TIMESTAMP_KEY);
  const cachedData = localStorage.getItem(CACHE_KEY);

  // If cache exists and is valid
  if (
    cachedTimestamp &&
    cachedData &&
    now - parseInt(cachedTimestamp, 10) < CACHE_DURATION
  ) {
    return JSON.parse(cachedData);
  }

  try {
    const res = await authFetch(grammar_api);
    if (!res.ok) {
      throw new Error("Failed to fetch kanji data");
    }

    const data = await res.json();

    // Cache the data and timestamp
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    localStorage.setItem(TIMESTAMP_KEY, now.toString());

    return data;
  } catch (err) {
    console.error("Error fetching grammar data:", err);
    // Fallback to cached data if available
    if (cachedData) {
      return JSON.parse(cachedData);
    }
    return null;
  }
}

export async function fetch_verb_data() {
  const CACHE_KEY = "cacheVerb";
  const TIMESTAMP_KEY = "cacheVerbTimestamp";
  const CACHE_DURATION = 12 * 60 * 60 * 1000;
  const now = Date.now();
  const cachedTimestamp = localStorage.getItem(TIMESTAMP_KEY);
  const cachedData = localStorage.getItem(CACHE_KEY);

  // If cache exists and is valid
  if (
    cachedTimestamp &&
    cachedData &&
    now - parseInt(cachedTimestamp, 10) < CACHE_DURATION
  ) {
    return JSON.parse(cachedData);
  }

  try {
    const res = await authFetch(verb_api);
    if (!res.ok) {
      throw new Error("Failed to fetch verb data");
    }

    const data = await res.json();

    // Cache the data and timestamp
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    localStorage.setItem(TIMESTAMP_KEY, now.toString());

    return data;
  } catch (err) {
    console.error("Error fetching vocab data:", err);
    // Fallback to cached data if available
    if (cachedData) {
      return JSON.parse(cachedData);
    }
    return null;
  }
}