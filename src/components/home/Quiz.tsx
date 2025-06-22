import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { quizQuestions, calculateQuizResults } from '../../data/quiz';
import { getCountryById } from '../../data/countries';
import { motion } from 'framer-motion';

const Quiz: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{[key: string]: string}>({});
  const [results, setResults] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  const handleOptionSelect = (questionId: string, value: string) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate results
      const recommendedCountries = calculateQuizResults(answers);
      setResults(recommendedCountries);
      setIsComplete(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setResults([]);
    setIsComplete(false);
  };

  const currentQ = quizQuestions[currentQuestion];
  
  const isNextDisabled = !answers[currentQ?.id];

  return (
    <section className="section bg-cream dark:bg-neutral-800">
      <div className="container-custom">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <HelpCircle size={24} className="text-primary-500" />
            <h2 className="text-3xl font-bold font-display text-neutral-800 dark:text-white">
              Find Your Ideal EU Homeschooling Destination
            </h2>
          </div>
          <p className="text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
            Answer a few questions to discover which European countries might be the best fit for your homeschooling journey.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg p-8">
            {!isComplete ? (
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Progress indicator */}
                <div className="flex mb-6">
                  {quizQuestions.map((_, index) => (
                    <div 
                      key={index} 
                      className={`h-1 rounded-full flex-1 mx-1 ${
                        index < currentQuestion 
                          ? 'bg-primary-500' 
                          : index === currentQuestion 
                            ? 'bg-primary-300' 
                            : 'bg-neutral-200 dark:bg-neutral-700'
                      }`}
                    ></div>
                  ))}
                </div>

                <h3 className="text-xl font-semibold mb-6 text-neutral-800 dark:text-neutral-100">
                  {currentQ.question}
                </h3>

                <div className="space-y-3">
                  {currentQ.options.map(option => (
                    <div 
                      key={option.id}
                      onClick={() => handleOptionSelect(currentQ.id, option.value)}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        answers[currentQ.id] === option.value 
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                          : 'border-neutral-200 hover:border-primary-300 dark:border-neutral-700 dark:hover:border-primary-700'
                      }`}
                    >
                      <div className="flex items-start">
                        <div className={`mt-1 w-5 h-5 rounded-full border flex-shrink-0 flex items-center justify-center ${
                          answers[currentQ.id] === option.value 
                            ? 'border-primary-500 bg-primary-500 text-white' 
                            : 'border-neutral-400 dark:border-neutral-500'
                        }`}>
                          {answers[currentQ.id] === option.value && (
                            <CheckCircle size={16} />
                          )}
                        </div>
                        <div className="ml-3">
                          <span className={`${
                            answers[currentQ.id] === option.value 
                              ? 'text-primary-800 dark:text-primary-200' 
                              : 'text-neutral-700 dark:text-neutral-300'
                          }`}>
                            {option.text}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    onClick={handleNext}
                    disabled={isNextDisabled}
                    className={`btn px-6 py-2 flex items-center space-x-2 ${
                      isNextDisabled
                        ? 'bg-neutral-300 cursor-not-allowed dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400'
                        : 'bg-primary-600 hover:bg-primary-700 text-white'
                    }`}
                  >
                    <span>{currentQuestion === quizQuestions.length - 1 ? 'See Results' : 'Next'}</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <CheckCircle size={60} className="mx-auto text-success-500 mb-6" />
                <h3 className="text-2xl font-bold mb-2 text-neutral-800 dark:text-neutral-100">
                  Your Recommended Destinations
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 mb-8">
                  Based on your preferences, these countries might be a good fit for your homeschooling journey.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {results.map(countryId => {
                    const country = getCountryById(countryId);
                    if (!country) return null;
                    
                    return (
                      <div key={country.id} className="card">
                        <div className="h-36 overflow-hidden">
                          <img 
                            src={country.headerImage} 
                            alt={country.name} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div className="p-4">
                          <h4 className="font-bold font-display mb-2">{country.name}</h4>
                          <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded text-sm mb-3 ${
                            country.verdict === 'green' 
                              ? 'bg-success-100 text-success-800' 
                              : country.verdict === 'yellow'
                                ? 'bg-warning-100 text-warning-800'
                                : 'bg-error-100 text-error-800'
                          }`}>
                            <span>{country.verdict === 'green' ? 'Easy' : country.verdict === 'yellow' ? 'Possible' : 'Difficult'}</span>
                          </div>
                          <Link 
                            to={`/destinations/${country.id}`} 
                            className="mt-2 btn-primary py-2 px-4 rounded text-sm inline-block"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={resetQuiz}
                    className="btn-outline"
                  >
                    Take Quiz Again
                  </button>
                  <Link to="/destinations" className="btn-primary ml-4">
                    Explore All Destinations
                  </Link>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Quiz;