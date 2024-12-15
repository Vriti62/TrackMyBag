const fs = require('fs');
const path = require('path');


const chatbotDataPath = path.join(__dirname, '../data/chatbotResponses.json');


const readChatbotData = () => {
  try {
    const data = fs.readFileSync(chatbotDataPath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading chatbot data:', err);
    return [];
  }
};


const getRandomQuestions = (array, count) => {
  return array.sort(() => 0.5 - Math.random()).slice(0, count);
};

let matchedQuestions = [];

const getResponse = (req, res) => {
  const { query, selectedQuestionIndex } = req.body;


  if (query) {
    const lowerCaseQuery = query.trim().toLowerCase();
    const chatbotData = readChatbotData();

    matchedQuestions = chatbotData.filter(item =>
      item.question.toLowerCase().includes(lowerCaseQuery)
    );

    if (matchedQuestions.length === 0) {
      return res.json({ reply: 'No matching questions found. Please try again.' });
    }

    const randomQuestions = getRandomQuestions(matchedQuestions, 5);

    return res.json({
      suggestions: randomQuestions.map((item, index) => ({
        id: item.id || index + 1, 
        question: item.question,
      })),
    });
  }

  if (typeof selectedQuestionIndex === 'number') {
    const selectedQuestion = matchedQuestions.find(
      question => question.id === selectedQuestionIndex
    );

    if (!selectedQuestion) {
      return res.status(400).json({
        reply: 'Invalid question ID selected. Please select a valid question from the list.',
      });
    }

    const selectedAnswer = selectedQuestion.answer;

    if (selectedAnswer) {
      return res.json({
        reply: selectedAnswer,
      });
    }

    return res.status(400).json({ reply: 'Answer not found for the selected question.' });
  }

  return res.status(400).json({ reply: 'Query or question ID is required.' });
};

module.exports = { getResponse };
