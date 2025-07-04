import { Country } from '../types';

export const countries: Country[] = [
  {
    id: 'croatia',
    name: 'Croatia',
    verdict: 'yellow',
    rules: 'Homeschooling in Croatia is legal but requires approval from the Ministry of Science and Education. Parents must submit a detailed educational plan and demonstrate their qualifications to teach. The education must follow the Croatian national curriculum, and students are required to take annual examinations at a registered school. While the legal framework exists, the approval process can be bureaucratic and varies by region.',
    languages: 'Croatian educational resources are available through the national system, with growing support for multilingual education. Zagreb and coastal cities have international communities that share resources in various languages. Many families use a combination of Croatian materials and international online curricula. English, German, and Italian language resources are commonly used, reflecting the country\'s tourism industry and EU connections.',
    communities: [
      {
        name: 'Zagreb International Homeschoolers',
        location: 'Zagreb',
        activities: 'Multilingual meetups and cultural heritage studies'
      },
      {
        name: 'Split Coastal Learners',
        location: 'Split',
        activities: 'Mediterranean studies and marine biology programs'
      },
      {
        name: 'Dubrovnik Heritage Educators',
        location: 'Dubrovnik',
        activities: 'Historical studies and UNESCO site explorations'
      }
    ],
    costOfLiving: 2000,
    internetSpeed: 65,
    communityStrength: 3,
    pros: [
      'Legal framework exists',
      'Affordable cost of living',
      'Beautiful Adriatic coastline',
      'Rich cultural heritage',
      'Growing tourism and expat community'
    ],
    cons: [
      'Bureaucratic approval process',
      'Annual examinations required',
      'Must follow national curriculum',
      'Limited English resources locally'
    ],
    headerImage: '/countryimages/croatia.webp'
  },
  {
    id: 'greece',
    name: 'Greece',
    verdict: 'yellow',
    rules: 'Homeschooling in Greece is legal but highly regulated. Parents must obtain approval from the local education authority and demonstrate their qualifications to teach. The education must follow the Greek national curriculum, and students are required to take annual examinations. Regular inspections by education officials are conducted to ensure compliance. The process is bureaucratic but provides a clear legal pathway for homeschooling.',
    languages: 'Greek educational resources are available through the national system. Athens and other major cities have international communities that support multilingual education. Many expat families use international online curricula while maintaining some Greek language instruction. English, German, and French language resources are available through various international schools and tutoring services.',
    communities: [
      {
        name: 'Athens International Homeschoolers',
        location: 'Athens',
        activities: 'Ancient history studies and archaeological site visits'
      },
      {
        name: 'Thessaloniki Learning Network',
        location: 'Thessaloniki',
        activities: 'Byzantine culture workshops and language exchange'
      },
      {
        name: 'Crete Island Educators',
        location: 'Heraklion',
        activities: 'Minoan civilization studies and marine ecology'
      }
    ],
    costOfLiving: 1800,
    internetSpeed: 55,
    communityStrength: 2,
    pros: [
      'Clear legal framework',
      'Very affordable cost of living',
      'Rich ancient history and culture',
      'Beautiful islands and coastline',
      'Growing digital nomad community'
    ],
    cons: [
      'Highly regulated system',
      'Regular inspections required',
      'Must follow Greek curriculum',
      'Slower internet in rural areas'
    ],
    headerImage: '/countryimages/greece.webp'
  },
  {
    id: 'hungary',
    name: 'Hungary',
    verdict: 'yellow',
    rules: 'Homeschooling in Hungary is legal but requires formal approval from the local education authority. Parents must submit a detailed educational plan and demonstrate their ability to provide quality education equivalent to school standards. Regular monitoring and annual assessments are mandatory. The process involves significant bureaucracy, but it\'s achievable with proper preparation. The education must follow the Hungarian national curriculum framework.',
    languages: 'Hungarian educational resources are available through the national system, with growing support for multilingual education. Budapest has an active international community that shares resources in various languages. Many families combine Hungarian materials with international online curricula. English and German language resources are commonly used, reflecting the country\'s historical connections and growing expat population.',
    communities: [
      {
        name: 'Budapest International Homeschoolers',
        location: 'Budapest',
        activities: 'Multilingual meetups and cultural heritage studies'
      },
      {
        name: 'Debrecen Learning Network',
        location: 'Debrecen',
        activities: 'Traditional crafts and Hungarian history workshops'
      },
      {
        name: 'Lake Balaton Educators',
        location: 'Balatonfüred',
        activities: 'Environmental studies and outdoor education programs'
      }
    ],
    costOfLiving: 1800,
    internetSpeed: 70,
    communityStrength: 3,
    pros: [
      'Legal framework exists',
      'Very affordable cost of living',
      'Rich cultural heritage',
      'Growing international community',
      'Central European location'
    ],
    cons: [
      'Bureaucratic approval process',
      'Regular monitoring required',
      'Must follow national curriculum',
      'Hungarian language barrier for non-speakers'
    ],
    headerImage: '/countryimages/hungary.webp'
  },
  {
    id: 'romania',
    name: 'Romania',
    verdict: 'yellow',
    rules: 'Homeschooling in Romania is legal under specific conditions. Parents must obtain approval from the county school inspectorate and demonstrate their qualifications to teach. The education must follow the Romanian national curriculum, and students are required to take annual examinations at a registered school. While the legal framework exists, the approval process can be challenging and varies by county.',
    languages: 'Romanian educational resources are available through official channels, with increasing support for international curricula. Bucharest and other major cities have growing international communities that share multilingual resources. Many families use a combination of Romanian materials and online international programs. English, German, and French language resources are commonly available due to the diverse expat population.',
    communities: [
      {
        name: 'Bucharest Home Education Circle',
        location: 'Bucharest',
        activities: 'Academic support groups and cultural activities'
      },
      {
        name: 'Cluj-Napoca Learning Collective',
        location: 'Cluj-Napoca',
        activities: 'STEM workshops and Transylvanian history studies'
      },
      {
        name: 'Constanta Coastal Learners',
        location: 'Constanta',
        activities: 'Black Sea studies and maritime education'
      }
    ],
    costOfLiving: 1600,
    internetSpeed: 65,
    communityStrength: 2,
    pros: [
      'Clear legal framework',
      'Very affordable cost of living',
      'Rich historical and cultural resources',
      'Growing tech sector',
      'Beautiful natural landscapes'
    ],
    cons: [
      'Strict qualification requirements',
      'Annual examinations mandatory',
      'County approval needed',
      'Limited English resources locally'
    ],
    headerImage: '/countryimages/romania.webp'
  },
  {
    id: 'bulgaria',
    name: 'Bulgaria',
    verdict: 'yellow',
    rules: 'Homeschooling in Bulgaria is legal but requires approval from the Regional Education Inspectorate. Parents must submit an educational plan and demonstrate their ability to provide quality education. Students must be enrolled in a school and take annual examinations. The process is bureaucratic but manageable with proper documentation. The education must align with Bulgarian curriculum standards.',
    languages: 'Bulgarian educational resources are available through the national system. Sofia and other major cities have international communities that support multilingual education. Many families use a combination of Bulgarian materials and international online resources. English-language curricula are increasingly popular among expatriate families, with additional support available for Russian and other European languages.',
    communities: [
      {
        name: 'Sofia International Homeschoolers',
        location: 'Sofia',
        activities: 'Multilingual education groups and cultural workshops'
      },
      {
        name: 'Plovdiv Learning Network',
        location: 'Plovdiv',
        activities: 'Ancient history studies and archaeological projects'
      },
      {
        name: 'Varna Coastal Educators',
        location: 'Varna',
        activities: 'Black Sea ecology and marine biology studies'
      }
    ],
    costOfLiving: 1500,
    internetSpeed: 60,
    communityStrength: 2,
    pros: [
      'Legal framework exists',
      'Extremely affordable cost of living',
      'Rich ancient history and culture',
      'Beautiful Black Sea coast',
      'Growing digital nomad community'
    ],
    cons: [
      'Bureaucratic approval process',
      'Annual examinations required',
      'Must follow Bulgarian curriculum',
      'Smaller international community'
    ],
    headerImage: '/countryimages/bulgaria.webp'
  },
  {
    id: 'estonia',
    name: 'Estonia',
    verdict: 'green',
    rules: 'Homeschooling is legal in Estonia with relatively light regulation. Parents must notify their local municipality and provide an educational plan that covers the national curriculum requirements. The education must be equivalent to what children would receive in school. Annual assessments are conducted, but they focus on ensuring educational progress rather than strict compliance. Estonia\'s digital-first approach makes homeschooling documentation and communication with authorities straightforward.',
    languages: 'Estonia offers excellent digital educational resources in Estonian, with strong support for multilingual education. Tallinn and other cities have active international communities sharing resources in various languages. Many families use a combination of Estonian materials and international curricula. English-language resources are widely used, and there\'s good support for Russian and other European languages due to the diverse population.',
    communities: [
      {
        name: 'Tallinn Digital Homeschoolers',
        location: 'Tallinn',
        activities: 'Tech-focused learning and coding workshops'
      },
      {
        name: 'Tartu Academic Circle',
        location: 'Tartu',
        activities: 'University-level science programs and research projects'
      },
      {
        name: 'Pärnu Coastal Learners',
        location: 'Pärnu',
        activities: 'Marine biology studies and environmental education'
      }
    ],
    costOfLiving: 2200,
    internetSpeed: 95,
    communityStrength: 4,
    pros: [
      'Digital-first government approach',
      'Flexible homeschooling framework',
      'Excellent internet infrastructure',
      'Growing tech community',
      'EU membership benefits'
    ],
    cons: [
      'Small homeschooling community',
      'Estonian language barrier',
      'Annual assessments required',
      'Limited local resources'
    ],
    headerImage: '/countryimages/estonia.webp'
  },
  {
    id: 'latvia',
    name: 'Latvia',
    verdict: 'yellow',
    rules: 'Homeschooling in Latvia is legal but requires formal approval from the local education authority. Parents must submit a detailed educational plan and demonstrate their ability to provide quality education. Regular monitoring and annual assessments are mandatory. The process involves more bureaucracy than neighboring Estonia, but it\'s still achievable with proper preparation and documentation.',
    languages: 'Latvian educational resources are available through the national system, with growing support for multilingual education. Riga has an active international community that shares resources in various languages. Many families combine Latvian materials with international online curricula. English and Russian language resources are commonly used, reflecting the country\'s linguistic diversity.',
    communities: [
      {
        name: 'Riga International Homeschoolers',
        location: 'Riga',
        activities: 'Multilingual meetups and cultural exchange programs'
      },
      {
        name: 'Daugavpils Learning Network',
        location: 'Daugavpils',
        activities: 'Traditional crafts and cultural heritage studies'
      },
      {
        name: 'Liepāja Baltic Educators',
        location: 'Liepāja',
        activities: 'Maritime studies and coastal ecology programs'
      }
    ],
    costOfLiving: 2000,
    internetSpeed: 80,
    communityStrength: 3,
    pros: [
      'Legal framework exists',
      'Affordable cost of living',
      'Rich cultural heritage',
      'Growing international community',
      'Beautiful natural environment'
    ],
    cons: [
      'Bureaucratic approval process',
      'Regular monitoring required',
      'Smaller homeschooling community',
      'Language barriers for non-Latvian speakers'
    ],
    headerImage: '/countryimages/latvia.webp'
  },
  {
    id: 'lithuania',
    name: 'Lithuania',
    verdict: 'yellow',
    rules: 'Homeschooling in Lithuania is legal under specific conditions. Parents must obtain permission from the municipal education department and demonstrate their qualifications to teach. The education must follow the national curriculum, and students are required to take annual examinations at a registered school. While the legal framework is clear, the approval process can be challenging and varies by municipality.',
    languages: 'Lithuanian educational resources are available through official channels, with increasing support for international curricula. Vilnius and Kaunas have growing international communities that share multilingual resources. Many families use a combination of Lithuanian materials and online international programs. English, Polish, and Russian language resources are commonly available.',
    communities: [
      {
        name: 'Vilnius Home Education Circle',
        location: 'Vilnius',
        activities: 'Academic support groups and cultural activities'
      },
      {
        name: 'Kaunas Learning Collective',
        location: 'Kaunas',
        activities: 'STEM workshops and historical studies'
      },
      {
        name: 'Klaipėda Maritime Learners',
        location: 'Klaipėda',
        activities: 'Baltic Sea studies and environmental projects'
      }
    ],
    costOfLiving: 1900,
    internetSpeed: 75,
    communityStrength: 3,
    pros: [
      'Legal framework exists',
      'Affordable cost of living',
      'Rich cultural heritage',
      'Growing international community',
      'Beautiful natural environment'
    ],
    cons: [
      'Bureaucratic approval process',
      'Regular monitoring required',
      'Smaller homeschooling community',
      'Language barriers for non-Lithuanian speakers'
    ],
    headerImage: '/countryimages/lithuania.webp'
  },
  {
    id: 'finland',
    name: 'Finland',
    verdict: 'green',
    rules: 'Homeschooling is legal in Finland with relatively light regulation. Parents must notify their local education authority of their decision to homeschool and ensure their children receive an education equivalent to the basic education curriculum. While there are no specific qualifications required for parents, children\'s progress is monitored through annual assessments. The approach is generally supportive and respects parents\' educational choices.',
    languages: 'Finnish educational resources are readily available, and there\'s strong support for multilingual education. Helsinki and other major cities have active international communities that share resources in various languages. Many families use a combination of Finnish materials and international curricula. English-language resources are widely used, and there\'s good support for other European languages.',
    communities: [
      {
        name: 'Helsinki Home Educators',
        location: 'Helsinki',
        activities: 'Weekly meetups and outdoor learning programs'
      },
      {
        name: 'Tampere Learning Circle',
        location: 'Tampere',
        activities: 'STEM workshops and nature studies'
      },
      {
        name: 'Turku Homeschool Network',
        location: 'Turku',
        activities: 'Baltic cultural exchange and environmental education'
      }
    ],
    costOfLiving: 3000,
    internetSpeed: 100,
    communityStrength: 4,
    pros: [
      'Flexible homeschooling laws',
      'High-quality educational resources',
      'Strong digital infrastructure',
      'Excellent work-life balance',
      'Safe and stable society'
    ],
    cons: [
      'High cost of living',
      'Dark winters can be challenging',
      'Finnish language barrier',
      'Annual assessments required'
    ],
    headerImage: '/countryimages/finland.webp'
  },
  {
    id: 'france',
    name: 'France',
    verdict: 'yellow',
    rules: 'As of 2022, France has made homeschooling more restrictive. Parents must now obtain authorization from the Ministry of Education based on specific grounds: the child\'s health, intensive sports or artistic activities, family mobility, or distance from schools. Applications must be submitted annually. Even with authorization, families are subject to regular inspections by education authorities to ensure the quality of instruction meets national standards. Homeschooling is possible but now requires navigating significant bureaucracy.',
    languages: 'France offers the CNED (Centre National d\'Enseignement à Distance), the official distance learning program that follows the French curriculum. This is available for French speakers and can be a good option for families wanting official recognition. For English-speaking families, there are international online schools, and cities like Paris, Lyon, and Nice have tutors available for various European languages. Bilingual resources are increasingly common, especially in areas with high expat populations.',
    communities: [
      {
        name: 'Paris Instruction En Famille',
        location: 'Paris',
        activities: 'Bilingual educational outings and structured learning groups'
      },
      {
        name: 'Lyon Homeschool Collective',
        location: 'Lyon',
        activities: 'French/English academic support and cultural activities'
      },
      {
        name: 'Nice International Education Circle',
        location: 'Nice',
        activities: 'Mediterranean studies and multilingual meetups'
      }
    ],
    costOfLiving: 2800,
    internetSpeed: 75,
    communityStrength: 3,
    pros: [
      'Established distance learning system (CNED)',
      'Still legally possible with authorization',
      'Rich cultural and educational resources',
      'Strong expat communities in major cities'
    ],
    cons: [
      'Recent restrictions make approval harder',
      'Regular inspections and oversight',
      'Annual renewal required',
      'Need to follow French curriculum standards'
    ],
    headerImage: '/countryimages/france.webp'
  },
  {
    id: 'portugal',
    name: 'Portugal',
    verdict: 'green',
    rules: 'Homeschooling is fully legal in Portugal with relatively minimal oversight. Parents need to register with their local education authority and submit an educational plan for approval. Annual assessments are required but are generally not intrusive. The educational plan should align with the Portuguese national curriculum, but there\'s flexibility in teaching methods and resources. Many expat families find the process straightforward, especially in regions with established international communities.',
    languages: 'English-language curricula are widely used among expat families in Portugal, with resources like Outschool, Khan Academy, and Time4Learning being popular choices. For native language options, families can access Deutsche Fernschule for German, Cours Legendre for French, and Sistema de Educación a Distancia for Spanish. In major cities like Lisbon and Porto, there are tutors available who specialize in teaching various European languages. Many homeschooling families use a mix of online resources and in-person tutoring.',
    communities: [
      {
        name: 'Lisbon English Homeschool Co-op',
        location: 'Lisbon',
        activities: 'Weekly park meetups, monthly museum trips, and collaborative STEM projects'
      },
      {
        name: 'Porto Homeschool Network',
        location: 'Porto',
        activities: 'Twice monthly field trips and weekly art classes'
      },
      {
        name: 'Deutsche Homeschooler Portugal',
        location: 'Faro',
        activities: 'Monthly German-language workshops and cultural activities'
      }
    ],
    costOfLiving: 2500,
    internetSpeed: 80,
    communityStrength: 4,
    pros: [
      'Flexible homeschooling laws',
      'Strong English-speaking communities',
      'Relatively affordable cost of living',
      'Excellent climate and quality of life',
      'Digital nomad visa available'
    ],
    cons: [
      'Annual assessments still required',
      'Bureaucratic registration process',
      'Need to align somewhat with Portuguese curriculum',
      'Homeschooling communities concentrated in major cities'
    ],
    headerImage: '/countryimages/portugal.webp'
  },
  {
    id: 'ireland',
    name: 'Ireland',
    verdict: 'green',
    rules: 'Homeschooling is a constitutional right in Ireland, making it one of the most homeschool-friendly countries in Europe. Parents must register with the National Education Welfare Board (NEWB), after which an assessment is conducted to ensure the child is receiving a "certain minimum education." The assessment process is generally respectful of different educational approaches. Once registered, there is minimal interference, though occasional follow-up assessments may occur.',
    languages: 'Ireland offers excellent resources for English-language homeschooling, with many families using curricula from the UK, US, or Australia. For non-English speakers, there are growing resources available online. Irish language resources are also widely available for those interested in bilingual education. The Home Education Network Ireland provides resources in multiple languages and connects families with tutors who speak various European languages.',
    communities: [
      {
        name: 'Dublin Home Education Network',
        location: 'Dublin',
        activities: 'Weekly meetups, science fairs, and educational excursions'
      },
      {
        name: 'Cork Homeschool Association',
        location: 'Cork',
        activities: 'Monthly workshops and outdoor learning activities'
      },
      {
        name: 'Galway International Homeschoolers',
        location: 'Galway',
        activities: 'Bilingual learning sessions and cultural exchange programs'
      }
    ],
    costOfLiving: 3000,
    internetSpeed: 90,
    communityStrength: 5,
    pros: [
      'Constitutional right to homeschool',
      'Minimal interference after registration',
      'Vibrant homeschooling community',
      'English-speaking country',
      'High-quality educational resources'
    ],
    cons: [
      'High cost of living',
      'Initial assessment can be rigorous',
      'Housing shortage in major cities',
      'Weather can be challenging for outdoor activities'
    ],
    headerImage: '/countryimages/ireland.webp'
  },
  {
    id: 'spain',
    name: 'Spain',
    verdict: 'yellow',
    rules: 'Homeschooling exists in a legal gray area in Spain. While not explicitly legal, it\'s also not explicitly prohibited. The education law requires children to attend school, but court rulings have recognized parents\' right to educate their children. The situation varies by autonomous community, with some regions like Catalonia being more accepting than others. Families typically register with a private umbrella school or follow the Spanish curriculum through distance learning to maintain legal compliance.',
    languages: 'Resources for homeschooling in Spanish are abundant, including the official Spanish Centre for Innovation and Development of Distance Education (CIDEAD). For English-speaking families, international online schools like InterHigh or Wolsey Hall Oxford are popular choices. Various local communities offer language exchange opportunities, and in major expat areas like Barcelona, Madrid, and the Costa del Sol, there are tutors available for most European languages.',
    communities: [
      {
        name: 'Barcelona Home Learners',
        location: 'Barcelona',
        activities: 'Bilingual meetups and collaborative learning projects'
      },
      {
        name: 'Madrid Educación en Casa',
        location: 'Madrid',
        activities: 'Spanish/English language exchange and educational outings'
      },
      {
        name: 'Costa del Sol Homeschoolers',
        location: 'Málaga',
        activities: 'Beach learning days and multilingual reading groups'
      }
    ],
    costOfLiving: 2300,
    internetSpeed: 75,
    communityStrength: 3,
    pros: [
      'Growing acceptance of homeschooling',
      'Strong expat communities in coastal areas',
      'Reasonable cost of living',
      'Rich cultural learning opportunities',
      'Good climate for outdoor activities'
    ],
    cons: [
      'Legal ambiguity',
      'Varies by region/community',
      'May need to register with umbrella schools',
      'Potential for issues with local authorities'
    ],
    headerImage: '/countryimages/spain.webp'
  },
  {
    id: 'netherlands',
    name: 'Netherlands',
    verdict: 'yellow',
    rules: 'Homeschooling in the Netherlands is legal but requires an exemption based on religious or philosophical convictions. Parents must apply for this exemption before a child starts school (at age 5), explaining their objections to available schools. Once granted, the exemption is valid throughout the child\'s school years. The education inspectorate does not supervise homeschooling, but local authorities may check if education is actually taking place. The process is stricter than in "green" countries but possible with proper preparation.',
    languages: 'The Netherlands has excellent English resources due to the high English proficiency of Dutch society. International online schools are popular among expat homeschoolers. For native language options, there are online schools and resources available for most European languages. In cities with large expat populations like Amsterdam, Rotterdam, and The Hague, there are tutors and community groups for various languages. The Dutch NKO (Nederlands Kenniscentrum Onderwijs) provides some resources for homeschoolers in Dutch.',
    communities: [
      {
        name: 'Amsterdam Homeschooling Circle',
        location: 'Amsterdam',
        activities: 'Weekly learning exchanges and museum tours'
      },
      {
        name: 'Rotterdam International Homeschoolers',
        location: 'Rotterdam',
        activities: 'Maritime education programs and cultural studies'
      },
      {
        name: 'Utrecht Thuisonderwijs',
        location: 'Utrecht',
        activities: 'Dutch-language learning sessions and nature excursions'
      }
    ],
    costOfLiving: 3200,
    internetSpeed: 100,
    communityStrength: 3,
    pros: [
      'Once exemption is granted, minimal oversight',
      'Excellent digital infrastructure',
      'Strong international community',
      'High English proficiency countrywide',
      'Good public transportation'
    ],
    cons: [
      'Exemption must be requested before age 5',
      'Religious/philosophical grounds required',
      'High cost of living',
      'Housing shortage in major cities'
    ],
    headerImage: '/countryimages/netherlands.webp'
  },
  {
    id: 'germany',
    name: 'Germany',
    verdict: 'red',
    rules: 'Homeschooling is effectively illegal in Germany. School attendance is mandatory, and parents who homeschool face severe penalties including fines, loss of custody, and even imprisonment in extreme cases. The German legal system considers school attendance a social value that supersedes parents\' rights to determine their children\'s education. Some families have sought asylum in other countries to continue homeschooling. Very rare exemptions might be granted for severe health reasons, but these are extremely difficult to obtain and usually temporary.',
    languages: 'Due to the legal restrictions, language resources for homeschooling are not officially available in Germany. Families who attempt to homeschool despite legal risks often use international online resources. For those who move to Germany but want to maintain their native language education, supplementary after-school programs are available in most cities, but these cannot replace regular school attendance.',
    communities: [
      {
        name: 'Berlin Expat Education Network',
        location: 'Berlin',
        activities: 'Discrete online support and information sharing'
      }
    ],
    costOfLiving: 3000,
    internetSpeed: 85,
    communityStrength: 1,
    pros: [
      'High-quality public education system',
      'International schools in major cities',
      'Strong supplementary educational resources',
      'Good digital infrastructure'
    ],
    cons: [
      'Homeschooling is illegal',
      'Severe penalties for non-compliance',
      'No legitimate exemptions for philosophical reasons',
      'Many families have had to leave Germany to homeschool'
    ],
    headerImage: '/countryimages/germany.webp'
  },
  {
    id: 'poland',
    name: 'Poland',
    verdict: 'yellow',
    rules: 'Homeschooling is legal in Poland but requires registration with a school and periodic evaluations. Parents must obtain permission from the school principal and ensure their children take annual classification exams. The child must be enrolled in a school that supports homeschooling, though this can be done remotely. While the regulations are clear, the implementation can vary depending on the chosen school\'s approach to homeschooling.',
    languages: 'Polish homeschoolers have access to the national curriculum materials and a growing number of Polish-language homeschooling resources. For international families, there are several online platforms offering curricula in English, German, and other languages. Major cities like Warsaw and Kraków have active international communities that share resources and organize language exchange programs.',
    communities: [
      {
        name: 'Warsaw Home Education Hub',
        location: 'Warsaw',
        activities: 'Monthly educational workshops and cultural events'
      },
      {
        name: 'Kraków Homeschool Network',
        location: 'Kraków',
        activities: 'Weekly meetups and collaborative learning projects'
      },
      {
        name: 'Tricity Homeschoolers',
        location: 'Gdańsk',
        activities: 'Baltic region studies and outdoor education programs'
      }
    ],
    costOfLiving: 2200,
    internetSpeed: 70,
    communityStrength: 3,
    pros: [
      'Clear legal framework',
      'Affordable cost of living',
      'Growing homeschool community',
      'Rich cultural heritage for learning',
      'Good internet infrastructure'
    ],
    cons: [
      'Annual examinations required',
      'Need to find a supportive school',
      'Limited English resources locally',
      'Bureaucratic registration process'
    ],
    headerImage: '/countryimages/poland.webp'
  },
  {
    id: 'czech-republic',
    name: 'Czech Republic',
    verdict: 'yellow',
    rules: 'Homeschooling in the Czech Republic is legal but regulated. It\'s officially called "Individual Education" and requires approval from the school director. Parents must demonstrate appropriate educational qualifications or work with a qualified supervisor. Regular semester evaluations are required, and students must follow the national curriculum framework. The process is more structured than in some countries but provides a clear path for homeschoolers.',
    languages: 'The Czech education system provides materials in Czech, but there\'s growing support for multilingual education. International families often combine local resources with online curricula in their preferred language. Prague and other major cities have international education centers that support homeschooling families with various language needs.',
    communities: [
      {
        name: 'Prague Home Education Association',
        location: 'Prague',
        activities: 'Educational support groups and cultural excursions'
      },
      {
        name: 'Brno Homeschoolers',
        location: 'Brno',
        activities: 'Science workshops and language exchange meetups'
      },
      {
        name: 'Pilsen Learning Community',
        location: 'Pilsen',
        activities: 'Traditional crafts workshops and nature studies'
      }
    ],
    costOfLiving: 2000,
    internetSpeed: 65,
    communityStrength: 3,
    pros: [
      'Structured legal framework',
      'Lower cost of living',
      'Strong cultural education opportunities',
      'Growing international community',
      'Central European location'
    ],
    cons: [
      'Regular evaluations required',
      'Parent qualification requirements',
      'Must follow national curriculum',
      'Limited flexibility in assessment methods'
    ],
    headerImage: '/countryimages/czech republic.webp'
  },
  {
    id: 'slovakia',
    name: 'Slovakia',
    verdict: 'yellow',
    rules: 'Homeschooling in Slovakia is legal but requires approval from the school director. Parents must demonstrate their qualifications to teach and submit an educational plan. The education must follow the Slovak national curriculum, and students are required to take annual examinations at a registered school. While the legal framework exists, the approval process can be bureaucratic and varies by school.',
    languages: 'Slovak educational resources are available through the national system, with growing support for multilingual education. Bratislava and other cities have international communities that share resources in various languages. Many families use a combination of Slovak materials and international online curricula. English, Hungarian, and other European language resources are commonly used.',
    communities: [
      {
        name: 'Bratislava International Homeschoolers',
        location: 'Bratislava',
        activities: 'Multilingual meetups and cultural heritage studies'
      },
      {
        name: 'Košice Learning Network',
        location: 'Košice',
        activities: 'Traditional crafts and Slovak history workshops'
      },
      {
        name: 'High Tatras Educators',
        location: 'Poprad',
        activities: 'Mountain ecology and environmental education'
      }
    ],
    costOfLiving: 1800,
    internetSpeed: 70,
    communityStrength: 3,
    pros: [
      'Legal framework exists',
      'Affordable cost of living',
      'Rich cultural heritage',
      'Beautiful mountain landscapes',
      'Growing international community'
    ],
    cons: [
      'Bureaucratic approval process',
      'Annual examinations required',
      'Must follow national curriculum',
      'Limited English resources locally'
    ],
    headerImage: '/countryimages/slovakia.webp'
  },
  {
    id: 'italy',
    name: 'Italy',
    verdict: 'yellow',
    rules: 'Homeschooling in Italy is legal under the term "istruzione parentale" or "scuola familiare." Parents must notify local authorities annually of their intent to homeschool and demonstrate technical or economic capacity to teach. Students must pass annual validation exams at a state school. While the legal framework is clear, implementation can vary by region, and some bureaucratic challenges may arise.',
    languages: 'Italian educational resources are readily available, and there\'s growing support for multilingual education. Major cities like Rome, Milan, and Florence have international communities that share resources in various languages. Online platforms offer curricula in English, German, and other languages, while local tutors and language schools provide additional support.',
    communities: [
      {
        name: 'Rome Homeschool Network',
        location: 'Rome',
        activities: 'Classical education programs and art history tours'
      },
      {
        name: 'Milan International Learners',
        location: 'Milan',
        activities: 'Multilingual education groups and cultural workshops'
      },
      {
        name: 'Florence Family Education',
        location: 'Florence',
        activities: 'Renaissance art studies and historical excursions'
      }
    ],
    costOfLiving: 2600,
    internetSpeed: 70,
    communityStrength: 3,
    pros: [
      'Legal recognition of homeschooling',
      'Rich cultural learning environment',
      'Strong artistic and historical resources',
      'Growing international community',
      'Mediterranean lifestyle'
    ],
    cons: [
      'Annual exams required',
      'Regional variations in implementation',
      'Bureaucratic challenges',
      'Need to demonstrate teaching capacity'
    ],
    headerImage: '/countryimages/italy.webp'
  },
  {
    id: 'denmark',
    name: 'Denmark',
    verdict: 'red',
    rules: 'Homeschooling in Denmark is legally possible but highly regulated. Parents must notify their municipality and receive approval. The education must meet national standards, and children are required to take annual tests. Municipal supervisors conduct regular home visits to ensure educational quality. While technically legal, the requirements are so stringent that very few families successfully homeschool.',
    languages: 'Danish educational resources are available through the national system. International families often use online curricula in English or their native language. Copenhagen has a small but active international education community. Several online platforms offer curricula in English, German, and other languages commonly used by expatriate families.',
    communities: [
      {
        name: 'Copenhagen Home Learners',
        location: 'Copenhagen',
        activities: 'Educational workshops and cultural activities'
      },
      {
        name: 'Aarhus Education Network',
        location: 'Aarhus',
        activities: 'STEM focus groups and outdoor learning'
      },
      {
        name: 'Odense Family School',
        location: 'Odense',
        activities: 'Nordic culture studies and nature exploration'
      }
    ],
    costOfLiving: 3500,
    internetSpeed: 120,
    communityStrength: 2,
    pros: [
      'Technically legal framework exists',
      'Excellent digital infrastructure',
      'High quality of life',
      'Strong social support system',
      'Beautiful natural environment'
    ],
    cons: [
      'Very strict regulations',
      'Regular supervision required',
      'High cost of living',
      'Small homeschooling community',
      'Challenging approval process'
    ],
    headerImage: '/countryimages/denmark.webp'
  },
  {
    id: 'sweden',
    name: 'Sweden',
    verdict: 'red',
    rules: 'Homeschooling in Sweden is effectively prohibited except in extraordinary circumstances (such as severe illness or actors who travel frequently). The 2010 Education Act made it extremely difficult to obtain permission for homeschooling. Many families seeking to homeschool have had to leave Sweden or send their children to school. Religious or philosophical reasons are not accepted as valid grounds for homeschooling.',
    languages: 'While Sweden has excellent educational resources in Swedish and English, these are primarily designed for school use. For families who manage to get rare exemptions, there are online international schools and distance learning programs available. Stockholm and other major cities have international schools that sometimes support partial home study programs.',
    communities: [
      {
        name: 'Stockholm International Educators',
        location: 'Stockholm',
        activities: 'Support network and educational advocacy'
      },
      {
        name: 'Gothenburg Learning Circle',
        location: 'Gothenburg',
        activities: 'Alternative education discussions and support'
      },
      {
        name: 'Malmö Education Network',
        location: 'Malmö',
        activities: 'International education resources and meetups'
      }
    ],
    costOfLiving: 3300,
    internetSpeed: 110,
    communityStrength: 1,
    pros: [
      'Excellent public education system',
      'High-quality international schools',
      'Superior digital infrastructure',
      'Strong social support system',
      'High standard of living'
    ],
    cons: [
      'Homeschooling effectively prohibited',
      'Very few exceptions granted',
      'High cost of living',
      'Many families forced to relocate',
      'No recognition of philosophical reasons'
    ],
    headerImage: '/countryimages/sweden.webp'
  },
  {
    id: 'austria',
    name: 'Austria',
    verdict: 'yellow',
    rules: 'Homeschooling is legal in Austria with moderate regulation. Parents must notify the school board (Schulbehörde) at the beginning of each school year and demonstrate that their homeschooling program is equivalent to that of public schools. Children must pass annual examinations to prove their educational progress. While the framework is clear, implementation can vary by region.',
    languages: 'Austrian homeschoolers have access to German-language curricula and resources. Vienna and other major cities have international communities that support multilingual education. Many families use a combination of Austrian materials and international online resources. English-language curricula are widely used among expatriate families, with additional support available for other European languages.',
    communities: [
      {
        name: 'Vienna Home Education Network',
        location: 'Vienna',
        activities: 'Weekly meetups and cultural excursions'
      },
      {
        name: 'Salzburg Learning Circle',
        location: 'Salzburg',
        activities: 'Music education and Alpine nature studies'
      },
      {
        name: 'Graz Homeschool Community',
        location: 'Graz',
        activities: 'STEM workshops and outdoor education'
      }
    ],
    costOfLiving: 2800,
    internetSpeed: 85,
    communityStrength: 3,
    pros: [
      'Clear legal framework',
      'Rich cultural environment',
      'Strong international community',
      'Excellent public infrastructure',
      'Central European location'
    ],
    cons: [
      'Annual examinations required',
      'Higher cost of living',
      'Must follow Austrian curriculum',
      'Regional variations in implementation'
    ],
    headerImage: '/countryimages/austria.webp'
  },
  {
    id: 'slovenia',
    name: 'Slovenia',
    verdict: 'yellow',
    rules: 'Homeschooling in Slovenia is legal but requires approval from the Ministry of Education. Parents must submit a detailed educational plan and demonstrate their qualifications to teach. The education must follow the Slovenian national curriculum, and students are required to take annual examinations at a registered school. While the legal framework exists, the approval process can be bureaucratic and varies by region.',
    languages: 'Slovenian educational resources are available through the national system, with growing support for multilingual education. Ljubljana and other cities have international communities that share resources in various languages. Many families use a combination of Slovenian materials and international online curricula. English, German, and Italian language resources are commonly used, reflecting the country\'s multilingual heritage.',
    communities: [
      {
        name: 'Ljubljana International Homeschoolers',
        location: 'Ljubljana',
        activities: 'Multilingual meetups and cultural heritage studies'
      },
      {
        name: 'Maribor Learning Network',
        location: 'Maribor',
        activities: 'Traditional crafts and Slovenian history workshops'
      },
      {
        name: 'Coastal Slovenia Educators',
        location: 'Koper',
        activities: 'Mediterranean studies and environmental education'
      }
    ],
    costOfLiving: 2100,
    internetSpeed: 75,
    communityStrength: 3,
    pros: [
      'Legal framework exists',
      'Affordable cost of living',
      'Beautiful Alpine and coastal regions',
      'Rich cultural heritage',
      'Growing international community'
    ],
    cons: [
      'Bureaucratic approval process',
      'Annual examinations required',
      'Must follow national curriculum',
      'Limited English resources locally'
    ],
    headerImage: '/countryimages/slovenia.webp'
  },
  {
    id: 'liechtenstein',
    name: 'Liechtenstein',
    verdict: 'yellow',
    rules: 'Homeschooling in Liechtenstein follows similar regulations to neighboring Switzerland and Austria. Parents must obtain approval from the education authorities and demonstrate their ability to provide quality education. The education must meet national curriculum standards, and regular assessments are required. As a small country with close ties to Switzerland, many families use Swiss or German educational resources.',
    languages: 'German is the primary language of education in Liechtenstein. Educational resources are typically sourced from Germany, Austria, or Switzerland. The small international community often uses online curricula in English or other languages. Due to the country\'s size, families often connect with homeschooling communities in neighboring countries.',
    communities: [
      {
        name: 'Vaduz Home Educators',
        location: 'Vaduz',
        activities: 'Small group meetups and cross-border educational exchanges'
      },
      {
        name: 'Rhine Valley Learning Circle',
        location: 'Schaan',
        activities: 'Nature studies and Alpine culture workshops'
      }
    ],
    costOfLiving: 4000,
    internetSpeed: 100,
    communityStrength: 2,
    pros: [
      'EEA membership allows EU citizen residence',
      'High standard of living',
      'Excellent infrastructure',
      'Close to Switzerland and Austria',
      'Safe and stable environment'
    ],
    cons: [
      'Very high cost of living',
      'Small homeschooling community',
      'Limited local resources',
      'German language requirement',
      'Bureaucratic approval process'
    ],
    headerImage: '/countryimages/liechtenstein.webp'
  },
  {
    id: 'luxembourg',
    name: 'Luxembourg',
    verdict: 'yellow',
    rules: 'Homeschooling in Luxembourg is legal but requires approval from the Ministry of Education. Parents must submit a detailed educational plan and demonstrate their qualifications to teach. The education must follow the Luxembourgish national curriculum, and students are required to take annual examinations. Regular inspections are conducted to ensure compliance.',
    languages: 'Luxembourg\'s trilingual system (Luxembourgish, French, German) offers diverse educational resources. The international community, particularly in Luxembourg City, has access to resources in many languages. English-language curricula are widely used among expat families, and the presence of EU institutions provides excellent support for multilingual education.',
    communities: [
      {
        name: 'Luxembourg City International Homeschoolers',
        location: 'Luxembourg City',
        activities: 'EU institution visits and multilingual education groups'
      },
      {
        name: 'Esch-sur-Alzette Learning Network',
        location: 'Esch-sur-Alzette',
        activities: 'Industrial heritage studies and cultural workshops'
      }
    ],
    costOfLiving: 3500,
    internetSpeed: 85,
    communityStrength: 3,
    pros: [
      'Legal framework exists',
      'Strong international community',
      'Multilingual environment',
      'EU capital advantages',
      'Excellent infrastructure'
    ],
    cons: [
      'Very high cost of living',
      'Annual evaluations required',
      'Complex multilingual requirements',
      'Bureaucratic processes'
    ],
    headerImage: '/countryimages/luxembourg.webp'
  },
  {
    id: 'malta',
    name: 'Malta',
    verdict: 'yellow',
    rules: 'Homeschooling in Malta is legal but requires approval from the Ministry of Education. Parents must submit an educational plan and demonstrate their qualifications to teach. The education must follow the Maltese national curriculum, and students are required to take annual examinations. Regular inspections are conducted to ensure compliance with educational standards.',
    languages: 'Malta offers educational resources in Maltese and English, with strong support for bilingual education. The international community, particularly in Valletta and Sliema, has access to resources in many languages. English-language curricula are widely used, and the country\'s historical connections provide excellent opportunities for cultural education.',
    communities: [
      {
        name: 'Valletta International Homeschoolers',
        location: 'Valletta',
        activities: 'Historical studies and cultural heritage workshops'
      },
      {
        name: 'Sliema Learning Network',
        location: 'Sliema',
        activities: 'Mediterranean studies and language exchange programs'
      },
      {
        name: 'Gozo Island Educators',
        location: 'Victoria',
        activities: 'Island ecology and traditional crafts workshops'
      }
    ],
    costOfLiving: 2500,
    internetSpeed: 85,
    communityStrength: 3,
    pros: [
      'English-speaking environment',
      'Legal framework exists',
      'Mediterranean climate',
      'Strong expat community',
      'EU membership benefits'
    ],
    cons: [
      'Bureaucratic approval process',
      'Annual assessments required',
      'Island limitations',
      'Higher cost of living than mainland Europe',
      'Limited local educational resources'
    ],
    headerImage: '/countryimages/malta.webp'
  },
  {
    id: 'belgium',
    name: 'Belgium',
    verdict: 'yellow',
    rules: 'Homeschooling in Belgium is legal but regulated differently across its three regions: Flanders, Wallonia, and Brussels. In Flanders, parents must notify authorities and follow the Flemish curriculum with annual evaluations. Wallonia requires registration and periodic inspections. Brussels follows similar rules to Wallonia. The multilingual nature of Belgium means families can choose between Dutch, French, or German educational systems depending on their region.',
    languages: 'Belgium\'s trilingual system (Dutch, French, German) offers diverse educational resources. Brussels, as the EU capital, has a particularly strong international community with resources available in many languages. English-language curricula are widely used among expat families, and the presence of EU institutions means excellent support for multilingual education. International schools and tutoring services are readily available.',
    communities: [
      {
        name: 'Brussels International Homeschoolers',
        location: 'Brussels',
        activities: 'EU institution visits and multilingual education groups'
      },
      {
        name: 'Antwerp Home Learning Network',
        location: 'Antwerp',
        activities: 'Art history workshops and Flemish culture studies'
      },
      {
        name: 'Wallonia Homeschool Collective',
        location: 'Namur',
        activities: 'French-language education and outdoor learning'
      }
    ],
    costOfLiving: 2900,
    internetSpeed: 90,
    communityStrength: 4,
    pros: [
      'Legal framework exists',
      'Strong international community',
      'Multilingual environment',
      'EU capital advantages',
      'Excellent infrastructure'
    ],
    cons: [
      'Different rules by region',
      'Annual evaluations required',
      'High cost of living',
      'Complex multilingual requirements',
      'Bureaucratic processes'
    ],
    headerImage: '/countryimages/belgium.webp'
  },
  {
    id: 'cyprus',
    name: 'Cyprus',
    verdict: 'yellow',
    rules: 'Homeschooling in Cyprus is legal but requires approval from the Ministry of Education. Parents must submit an educational plan and demonstrate their qualifications to teach. The education must follow the Cypriot national curriculum, and students are required to take annual examinations. Regular inspections are conducted to ensure compliance with educational standards.',
    languages: 'Cyprus offers educational resources in Greek and English, with strong support for bilingual education. The international community, particularly in Nicosia and coastal cities, has access to resources in many languages. English-language curricula are widely used, and the country\'s historical connections provide excellent opportunities for cultural education.',
    communities: [
      {
        name: 'Nicosia International Homeschoolers',
        location: 'Nicosia',
        activities: 'Historical studies and cultural heritage workshops'
      },
      {
        name: 'Limassol Learning Network',
        location: 'Limassol',
        activities: 'Mediterranean studies and language exchange programs'
      },
      {
        name: 'Paphos Coastal Educators',
        location: 'Paphos',
        activities: 'Archaeological studies and environmental education'
      }
    ],
    costOfLiving: 2200,
    internetSpeed: 80,
    communityStrength: 3,
    pros: [
      'English-speaking environment',
      'Legal framework exists',
      'Mediterranean climate',
      'Strong expat community',
      'EU membership benefits'
    ],
    cons: [
      'Bureaucratic approval process',
      'Annual assessments required',
      'Island limitations',
      'Higher cost of living than mainland Europe',
      'Limited local educational resources'
    ],
    headerImage: '/countryimages/cyprus.webp'
  }
];

export const getCountryById = (id: string): Country | undefined => {
  return countries.find(country => country.id === id);
};

export const getCountriesByVerdict = (verdict: string): Country[] => {
  return countries.filter(country => country.verdict === verdict);
};

export const getAllEUCountries = (): string[] => [
  'Austria', 'Belgium', 'Bulgaria', 'Croatia', 'Cyprus', 
  'Czech Republic', 'Denmark', 'Estonia', 'Finland', 'France', 
  'Germany', 'Greece', 'Hungary', 'Ireland', 'Italy', 
  'Latvia', 'Lithuania', 'Luxembourg', 'Malta', 'Netherlands', 
  'Poland', 'Portugal', 'Romania', 'Slovakia', 'Slovenia', 
  'Spain', 'Sweden'
];