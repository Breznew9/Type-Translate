import React, { useEffect, useState } from "react";
import {
  Globe,
  Languages,
  Loader2,
  ArrowRightLeft,
  RotateCcw,
  Copy,
  Check,
} from "lucide-react";
import { apiTranslation } from "../services/TypeNTranslateService";
import { translationParams } from "./Translation";

const TypeNTranslate: React.FC = () => {
  const [textInput, setTextInput] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [sourceLanguage, setSourceLanguage] = useState("en");
  const [targetLanguage, setTargetLanguage] = useState("es");
  const [isLoading, setIsLoading] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const [tooltipText, setTooltipText] = useState("");

  const handleTranslate = async () => {
    if (textInput.trim() === "") return;
    setIsLoading(true);
    try {
      const translationParams: translationParams = {
        textInput: textInput,
        sourceLanguage: sourceLanguage,
        targetLanguage: targetLanguage,
      };

      const response = await apiTranslation(translationParams);
      if (response.data && response.data.responseData.translatedText) {
        setTranslatedText(response.data.responseData.translatedText);
      } else {
        setTranslatedText("No translation available.");
      }
    } catch (error) {
      console.error("Error translating text:", error);
      setTranslatedText(
        "An error occurred during translation. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: any) => {
    const text = e.target.value;
    setTextInput(text);
    setCharacterCount(text.length);
  };

  const handleSwapLanguages = () => {
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
    setTextInput(translatedText);
    setTranslatedText(textInput);
  };

  const handleClear = () => {
    setTextInput("");
    setTranslatedText("");
    setCharacterCount(0);
  };

  const handleSourceLanguageSelector = (e: any) => {
    const source = e.target.value;
    setSourceLanguage(source);
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
  };

  useEffect(() => {
    if (copied) {
      setTimeout(() => setCopied(false), 2000);
    }
  }, [copied]);

  const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "it", name: "Italian" },
    { code: "pt", name: "Portuguese" },
    { code: "ru", name: "Russian" },
    { code: "ja", name: "Japanese" },
    { code: "ko", name: "Korean" },
  ];

  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="max-w-6xl flex items-center">
          <Languages className="w-7 h-7" />
          <h1 className="text-2xl font-bold">Type & Translate</h1>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-6">
        <div className="w-full bg-white rounded-xl shadow-xl border border-gray-200">
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="w-1/2">
                <select
                  value={sourceLanguage}
                  onChange={handleSourceLanguageSelector}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white"
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleSwapLanguages}
                className="p-2 rounded-full hover:bg-gray-100 transition duration-200 group relative"
                onMouseEnter={() => setTooltipText("Swap languages")}
                onMouseLeave={() => setTooltipText("")}
              >
                <ArrowRightLeft className="w-5 h-5 text-blue-600" />
                {tooltipText === "Swap languages" && (
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-sm py-1 px-2 rounded whitespace-nowrap">
                    Swap languages
                  </div>
                )}
              </button>

              <div className="w-1/2">
                <select
                  value={targetLanguage}
                  onChange={(e) => setTargetLanguage(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white"
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="relative">
                <textarea
                  className="w-full h-64 p-4 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none outline-none"
                  placeholder="Enter text to translate..."
                  value={textInput}
                  onChange={handleInputChange}
                />
                <div className="absolute bottom-4 right-4 flex items-center space-x-4 text-sm text-gray-500">
                  <span>{characterCount} characters</span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleCopy(textInput)}
                      className="p-1.5 rounded-full hover:bg-gray-100 transition duration-200"
                    >
                      {copied ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={handleClear}
                      className="p-1.5 rounded-full hover:bg-gray-100 transition duration-200"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="w-full h-64 p-4 rounded-lg border border-gray-200 bg-gray-50 overflow-auto">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    </div>
                  ) : translatedText ? (
                    <p className="text-gray-800">{translatedText}</p>
                  ) : (
                    <p className="text-gray-400 italic">
                      Translation will appear here...
                    </p>
                  )}
                </div>
                {translatedText && (
                  <div className="absolute bottom-4 right-4">
                    <button
                      onClick={() => handleCopy(translatedText)}
                      className="p-1.5 rounded-full hover:bg-gray-100 transition duration-200"
                    >
                      {copied ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-center">
              <button
                onClick={handleTranslate}
                disabled={isLoading}
                className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 shadow-sm"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin w-5 h-5" />
                    <span>Translating...</span>
                  </>
                ) : (
                  <>
                    <Languages className="w-5 h-5" />
                    <span>Translate</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TypeNTranslate;
