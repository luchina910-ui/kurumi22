// Глобальные переменные
let map;
let objectsData = [];
let layers = {};
let truckMarker;
let truckAnimationInterval;

// Инициализация карты
ymaps.ready(init);

function init() {
  map = new ymaps.Map('map', {
    center: [64.562, 39.82],
    zoom: 14,
    controls: ['zoomControl']
  });

  loadData();
}

// Загрузка данных
async function loadData() {
  try {
    const response = await fetch('/api/objects');
    const result = await response.json();
    objectsData = result.data;
    renderObjects();
  } catch (error) {
    console.error('Ошибка загрузки данных:', error);
  }
}

// Рендер объектов
function renderObjects() {
  objectsData.forEach(obj => {
    if (obj.type === 'truck_route') {
      renderTruckRoute(obj);
    } else {
      renderHouse(obj);
    }
  });
}

// Рендер дома
function renderHouse(house) {
  // Границы дома
  const boundary = new ymaps.Polygon([house.boundary], {
    hintContent: house.address
  }, {
    fillColor: 'rgba(0, 128, 0, 0.2)',
    strokeColor: '#008000',
    strokeWidth: 2
  });

  layers.houses = layers.houses || [];
  layers.houses.push(boundary);
  map.geoObjects.add(boundary);

  // Метка дома
  const housePlacemark = new ymaps.Placemark(house.coords, {
    balloonContentHeader: house.address,
    balloonContentBody: getHouseBalloonContent(house)
  }, {
    preset: 'islands#greenDotIcon'
  });

  housePlacemark.events.add('click', () => {
    openHouseModal(house);
  });

  layers.houses.push(housePlacemark);
  map.geoObjects.add(housePlacemark);

  // Инфраструктура
  if (house.infra) {
    house.infra.forEach(infra => {
      renderInfrastructure(infra, house.id);
    });
  }
}

// Рендер инфраструктуры
function renderInfrastructure(infra, houseId) {
  let placemark;

  if (infra.type === 'trash_bin' || infra.type === 'tko_bin') {
    const color = getTrashColor(infra.load);
    placemark = new ymaps.Placemark(infra.coords, {
      balloonContentHeader: infra.title,
      balloonContentBody: getTrashBalloonContent(infra)
    }, {
      preset: `islands#${color}DotIcon`
    });

    const layerKey = infra.type === 'tko_bin' ? 'tko' : 'trash';
    layers[layerKey] = layers[layerKey] || [];
    layers[layerKey].push(placemark);
    map.geoObjects.add(placemark);
  }

  if (infra.type === 'parking') {
    // Границы парковки
    if (infra.boundary) {
      const parkingBoundary = new ymaps.Polygon([infra.boundary], {
        hintContent: infra.title
      }, {
        fillColor: 'rgba(0, 0, 255, 0.1)',
        strokeColor: '#0000FF',
        strokeWidth: 1
      });

      layers.parking = layers.parking || [];
      layers.parking.push(parkingBoundary);
      map.geoObjects.add(parkingBoundary);
    }

    placemark = new ymaps.Placemark(infra.coords, {
      balloonContentHeader: infra.title,
      balloonContentBody: getParkingBalloonContent(infra)
    }, {
      preset: 'islands#blueDotIcon'
    });

    layers.parking = layers.parking || [];
    layers.parking.push(placemark);
    map.geoObjects.add(placemark);
  }

  if (infra.type === 'playground') {
    // Границы площадки
    if (infra.boundary) {
      const playgroundBoundary = new ymaps.Polygon([infra.boundary], {
        hintContent: infra.title
      }, {
        fillColor: 'rgba(255, 165, 0, 0.1)',
        strokeColor: '#FFA500',
        strokeWidth: 1
      });

      layers.playground = layers.playground || [];
      layers.playground.push(playgroundBoundary);
      map.geoObjects.add(playgroundBoundary);
    }

    placemark = new ymaps.Placemark(infra.coords, {
      balloonContentHeader: infra.title,
      balloonContentBody: getPlaygroundBalloonContent(infra)
    }, {
      preset: 'islands#orangeDotIcon'
    });

    layers.playground = layers.playground || [];
    layers.playground.push(placemark);
    map.geoObjects.add(placemark);
  }
}

// Рендер маршрута техники
function renderTruckRoute(route) {
  // Линия маршрута
  const polyline = new ymaps.Polyline(route.path, {}, {
    strokeColor: '#FF6600',
    strokeWidth: 4,
    strokeOpacity: 0.8
  });

  layers.truck = layers.truck || [];
  layers.truck.push(polyline);
  map.geoObjects.add(polyline);

  // Анимированный маркер
  truckMarker = new ymaps.Placemark(route.path[0], {
    iconContent: '🚛'
  }, {
    preset: 'islands#autoIcon'
  });

  layers.truck.push(truckMarker);
  map.geoObjects.add(truckMarker);

  // Запуск анимации
  animateTruck(route.path);
}

