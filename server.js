const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname));

// Расширенные данные объектов
const objects = [
  {
    id: "h1",
    address: "ул. Ленина, д. 1",
    coords: [64.562, 39.82],
    floors: 5,
    year: 2018,
    photo: "/house1.jpg",
    developer: "ООО «СтройМастер»",
    series: "П-44Т",
    material: "Кирпич",
    area: 4500,
    apartments: 72,
    elevator: true,
    rating: 4.7,
    energyClass: "B",
    lastRepair: "2023-05",
    nextRepair: "2025-05",
    manager: "Иванов П.С.",
    phone: "+7 (8182) 00-00-01",
    boundary: [
      [64.5615, 39.8195],
      [64.5625, 39.8195],
      [64.5625, 39.8205],
      [64.5615, 39.8205]
    ],
    utilities: {
      electricity: 12450,
      water: 3200,
      heating: 8900,
      gas: 0
    },
    infra: [
      {
        type: "trash_bin",
        title: "Бак №1",
        coords: [64.5618, 39.8198],
        load: 25,
        volume: "1.1 м³",
        material: "Сталь",
        lastEmpty: "2024-01-15",
        photo: "/trash1.jpg",
        status: "active"
      },
      {
        type: "trash_bin",
        title: "Бак №2",
        coords: [64.5622, 39.8202],
        load: 55,
        volume: "1.1 м³",
        material: "Пластик",
        lastEmpty: "2024-01-14",
        photo: "/trash2.jpg",
        status: "active"
      },
      {
        type: "tko_bin",
        title: "ТКО Бак",
        coords: [64.5617, 39.8203],
        load: 80,
        volume: "0.8 м³",
        material: "Металл",
        lastEmpty: "2024-01-13",
        photo: "/tko1.jpg",
        status: "active"
      },
      {
        type: "parking",
        title: "Парковка №1",
        totalSpots: 45,
        busySpots: 32,
        coords: [64.5623, 39.8197],
        pricePerHour: 50,
        hasEVCharger: true,
        barrier: true,
        camera: true,
        boundary: [
          [64.5620, 39.8193],
          [64.5626, 39.8193],
          [64.5626, 39.8201],
          [64.5620, 39.8201]
        ]
      },
      {
        type: "playground",
        title: "Детская площадка",
        surface: "Резиновая крошка",
        sportEq: "Турники, брусья",
        kidsEq: "Качели, горка, песочница",
        ageRange: "3-12 лет",
        coords: [64.5616, 39.8201],
        condition: "Отличное",
        lastInspection: "2024-01-10",
        boundary: [
          [64.5614, 39.8198],
          [64.5618, 39.8198],
          [64.5618, 39.8204],
          [64.5614, 39.8204]
        ]
      },
      {
        type: "ev_charger",
        title: "Зарядка для ЭМ",
        coords: [64.5624, 39.8199],
        power: "22 кВт",
        type: "Type 2",
        status: "free",
        price: "15 ₽/кВт"
      }
    ]
  },
  {
    id: "h2",
    address: "ул. Ленина, д. 3",
    coords: [64.564, 39.822],
    floors: 9,
    year: 2020,
    photo: "/house2.jpg",
    developer: "ЗАО «Новострой»",
    series: "Серия 121",
    material: "Панель",
    area: 7200,
    apartments: 108,
    elevator: true,
    rating: 4.9,
    energyClass: "A",
    lastRepair: "2024-01",
    nextRepair: "2026-01",
    manager: "Петрова А.М.",
    phone: "+7 (8182) 00-00-02",
    boundary: [
      [64.5635, 39.8215],
      [64.5645, 39.8215],
      [64.5645, 39.8225],
      [64.5635, 39.8225]
    ],
    utilities: {
      electricity: 18900,
      water: 5100,
      heating: 12400,
      gas: 0
    },
    infra: [
      {
        type: "trash_bin",
        title: "Бак №3",
        coords: [64.5638, 39.8218],
        load: 10,
        volume: "1.1 м³",
        material: "Сталь",
        lastEmpty: "2024-01-16",
        photo: "/trash3.jpg",
        status: "active"
      },
      {
        type: "parking",
        title: "Парковка №2",
        totalSpots: 60,
        busySpots: 45,
        coords: [64.5642, 39.8217],
        pricePerHour: 50,
        hasEVCharger: false,
        barrier: true,
        camera: true,
        boundary: [
          [64.5639, 39.8213],
          [64.5645, 39.8213],
          [64.5645, 39.8221],
          [64.5639, 39.8221]
        ]
      },
      {
        type: "gym",
        title: "Уличный тренажёрный зал",
        coords: [64.5641, 39.8219],
        equipment: "10 тренажёров",
        condition: "Хорошее",
        lighting: true,
        boundary: [
          [64.5639, 39.8217],
          [64.5643, 39.8217],
          [64.5643, 39.8221],
          [64.5639, 39.8221]
        ]
      }
    ]
  },
  {
    id: "h3",
    address: "ул. Мира, д. 5",
    coords: [64.560, 39.818],
    floors: 12,
    year: 2021,
    photo: "/house3.jpg",
    developer: "ГК «Север»",
    series: "Монолит",
    material: "Монолит",
    area: 9800,
    apartments: 156,
    elevator: true,
    rating: 4.8,
    energyClass: "A+",
    lastRepair: "2024-06",
    nextRepair: "2027-06",
    manager: "Сидоров В.К.",
    phone: "+7 (8182) 00-00-03",
    boundary: [
      [64.5595, 39.8175],
      [64.5605, 39.8175],
      [64.5605, 39.8185],
      [64.5595, 39.8185]
    ],
    utilities: {
      electricity: 24500,
      water: 7800,
      heating: 16200,
      gas: 0
    },
    infra: [
      {
        type: "trash_bin",
        title: "Бак №4",
        coords: [64.5598, 39.8178],
        load: 45,
        volume: "1.1 м³",
        material: "Пластик",
        lastEmpty: "2024-01-15",
        photo: "/trash4.jpg",
        status: "active"
      },
      {
        type: "parking",
        title: "Подземный паркинг",
        totalSpots: 120,
        busySpots: 89,
        coords: [64.5602, 39.8179],
        pricePerHour: 100,
        hasEVCharger: true,
        barrier: true,
        camera: true,
        levels: 2,
        boundary: [
          [64.5598, 39.8175],
          [64.5606, 39.8175],
          [64.5606, 39.8183],
          [64.5598, 39.8183]
        ]
      }
    ]
  },
  {
    id: "truck_route",
    type: "truck_route",
    name: "Маршрут мусоровоза",
    vehicleId: "АМ 001 29",
    driver: "Козлов Н.П.",
    status: "in_progress",
    path: [
      [64.5615, 39.8190],
      [64.5620, 39.8200],
      [64.5630, 39.8210],
      [64.5640, 39.8220],
      [64.5650, 39.8230],
      [64.5645, 39.8240],
      [64.5635, 39.8235],
      [64.5625, 39.8225],
      [64.5615, 39.8215],
      [64.5605, 39.8205]
    ]
  }
];

