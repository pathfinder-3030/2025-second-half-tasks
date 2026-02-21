"use client";

import { useState } from "react";

interface CityAddFormProps {
  onAdd: (cityName: string) => void;
  disabled?: boolean;
}

export default function CityAddForm({ onAdd, disabled }: CityAddFormProps) {
  const [cityInput, setCityInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedCity = cityInput.trim();
    if (!trimmedCity) {
      return;
    }

    onAdd(trimmedCity);
    setCityInput("");
  };

  return (
    <div className="mb-8 max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={cityInput}
          onChange={(e) => setCityInput(e.target.value)}
          placeholder="都市名を入力 (例: London)"
          aria-label="都市名を入力"
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={disabled}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg transition-colors duration-200"
        >
          追加
        </button>
      </form>
    </div>
  );
}