// Анимация техники
function animateTruck(path) {
  let currentIndex = 0;
  let progress = 0;
  const speed = 0.02;

  truckAnimationInterval = setInterval(() => {
    progress += speed;

    if (progress >= 1) {
      progress = 0;
      currentIndex++;
      if (currentIndex >= path.length - 1) {
        currentIndex = 0;
      }
    }

    const from = path[currentIndex];
    const to = path[currentIndex + 1] || path[0];

    const lat = from[0] + (to[0] - from[0]) * progress;
    const lon = from[1] + (to[1] - from[1]) * progress;

    truckMarker.geometry.setCoordinates([lat, lon]);
  }, 50);
}

// Цвет бака в зависимости от заполненности
function getTrashColor(load) {
  if (load < 33) return 'green';
  if (load < 66) return 'orange';
  return 'red';
}

// Контент балуна дома
function getHouseBalloonContent(house) {
  return `
    <div style="padding: 10px;">
      <strong>${house.address}</strong><br>
      Этажей: ${house.floors}<br>
      Год: ${house.year}<br>
      <button onclick="openHouseModalById('${house.id}')" style="margin-top: 10px;">Подробнее</button>
    </div>
  `;
}

// Контент балуна мусорного бака
function getTrashBalloonContent(infra) {
  const color = getTrashColor(infra.load);
  const colorName = color === 'green' ? 'Зелёный' : color === 'orange' ? 'Оранжевый' : 'Красный';
  return `
    <div style="padding: 10px;">
      <strong>${infra.title}</strong><br>
      Заполненность: ${infra.load}%<br>
      Статус: ${colorName}<br>
      Объём: ${infra.volume}<br>
      Материал: ${infra.material}<br>
      Последнее опорожнение: ${infra.lastEmpty}
    </div>
  `;
}

// Контент балуна парковки
function getParkingBalloonContent(infra) {
  const freeSpots = infra.totalSpots - infra.busySpots;
  return `
    <div style="padding: 10px;">
      <strong>${infra.title}</strong><br>
      Всего мест: ${infra.totalSpots}<br>
      Занято: ${infra.busySpots}<br>
      Свободно: ${freeSpots}<br>
      <button onclick="openCameraModal()" style="margin-top: 10px;">Смотреть камеру</button>
    </div>
  `;
}

// Контент балуна детской площадки
function getPlaygroundBalloonContent(infra) {
  return `
    <div style="padding: 10px;">
      <strong>${infra.title}</strong><br>
      Покрытие: ${infra.surface}<br>
      Возраст: ${infra.ageRange}<br>
      Спорт: ${infra.sportEq}<br>
      Детское: ${infra.kidsEq}
    </div>
  `;
}

// Переключение слоёв
window.toggleLayer = function(layerName, enabled) {
  if (layers[layerName]) {
    layers[layerName].forEach(obj => {
      if (enabled) {
        map.geoObjects.add(obj);
      } else {
        map.geoObjects.remove(obj);
      }
    });
  }
};

// Эко-панель
window.toggleEcoPanel = function() {
  const content = document.getElementById('ecoContent');
  const arrow = document.getElementById('ecoArrow');
  
  if (window.innerWidth <= 768) {
    content.classList.toggle('open');
    arrow.style.transform = content.classList.contains('open') ? 'rotate(180deg)' : 'rotate(0deg)';
  }
};

// Закрытие панели при клике вне
document.addEventListener('click', (e) => {
  if (window.innerWidth <= 768) {
    const ecoPanel = document.getElementById('ecoPanel');
    if (!ecoPanel.contains(e.target)) {
      document.getElementById('ecoContent').classList.remove('open');
      document.getElementById('ecoArrow').style.transform = 'rotate(0deg)';
    }
  }
});

// Настройки
window.toggleSettings = function() {
  const btn = document.querySelector('.settings-btn');
  btn.classList.add('rotating');
  setTimeout(() => btn.classList.remove('rotating'), 600);
  openModal('settingsModal');
};

// Модалки
window.openModal = function(modalId) {
  document.getElementById(modalId).classList.add('active');
};

window.closeModal = function(modalId) {
  document.getElementById(modalId).classList.remove('active');
};

// Тёмная тема
window.toggleDarkTheme = function() {
  document.body.classList.toggle('interface-dark');
};

// Доп. настройки
window.toggleExtraSettings = function() {
  const extra = document.getElementById('extraSettings');
  extra.classList.toggle('visible');
};

// QR модалка
window.openQRModal = function() {
  openModal('qrModal');
};

// Увеличение QR
window.zoomQR = function(img) {
  img.classList.toggle('zoomed');
};

