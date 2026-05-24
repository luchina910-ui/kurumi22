const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Статика
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname));

// Данные объектов
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
    boundary: [
      [64.5615, 39.8195],
      [64.5625, 39.8195],
      [64.5625, 39.8205],
      [64.5615, 39.8205]
    ],
    infra: [
      {
        type: "trash_bin",
        title: "Бак №1",
        coords: [64.5618, 39.8198],
        load: 25,
        volume: "1.1 м³",
        material: "Сталь",
        lastEmpty: "2024-01-15",
        photo: "/trash1.jpg"
      },
      {
        type: "trash_bin",
        title: "Бак №2",
        coords: [64.5622, 39.8202],
        load: 55,
        volume: "1.1 м³",
        material: "Пластик",
        lastEmpty: "2024-01-14",
        photo: "/trash2.jpg"
      },
      {
        type: "tko_bin",
        title: "ТКО Бак",
        coords: [64.5617, 39.8203],
        load: 80,
        volume: "0.8 м³",
        material: "Металл",
        lastEmpty: "2024-01-13",
        photo: "/tko1.jpg"
      },
      {
        type: "parking",
        title: "Парковка №1",
        totalSpots: 45,
        busySpots: 32,
        coords: [64.5623, 39.8197],
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
        boundary: [
          [64.5614, 39.8198],
          [64.5618, 39.8198],
          [64.5618, 39.8204],
          [64.5614, 39.8204]
        ]
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
    boundary: [
      [64.5635, 39.8215],
      [64.5645, 39.8215],
      [64.5645, 39.8225],
      [64.5635, 39.8225]
    ],
    infra: [
      {
        type: "trash_bin",
        title: "Бак №3",
        coords: [64.5638, 39.8218],
        load: 10,
        volume: "1.1 м³",
        material: "Сталь",
        lastEmpty: "2024-01-16",
        photo: "/trash3.jpg"
      },
      {
        type: "parking",
        title: "Парковка №2",
        totalSpots: 60,
        busySpots: 45,
        coords: [64.5642, 39.8217],
        boundary: [
          [64.5639, 39.8213],
          [64.5645, 39.8213],
          [64.5645, 39.8221],
          [64.5639, 39.8221]
        ]
      }
    ]
  },
  {
    id: "truck_route",
    type: "truck_route",
    path: [
      [64.5615, 39.8190],
      [64.5620, 39.8200],
      [64.5630, 39.8210],
      [64.5640, 39.8220],
      [64.5650, 39.8230],
      [64.5645, 39.8240],
      [64.5635, 39.8235],
      [64.5625, 39.8225]
    ]
  }
];

// API endpoint
app.get('/api/objects', (req, res) => {
  res.json({ data: objects });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
});
