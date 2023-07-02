import { MatchingType, PrismaClient } from "@prisma/client";

export default async function seedMatchings(prisma: PrismaClient) {
  const defaultLat = 21.007076103786403; // Default latitude
  const defaultLong = 105.84310564167778; // Default longitude

  await prisma.matching.createMany({
    data: [
      // QUICK matchings
      {
        ownerId: 1,
        address: generateRandomAddress(),
        lat: defaultLat + getRandomOffset(),
        long: defaultLong + getRandomOffset(),
        duration: getRandomDuration(),
        matchingDate: new Date('2023-05-07'),
        desiredFood: 'Ice Cream',
        conversationTopics: 'Sports',
        matchingType: MatchingType.QUICK,
      },
      {
        ownerId: 2,
        address: generateRandomAddress(),
        lat: defaultLat + getRandomOffset(),
        long: defaultLong + getRandomOffset(),
        duration: getRandomDuration(),
        matchingDate: new Date('2023-06-06'),
        desiredFood: 'Pizza',
        conversationTopics: 'Movies',
        matchingType: MatchingType.QUICK,
      },
      {
        ownerId: 3,
        address: generateRandomAddress(),
        lat: defaultLat + getRandomOffset(),
        long: defaultLong + getRandomOffset(),
        duration: getRandomDuration(),
        matchingDate: new Date('2023-06-15'),
        desiredFood: 'Burgers',
        conversationTopics: 'Technology',
        matchingType: MatchingType.QUICK,
      },
      {
        ownerId: 4,
        address: generateRandomAddress(),
        lat: defaultLat + getRandomOffset(),
        long: defaultLong + getRandomOffset(),
        duration: getRandomDuration(),
        matchingDate: new Date('2023-06-21'),
        desiredFood: 'Sushi',
        conversationTopics: 'Travel',
        matchingType: MatchingType.QUICK,
      },
      // YOTEI matchings
      {
        ownerId: 5,
        address: generateRandomAddress(),
        lat: defaultLat + getRandomOffset(),
        long: defaultLong + getRandomOffset(),
        matchingDate: new Date('2023-07-05'),
        desiredFood: 'Pasta',
        conversationTopics: 'Music',
        matchingType: MatchingType.YOTEI,
      },
      {
        ownerId: 2,
        address: generateRandomAddress(),
        lat: defaultLat + getRandomOffset(),
        long: defaultLong + getRandomOffset(),
        matchingDate: new Date('2023-07-21'),
        desiredFood: 'Steak',
        conversationTopics: 'Art',
        matchingType: MatchingType.YOTEI,
      },
      {
        ownerId: 1,
        address: generateRandomAddress(),
        lat: defaultLat + getRandomOffset(),
        long: defaultLong + getRandomOffset(),
        matchingDate: new Date('2023-06-24'),
        desiredFood: 'Sushi',
        conversationTopics: 'Travel',
        matchingType: MatchingType.YOTEI,
      },
      {
        ownerId: 3,
        address: generateRandomAddress(),
        lat: defaultLat + getRandomOffset(),
        long: defaultLong + getRandomOffset(),
        matchingDate: new Date('2023-07-20'),
        desiredFood: 'Burgers',
        conversationTopics: 'Technology',
        matchingType: MatchingType.YOTEI,
      },
      // Add more matchings as needed...
    ]
  });

  await prisma.userMatching.createMany({
    data: [
      {
        userId: 1,
        matchingId: 1,
      },
      {
        userId: 3,
        matchingId: 1,
      },
      {
        userId: 4,
        matchingId: 1,
      },
      {
        userId: 2,
        matchingId: 2,
      },
      {
        userId: 3,
        matchingId: 3,
      },
      {
        userId: 2,
        matchingId: 4,
      },
      {
        userId: 4,
        matchingId: 4,
      },
      {
        userId: 1,
        matchingId: 5,
      },
      {
        userId: 5,
        matchingId: 5,
      },
      {
        userId: 2,
        matchingId: 6,
      },
      {
        userId: 3,
        matchingId: 6,
      },
      {
        userId: 1,
        matchingId: 7,
      },
      {
        userId: 2,
        matchingId: 7,
      },
      {
        userId: 5,
        matchingId: 7,
      },
      {
        userId: 3,
        matchingId: 8,
      },
      {
        userId: 4,
        matchingId: 8,
      },
    ]
  })
}

// Helper function to generate a random offset within 0.01
function getRandomOffset() {
  return (Math.random() - 0.5) * 0.02;
}

// Helper function to generate a random duration within 15-120 minutes
function getRandomDuration() {
  return Math.floor(Math.random() * (120-15)) + 15;
}

// Helper function to generate a random address
function generateRandomAddress() {
  const cities = [
    'Hanoi',
    'Ho Chi Minh City',
    'Da Nang',
    'Hai Phong',
    'Can Tho',
    // Add more city names as needed...
  ];

  const streets = [
    'Nguyen Hue',
    'Le Loi',
    'Tran Hung Dao',
    'Phan Dinh Phung',
    'Hoang Van Thu',
    // Add more street names as needed...
  ];

  const randomCity = cities[Math.floor(Math.random() * cities.length)];
  const randomStreet = streets[Math.floor(Math.random() * streets.length)];
  const randomHouseNumber = Math.floor(Math.random() * 1000);

  return `${randomHouseNumber} ${randomStreet}, ${randomCity}`;
}