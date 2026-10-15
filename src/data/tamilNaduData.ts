import { Destination, BeachChangingFacility, TourPackage } from '../types/tourism';

export const TN_DESTINATIONS: Destination[] = [
  {
    id: 'ooty',
    name: 'Ooty (Udhagamandalam)',
    tamilName: 'ஊட்டி (உதகமண்டலம்)',
    district: 'Nilgiris',
    category: 'hill_station',
    shortDescription: 'The Queen of Hill Stations set amidst misty blue Nilgiri mountains, sprawling tea estates, and colonial charm.',
    fullDescription: 'Nestled at 2,240 meters above sea level in the Nilgiri Hills, Ooty is famous for its cool climate, pine forests, Nilgiri Mountain Railway (UNESCO World Heritage), scenic lakes, and sprawling botanical reserves.',
    images: [
      'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'
    ],
    popularAttractions: ['Botanical Gardens', 'Ooty Lake & Boathouse', 'Doddabetta Peak', 'Rose Garden', 'Nilgiri Mountain Toy Train', 'Pykara Waterfalls'],
    estimatedCostPerDay: 2800,
    averageRating: 4.8,
    reviewCount: 342,
    location: 'Nilgiris District, Tamil Nadu',
    coordinates: { lat: 11.4102, lng: 76.6950 },
    isPopular: true,
    isTrending: true,
    isWeekendFavorite: true,
    suitableGroupTypes: ['solo', 'family', 'friends', 'couple', 'group'],
    suitableCategories: ['nature_wildlife', 'photography_visual', 'general_tourist'],
    weather: {
      tempC: 16,
      condition: 'Misty & Pleasant',
      rainfallMm: 2,
      windSpeedKmh: 11,
      alertLevel: 'green',
      alertTitle: 'Clear Hill Station Weather',
      alertDetails: 'Ideal touring weather. Mild sweaters recommended for evening hours.',
      bookingRestricted: false
    },
    packages: [
      {
        id: 'ooty-classic-3d',
        title: 'Nilgiri Tea & Peaks Odyssey',
        duration: '3 Days / 2 Nights',
        pricePerPerson: 5999,
        inclusions: ['3-Star Hill Resort', 'Toy Train Experience Tickets', 'Private Cab Sightseeing', 'Breakfast Included'],
        highlights: ['Doddabetta 360 View', 'Tea Factory Tasting Tour', 'Pykara Lake Speedboating'],
        suitableFor: ['Family', 'Couples', 'Photographers'],
        vehicleIncluded: 'AC Sedan / SUV'
      },
      {
        id: 'ooty-adventure-friends',
        title: 'Nilgiri Pines & Trekking Expedition',
        duration: '2 Days / 1 Night',
        pricePerPerson: 3800,
        inclusions: ['Cottage Stay', 'Guided Pine Forest Trek', 'Campfire & BBQ', 'Shared Tempo Traveller'],
        highlights: ['Shooting Point Vistas', 'Emerald Lake Cycling', 'Local Nilgiri Chocolate Tasting'],
        suitableFor: ['Friends', 'Adventure Groups'],
        vehicleIncluded: 'Tempo Traveller'
      }
    ]
  },
  {
    id: 'kodaikanal',
    name: 'Kodaikanal',
    tamilName: 'கொடைக்கானல்',
    district: 'Dindigul',
    category: 'hill_station',
    shortDescription: 'The Princess of Hill Stations known for star-shaped Kodai lake, eucalyptus woods, Pillar Rocks, and cool clouds.',
    fullDescription: 'Located at 2,133 meters in the Palani Hills, Kodaikanal charms visitors with cascading Silver Cascade falls, serene Bryant Park, Coaker\'s Walk cliff views, and homemade chocolates.',
    images: [
      'https://images.unsplash.com/photo-1609137144820-22d7c040bb06?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'
    ],
    popularAttractions: ['Kodaikanal Lake', 'Coaker’s Walk', 'Pillar Rocks', 'Bryant Park', 'Silver Cascade', 'Pine Forest'],
    estimatedCostPerDay: 2600,
    averageRating: 4.7,
    reviewCount: 289,
    location: 'Dindigul District, Tamil Nadu',
    coordinates: { lat: 10.2381, lng: 77.4892 },
    isPopular: true,
    isTrending: true,
    suitableGroupTypes: ['solo', 'family', 'friends', 'couple', 'group'],
    suitableCategories: ['nature_wildlife', 'photography_visual', 'general_tourist'],
    weather: {
      tempC: 17,
      condition: 'Overcast & Fresh',
      rainfallMm: 4,
      windSpeedKmh: 14,
      alertLevel: 'green',
      alertTitle: 'Comfortable Mountain Climate',
      alertDetails: 'Pleasant daytime breezes. Good visibility at viewpoints.',
      bookingRestricted: false
    },
    packages: [
      {
        id: 'kodai-mist-3d',
        title: 'Misty Valleys & Lake Serenity',
        duration: '3 Days / 2 Nights',
        pricePerPerson: 5499,
        inclusions: ['Lakeview Resort', 'Private Vehicle', 'All Sightseeing Entry Passes', 'Buffet Breakfast'],
        highlights: ['Row Boating at Kodai Lake', 'Pillar Rocks Echo Point', 'Solar Observatory Visit'],
        suitableFor: ['Couples', 'Family'],
        vehicleIncluded: 'AC Sedan'
      }
    ]
  },
  {
    id: 'madurai',
    name: 'Madurai (Meenakshi Amman City)',
    tamilName: 'மதுரை (மீனாட்சி அம்மன் நகரம்)',
    district: 'Madurai',
    category: 'temple',
    shortDescription: 'The Athens of the East, famed for the magnificent Meenakshi Sundareswarar Temple, Jasmine markets, and Jigarthanda.',
    fullDescription: 'One of the world\'s oldest continuously inhabited cities, built along the sacred Vaigai River. Madurai is renowned for its grand Dravidian gopurams, the thousand-pillared hall, Thirumalai Nayakkar Palace, and vibrant culinary scene.',
    images: [
      'https://images.unsplash.com/photo-1621847468516-1ed5d0df56fe?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=1200&q=80'
    ],
    popularAttractions: ['Meenakshi Amman Temple', 'Thirumalai Nayakkar Mahal', 'Gandhi Memorial Museum', 'Vandiyur Mariamman Teppakulam', 'Alagar Kovil'],
    estimatedCostPerDay: 2200,
    averageRating: 4.9,
    reviewCount: 420,
    location: 'Madurai District, Tamil Nadu',
    coordinates: { lat: 9.9195, lng: 78.1193 },
    isPopular: true,
    isBudgetFriendly: true,
    suitableGroupTypes: ['solo', 'family', 'group'],
    suitableCategories: ['temple_spiritual', 'historical_heritage', 'food_culture'],
    templeInfo: {
      deity: 'Goddess Meenakshi & Lord Sundareswarar',
      openingHours: '5:00 AM – 12:30 PM & 4:00 PM – 10:00 PM',
      poojaTimings: 'Thiruvanandal (5:30 AM), Kaalasanthi (6:30 AM), Thrikalasanthi (10:30 AM), Sayarakshai (5:00 PM), Arthajamam (9:00 PM)',
      dressCode: 'Strict Traditional Indian Attire: Dhoti/Kurta for Men; Saree/Churidar with Dupatta for Women. Jeans, shorts, and tight western wear not allowed.',
      visitorGuidelines: 'Mobile phones and electronic gadgets are prohibited inside inner corridors. Clock rooms available at East Gopuram.',
      nearbyVegEateries: ['Murugan Idli Shop (West Masi St)', 'Modern Restaurant (Netaji Rd)', 'Sri Sabarees Pure Veg (Opp. Railway Stn)', 'Famous Jigarthanda Shop']
    },
    heritageInfo: {
      timeline: 'Sangam Period (6th Century BCE) to Nayak Dynasty (16th Century CE)',
      archaeologicalSignificance: 'Capital of ancient Pandya Kings mentioned in Megasthenes records and Silappatikaram.',
      museumInfo: 'Temple Art Museum inside Thousand Pillar Hall; Gandhi Memorial Palace Museum.',
      photographyPermit: 'Strictly prohibited inside sanctum. Permitted in outer courtyard with prior clearance.'
    },
    weather: {
      tempC: 31,
      condition: 'Sunny & Clear',
      rainfallMm: 0,
      windSpeedKmh: 8,
      alertLevel: 'green',
      alertTitle: 'Warm & Ideal For Darshan',
      alertDetails: 'Morning and evening temple darshan recommended for cooler temperatures.',
      bookingRestricted: false
    },
    packages: [
      {
        id: 'madurai-spiritual-2d',
        title: 'Spiritual Heritage & Darshan Circuit',
        duration: '2 Days / 1 Night',
        pricePerPerson: 3600,
        inclusions: ['Heritage Hotel Near Temple', 'Special Darshan Assistance Guidance', 'Air-Conditioned Cab', 'Traditional Madurai Breakfast'],
        highlights: ['Meenakshi Amman Evening Aarti Ceremony', 'Nayakkar Palace Light & Sound Show', 'Food Trail Jigarthanda Tasting'],
        suitableFor: ['Family', 'Devotees', 'Heritage Researchers'],
        vehicleIncluded: 'AC Sedan / Mini Bus'
      }
    ]
  },
  {
    id: 'rameswaram',
    name: 'Rameswaram (Pamban Island)',
    tamilName: 'இராமேஸ்வரம் (பாம்பன் தீவு)',
    district: 'Ramanathapuram',
    category: 'temple',
    shortDescription: 'Sacred island temple town with 22 holy theerthams, iconic Pamban Sea Bridge, and Dhanushkodi ghost town.',
    fullDescription: 'Located on Pamban Island separated from mainland India by the Pamban Channel, Rameswaram is one of the Char Dham pilgrimage sites, famous for Ramanathaswamy Temple\'s 1,212 corridor pillars and holy water bathing rituals.',
    images: [
      'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'
    ],
    popularAttractions: ['Ramanathaswamy Temple', '22 Holy Kund Theerthams', 'Dhanushkodi Beach & Ruins', 'Pamban Rail & Road Bridge', 'Dr. APJ Abdul Kalam Memorial', 'Agni Theertham'],
    estimatedCostPerDay: 2300,
    averageRating: 4.8,
    reviewCount: 310,
    location: 'Ramanathapuram District, Tamil Nadu',
    coordinates: { lat: 9.2876, lng: 79.3129 },
    isPopular: true,
    suitableGroupTypes: ['solo', 'family', 'group'],
    suitableCategories: ['temple_spiritual', 'historical_heritage', 'general_tourist'],
    templeInfo: {
      deity: 'Lord Ramanathaswamy (Lingam of Sand by Sita Devi)',
      openingHours: '5:00 AM – 1:00 PM & 3:00 PM – 9:00 PM',
      poojaTimings: 'Mani Darshan / Spatika Linga Pooja (5:00 AM - 6:00 AM), Sayarakshai (6:00 PM), Arthajamam (8:30 PM)',
      dressCode: 'Traditional attire. Men in dhotis without shirts or angavastram, Women in sarees/churidars. Wet clothes allowed only during 22 Theertham ritual.',
      visitorGuidelines: 'Agni Theertham sea dip followed by bathing at 22 internal temple wells.',
      nearbyVegEateries: ['Sri Saravana Bhavan (Near Temple)', 'Gujarat Bhavan Bhojanalay', 'Hotel Tamil Nadu Restaurant']
    },
    weather: {
      tempC: 29,
      condition: 'Coastal Breeze & Sunny',
      rainfallMm: 0,
      windSpeedKmh: 18,
      alertLevel: 'green',
      alertTitle: 'Clear Sea & Darshan Conditions',
      alertDetails: 'Calm waters at Agni Theertham. Dhanushkodi road open for tourist 4WDs.',
      bookingRestricted: false
    },
    packages: [
      {
        id: 'rameswaram-pilgrimage-2d',
        title: 'Sacred Theerthams & Pamban Wonders',
        duration: '2 Days / 1 Night',
        pricePerPerson: 4200,
        inclusions: ['Hotel with Hot Water Facility', '22 Theertham Assistance', 'Dhanushkodi 4x4 Safari Tour', 'AC Cab'],
        highlights: ['Spatika Linga Morning Darshan', 'Dhanushkodi Ram Setu Point', 'Dr. Kalam National Memorial'],
        suitableFor: ['Pilgrims', 'Family', 'Photographers'],
        vehicleIncluded: 'AC Sedan / Tempo'
      }
    ]
  },
  {
    id: 'kanyakumari',
    name: 'Kanyakumari (Triveni Sangam)',
    tamilName: 'கன்னியாகுமரி (முக்கடல் சங்கமம்)',
    district: 'Kanyakumari',
    category: 'beach',
    shortDescription: 'The southernmost tip of peninsular India where the Arabian Sea, Bay of Bengal, and Indian Ocean meet.',
    fullDescription: 'Famous for spectacular simultaneous sunrises and sunsets over three oceans, the Vivekananda Rock Memorial, the 133-foot Thiruvalluvar Statue, and Bhagavathy Amman Temple.',
    images: [
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80'
    ],
    popularAttractions: ['Vivekananda Rock Memorial', 'Thiruvalluvar Statue', 'Bhagavathy Amman Temple', 'Sunset View Point', 'Gandhi Memorial Mandapam', 'Triveni Sangam Shore'],
    estimatedCostPerDay: 2400,
    averageRating: 4.8,
    reviewCount: 395,
    location: 'Kanyakumari District, Tamil Nadu',
    coordinates: { lat: 8.0883, lng: 77.5385 },
    isPopular: true,
    suitableGroupTypes: ['solo', 'family', 'friends', 'couple', 'group'],
    suitableCategories: ['nature_wildlife', 'photography_visual', 'temple_spiritual', 'general_tourist'],
    weather: {
      tempC: 28,
      condition: 'Clear Blue Sky & Coastal Winds',
      rainfallMm: 0,
      windSpeedKmh: 20,
      alertLevel: 'green',
      alertTitle: 'Excellent Ferry Operation',
      alertDetails: 'Vivekananda Rock ferry service operating on regular schedule.',
      bookingRestricted: false
    },
    packages: [
      {
        id: 'kanya-sunrise-2d',
        title: 'Three Seas Sunrise & Heritage Odyssey',
        duration: '2 Days / 1 Night',
        pricePerPerson: 3900,
        inclusions: ['Sea-facing Hotel Room', 'Ferry Tickets to Rock Memorial', 'Padmanabhapuram Palace Excursion', 'Private Cab'],
        highlights: ['Tri-Sea Confluence Sunrise', 'Thiruvalluvar Statue Boat Ride', 'Mathur Hanging Trough'],
        suitableFor: ['Family', 'Couples', 'Solo Travellers'],
        vehicleIncluded: 'AC Sedan'
      }
    ]
  },
  {
    id: 'mahabalipuram',
    name: 'Mahabalipuram (Mamallapuram)',
    tamilName: 'மகாபலிபுரம் (மாமல்லபுரம்)',
    district: 'Chengalpattu',
    category: 'historical_site',
    shortDescription: 'UNESCO World Heritage Pallava rock-cut architecture, monolithic chariots, Arjuna’s Penance, and oceanfront breeze.',
    fullDescription: 'Dating back to the 7th-8th century Pallava Dynasty, Mahabalipuram is an open-air art museum. The coastal Shore Temple, monolithic Pancha Rathas, and world\'s largest bas-relief carvings stand witness to timeless ancient craftsmanship.',
    images: [
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'
    ],
    popularAttractions: ['Shore Temple', 'Pancha Rathas (Five Rathas)', 'Arjuna’s Penance', 'Krishna’s Butter Ball', 'Mahabalipuram Beach', 'India Seashell Museum'],
    estimatedCostPerDay: 2500,
    averageRating: 4.8,
    reviewCount: 375,
    location: 'Chengalpattu District, Tamil Nadu',
    coordinates: { lat: 12.6269, lng: 80.1927 },
    isPopular: true,
    isWeekendFavorite: true,
    suitableGroupTypes: ['solo', 'friends', 'family', 'couple', 'group'],
    suitableCategories: ['historical_heritage', 'photography_visual', 'educational_research'],
    heritageInfo: {
      timeline: '7th–8th Century CE (King Narasimhavarman I & II)',
      archaeologicalSignificance: 'UNESCO World Heritage Monument Group; cradle of south Indian monolithic stone architecture.',
      museumInfo: 'Archaeological Survey of India (ASI) Museum and Maritime Heritage Display.',
      photographyPermit: 'Allowed for amateur photography. Drone flying requires prior DGCA and ASI clearance.'
    },
    weather: {
      tempC: 30,
      condition: 'Sunny Sea Breeze',
      rainfallMm: 0,
      windSpeedKmh: 15,
      alertLevel: 'green',
      alertTitle: 'Ideal Coastal Weather',
      alertDetails: 'Pleasant morning walks along monument complexes.',
      bookingRestricted: false
    },
    packages: [
      {
        id: 'maha-heritage-1d',
        title: 'Pallava Stone Carvings & Shoreline Splendor',
        duration: '1 Day / Full Day',
        pricePerPerson: 1800,
        inclusions: ['ASI Monument Entry Passes', 'Certified Heritage Guide', 'AC Cab from Chennai/Hotel', 'Seafood / Veg Lunch'],
        highlights: ['Arjuna Penance Storytelling', 'Krishna Butterball Gravity Wonder', 'Pancha Ratha Monoliths'],
        suitableFor: ['Heritage Researchers', 'Students', 'Friends'],
        vehicleIncluded: 'AC Sedan / Tourist Bus'
      }
    ]
  },
  {
    id: 'thanjavur',
    name: 'Thanjavur (Brihadisvara Big Temple)',
    tamilName: 'தஞ்சாவூர் (பெரிய கோவில்)',
    district: 'Thanjavur',
    category: 'historical_site',
    shortDescription: 'The Cultural Capital of Tamil Nadu, home to the thousand-year-old Chola Brihadisvara Temple (Peruvudaiyar Kovil).',
    fullDescription: 'Built by the visionary emperor Raja Raja Chola I in 1010 CE, the Brihadisvara Temple stands with its 216-foot vimana topped by an 80-tonne single granite kumbam. Thanjavur is also world-renowned for bronze casting, Tanjore paintings, and Saraswathi Mahal Library.',
    images: [
      'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1621847468516-1ed5d0df56fe?auto=format&fit=crop&w=1200&q=80'
    ],
    popularAttractions: ['Brihadisvara Temple (Big Temple)', 'Thanjavur Maratha Palace', 'Saraswathi Mahal Library', 'Schwartz Church', 'Art Gallery & Chola Bronzes'],
    estimatedCostPerDay: 2100,
    averageRating: 4.9,
    reviewCount: 360,
    location: 'Thanjavur District, Tamil Nadu',
    coordinates: { lat: 10.7870, lng: 79.1378 },
    isPopular: true,
    suitableGroupTypes: ['solo', 'family', 'group'],
    suitableCategories: ['historical_heritage', 'temple_spiritual', 'educational_research'],
    templeInfo: {
      deity: 'Lord Shiva (Peruvudaiyar / Brihadisvara) & Goddess Periyanayagi',
      openingHours: '6:00 AM – 12:30 PM & 4:00 PM – 8:30 PM',
      poojaTimings: 'Kaalasanthi (8:30 AM), Uchikala (12:00 PM), Sayarakshai (6:00 PM), Arthajamam (8:00 PM)',
      dressCode: 'Modest traditional Indian attire required.',
      visitorGuidelines: 'Footwear must be deposited at the outer counter. Large shadows never cast outside parameter claims are explained on guided tours.',
      nearbyVegEateries: ['Hotel Gnanam Pure Veg', 'Sree Ariya Bhavan (Opp. Old Bus Stand)', 'Vasantha Bhavan']
    },
    heritageInfo: {
      timeline: 'Completed 1010 CE by Emperor Raja Raja Chola I',
      archaeologicalSignificance: 'UNESCO World Heritage Living Chola Temple; ancient Tamil inscriptions cataloging state donations, dancers, and engineers.',
      museumInfo: 'Saraswathi Mahal Library (rare palm-leaf manuscripts) and Royal Palace Art Gallery.',
      photographyPermit: 'Outer temple premises free for photography; restricted inside sanctum.'
    },
    weather: {
      tempC: 32,
      condition: 'Clear Skies',
      rainfallMm: 0,
      windSpeedKmh: 10,
      alertLevel: 'green',
      alertTitle: 'Sunny & Pleasant',
      alertDetails: 'Granite courtyard gets warm after noon; early morning or sunset visits recommended.',
      bookingRestricted: false
    },
    packages: [
      {
        id: 'thanjavur-chola-2d',
        title: 'Great Living Chola Temples Circuit',
        duration: '2 Days / 1 Night',
        pricePerPerson: 4500,
        inclusions: ['Heritage Stay', 'Chola Architecture Historian Guide', 'AC Transport across Thanjavur & Gangaikonda Cholapuram', 'Entry Passes'],
        highlights: ['Big Temple Architectural Secrets', 'Saraswathi Mahal Rare Manuscript Gallery', 'Bronze Casting Demonstration'],
        suitableFor: ['Historical Researchers', 'Devotees', 'Architecture Students'],
        vehicleIncluded: 'AC Sedan / Mini Bus'
      }
    ]
  },
  {
    id: 'yercaud',
    name: 'Yercaud (Jewel of the South)',
    tamilName: 'ஏற்காடு (தெற்கின் நகை)',
    district: 'Salem',
    category: 'hill_station',
    shortDescription: 'Peaceful hill resort in the Shevaroy Hills surrounded by coffee plantations, orange groves, and peaceful lakes.',
    fullDescription: 'Perched at 1,515 meters above sea level, Yercaud provides a relaxed, less crowded hill experience with scenic viewpoints like Lady\'s Seat, Pagoda Point, Killiyur Falls, and botanical rose gardens.',
    images: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80'
    ],
    popularAttractions: ['Yercaud Emerald Lake', 'Lady’s Seat & Gent’s Seat', 'Killiyur Falls', 'Pagoda Point', 'Shevaroy Temple', 'Botanical Garden & Orchidarium'],
    estimatedCostPerDay: 2000,
    averageRating: 4.6,
    reviewCount: 215,
    location: 'Salem District, Tamil Nadu',
    coordinates: { lat: 11.7749, lng: 78.2093 },
    isPopular: true,
    isBudgetFriendly: true,
    isWeekendFavorite: true,
    suitableGroupTypes: ['solo', 'family', 'friends', 'couple'],
    suitableCategories: ['nature_wildlife', 'general_tourist'],
    weather: {
      tempC: 21,
      condition: 'Pleasant & Mild Breeze',
      rainfallMm: 0,
      windSpeedKmh: 9,
      alertLevel: 'green',
      alertTitle: 'Ideal Weekend Conditions',
      alertDetails: 'Scenic ghat road open with excellent driving conditions.',
      bookingRestricted: false
    },
    packages: [
      {
        id: 'yercaud-relax-2d',
        title: 'Coffee Estate Walk & Lake Escape',
        duration: '2 Days / 1 Night',
        pricePerPerson: 3200,
        inclusions: ['Plantation Stay Cottage', 'Boating Vouchers', 'Private Cab for Viewpoints', 'Breakfast'],
        highlights: ['Killiyur Cascades Hike', 'Sunset at Lady\'s Seat', 'Organic Coffee Tasting'],
        suitableFor: ['Families', 'Couples', 'Weekend Explorers'],
        vehicleIncluded: 'AC Sedan'
      }
    ]
  },
  {
    id: 'courtallam',
    name: 'Courtallam (Spa of South India)',
    tamilName: 'குற்றாலம் (தென்னிந்தியாவின் ஸ்பா)',
    district: 'Tenkasi',
    category: 'waterfall',
    shortDescription: 'World-famous medicinal herbal waterfalls situated at the foothills of the Western Ghats.',
    fullDescription: 'Courtallam is blessed with nine major waterfalls whose waters flow through dense Ayurvedic herb and spice forests of the Western Ghats. The breeze and microclimate create a natural healing therapy known locally as the Courtallam Season.',
    images: [
      'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80'
    ],
    popularAttractions: ['Main Falls (Peraruvi)', 'Five Falls (Aintharuvi)', 'Old Courtallam Falls', 'Tiger Falls', 'Shenbaga Devi Falls', 'Kutralanathar Temple'],
    estimatedCostPerDay: 1900,
    averageRating: 4.7,
    reviewCount: 260,
    location: 'Tenkasi District, Tamil Nadu',
    coordinates: { lat: 8.9304, lng: 77.2694 },
    isPopular: true,
    isBudgetFriendly: true,
    suitableGroupTypes: ['family', 'friends', 'group'],
    suitableCategories: ['nature_wildlife', 'temple_spiritual', 'food_culture'],
    weather: {
      tempC: 25,
      condition: 'Gentle Drizzle & Cool Winds',
      rainfallMm: 8,
      windSpeedKmh: 16,
      alertLevel: 'green',
      alertTitle: 'Optimal Water Cascade Flow',
      alertDetails: 'Bathing permitted under lifeguard supervision at Main and Five Falls.',
      bookingRestricted: false
    },
    packages: [
      {
        id: 'courtallam-wellness-2d',
        title: 'Herbal Water Cascades & Tenkasi Flavors',
        duration: '2 Days / 1 Night',
        pricePerPerson: 2900,
        inclusions: ['Resort near Five Falls', 'Private Vehicle', 'Tenkasi Border Parotta Food Trail', 'Kutralanathar Temple Visit'],
        highlights: ['Five Falls Natural Herbal Bath', 'Old Courtallam Peaceful Walk', 'Local Tenkasi Halwa Tasting'],
        suitableFor: ['Families', 'Friends Groups'],
        vehicleIncluded: 'AC Sedan / Tempo'
      }
    ]
  },
  {
    id: 'valparai',
    name: 'Valparai (Anamalai Hills Sanctuary)',
    tamilName: 'வால்பாறை (ஆனைமலை மலைத்தொடர்)',
    district: 'Coimbatore',
    category: 'wildlife',
    shortDescription: 'Untouched hill station with 40 hairpin bends, Lion-tailed macaques, Great hornbills, and endless tea estates.',
    fullDescription: 'Rising 1,066 meters in the Anamalai Tiger Reserve range, Valparai is heaven for wildlife photographers and nature lovers. It features emerald tea estates, mist-laden Sholayar Dam, and rare indigenous wildlife.',
    images: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=80'
    ],
    popularAttractions: ['40 Hairpin Bends', 'Sholayar Dam', 'Chinnakallar Waterfalls (Highest Rainfall Spot)', 'Aliyar Dam Viewpoint', 'Nallamudi Poonjolai', 'Monkey Falls'],
    estimatedCostPerDay: 2600,
    averageRating: 4.8,
    reviewCount: 198,
    location: 'Coimbatore District, Tamil Nadu',
    coordinates: { lat: 10.3262, lng: 76.9554 },
    isPopular: true,
    suitableGroupTypes: ['solo', 'friends', 'couple', 'group'],
    suitableCategories: ['nature_wildlife', 'photography_visual', 'educational_research'],
    weather: {
      tempC: 19,
      condition: 'Heavy Mountain Rain Alert',
      rainfallMm: 68,
      windSpeedKmh: 42,
      alertLevel: 'red',
      alertTitle: 'DANGER ZONE – RED ALERT (Landslide & Heavy Ghat Rainfall)',
      alertDetails: 'District Collector advisory: Ghat road hairpin turns 28 to 36 have risk of mud slips. Tourist booking restricted until safety clearance.',
      bookingRestricted: true,
      safeAlternativeDestinations: ['yercaud', 'ooty', 'mahabalipuram']
    },
    packages: [
      {
        id: 'valparai-eco-3d',
        title: 'Rainforest Wildlife & Sholayar Trails',
        duration: '3 Days / 2 Nights',
        pricePerPerson: 5900,
        inclusions: ['Forest Eco-Lodge', 'Guided Naturalist Safari', 'Tea Factory Visit', 'All Forest Passes'],
        highlights: ['Hornbill Birdwatching', 'Sholayar Dam Backwater Sunset', 'Lion-Tailed Macaque Habitat'],
        suitableFor: ['Wildlife Photographers', 'Nature Enthusiasts'],
        vehicleIncluded: 'Forest Safari 4WD / Mini Bus'
      }
    ]
  },

  // HIDDEN SPOTS
  {
    id: 'meghamalai',
    name: 'Meghamalai (Highwavys High Range)',
    tamilName: 'மேகமலை (ஹைவேவிஸ்)',
    district: 'Theni',
    category: 'hidden_spot',
    isHiddenSpot: true,
    shortDescription: 'The "High Wavy Mountains" hidden in clouds with cool cardamom estates, wild elephants, and emerald dams.',
    fullDescription: 'Meghamalai, popularly known as Highwavys, is an offbeat paradise nestled at 1,500m in the Western Ghats. Surrounded by tea plantations and the Megamalai Wildlife Sanctuary, it offers pristine solitude far from tourist commercialization.',
    images: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80'
    ],
    popularAttractions: ['Highwavys Dam', 'Manalar Dam', 'Megamalai Wildlife Sanctuary', 'Venniyar Tea Estate', 'Maharaja Mettu Viewpoint', 'Suruli Falls Foothills'],
    estimatedCostPerDay: 2500,
    averageRating: 4.8,
    reviewCount: 142,
    location: 'Theni District, Tamil Nadu',
    coordinates: { lat: 9.7145, lng: 77.3995 },
    suitableGroupTypes: ['solo', 'friends', 'couple'],
    suitableCategories: ['nature_wildlife', 'photography_visual'],
    weather: {
      tempC: 18,
      condition: 'Misty Cloud Cover',
      rainfallMm: 3,
      windSpeedKmh: 12,
      alertLevel: 'green',
      alertTitle: 'Pristine Mist Weather',
      alertDetails: 'Clear road from Chinnamanur. Four-wheel drive or experienced hill driving recommended.',
      bookingRestricted: false
    },
    packages: [
      {
        id: 'meghamalai-clouds-2d',
        title: 'Untouched Cloud Mountain Hideaway',
        duration: '2 Days / 1 Night',
        pricePerPerson: 4600,
        inclusions: ['Colonial Plantation Bungalow', 'Jeep Safari to Maharaja Mettu', 'Campfire Under Stars', 'Homecooked Meals'],
        highlights: ['Cloud Inversion Sunrise', 'Highwavys Lake Mist Walk', 'Wild Bison Spotting'],
        suitableFor: ['Peace Seekers', 'Couples', 'Solo Travellers'],
        vehicleIncluded: 'Hill 4WD Jeep'
      }
    ]
  },
  {
    id: 'kolli-hills',
    name: 'Kolli Hills (Mountain of Death & Life)',
    tamilName: 'கொல்லி மலை (70 கொண்டை ஊசி வளைவுகள்)',
    district: 'Namakkal',
    category: 'hidden_spot',
    isHiddenSpot: true,
    shortDescription: 'Mystical hill range famous for 70 exhilarating hairpin bends, ancient Arapaleeswarar temple, and Agaya Gangai waterfall.',
    fullDescription: 'Rising 1,300 meters, Kolli Hills has remained serene and untouched. Legendary for Siddha medicinal plants, pepper plantations, 70 continuous hairpin bends for bike and road trip enthusiasts, and the breathtaking 300-foot Agaya Gangai cascades.',
    images: [
      'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80'
    ],
    popularAttractions: ['70 Hairpin Bends', 'Agaya Gangai Waterfalls (1,200 Steps Descent)', 'Arapaleeswarar Temple', 'Siddha Caves', 'Seekuparai Viewpoint', 'Masila Falls'],
    estimatedCostPerDay: 1800,
    averageRating: 4.7,
    reviewCount: 165,
    location: 'Namakkal District, Tamil Nadu',
    coordinates: { lat: 11.2500, lng: 78.3392 },
    isBudgetFriendly: true,
    suitableGroupTypes: ['friends', 'solo', 'group'],
    suitableCategories: ['nature_wildlife', 'temple_spiritual'],
    weather: {
      tempC: 22,
      condition: 'Fresh Mountain Breezes',
      rainfallMm: 1,
      windSpeedKmh: 10,
      alertLevel: 'green',
      alertTitle: 'Clear Ghat Pass',
      alertDetails: 'All 70 hairpin bends clear and dry. Step descent to Agaya Gangai open.',
      bookingRestricted: false
    },
    packages: [
      {
        id: 'kolli-rider-2d',
        title: '70 Hairpin Thrill & Agaya Gangai Trek',
        duration: '2 Days / 1 Night',
        pricePerPerson: 3100,
        inclusions: ['Hill Top Stay', 'Local Trek Guide for 1200 Steps', 'Authentic Kongu Meals', 'Sightseeing Transfers'],
        highlights: ['Ghat Road Drive Thrill', 'Agaya Gangai Natural Shower', 'Herbal Farm Visit'],
        suitableFor: ['Friends Groups', 'Trekkers', 'Bikers'],
        vehicleIncluded: 'AC Cab / Tempo Traveller'
      }
    ]
  },
  {
    id: 'pichavaram',
    name: 'Pichavaram Mangrove Forest',
    tamilName: 'பிச்சாவரம் சதுப்புநிலக் காடுகள்',
    district: 'Cuddalore',
    category: 'hidden_spot',
    isHiddenSpot: true,
    shortDescription: 'World\'s second-largest mangrove ecosystem with 4,400 intricate tidal water canals and exotic birdlife.',
    fullDescription: 'Located near Chidambaram, Pichavaram features lush evergreen mangrove trees whose complex root systems create natural water labyrinths. Rowboats weave through tranquil green tunnels opening into the Vellar and Coleroon estuaries.',
    images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'
    ],
    popularAttractions: ['Mangrove Water Tunnel Boating', 'Avian Bird Sanctuary', 'Mudflat Exploration', 'Chidambaram Nataraja Temple (15km)', 'Silver Beach Estuary'],
    estimatedCostPerDay: 1700,
    averageRating: 4.7,
    reviewCount: 220,
    location: 'Cuddalore District, Tamil Nadu',
    coordinates: { lat: 11.4287, lng: 79.7828 },
    isBudgetFriendly: true,
    suitableGroupTypes: ['solo', 'family', 'friends', 'group'],
    suitableCategories: ['nature_wildlife', 'photography_visual', 'educational_research'],
    weather: {
      tempC: 30,
      condition: 'Coastal Calm & Gentle Sun',
      rainfallMm: 0,
      windSpeedKmh: 12,
      alertLevel: 'green',
      alertTitle: 'Safe Tidal Waterway Conditions',
      alertDetails: 'Boat club running regular rowboat and motorboat routes inside mangrove canopy.',
      bookingRestricted: false
    },
    packages: [
      {
        id: 'pichavaram-eco-1d',
        title: 'Mangrove Tunnel Boating & Temple Trail',
        duration: '1 Day / Full Day',
        pricePerPerson: 1650,
        inclusions: ['4-Hour Rowboat Exploration with Boatman', 'Life Jackets & Forest Entry Fee', 'Chidambaram Nataraja Temple Visit', 'Traditional Banana Leaf Lunch'],
        highlights: ['Evergreen Tree Arch Boating', 'Kingfisher & Egret Photography', 'Chidambaram Secret Explanation'],
        suitableFor: ['Families', 'Photographers', 'Educational Groups'],
        vehicleIncluded: 'AC Sedan / Coach'
      }
    ]
  },
  {
    id: 'sittanavasal',
    name: 'Sittanavasal (Ancient Cave Frescoes)',
    tamilName: 'சித்தன்னவாசல் (பழங்கால ஓவியக் குகைகள்)',
    district: 'Pudukkottai',
    category: 'historical_site',
    isHiddenSpot: true,
    shortDescription: '2nd Century BCE Jain rock-cut hermitage, Arivar Koil with natural vegetable-dye frescoes, and megalithic stone circles.',
    fullDescription: 'A treasure of ancient archaeology, Sittanavasal includes a 2nd century BCE rock shelter with 17 stone beds of Jain ascetics featuring Tamil-Brahmi inscriptions, and a 7th century Pandya cave temple adorned with world-famous lotus pond frescoes comparable to Ajanta.',
    images: [
      'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80'
    ],
    popularAttractions: ['Arivar Koil Cave Temple', 'Samanar Padukkai (Jain Beds)', 'Ancient Lotus Pond Frescoes', 'Megalithic Stone Burial Urns', 'Echo Rock', 'ASI Archaeological Park'],
    estimatedCostPerDay: 1500,
    averageRating: 4.8,
    reviewCount: 95,
    location: 'Pudukkottai District, Tamil Nadu',
    coordinates: { lat: 10.4578, lng: 78.7196 },
    isBudgetFriendly: true,
    suitableGroupTypes: ['solo', 'group'],
    suitableCategories: ['historical_heritage', 'educational_research', 'photography_visual'],
    heritageInfo: {
      timeline: '2nd Century BCE to 9th Century CE (Pandya & Early Chola)',
      archaeologicalSignificance: 'Protected monument of ASI; crucial epigraphical evidence for Tamil-Brahmi script transition.',
      museumInfo: 'ASI Pudukkottai Archaeological Site Museum and Heritage Information Kiosk.',
      photographyPermit: 'Strictly prohibited with flash inside painted cave chambers to preserve vegetable pigments.'
    },
    weather: {
      tempC: 31,
      condition: 'Clear & Sunny',
      rainfallMm: 0,
      windSpeedKmh: 9,
      alertLevel: 'green',
      alertTitle: 'Optimal Cave Exploration Weather',
      alertDetails: 'Comfortable morning climb to rock-cut beds.',
      bookingRestricted: false
    },
    packages: [
      {
        id: 'sitta-archaeo-1d',
        title: 'Tamil-Brahmi & Cave Art Research Expedition',
        duration: '1 Day / Full Day',
        pricePerPerson: 1850,
        inclusions: ['ASI Monument Entry', 'Archaeology Scholar Guide', 'AC Transport from Pudukkottai/Trichy', 'Traditional Meal'],
        highlights: ['Pandya Lotus Fresco Interpretation', 'Tamil-Brahmi Inscription Deciphering', 'Megalithic Urn Field Walk'],
        suitableFor: ['Historical Researchers', 'Archaeology Students'],
        vehicleIncluded: 'AC Sedan / Research Mini Bus'
      }
    ]
  },
  {
    id: 'keezhadi',
    name: 'Keezhadi Archaeological Excavation & Museum',
    tamilName: 'கீழடி தொல்லியல் களம் & உலகத்தரம் வாய்ந்த அருங்காட்சியகம்',
    district: 'Sivaganga',
    category: 'historical_site',
    shortDescription: 'Monumental 2,600-year-old Sangam Age urban civilization on the banks of Vaigai with state-of-the-art heritage museum.',
    fullDescription: 'Keezhadi has revolutionized ancient Indian history by proving a literate, sophisticated urban civilization existed along the Vaigai river as early as the 6th Century BCE. The newly opened ₹18.4 crore museum showcases over 4,000 artifacts, ring wells, pottery with Tamil-Brahmi graffiti, gold ornaments, and bone tools.',
    images: [
      'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80'
    ],
    popularAttractions: ['Keezhadi State Museum', 'Active Excavation Quadrants (Phases 8 & 9)', 'Ring Wells & Ancient Brick Structures', 'Tamil-Brahmi Inscribed Potsherds', 'Ancient Weaving & Dyeing Vats'],
    estimatedCostPerDay: 1600,
    averageRating: 4.9,
    reviewCount: 312,
    location: 'Sivaganga District (12km from Madurai), Tamil Nadu',
    coordinates: { lat: 9.8622, lng: 78.1883 },
    suitableGroupTypes: ['solo', 'family', 'group'],
    suitableCategories: ['historical_heritage', 'educational_research'],
    heritageInfo: {
      timeline: '6th Century BCE (Carbon-14 AMS Dated to 580 BCE)',
      archaeologicalSignificance: 'Definitive evidence of 2,600-year-old Sangam urban civilization, trade ties with ancient Rome and Southeast Asia.',
      museumInfo: 'Keezhadi World Museum with 6 immersive themed galleries, 3D animated reconstructions, and VR headsets.',
      photographyPermit: 'Allowed in designated museum galleries; excavation trenches subject to on-site Archaeological Officer permit.'
    },
    weather: {
      tempC: 32,
      condition: 'Clear & Bright',
      rainfallMm: 0,
      windSpeedKmh: 9,
      alertLevel: 'green',
      alertTitle: 'Ideal Museum & Site Conditions',
      alertDetails: 'Museum fully air-conditioned and open from 10:00 AM to 6:00 PM (Closed on Government Holidays).',
      bookingRestricted: false
    },
    packages: [
      {
        id: 'keezhadi-sangam-1d',
        title: 'Sangam Era 2600-Year Civilization Discovery',
        duration: '1 Day / Full Day',
        pricePerPerson: 1950,
        inclusions: ['Museum Entry & VR Ticket', 'Certified Tamil History Scholar Guidance', 'Madurai Pickup & Drop', 'South Indian Lunch'],
        highlights: ['Tamil-Brahmi Script Decryption', 'Ancient Brick Architecture Analysis', 'Live Excavation Site Walk'],
        suitableFor: ['Historical Researchers', 'College & University Groups', 'Family'],
        vehicleIncluded: 'AC Sedan / Educational Bus'
      }
    ]
  },
  {
    id: 'tiruvannamalai',
    name: 'Tiruvannamalai (Annamalaiyar & Girivalam)',
    tamilName: 'திருவண்ணாமலை (அண்ணாமலையார் & கிரிவலம்)',
    district: 'Tiruvannamalai',
    category: 'temple',
    shortDescription: 'One of the Pancha Bhoota Sthalams representing Fire (Agni Lingam), holy Arunachala hill, and 14km sacred Girivalam.',
    fullDescription: 'Sprawled over 25 acres with four magnificent gopurams including the 217-foot Eastern Raja Gopuram, Tiruvannamalai is the epicentre of Shaivite philosophy and the seat of Sri Ramana Maharshi Ashram.',
    images: [
      'https://images.unsplash.com/photo-1621847468516-1ed5d0df56fe?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=1200&q=80'
    ],
    popularAttractions: ['Annamalaiyar Temple', '14km Sacred Girivalam Path', 'Sri Ramana Ashram', 'Virupaksha Cave', 'Karthikai Deepam Hill Peak'],
    estimatedCostPerDay: 1900,
    averageRating: 4.9,
    reviewCount: 380,
    location: 'Tiruvannamalai District, Tamil Nadu',
    coordinates: { lat: 12.2253, lng: 79.0747 },
    isPopular: true,
    suitableGroupTypes: ['solo', 'family', 'group'],
    suitableCategories: ['temple_spiritual', 'historical_heritage'],
    templeInfo: {
      deity: 'Lord Arunachaleswarar (Agni Lingam) & Goddess Unnamalai Amman',
      openingHours: '5:30 AM – 12:30 PM & 3:30 PM – 9:30 PM (Continuous on Pournami / Full Moon nights)',
      poojaTimings: 'Ushakkalam (5:30 AM), Kaalasanthi (8:00 AM), Uchikalam (11:30 AM), Sayarakshai (5:30 PM), Arthajamam (9:00 PM)',
      dressCode: 'Dhoti, Kurta, Saree, Churidar with dupatta. Traditional dress is mandatory.',
      visitorGuidelines: 'Full moon night Girivalam requires starting by dusk; free battery buggy carts available for elderly along parts of the route.',
      nearbyVegEateries: ['Hotel Arunachala Pure Veg', 'Shanti Cafe & Bakery', 'The Dreaming Tree']
    },
    weather: {
      tempC: 30,
      condition: 'Pleasant Evening Breeze',
      rainfallMm: 0,
      windSpeedKmh: 11,
      alertLevel: 'green',
      alertTitle: 'Clear Girivalam Conditions',
      alertDetails: 'Well-lit walkway, ideal for evening and nighttime circumambulation.',
      bookingRestricted: false
    },
    packages: [
      {
        id: 'arunachala-girivalam-2d',
        title: 'Sacred Agni Sthalam & Girivalam Retreat',
        duration: '2 Days / 1 Night',
        pricePerPerson: 3400,
        inclusions: ['Ashram-adjacent Hotel', 'Special Darshan Pass Assistance', 'Ramana Ashram & Virupaksha Cave Walk Guide', 'Sattvic Breakfast'],
        highlights: ['Pournami Girivalam Guidance', 'Ancient Thousand Pillar Hall', 'Quiet Meditation in Cave'],
        suitableFor: ['Devotees', 'Spiritual Seekers', 'Elders'],
        vehicleIncluded: 'AC Sedan / Devotional Bus'
      }
    ]
  },
  {
    id: 'nagapattinam',
    name: 'Velankanni & Coastal Nagapattinam',
    tamilName: 'நாகப்பட்டினம் & வேளாங்கண்ணி',
    district: 'Nagapattinam',
    category: 'beach',
    shortDescription: 'Historic maritime port and coastal pilgrim sanctuary on the Bay of Bengal.',
    fullDescription: 'Centuries-old port connected to the ancient Chola maritime trade, home to the Basilica of Our Lady of Good Health and historic Nagapattinam lighthouse.',
    images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80'
    ],
    popularAttractions: ['Velankanni Basilica', 'Nagore Dargah', 'Nagapattinam Lighthouse & Beach', 'Sikkal Singaravelan Temple'],
    estimatedCostPerDay: 2100,
    averageRating: 4.6,
    reviewCount: 180,
    location: 'Nagapattinam District, Tamil Nadu',
    coordinates: { lat: 10.7656, lng: 79.8424 },
    suitableGroupTypes: ['family', 'group'],
    suitableCategories: ['temple_spiritual', 'general_tourist'],
    weather: {
      tempC: 27,
      condition: 'Depression / Rough High Seas',
      rainfallMm: 45,
      windSpeedKmh: 55,
      alertLevel: 'orange',
      alertTitle: 'High Sea Surge & Wind Warning (Orange Alert)',
      alertDetails: 'Fishermen and tourists advised not to enter sea water. Beach access restricted by coastal police.',
      bookingRestricted: false
    },
    packages: [
      {
        id: 'naga-pilgrim-2d',
        title: 'Coastal Peace & Multi-Faith Pilgrimage',
        duration: '2 Days / 1 Night',
        pricePerPerson: 3200,
        inclusions: ['Coastal Hotel', 'AC Vehicle', 'Temple & Shrine Transfers', 'Breakfast'],
        highlights: ['Velankanni Morning Mass', 'Nagore Sacred Harmony Tour', 'Fresh Seafood Market'],
        suitableFor: ['Pilgrims', 'Families'],
        vehicleIncluded: 'AC Sedan / Bus'
      }
    ]
  }
];

