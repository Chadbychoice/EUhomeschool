import { Comment } from '../types';

export const comments: Comment[] = [
  {
    id: '1',
    countryId: 'portugal',
    author: 'Maria Johnson',
    avatarUrl: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
    date: '2023-10-15',
    content: 'We\'ve been homeschooling our children in Lisbon for the past 2 years. The English-speaking co-op here has been absolutely amazing for science projects and field trips. Registration with the local authorities was straightforward once we had all our documents translated. The community is incredibly supportive!'
  },
  {
    id: '2',
    countryId: 'portugal',
    author: 'Thomas Weber',
    avatarUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    date: '2023-09-28',
    content: 'As Germans living in the Algarve, we\'ve found a wonderful balance using Deutsche Fernschule curricula while connecting with local homeschoolers in Faro. Our children are becoming trilingual (German, English, and now Portuguese). The assessment process is reasonable, though make sure to have a good translator for official meetings.'
  },
  {
    id: '3',
    countryId: 'portugal',
    author: 'Elena Kovalenko',
    avatarUrl: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
    date: '2023-11-02',
    content: 'Porto has a smaller but growing homeschool community. We connect weekly at Parque da Cidade and organize frequent educational outings. Finding tutors for specific subjects has been easy here, especially for STEM subjects. The internet is reliable for online classes even in our somewhat rural location outside the city.'
  },
  {
    id: '4',
    countryId: 'ireland',
    author: 'Sean Murphy',
    avatarUrl: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg',
    date: '2023-10-22',
    content: 'The registration process with TUSLA (Child and Family Agency) in Ireland was straightforward but thorough. Our assessment was conducted at home and focused on our educational philosophy and resources. Dublin has a fantastic homeschooling network that organizes weekly meetups at Phoenix Park and regular educational workshops. Highly recommend connecting with HEN (Home Education Network) immediately upon arrival.'
  },
  {
    id: '5',
    countryId: 'ireland',
    author: 'Francesca Rossi',
    avatarUrl: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg',
    date: '2023-09-18',
    content: 'As Italians in Cork, we\'ve been amazed at how easy it\'s been to homeschool while maintaining our language and cultural ties. We use Italian curricula from Scuola Erickson alongside English resources. The Cork Homeschool Association has been incredibly welcoming, and they even helped us connect with other Italian families in the area. The constitutional protection of homeschooling here gives great peace of mind.'
  },
  {
    id: '6',
    countryId: 'spain',
    author: 'David Wilson',
    avatarUrl: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
    date: '2023-11-12',
    content: 'The legal gray area in Spain can be nerve-wracking. In Barcelona, we\'ve registered with a private umbrella school in the UK and keep detailed records of our children\'s education. The local education authorities haven\'t given us any issues, but I\'ve heard different stories from other regions. The Barcelona Home Learners group has been essential for support and local knowledge. There are many bilingual families here which enriches the learning experience.'
  },
  {
    id: '7',
    countryId: 'germany',
    author: 'Anna Schmidt',
    avatarUrl: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
    date: '2023-10-05',
    content: 'Unfortunately, we had to leave Germany due to the strict anti-homeschooling laws. Despite having a PhD in education, I was not permitted to educate my own children at home. We now live across the border in France and sometimes visit Berlin for the excellent museums and cultural opportunities. I stay connected with other German families who\'ve made similar choices through online forums, but there\'s no active physical community due to the legal risks.'
  }
];

// Helper function to get comments by country ID
export const getCommentsByCountry = (countryId: string): Comment[] => {
  return comments.filter(comment => comment.countryId === countryId);
};