// Заявки жителей
const complaints = [
  { id: "Ж-1234", houseId: "h1", text: "Не работает освещение в подъезде", status: "completed", date: "2024-01-10", resolved: "2024-01-12" },
  { id: "Ж-1235", houseId: "h1", text: "Протекает крыша", status: "in_progress", date: "2024-01-14", resolved: null },
  { id: "Ж-1236", houseId: "h2", text: "Сломана дверь в подвал", status: "pending", date: "2024-01-16", resolved: null },
  { id: "Ж-1237", houseId: "h3", text: "Грязь в подъезде", status: "completed", date: "2024-01-15", resolved: "2024-01-15" }
];

// События
const events = [
  { id: 1, title: "Общее собрание жильцов", date: "2024-02-01", time: "18:00", location: "ул. Ленина, д. 1, холл", type: "meeting" },
  { id: 2, title: "День двора", date: "2024-02-15", time: "12:00", location: "Детская площадка", type: "event" },
  { id: 3, title: "Проверка пожарных систем", date: "2024-02-20", time: "10:00", location: "Все дома", type: "inspection" }
];

// Голосования
const votes = [
  {
    id: 1,
    title: "Установка шлагбаума",
    description: "Предлагаем установить автоматический шлагбаум на въезде во двор",
    endDate: "2024-02-28",
    options: [
      { text: "За", votes: 145 },
      { text: "Против", votes: 23 },
      { text: "Воздержался", votes: 12 }
    ]
  },
  {
    id: 2,
    title: "Озеленение двора",
    description: "Высадка деревьев и кустарников во дворе",
    endDate: "2024-03-15",
    options: [
      { text: "За", votes: 89 },
      { text: "Против", votes: 8 },
      { text: "Воздержался", votes: 5 }
    ]
  }
];

// Статистика
const stats = {
  totalHouses: 3,
  totalApartments: 336,
  totalResidents: 890,
  activeComplaints: 2,
  completedComplaints: 2,
  avgRating: 4.8,
  totalParkingSpots: 225,
  busyParkingSpots: 166,
  energyToday: 55850,
  waterToday: 16100,
  trashCollected: 12.5
};

// Погода (mock)
const weather = {
  temp: -12,
  feelsLike: -18,
  condition: "Снег",
  humidity: 78,
  wind: 5.2,
  pressure: 752
};

// API endpoints
app.get('/api/objects', (req, res) => {
  res.json({ data: objects });
});

app.get('/api/complaints', (req, res) => {
  res.json({ data: complaints });
});

app.get('/api/events', (req, res) => {
  res.json({ data: events });
});

app.get('/api/votes', (req, res) => {
  res.json({ data: votes });
});

app.get('/api/stats', (req, res) => {
  res.json({ data: stats });
});

app.get('/api/weather', (req, res) => {
  res.json({ data: weather });
});

app.post('/api/complaints', (req, res) => {
  const { houseId, text } = req.body;
  const newComplaint = {
    id: "Ж-" + String(Math.floor(1000 + Math.random() * 9000)),
    houseId,
    text,
    status: "pending",
    date: new Date().toISOString().split('T')[0],
    resolved: null
  };
  complaints.push(newComplaint);
  res.json({ success: true, complaint: newComplaint });
});

app.post('/api/votes/:voteId', (req, res) => {
  const { voteId } = req.params;
  const { optionIndex } = req.body;
  const vote = votes.find(v => v.id === parseInt(voteId));
  if (vote && vote.options[optionIndex]) {
    vote.options[optionIndex].votes++;
    res.json({ success: true, votes: vote.options });
  } else {
    res.status(400).json({ error: "Invalid vote" });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
  console.log(`📊 Доступные API:`);
  console.log(`   GET  /api/objects`);
  console.log(`   GET  /api/complaints`);
  console.log(`   GET  /api/events`);
  console.log(`   GET  /api/votes`);
  console.log(`   GET  /api/stats`);
  console.log(`   GET  /api/weather`);
  console.log(`   POST /api/complaints`);
  console.log(`   POST /api/votes/:voteId`);
});
