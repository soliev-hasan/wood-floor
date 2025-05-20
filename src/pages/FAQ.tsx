import React, { useState } from "react";
import "./FAQ.css";

const faqData = [
  {
    question: "How long does floor installation take?",
    answer:
      "It depends on the size and complexity of the project, but typically it takes 1 to 3 days.",
  },
  {
    question: "What materials do you use?",
    answer:
      "We work with various materials, including laminate, hardwood and vinyl.",
  },
  {
    question: "Do you offer a warranty?",
    answer: "Yes, we offer a warranty on all our work for up to 1 years.",
  },
  {
    question: "Do I need to prepare the space before installation?",
    answer:
      "Yes, we ask that you remove furniture and personal items from the work area to ensure a safe and efficient process.",
  },
  {
    question: "How do I maintain my new floor?",
    answer:
      "Regular sweeping and occasional damp mopping with a recommended cleaner will keep your floors looking great.",
  },
  {
    question: "Do you provide free estimates?",
    answer: "Yes, we offer free estimates for all flooring projects.",
  },
];

const FAQ: React.FC = () => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="faq-page">
      <h1>Frequently Asked Questions</h1>
      <div className="faq-list">
        {faqData.map((item, idx) => (
          <div
            className={`faq-item${hovered === idx ? " open" : ""}`}
            key={idx}
            onMouseEnter={() => setHovered(idx)}
            onMouseLeave={() => setHovered(null)}
          >
            <div className="faq-question">{item.question}</div>
            <div className="faq-answer">{item.answer}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
