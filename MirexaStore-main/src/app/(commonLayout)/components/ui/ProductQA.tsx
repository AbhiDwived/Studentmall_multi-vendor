"use client";

import React, { useState } from 'react';
import { HiQuestionMarkCircle, HiReply } from 'react-icons/hi';
import toast from 'react-hot-toast';

interface QAItem {
  id: string;
  question: string;
  answer?: string;
  askedBy: string;
  askedAt: string;
  answeredAt?: string;
}

interface ProductQAProps {
  productId: string;
}

const ProductQA: React.FC<ProductQAProps> = ({ productId }) => {
  const [questions, setQuestions] = useState<QAItem[]>([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [showAskForm, setShowAskForm] = useState(false);

  const handleAskQuestion = () => {
    if (!newQuestion.trim()) return;
    
    const question: QAItem = {
      id: Date.now().toString(),
      question: newQuestion,
      askedBy: 'You',
      askedAt: new Date().toISOString()
    };
    
    setQuestions([question, ...questions]);
    setNewQuestion('');
    setShowAskForm(false);
    toast.success('Question submitted! You will be notified when answered.');
  };

  return (
    <div className="mt-8 bg-white p-6 border border-gray-200 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <HiQuestionMarkCircle className="w-5 h-5 text-blue-600" />
          <h3 className="text-xl font-semibold text-gray-800">Questions & Answers</h3>
        </div>
        <button
          onClick={() => setShowAskForm(!showAskForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Ask Question
        </button>
      </div>

      {showAskForm && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <textarea
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder="Ask your question about this product..."
            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={3}
          />
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleAskQuestion}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Submit Question
            </button>
            <button
              onClick={() => setShowAskForm(false)}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {questions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <HiQuestionMarkCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No questions yet. Be the first to ask!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((qa) => (
            <div key={qa.id} className="border-b border-gray-100 pb-4">
              <div className="mb-2">
                <p className="font-medium text-gray-800">Q: {qa.question}</p>
                <p className="text-xs text-gray-500">
                  Asked by {qa.askedBy} • {new Date(qa.askedAt).toLocaleDateString()}
                </p>
              </div>
              {qa.answer ? (
                <div className="ml-4 p-3 bg-green-50 rounded">
                  <div className="flex items-start gap-2">
                    <HiReply className="w-4 h-4 text-green-600 mt-1" />
                    <div>
                      <p className="text-gray-700">{qa.answer}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Answered on {qa.answeredAt && new Date(qa.answeredAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="ml-4 text-sm text-orange-600 italic">Waiting for answer...</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductQA;
