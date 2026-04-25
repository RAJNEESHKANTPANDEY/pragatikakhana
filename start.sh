#!/bin/bash
echo "🍛  Roz Ka Khana — Smart Meal Planner"
echo "────────────────────────────────────────"
if ! command -v node &>/dev/null; then echo "Node.js not found. Install from https://nodejs.org"; exit 1; fi
[ ! -d "node_modules" ] && npm install
lsof -ti:3947 | xargs kill -9 2>/dev/null; sleep 0.5
node server.js &
sleep 1
if command -v open &>/dev/null; then open http://localhost:3947
elif command -v xdg-open &>/dev/null; then xdg-open http://localhost:3947
else echo "Open http://localhost:3947 in your browser"; fi
echo "Server running at http://localhost:3947  |  Ctrl+C to stop"
wait
