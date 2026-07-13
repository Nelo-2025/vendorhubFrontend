
const API_BASE = 'api'; // adjust to your PHP api folder path

async function fetchJSON(url){
  try{
    const res = await fetch(url);
    if(!res.ok) throw new Error('Request failed: ' + res.status);
    return await res.json();
  }catch(err){
    console.error(err);
    return null;
  }
}

function formatDateBadge(dateStr){
  const d = new Date(dateStr);
  if(isNaN(d)) return { day:'--', month:'---' };
  const day = d.getDate();
  const month = d.toLocaleString('en-GB', { month:'short' }).toUpperCase();
  return { day, month };
}

function eventCard(ev){
  const badge = formatDateBadge(ev.start_datetime);
  const price = (ev.min_price === 0 || ev.min_price === null)
    ? '<span class="amount free">Free</span>'
    : `<span class="amount">£${Number(ev.min_price).toFixed(2)}</span>`;

  return `
    <a class="event-card" href="event.html?id=${ev.id}">
      <div class="thumb">
        <span class="category-tag">${ev.category_name || 'General'}</span>
        <div class="date-badge"><strong>${badge.day}</strong>${badge.month}</div>
      </div>
      <div class="body">
        <h3>${ev.title}</h3>
        <div class="loc">📍 ${ev.venue || 'Location TBC'}</div>
        <div class="foot">
          <span class="from">from</span>
          ${price}
        </div>
      </div>
    </a>`;
}

function renderSkeletons(container, count){
  container.innerHTML = Array.from({length: count}).map(() => `
    <div class="event-card">
      <div class="thumb skeleton" style="background:none;"></div>
      <div class="body">
        <div class="skeleton" style="height:18px; width:80%; border-radius:6px;"></div>
        <div class="skeleton" style="height:14px; width:50%; border-radius:6px; margin-top:8px;"></div>
      </div>
    </div>`).join('');
}

async function loadCategories(){
  const data = await fetchJSON(`${API_BASE}/categories.php`);
  const select = document.getElementById('category-select');
  const chipRow = document.getElementById('category-chips');
  if(!data || !data.length) return;

  data.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat.id;
    opt.textContent = cat.name;
    select.appendChild(opt);

    const chip = document.createElement('button');
    chip.className = 'chip';
    chip.dataset.category = cat.id;
    chip.textContent = cat.name;
    chip.addEventListener('click', () => {
      document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      loadEvents({ category: cat.id });
    });
    chipRow.appendChild(chip);
  });

  document.querySelector('.chip[data-category=""]').addEventListener('click', (e) => {
    document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    e.target.classList.add('active');
    loadEvents({});
  });
}

async function loadEvents(params = {}){
  const grid = document.getElementById('event-grid');
  renderSkeletons(grid, 6);

  const query = new URLSearchParams(params).toString();
  const data = await fetchJSON(`${API_BASE}/events.php${query ? '?' + query : ''}`);

  if(!data || !data.events || data.events.length === 0){
    grid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1;">
        <h3>No events found</h3>
        <p>Try a different search, or check back soon.</p>
      </div>`;
    document.getElementById('stat-events').textContent = '0';
    return;
  }

  grid.innerHTML = data.events.map(eventCard).join('');
  document.getElementById('stat-events').textContent = data.events.length;
  const cities = new Set(data.events.map(e => e.venue));
  document.getElementById('stat-cities').textContent = cities.size;
}

document.getElementById('search-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const q = document.getElementById('search-input').value.trim();
  const category = document.getElementById('category-select').value;
  loadEvents({ q, category });
});

loadCategories();
loadEvents();
