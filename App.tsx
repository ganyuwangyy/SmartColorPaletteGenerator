import React, { useState, useCallback } from 'react';
import { generatePalette } from './services/geminiService';
import ColorPalette from './components/ColorPalette';
import { PaletteResponse } from './types';

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center my-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-pink-500"></div>
    </div>
);

const App: React.FC = () => {
    const [mood, setMood] = useState<string>('');
    const [paletteResponse, setPaletteResponse] = useState<PaletteResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!mood.trim()) {
            setError("Please enter a mood or keyword.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setPaletteResponse(null);

        try {
            const result = await generatePalette(mood);
            setPaletteResponse(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    }, [mood]);

    return (
        <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-4 selection:bg-pink-200">
            <main className="bg-white rounded-2xl shadow-lg shadow-emerald-200 p-6 sm:p-10 max-w-2xl w-full transform transition-all duration-300">
                <header className="text-center">
                    <h1 className="text-3xl sm:text-4xl font-bold text-pink-500 tracking-tight">
                        Smart Color Palette Generator
                    </h1>
                    <p className="mt-2 text-slate-500">
                        Describe a mood, get a cute & cheerful color palette!
                    </p>
                </header>

                <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3">
                    <input
                        type="text"
                        value={mood}
                        onChange={(e) => setMood(e.target.value)}
                        placeholder="Ketikkan Mood Desain Anda (e.g., Rustic, Futuristik)"
                        className="flex-grow w-full px-4 py-3 text-lg text-slate-700 bg-pink-50 border-2 border-pink-200 rounded-lg focus:outline-none focus:ring-4 focus:ring-pink-300 focus:border-pink-400 transition"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-8 py-3 bg-pink-500 text-white font-bold text-lg rounded-lg shadow-md hover:bg-pink-600 focus:outline-none focus:ring-4 focus:ring-pink-300 disabled:bg-pink-300 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                    >
                        Generate
                    </button>
                </form>

                <div className="mt-6 min-h-[250px]">
                    {isLoading && <LoadingSpinner />}
                    {error && (
                        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
                            <p className="font-bold">Oops!</p>
                            <p>{error}</p>
                        </div>
                    )}
                    {paletteResponse && (
                        <div className="animate-fade-in">
                            <ColorPalette colors={paletteResponse.palette} />
                            <blockquote className="mt-8 bg-sky-50 border-l-4 border-sky-300 p-4 rounded-r-lg">
                                <p className="text-slate-600 italic">
                                    {paletteResponse.justification}
                                </p>
                            </blockquote>
                        </div>
                    )}
                </div>
                 <footer className="text-center text-xs text-slate-400 mt-8">
                    <p>Powered by Gemini API</p>
                </footer>
            </main>
        </div>
    );
};

export default App;
