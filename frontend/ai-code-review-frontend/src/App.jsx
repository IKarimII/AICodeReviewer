import { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

function App() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState(null);
  const [language, setLanguage] = useState("javascript");
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = (
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8008"
  ).replace(/\/$/, "");

  function normalizeResult(output) {
    if (typeof output === "string") {
      const trimmed = output.trim();
      if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
        try {
          return JSON.parse(trimmed);
        } catch {
          return output;
        }
      }
      return output;
    }
    return output;
  }

  function renderValue(value) {
    if (value === null || value === undefined) return "";
    if (typeof value === "string" || typeof value === "number")
      return String(value);
    if (Array.isArray(value)) {
      return value
        .map((v) => (typeof v === "string" ? v : JSON.stringify(v)))
        .join("\n");
    }
    if (typeof value === "object") {
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  }

  const languages = [
    { value: "javascript", label: "JavaScript" },
    { value: "typescript", label: "TypeScript" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
    { value: "csharp", label: "C#" },
    { value: "cpp", label: "C++" },
    { value: "go", label: "Go" },
    { value: "php", label: "PHP" },
    { value: "ruby", label: "Ruby" },
    { value: "shell command", label: "CMD" },
  ];

  async function reviewCode() {
    setLoading(true);
    setResult(null);

    if (!code.trim()) {
      toast.error("Please paste some code first.");
      setLoading(false);
      return;
    }

    if (!language) {
      toast.error("Please select a language.");
      setLoading(false);
      return;
    }

    try {
      const url = `${API_BASE_URL}/request/review`;
      const response = await axios.post(url, {
        code,
        language,
      });

      if (!response.data.success) {
        throw new Error(response.data.error || "Review failed");
      }
      setResult(normalizeResult(response.data.output));
    } catch (error) {
      toast.error(
        error.response?.data?.error || error.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="min-h-screen bg-black text-white flex flex-col p-6 gap-6">
      <Toaster position="top-right" toastOptions={{ duration: 3500 }} />
      <h1 className="text-3xl font-bold">AI Code Reviewer</h1>

      <div className="w-full flex-1 min-h-0 flex flex-row gap-6">
        <div className="flex-2 min-h-0 gap-2 flex flex-col">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold">Your code</h2>
            <label className="flex items-center gap-2 text-sm text-zinc-300">
              Language
              <select
                className="rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 text-white focus:outline-none"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                {languages.map((l) => (
                  <option key={l.value} value={l.value}>
                    {l.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <textarea
            className="w-full flex-1 min-h-0 p-4 bg-zinc-800 rounded-lg border border-zinc-700 focus:outline-none resize-none"
            placeholder="Paste your code here..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>

        <div className="flex-1 min-h-0 flex flex-col gap-2">
          <h2 className="text-lg font-bold">Response</h2>
          <div className="w-full flex-1 min-h-0 p-4 bg-zinc-900 rounded-lg border border-zinc-700 overflow-auto whitespace-pre-wrap flex flex-col gap-3">
            {result ? (
              <>
                <h3 className="text-lg font-semibold">Issues</h3>
                <pre className="whitespace-pre-wrap wrap-break-word">
                  {renderValue(result.issues ?? result)}
                </pre>
                <h3 className="text-lg font-semibold">Improvements</h3>
                <pre className="whitespace-pre-wrap wrap-break-word">
                  {renderValue(result.improvements)}
                </pre>
                <h3 className="text-lg font-semibold">Explanation</h3>
                <pre className="whitespace-pre-wrap wrap-break-word">
                  {renderValue(result.explanation)}
                </pre>
              </>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
      <button
        onClick={reviewCode}
        disabled={loading}
        className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50"
      >
        {loading ? "Reviewing..." : "Review Code"}
      </button>
    </div>
  );
}

export default App;