// Камера
window.openCameraModal = function() {
  openModal('cameraModal');
  const loader = document.getElementById('cameraLoader');
  const placeholder = document.getElementById('cameraPlaceholder');
  
  loader.style.display = 'block';
  placeholder.style.display = 'none';
  
  setTimeout(() => {
    loader.style.display = 'none';
    placeholder.style.display = 'block';
  }, 2000);
};

// Открытие модалки дома
window.openHouseModalById = function(houseId) {
  closeModal('mainModal');
  const house = objectsData.find(o => o.id === houseId);
  if (house) {
    openHouseModal(house);
  }
};

function openHouseModal(house) {
  document.getElementById('modalTitle').textContent = house.address;
  
  const freeSpotsTotal = house.infra
    .filter(i => i.type === 'parking')
    .reduce((sum, p) => sum + (p.totalSpots - p.busySpots), 0);
  
  document.getElementById('modalBody').innerHTML = `
    <img src="${house.photo}" alt="${house.address}" class="house-photo" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22200%22><rect fill=%22%23ddd%22 width=%22400%22 height=%22200%22/><text fill=%22%23666%22 x=%2250%%22 y=%2250%%22 text-anchor=%22middle%22>Фото дома</text></svg>'">
    
    <div class="house-info">
      <div class="house-info-item">
        <div class="house-info-label">Этажей</div>
        <div class="house-info-value">${house.floors}</div>
      </div>
      <div class="house-info-item">
        <div class="house-info-label">Год постройки</div>
        <div class="house-info-value">${house.year}</div>
      </div>
      <div class="house-info-item">
        <div class="house-info-label">Застройщик</div>
        <div class="house-info-value">${house.developer}</div>
      </div>
      <div class="house-info-item">
        <div class="house-info-label">Серия</div>
        <div class="house-info-value">${house.series}</div>
      </div>
      <div class="house-info-item">
        <div class="house-info-label">Материал</div>
        <div class="house-info-value">${house.material}</div>
      </div>
      <div class="house-info-item">
        <div class="house-info-label">Площадь</div>
        <div class="house-info-value">${house.area} м²</div>
      </div>
      <div class="house-info-item">
        <div class="house-info-label">Квартир</div>
        <div class="house-info-value">${house.apartments}</div>
      </div>
      <div class="house-info-item">
        <div class="house-info-label">Лифт</div>
        <div class="house-info-value">${house.elevator ? 'Есть' : 'Нет'}</div>
      </div>
    </div>
    
    <h3 style="margin: 20px 0 12px;">Инфраструктура</h3>
    <div class="infra-list">
      ${house.infra.map(infra => getInfraItemHTML(infra)).join('')}
    </div>
    
    <button class="btn-primary" style="width: 100%; margin-top: 20px;" onclick="openComplaintForm('${house.id}')">Подать жалобу</button>
    <button class="btn-primary" style="width: 100%; margin-top: 10px; background: #2196F3;" onclick="openModal('ecoGuideModal')">Эко-гид</button>
  `;
  
  openModal('mainModal');
}

function getInfraItemHTML(infra) {
  let icon, status;
  
  if (infra.type === 'trash_bin' || infra.type === 'tko_bin') {
    const color = getTrashColor(infra.load);
    icon = '🗑️';
    status = `<span class="infra-status">Заполненность: ${infra.load}% (${color === 'green' ? 'Низкая' : color === 'orange' ? 'Средняя' : 'Высокая'})</span>`;
  } else if (infra.type === 'parking') {
    icon = '🅿️';
    const free = infra.totalSpots - infra.busySpots;
    status = `<span class="infra-status">Свободно: ${free} из ${infra.totalSpots}</span>`;
  } else if (infra.type === 'playground') {
    icon = '🎠';
    status = `<span class="infra-status">${infra.ageRange}</span>`;
  }
  
  const clickHandler = infra.type === 'parking' ? `onclick="openCameraModal()"` : '';
  
  return `
    <div class="infra-item" ${clickHandler}>
      <div class="infra-icon">${icon}</div>
      <div class="infra-details">
        <div class="infra-title">${infra.title}</div>
        ${status}
      </div>
    </div>
  `;
}

// Форма жалобы
window.openComplaintForm = function(houseId) {
  document.getElementById('modalBody').innerHTML = `
    <h3 style="margin-bottom: 16px;">Новая жалоба</h3>
    <form class="complaint-form" onsubmit="submitComplaint(event, '${houseId}')">
      <textarea placeholder="Опишите проблему..." required></textarea>
      <button type="submit" class="btn-primary">Отправить</button>
      <button type="button" onclick="closeModal('mainModal')">Отмена</button>
    </form>
  `;
};

window.submitComplaint = function(event, houseId) {
  event.preventDefault();
  closeModal('mainModal');
  
  const ticketNumber = 'Ж-' + String(Math.floor(1000 + Math.random() * 9000));
  document.getElementById('ticketNumber').textContent = 'Тикет: ' + ticketNumber;
  openModal('successModal');
};
