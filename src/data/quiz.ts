import { QuizQuestion } from '../types';

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'How important is legal clarity for your homeschooling situation?',
    options: [
      {
        id: 'q1a',
        text: 'Critical - I need full legal protection and clarity',
        value: 'legal_critical'
      },
      {
        id: 'q1b',
        text: 'Important - I prefer clear legal status but can navigate some gray areas',
        value: 'legal_important'
      },
      {
        id: 'q1c',
        text: 'Flexible - I can work with legal gray areas if necessary',
        value: 'legal_flexible'
      },
      {
        id: 'q1d',
        text: 'Not concerned - I\'m confident in finding solutions regardless',
        value: 'legal_unconcerned'
      }
    ]
  },
  {
    id: 'q2',
    question: 'Do you need English-speaking homeschool communities?',
    options: [
      {
        id: 'q2a',
        text: 'Essential - We need strong English-speaking communities',
        value: 'english_essential'
      },
      {
        id: 'q2b',
        text: 'Preferred - English communities are important but not critical',
        value: 'english_preferred'
      },
      {
        id: 'q2c',
        text: 'Nice to have - We can manage without but would appreciate some',
        value: 'english_nice'
      },
      {
        id: 'q2d',
        text: 'Not important - We don\'t need English-speaking communities',
        value: 'english_unnecessary'
      }
    ]
  },
  {
    id: 'q3',
    question: 'What is your native language and how important is education in that language?',
    options: [
      {
        id: 'q3a',
        text: 'We need resources in our native non-English language (e.g., German, French)',
        value: 'native_critical'
      },
      {
        id: 'q3b',
        text: 'We\'d like some resources in our native language but are flexible',
        value: 'native_important'
      },
      {
        id: 'q3c',
        text: 'We\'re primarily focused on English-language education',
        value: 'english_primary'
      },
      {
        id: 'q3d',
        text: 'We\'re interested in multilingual education with local language immersion',
        value: 'multilingual'
      }
    ]
  },
  {
    id: 'q4',
    question: 'What is your monthly budget for living expenses (for a family of 4)?',
    options: [
      {
        id: 'q4a',
        text: 'Under €2,000/month',
        value: 'budget_low'
      },
      {
        id: 'q4b',
        text: '€2,000-€2,500/month',
        value: 'budget_medium'
      },
      {
        id: 'q4c',
        text: '€2,500-€3,500/month',
        value: 'budget_high'
      },
      {
        id: 'q4d',
        text: 'Over €3,500/month',
        value: 'budget_very_high'
      }
    ]
  }
];

// Quiz logic to calculate results based on answers
export const calculateQuizResults = (answers: {[key: string]: string}): string[] => {
  // This is a simplified recommendation engine
  // In a real implementation, this would be more sophisticated
  
  // Mock implementation for MVP
  if (answers.q1 === 'legal_critical') {
    if (answers.q2 === 'english_essential') {
      return ['ireland', 'portugal'];
    } else {
      return ['portugal', 'ireland'];
    }
  } else if (answers.q1 === 'legal_important' || answers.q1 === 'legal_flexible') {
    if (answers.q3 === 'native_critical' || answers.q3 === 'multilingual') {
      return ['spain', 'france'];
    } else {
      return ['netherlands', 'spain'];
    }
  } else {
    // For budget-conscious
    if (answers.q4 === 'budget_low' || answers.q4 === 'budget_medium') {
      return ['portugal', 'spain'];
    } else {
      return ['ireland', 'netherlands'];
    }
  }
};