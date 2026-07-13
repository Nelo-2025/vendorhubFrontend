
const API_BASE = 'api'; // adjust to your PHP api folder path
const params = new URLSearchParams(window.location.search);
const eventId = params.get('id');

let ticketState = {}; // { ticket_type_id: quantity }

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

function formatDate(dateStr){
  const d = new Date(dateStr);
  if(isNaN(d)) return { day:'Date TBC', time:'' };
  const day = d.toLocaleDateString('en-GB', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
  const time = d.toLocaleTimeString('en-GB', { hour:'2-digit', minute:'2-digit' });
  return { day, time };
}

function initials(name){
  return (name || 'O').split(' ').map(w => w[0]).slice(0,2).join('').toUpperCase();
}

function renderError(message){
  document.getElementById('page-content').innerHTML = `
    <div class="error-block">
      <h2>Event not found</h2>
      <p>${message || "This event may have been removed or the link is incorrect."}</p>
      <a href="index.html" class="btn btn-primary" style="margin-top:18px; display:inline-flex;">Back to events</a>
    </div>`;
}

function renderEvent(ev){
  document.title = `${ev.title} — Nearby`;
  document.getElementById('breadcrumb-title').textContent = ev.title;

  const start = formatDate(ev.start_datetime);
  const end = ev.end_datetime ? formatDate(ev.end_datetime) : null;

  const ticketRows = (ev.ticket_types || []).map(t => {
    const remaining = t.quantity_available - t.quantity_sold;
    const soldOut = remaining <= 0;
    const priceLabel = Number(t.price) === 0
      ? '<div class="price free">Free</div>'
      : `<div class="price">£${Number(t.price).toFixed(2)}</div>`;

    return `
      <div class="ticket-row" data-ticket-id="${t.id}" data-price="${t.price}" data-max="${remaining}">
        <div class="info">
          <div class="name">${t.name}</div>
          ${priceLabel}
          <div class="stock">${soldOut ? 'Sold out' : remaining <= 10 ? `Only ${remaining} left` : 'Available'}</div>
        </div>
        <div class="qty-control">
          <button class="qty-btn minus" ${soldOut ? 'disabled' : ''} aria-label="Decrease quantity">−</button>
          <span class="qty-value">0</span>
          <button class="qty-btn plus" ${soldOut ? 'disabled' : ''} aria-label="Increase quantity">+</button>
        </div>
      </div>`;
  }).join('') || `<p style="color:var(--muted); font-size:0.9rem;">Tickets aren't on sale yet.</p>`;

  document.getElementById('page-content').innerHTML = `
    <div class="event-layout">
      <div>
        <div class="banner">
          <span class="category-tag">${ev.category_name || 'General'}</span>
          <button class="save-btn" aria-label="Save event">♡</button>
        </div>

        <div class="title-block">
          <h1>${ev.title}</h1>

          <div class="meta-row">
            <div class="meta-item">
              <div class="meta-icon">📅</div>
              <div>
                <div class="label">Date</div>
                <div class="value">${start.day}</div>
              </div>
            </div>
            <div class="meta-item">
              <div class="meta-icon">🕒</div>
              <div>
                <div class="label">Time</div>
                <div class="value">${start.time}${end ? ' – ' + end.time : ''}</div>
              </div>
            </div>
            <div class="meta-item">
              <div class="meta-icon">📍</div>
              <div>
                <div class="label">Venue</div>
                <div class="value">${ev.venue || 'TBC'}</div>
              </div>
            </div>
          </div>

          <div class="organiser-card">
            <div class="organiser-avatar">${initials(ev.organiser_name)}</div>
            <div>
              <div class="name">${ev.organiser_name || 'Event organiser'}</div>
              <div class="role">Organiser</div>
            </div>
            <button class="btn btn-ghost">Follow</button>
          </div>

          <div class="section-title">About this event</div>
          <div class="description">${(ev.description || 'No description provided yet.').split('\n').map(p => `<p>${p}</p>`).join('')}</div>

          <div class="section-title">Location</div>
          <div class="venue-box">
            <div class="venue-map">Map preview</div>
            <div class="venue-info">
              <div class="name">${ev.venue || 'Location TBC'}</div>
              <div class="address">${ev.address || 'Full address shown after booking'}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="ticket-panel">
        <h2>Tickets</h2>
        <div id="ticket-rows">${ticketRows}</div>

        <div class="perforation"></div>

        <div class="summary-row">
          <span>Tickets</span>
          <span id="summary-count">0</span>
        </div>
        <div class="summary-row total">
          <span>Total</span>
          <span id="summary-total">£0.00</span>
        </div>

        <button class="checkout-btn" id="checkout-btn" disabled>Select tickets to continue</button>
        <div class="low-stock-note" id="low-stock-note" style="display:none;">Almost sold out — grab yours before they're gone.</div>
      </div>
    </div>
  `;

  attachTicketHandlers(ev.id);
}

function attachTicketHandlers(eventId){
  const rows = document.querySelectorAll('.ticket-row');
  rows.forEach(row => {
    const ticketId = row.dataset.ticketId;
    const price = parseFloat(row.dataset.price);
    const max = parseInt(row.dataset.max, 10);
    const qtyEl = row.querySelector('.qty-value');
    const minusBtn = row.querySelector('.minus');
    const plusBtn = row.querySelector('.plus');

    ticketState[ticketId] = { qty:0, price, max };

    minusBtn.addEventListener('click', () => {
      const state = ticketState[ticketId];
      if(state.qty > 0) state.qty--;
      qtyEl.textContent = state.qty;
      updateSummary();
    });

    plusBtn.addEventListener('click', () => {
      const state = ticketState[ticketId];
      if(state.qty < state.max) state.qty++;
      qtyEl.textContent = state.qty;
      updateSummary();
    });
  });

  document.getElementById('checkout-btn').addEventListener('click', () => {
    const items = Object.entries(ticketState)
      .filter(([, s]) => s.qty > 0)
      .map(([ticketTypeId, s]) => ({ ticket_type_id: ticketTypeId, quantity: s.qty }));

    if(items.length === 0) return;

    sessionStorage.setItem('checkout_event_id', eventId);
    sessionStorage.setItem('checkout_items', JSON.stringify(items));
    window.location.href = 'checkout.html';
  });
}

function updateSummary(){
  let count = 0;
  let total = 0;
  Object.values(ticketState).forEach(s => {
    count += s.qty;
    total += s.qty * s.price;
  });

  document.getElementById('summary-count').textContent = count;
  document.getElementById('summary-total').textContent = `£${total.toFixed(2)}`;

  const btn = document.getElementById('checkout-btn');
  btn.disabled = count === 0;
  btn.textContent = count === 0 ? 'Select tickets to continue' : `Continue — ${count} ticket${count > 1 ? 's' : ''}`;
}

async function init(){
  if(!eventId){
    renderError('No event was specified.');
    return;
  }

  const data = await fetchJSON(`${API_BASE}/events.php?id=${encodeURIComponent(eventId)}`);
  if(!data || !data.event){
    renderError();
    return;
  }

  renderEvent(data.event);
}

init();