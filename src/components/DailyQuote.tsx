import React, { useEffect, useState } from 'react';
import quotes from '../data/quotes.json';

interface Quote {
  text: string;
  author: string;
}

const DailyQuote: React.FC = () => {
  const [quote, setQuote] = useState<Quote | null>(null);

  useEffect(() => {
    if (quotes.length > 0) {
      const today = new Date();
      const index = today.getDate() % quotes.length;
      setQuote(quotes[index]);
    }
  }, []);

  if (!quote) return null;

  return (
    <div className="mt-6 px-4 sm:px-6 md:px-8 text-center bg-gray-50 dark:bg-gray-800 py-4 sm:py-6 md:py-8 rounded-xl shadow-md max-w-2xl mx-auto">
      <p className="text-lg sm:text-xl md:text-2xl text-gray-800 dark:text-gray-100 italic leading-snug">
        “{quote.text}”
      </p>
      <p className="mt-3 text-sm sm:text-base text-gray-500 dark:text-gray-400">
        — {quote.author}
      </p>
    </div>
  );
};

export default DailyQuote;
