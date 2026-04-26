const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3947;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(cors());
app.use(express.json({ limit: '2mb' }));

// Serve frontend from same origin — this is what makes it work on any device
app.use(express.static(__dirname));

// ── Data helpers ──────────────────────────────────────────────────────────────
function loadData() {
  if (!fs.existsSync(DATA_FILE)) {
    const defaults = {
      pantry: [
        "Rice","Wheat flour","Moong dal","Toor dal","Chana dal",
        "Onion","Tomato","Garlic","Ginger","Green chilli",
        "Turmeric","Cumin seeds","Mustard seeds","Coriander powder",
        "Garam masala","Ghee","Oil","Salt","Milk","Eggs",
        "Potatoes","Spinach","Lemon juice","Coriander leaves","Curry leaves"
      ],
      customDishes: [],
      updatedAt: new Date().toISOString()
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(defaults, null, 2));
    return defaults;
  }
  const raw = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  if (!raw.customDishes) raw.customDishes = [];
  return raw;
}

function saveData(data) {
  data.updatedAt = new Date().toISOString();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

function uid() {
  return 'dish_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
}

// ── PANTRY routes ─────────────────────────────────────────────────────────────
app.get('/api/pantry', (req, res) => {
  const d = loadData();
  res.json({ success: true, pantry: d.pantry.sort(), updatedAt: d.updatedAt });
});

app.post('/api/pantry', (req, res) => {
  const { item, items } = req.body;
  const d = loadData();
  const toAdd = items || (item ? [item] : []);
  if (!toAdd.length) return res.status(400).json({ success: false, error: 'No item provided' });
  toAdd.forEach(i => {
    const t = i.trim();
    if (t && !d.pantry.map(p => p.toLowerCase()).includes(t.toLowerCase())) d.pantry.push(t);
  });
  saveData(d);
  res.json({ success: true, pantry: d.pantry.sort(), added: toAdd });
});

app.delete('/api/pantry', (req, res) => {
  const { item } = req.body;
  if (!item) return res.status(400).json({ success: false, error: 'No item provided' });
  const d = loadData();
  d.pantry = d.pantry.filter(p => p.toLowerCase() !== item.toLowerCase());
  saveData(d);
  res.json({ success: true, pantry: d.pantry.sort(), removed: item });
});

app.put('/api/pantry', (req, res) => {
  const { pantry } = req.body;
  if (!Array.isArray(pantry)) return res.status(400).json({ success: false, error: 'pantry must be array' });
  const d = loadData();
  d.pantry = [...new Set(pantry.map(p => p.trim()).filter(Boolean))];
  saveData(d);
  res.json({ success: true, pantry: d.pantry.sort() });
});

// ── CUSTOM DISHES routes ──────────────────────────────────────────────────────
app.get('/api/dishes', (req, res) => {
  const d = loadData();
  res.json({ success: true, dishes: d.customDishes });
});

app.post('/api/dishes', (req, res) => {
  const { name, emoji, origin, category, type, time, easy, description, ingredients, recipe, tips } = req.body;
  if (!name || !category || !description)
    return res.status(400).json({ success: false, error: 'name, category, description are required' });
  const d = loadData();
  const dish = {
    id: uid(), name: name.trim(), emoji: emoji || '🍽️',
    origin: (origin || 'My Kitchen').trim(), category,
    type: type || 'veg', time: parseInt(time) || 30, easy: Boolean(easy),
    description: description.trim(),
    ingredients: Array.isArray(ingredients) ? ingredients : [],
    recipe: (recipe || '').trim(), tips: (tips || '').trim(),
    custom: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  };
  d.customDishes.push(dish);
  saveData(d);
  res.json({ success: true, dish, dishes: d.customDishes });
});

app.put('/api/dishes/:id', (req, res) => {
  const { id } = req.params;
  const d = loadData();
  const idx = d.customDishes.findIndex(x => x.id === id);
  if (idx === -1) return res.status(404).json({ success: false, error: 'Dish not found' });
  d.customDishes[idx] = { ...d.customDishes[idx], ...req.body, id, custom: true, updatedAt: new Date().toISOString() };
  saveData(d);
  res.json({ success: true, dish: d.customDishes[idx], dishes: d.customDishes });
});

app.delete('/api/dishes/:id', (req, res) => {
  const { id } = req.params;
  const d = loadData();
  const before = d.customDishes.length;
  d.customDishes = d.customDishes.filter(x => x.id !== id);
  if (d.customDishes.length === before)
    return res.status(404).json({ success: false, error: 'Dish not found' });
  saveData(d);
  res.json({ success: true, deleted: id, dishes: d.customDishes });
});

app.get('/api/export', (req, res) => {
  const d = loadData();
  res.setHeader('Content-Disposition', 'attachment; filename="rozka-data.json"');
  res.json(d);
});

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', port: PORT, time: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`✅  Roz Ka Khana → http://localhost:${PORT}`);
  console.log(`    Frontend + API served from same origin`);
  console.log(`    Data stored in: ${DATA_FILE}`);
  loadData();
});
