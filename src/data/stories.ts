import { Story } from '../types';

export const stories: Story[] = [
  {
    id: '1',
    countryId: 'portugal',
    author: 'The Miller Family',
    avatarUrl: 'https://images.pexels.com/photos/1001850/pexels-photo-1001850.jpeg',
    title: 'From London to Lisbon: Our Homeschooling Journey',
    content: 'Moving from the UK to Portugal was a leap of faith for our family of five. We settled in Cascais, just outside Lisbon, and immediately connected with the local homeschooling community. The registration process was surprisingly straightforward - we submitted our educational plan to the local school board with Portuguese translations of all our documents.\n\nOur children (ages 8, 10, and 13) participate in the Lisbon English Homeschool Co-op twice weekly, where they enjoy science experiments, art projects, and field trips with other international families. We use a mix of UK and US curricula, supplemented with Portuguese language lessons and local history exploration.\n\nThe annual assessments have been positive experiences, focusing on progress rather than rigid standards. We\'ve found Portugal to be incredibly welcoming to homeschoolers, with its flexible legal framework and supportive expatriate community. The high-speed internet allows us to maintain online classes and connections, while the lower cost of living (compared to London) means we can invest in more educational resources and travel experiences throughout Europe.',
    date: '2023-11-10'
  },
  {
    id: '2',
    countryId: 'ireland',
    author: 'The Dupont Family',
    avatarUrl: 'https://images.pexels.com/photos/2467393/pexels-photo-2467393.jpeg',
    title: 'French Family Embracing Irish Freedom',
    content: 'After struggling with the increasingly restrictive homeschooling regulations in France, our family relocated to County Kerry, Ireland. As EU citizens, the transition was smooth, and registering with TUSLA for homeschooling was a positive experience compared to the French system.\n\nWe maintain our children\'s French language and cultural education using the CNED program while embracing Irish culture and English language learning. Our three children (ages.7, 9, and 12) have thrived with the freedom to pursue their interests in depth - marine biology for our oldest (inspired by the Atlantic coastline), traditional music for our middle child, and astronomy for our youngest.\n\nThe Irish Home Education Network has been an invaluable resource, connecting us with weekly meetups and special events. We\'ve been particularly impressed by how the assessment process respects diverse educational philosophies. The cost of living is higher than we expected, especially for housing, but the quality of life and educational freedom make it worthwhile. We appreciate that Ireland\'s constitutional protection of homeschooling provides security that our educational choices will remain protected.',
    date: '2023-10-25'
  },
  {
    id: '3',
    countryId: 'spain',
    author: 'The Bergman Family',
    avatarUrl: 'https://images.pexels.com/photos/1648396/pexels-photo-1648396.jpeg',
    title: 'Navigating the Spanish Homeschooling Landscape',
    content: 'As Swedish nationals, we chose Valencia as our base for remote work and homeschooling. The legal situation in Spain is complicated - homeschooling exists in a gray area. To establish a secure situation, we enrolled our children in a recognized online Swedish school which provides documentation we can show to local authorities if needed.\n\nWe connect with the local "educación en casa" community for weekly park days and cultural outings. Our children (ages 6 and 9) attend these gatherings to practice Spanish and make friends, while following their Swedish curriculum online. The community includes families from many different countries, creating a rich multilingual environment.\n\nValencia offers an excellent compromise - more legal flexibility than Sweden (where homeschooling is nearly impossible), affordable living, great climate, and good internet connectivity for our work and children\'s online classes. We maintain careful documentation of our educational activities and have established good relationships with local families. This approach has allowed us to create a stable situation while enriching our children\'s education with Mediterranean culture and multilingual experiences.\n\nFor families considering Spain, we recommend connecting with local communities before arriving and understanding the specific approach of your chosen region, as enforcement varies significantly across autonomous communities.',
    date: '2023-09-15'
  }
];

// Helper function to get stories by country ID
export const getStoriesByCountry = (countryId: string): Story[] => {
  return stories.filter(story => story.countryId === countryId);
};