export const BEACH_FACILITIES: BeachChangingFacility[] = [
  {
    id: 'marina-smart-changing',
    beachName: 'Marina Beach, Chennai',
    facilityName: 'TN Tourism Smart Coastal Changing & Refreshment Hub',
    address: 'Near Gandhi Statue, Kamarajar Salai, Marina Beach, Chennai - 600004',
    distanceFromShoreMeters: 80,
    rating: 4.8,
    reviewCount: 156,
    photos: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: {
      privateChangingRoomsMen: true,
      privateChangingRoomsWomen: true,
      familyChangingRooms: true,
      hotShowers: true,
      restrooms: true,
      secureLockers: true,
      luggageStorage: true,
      babyChangingRoom: true,
      freshTowelsAvailable: true,
      coldBeveragesAndSnacks: true
    },
    slotPricing: {
      baseBookingFee: 0, // Zero per mandatory Free Booking Policy
      lockerCharge: 30,
      showerCharge: 20,
      towelRental: 25
    },
    isVerified: true,
    openHours: '5:30 AM – 9:30 PM (Daily)'
  },
  {
    id: 'elliots-besant-hub',
    beachName: 'Besant Nagar Elliot’s Beach, Chennai',
    facilityName: 'Bessie Beach Changing & Locker Facility',
    address: '6th Avenue, Beside Karl Schmidt Memorial, Besant Nagar, Chennai - 600090',
    distanceFromShoreMeters: 65,
    rating: 4.9,
    reviewCount: 112,
    photos: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: {
      privateChangingRoomsMen: true,
      privateChangingRoomsWomen: true,
      familyChangingRooms: true,
      hotShowers: true,
      restrooms: true,
      secureLockers: true,
      luggageStorage: true,
      babyChangingRoom: true,
      freshTowelsAvailable: true,
      coldBeveragesAndSnacks: true
    },
    slotPricing: {
      baseBookingFee: 0,
      lockerCharge: 25,
      showerCharge: 20,
      towelRental: 20
    },
    isVerified: true,
    openHours: '5:00 AM – 10:00 PM'
  },
  {
    id: 'maha-shore-hub',
    beachName: 'Mahabalipuram Shore Beach',
    facilityName: 'Pallava Coastal Care & Shower Lounge',
    address: 'Othavadai Street end, Mahabalipuram - 603104',
    distanceFromShoreMeters: 50,
    rating: 4.7,
    reviewCount: 94,
    photos: [
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: {
      privateChangingRoomsMen: true,
      privateChangingRoomsWomen: true,
      familyChangingRooms: true,
      hotShowers: true,
      restrooms: true,
      secureLockers: true,
      luggageStorage: true,
      babyChangingRoom: true,
      freshTowelsAvailable: true,
      coldBeveragesAndSnacks: true
    },
    slotPricing: {
      baseBookingFee: 0,
      lockerCharge: 30,
      showerCharge: 25,
      towelRental: 30
    },
    isVerified: true,
    openHours: '6:00 AM – 8:00 PM'
  },
  {
    id: 'kanya-triveni-hub',
    beachName: 'Kanyakumari Triveni Beach',
    facilityName: 'Mukaddal Pilgrims Changing & Cloak Pavilion',
    address: 'Near Gandhi Mandapam, Beach Road, Kanyakumari - 629702',
    distanceFromShoreMeters: 40,
    rating: 4.8,
    reviewCount: 204,
    photos: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: {
      privateChangingRoomsMen: true,
      privateChangingRoomsWomen: true,
      familyChangingRooms: true,
      hotShowers: true,
      restrooms: true,
      secureLockers: true,
      luggageStorage: true,
      babyChangingRoom: true,
      freshTowelsAvailable: true,
      coldBeveragesAndSnacks: true
    },
    slotPricing: {
      baseBookingFee: 0,
      lockerCharge: 20,
      showerCharge: 15,
      towelRental: 20
    },
    isVerified: true,
    openHours: '4:30 AM – 9:00 PM'
  }
];
