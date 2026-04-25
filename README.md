# 🍛 Roz Ka Khana — Smart Meal Planner with Custom Recipes

## Quick Start
```bash
npm install
node server.js
# Open http://localhost:3947
```

## What's New — Custom Recipe System
- **✨ My Recipes tab** — add unlimited custom dishes with full details
- Custom dishes appear alongside built-in dishes in breakfast/lunch/dinner suggestions
- Pantry matching works for custom dishes too (ingredient dots, "Can Make" filter)
- Edit or delete any custom recipe anytime

## Custom Recipe Form includes:
- Emoji picker + custom emoji support
- Meal type (Breakfast / Lunch / Dinner)
- Diet type (Veg / Non-Veg / Vegan)
- Cook time & difficulty
- Ingredient builder with autocomplete (300+ ingredients) + Required/Optional tagging
- Full recipe / cooking instructions field
- Personal notes & tips field

## All Features
| Feature | Details |
|---|---|
| Built-in dishes | 130+ Indian & world dishes |
| Custom dishes | Unlimited, persisted in data.json |
| Pantry management | 300+ ingredients, sidebar + full page |
| Smart ranking | Dishes sorted by pantry match % |
| Filters | All / Veg / Non-Veg / Easy / Can Make / My Recipes |
| Ingredient dots | Green=have, Red=missing, Faded=optional |
| Add Missing button | One click adds all missing required ingredients |
| AI Tips | Claude gives cooking tips for every dish |
| YouTube + Google | Search links in every dish modal |

## API Endpoints
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/pantry` | Get pantry items |
| POST | `/api/pantry` | Add item(s) |
| DELETE | `/api/pantry` | Remove item |
| PUT | `/api/pantry` | Replace pantry |
| GET | `/api/dishes` | Get custom dishes |
| POST | `/api/dishes` | Create custom dish |
| PUT | `/api/dishes/:id` | Update custom dish |
| DELETE | `/api/dishes/:id` | Delete custom dish |
| GET | `/api/export` | Download all data as JSON |

## Data Storage
All data saved in `data.json`:
```json
{
  "pantry": ["Onion", "Tomato", ...],
  "customDishes": [{ "id": "...", "name": "...", ... }]
}
```
