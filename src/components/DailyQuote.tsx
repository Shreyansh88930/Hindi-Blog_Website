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
      const index = today.getDate() % quotes.length; // rotates daily
      setQuote(quotes[index]);
    }
  }, []);

  if (!quote) return null;

  return (
    <div className="mt-6 text-center bg-gray-50 dark:bg-gray-800 p-4 rounded-xl shadow-md max-w-2xl mx-auto">
      <p className="text-xl text-gray-800 dark:text-gray-100 italic">“{quote.text}”</p>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">— {quote.author}</p>
    </div>
  );
};

export default DailyQuote;
