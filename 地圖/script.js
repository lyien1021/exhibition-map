const map = L.map('map').setView([25.0708, 121.5216], 16);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors',
}).addTo(map);

const marker = L.marker([25.0708, 121.5216], {
  icon: L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    shadowSize: [41, 41],
    className: 'custom-marker' // 加上自訂的 className
  })
}).addTo(map)
  .bindPopup('臺北市立美術館', { closeButton: false });

marker.on('mouseover', function () {
  this.openPopup();
});

marker.on('mouseout', function () {
  this.closePopup();
});

marker.on('click', () => {
  const list = document.getElementById('exhibition-list');
  list.innerHTML = '<li>載入中...</li>';

  fetch('https://data.taipei/api/v1/dataset/1700a7e6-3d27-47f9-89d9-1811c9f7489c?scope=resourceAquire')
    .then(res => res.json())
    .then(data => {
      const records = data.result.results;
      list.innerHTML = '';

      if (!records || records.length === 0) {
        list.innerHTML = '<li>目前沒有展覽資料。</li>';
        return;
      }

      records.forEach(item => {
        const li = document.createElement('li');
        const title = item.title || '未命名展覽';
        const start = item.start_date || '未知';
        const end = item.end_date || '未知';
        const link = item.link;

        li.innerHTML = `
          <strong>${title}</strong><br>
          展覽時間：${start} - ${end}<br>
          ${link ? `<a href="${link}" target="_blank">查看展覽詳情</a>` : ''}
        `;
        list.appendChild(li);
      });
    })
    .catch(err => {
      console.error('取得資料失敗：', err);
      list.innerHTML = '<li>載入失敗，請稍後再試。</li>';
    });
});
