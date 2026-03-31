import { useState } from 'react';
import { Star, Send, X } from 'lucide-react';

export default function Feedback({ isOpen, onClose }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, send to backend here
    setSubmitted(true);
    setTimeout(() => {
      onClose();
      setSubmitted(false);
      setRating(0);
      setFeedback('');
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Modal / Widget */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative border border-slate-200 dark:border-slate-800">
          {/* Header */}
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Send Feedback</h3>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

            {/* Content */}
            <div className="p-6">
              {submitted ? (
                <div className="py-8 text-center flex flex-col items-center animate-in zoom-in duration-300">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                    <Star className="w-8 h-8 text-green-600 dark:text-green-400 fill-current" />
                  </div>
                  <h4 className="text-lg font-medium text-slate-800 dark:text-slate-100">Thank you!</h4>
                  <p className="text-sm text-slate-500 mt-1">Your feedback helps us improve.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
                  {/* Star Rating */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 text-center">
                      How would you rate your experience?
                    </label>
                    <div className="flex gap-2 justify-center py-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setRating(star)}
                          className="p-1 focus:outline-none transition-transform hover:scale-110"
                        >
                          <Star 
                            className={`w-8 h-8 ${
                              star <= (hoverRating || rating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-slate-300 dark:text-slate-600 line-through-none'
                            } transition-colors`} 
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Text Feedback */}
                  <div>
                    <label htmlFor="feedback" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Tell us more (optional)
                    </label>
                    <textarea
                      id="feedback"
                      rows="4"
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="What do you think we could improve?"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary dark:text-white transition-shadow"
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={rating === 0}
                    className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dim focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <Send className="w-4 h-4" />
                    Submit Feedback
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
    </>
  );
}
