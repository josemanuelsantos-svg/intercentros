import React, { useState, useMemo, useEffect, useRef } from 'react';

// === INYECTOR DE TAILWIND CSS PARA ENTORNOS VITE ===
if (typeof document !== 'undefined' && !document.getElementById('tailwind-cdn')) {
  const script = document.createElement('script');
  script.id = 'tailwind-cdn';
  script.src = 'https://cdn.tailwindcss.com';
  document.head.appendChild(script);
}

// --- ICONOS INTEGRADOS (Cero Dependencias) ---
const Icons = {
  MapPin: <g><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></g>,
  Calendar: <g><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></g>,
  Clock: <g><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></g>,
  Trophy: <g><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></g>,
  Filter: <g><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></g>,
  Users: <g><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></g>,
  Activity: <g><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></g>,
  Medal: <g><path d="M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15"/><path d="M11 12 5.12 2.2"/><path d="M13 12l5.88-9.8"/><path d="M8 7h8"/><circle cx="12" cy="17" r="5"/><polyline points="12 18 12 15.5 11 16"/></g>,
  ExternalLink: <g><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></g>,
  MapIcon: <g><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21 3 6"/><line x1="9" x2="9" y1="3" y2="18"/><line x1="15" x2="15" y1="6" y2="21"/></g>,
  ClipboardList: <g><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></g>,
  Search: <g><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></g>,
  ChevronRight: <g><path d="m9 18 6-6-6-6"/></g>,
  X: <g><path d="M18 6 6 18"/><path d="m6 6 12 12"/></g>,
  FileText: <g><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></g>,
  Star: <g><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></g>,
  Info: <g><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></g>,
  Sparkles: <g><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/></g>,
  Timer: <g><line x1="10" x2="14" y1="2" y2="2"/><line x1="12" x2="15" y1="14" y2="11"/><circle cx="12" cy="14" r="8"/></g>,
  Navigation: <g><polygon points="3 11 22 2 13 21 11 13 3 11"/></g>,
  PlayCircle: <g><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></g>,
  Lock: <g><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></g>,
  Unlock: <g><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></g>,
  Edit3: <g><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></g>,
  Save: <g><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></g>,
  Send: <g><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></g>,
  Database: <g><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/></g>,
  RefreshCw: <g><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></g>
};

const Icon = ({ name, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {Icons[name]}
  </svg>
);

const MapPin = (p) => <Icon name="MapPin" {...p} />;
const Calendar = (p) => <Icon name="Calendar" {...p} />;
const Clock = (p) => <Icon name="Clock" {...p} />;
const Trophy = (p) => <Icon name="Trophy" {...p} />;
const Filter = (p) => <Icon name="Filter" {...p} />;
const Users = (p) => <Icon name="Users" {...p} />;
const Activity = (p) => <Icon name="Activity" {...p} />;
const Medal = (p) => <Icon name="Medal" {...p} />;
const ExternalLink = (p) => <Icon name="ExternalLink" {...p} />;
const MapIcon = (p) => <Icon name="MapIcon" {...p} />;
const ClipboardList = (p) => <Icon name="ClipboardList" {...p} />;
const Search = (p) => <Icon name="Search" {...p} />;
const ChevronRight = (p) => <Icon name="ChevronRight" {...p} />;
const X = (p) => <Icon name="X" {...p} />;
const FileText = (p) => <Icon name="FileText" {...p} />;
const Star = (p) => <Icon name="Star" {...p} />;
const Info = (p) => <Icon name="Info" {...p} />;
const Sparkles = (p) => <Icon name="Sparkles" {...p} />;
const Timer = (p) => <Icon name="Timer" {...p} />;
const Navigation = (p) => <Icon name="Navigation" {...p} />;
const PlayCircle = (p) => <Icon name="PlayCircle" {...p} />;
const Lock = (p) => <Icon name="Lock" {...p} />;
const Unlock = (p) => <Icon name="Unlock" {...p} />;
const Edit3 = (p) => <Icon name="Edit3" {...p} />;
const Save = (p) => <Icon name="Save" {...p} />;
const Send = (p) => <Icon name="Send" {...p} />;
const Database = (p) => <Icon name="Database" {...p} />;
const RefreshCw = (p) => <Icon name="RefreshCw" {...p} />;

// --- ESTRUCTURAS DE DATOS ---
const FACILITIES = {
  "Campo Grande": { color: "bg-green-100 text-green-800 border-green-200", badge: "bg-green-500", icon: "⚽" },
  "Campo Pequeño": { color: "bg-emerald-100 text-emerald-800 border-emerald-200", badge: "bg-emerald-500", icon: "⚽" },
  "Gimnasio": { color: "bg-orange-100 text-orange-800 border-orange-200", badge: "bg-orange-500", icon: "🏀" },
  "Piscina": { color: "bg-cyan-100 text-cyan-800 border-cyan-200", badge: "bg-cyan-500", icon: "🏊" },
  "Pádel": { color: "bg-lime-100 text-lime-800 border-lime-200", badge: "bg-lime-500", icon: "🎾" },
  "Arena Ajedrez": { color: "bg-purple-100 text-purple-800 border-purple-200", badge: "bg-purple-500", icon: "♟️" },
  "Arena Petanca": { color: "bg-slate-100 text-slate-800 border-slate-200", badge: "bg-slate-500", icon: "🎱" },
  "Cross": { color: "bg-red-100 text-red-800 border-red-200", badge: "bg-red-500", icon: "🏃" }
};

const SCHOOLS = {
  "SB": { name: "San Buenaventura", color: "bg-blue-100 text-blue-800 border-blue-300", badge: "bg-blue-600", short: "SB" },
  "SF": { name: "San Francisco", color: "bg-orange-100 text-orange-800 border-orange-300", badge: "bg-orange-500", short: "SF" },
  "MC": { name: "Melchor Cano", color: "bg-purple-100 text-purple-800 border-purple-300", badge: "bg-purple-600", short: "MC" }
};

const SPORT_TO_FACILITY = {
  'Fútbol': ['Campo Grande', 'Campo Pequeño'],
  'Baloncesto': ['Gimnasio'],
  'Voleibol': ['Gimnasio'],
  'Natación': ['Piscina'],
  'Pádel': ['Pádel'],
  'Ajedrez': ['Arena Ajedrez'],
  'Petanca': ['Arena Petanca'],
  'Cross': ['Cross']
};

const INITIAL_SCHEDULE = [
  { time: "10:20 - 10:30", events: [
      { facility: "Campo Grande", title: "SB - SF", category: "INF MAS", referee: "Marcos Serrano" },
      { facility: "Campo Pequeño", title: "SB - MC", category: "INF MAS", referee: "Bruno" },
      { facility: "Piscina", title: "50m (series)", category: "INF MAS", referee: "Hugo Naranjo / Yago / Daniela" },
      { facility: "Pádel", title: "MC - SF", category: "INF MAS", referee: "Gonzalo / Edu" },
      { facility: "Cross", title: "Carrera", category: "INF MAS", referee: "Lavinia" }
    ]
  },
  { time: "10:30 - 10:40", events: [
      { facility: "Arena Ajedrez", title: "Libre para recreos", category: "INF FEM" }
    ]
  },
  { time: "10:45 - 10:50", events: [
      { facility: "Campo Grande", title: "MC - SF", category: "ALEV MAS", referee: "Reppeto" },
      { facility: "Campo Pequeño", title: "SF - SB", category: "ALEV MAS", referee: "Luis" },
      { facility: "Piscina", title: "50m (series)", category: "ALEV MAS", referee: "Hugo Naranjo / Yago / Daniela" },
      { facility: "Pádel", title: "SF - SB", category: "ALEV MAS", referee: "Gonzalo / Edu" },
      { facility: "Arena Ajedrez", title: "Libre para recreos", category: "ALEV MAS" }
    ]
  },
  { time: "10:50 - 11:05", events: [
      { facility: "Arena Ajedrez", title: "Libre para recreos", category: "ALEV FEM" },
      { facility: "Arena Petanca", title: "Juego", category: "INF FEM" },
      { facility: "Cross", title: "Carrera", category: "ALEV FEM" }
    ]
  },
  { time: "11:05 - 11:10", events: [
      { facility: "Piscina", title: "50m", category: "BENJ MAS" },
      { facility: "Pádel", title: "SB - MC", category: "BENJ MAS" },
      { facility: "Arena Ajedrez", title: "Libre para recreos", category: "BENJ MAS" },
      { facility: "Cross", title: "Carrera", category: "BENJ MAS", referee: "Irene Perez" }
    ]
  },
  { time: "11:10 - 11:20", events: [
      { facility: "Campo Grande", title: "SB - MC", category: "BENJ FEM", referee: "Aaron" },
      { facility: "Campo Pequeño", title: "MC - SF", category: "BENJ FEM", referee: "Sebastián" },
      { facility: "Arena Ajedrez", title: "Libre para recreos", category: "BENJ FEM" },
      { facility: "Cross", title: "Carrera", category: "BENJ FEM", referee: "Del Cerro" }
    ]
  },
  { time: "11:20 - 11:30", events: [
      { facility: "Gimnasio", title: "MC - SF", category: "ALEV MAS" },
      { facility: "Arena Ajedrez", title: "Libre para recreos", category: "ALEV MAS" },
      { facility: "Arena Petanca", title: "Juego", category: "ALEV MAS" }
    ]
  },
  { time: "11:30 - 11:40", events: [
      { facility: "Piscina", title: "Relevos", category: "ALEVIN" },
      { facility: "Pádel", title: "SF - SB", category: "ALEVIN", referee: "Gonzalo / Edu" }
    ]
  },
  { time: "11:40 - 11:50", events: [
      { facility: "Campo Grande", title: "SB - MC", category: "CAD MAS", referee: "Marcos" },
      { facility: "Campo Pequeño", title: "SB - MC", category: "CAD MAS", referee: "Bruno" },
      { facility: "Gimnasio", title: "SF - SB", category: "CAD MAS", referee: "Lucia / Monica / Elsa" },
      { facility: "Piscina", title: "200m (hasta :55)", category: "CAD MAS", referee: "Hugo Naranjo / Yago / Daniela" },
      { facility: "Arena Ajedrez", title: "Juego", category: "CAD MAS", referee: "Briongos" },
      { facility: "Arena Petanca", title: "Juego", category: "CAD MAS", referee: "Samuel Diaz" }
    ]
  },
  { time: "11:50 - 12:00", events: [
      { facility: "Cross", title: "Carrera", category: "ALEV FEM" }
    ]
  },
  { time: "12:00 - 12:10", events: [
      { facility: "Gimnasio", title: "MC - SB", category: "PARTIDO", referee: "Lucia / Monica / Elsa" },
      { facility: "Pádel", title: "SF - SB", category: "PARTIDO", referee: "Adrian / Daniel" },
      { facility: "Arena Ajedrez", title: "Juego", category: "GENERAL", referee: "Miguel" },
      { facility: "Arena Petanca", title: "Juego", category: "GENERAL", referee: "Hugo Camino" },
      { facility: "Cross", title: "Carrera", category: "GENERAL", referee: "Nicolas Gomez" }
    ]
  },
  { time: "12:10 - 12:20", events: [
      { facility: "Piscina", title: "200 M (hasta :25)", category: "COMPETICIÓN", referee: "Sara Pellicer / Kevin / Angel Marmol" },
      { facility: "Cross", title: "Carrera", category: "GENERAL", referee: "Yang" }
    ]
  },
  { time: "12:20 - 12:30", events: [
      { facility: "Campo Grande", title: "MC - SF", category: "CAD MAS", referee: "Ruben Sanz" }
    ]
  },
  { time: "12:30 - 12:35", events: [
      { facility: "Campo Pequeño", title: "SB - MC", category: "PARTIDO", referee: "Mónica / Candela / Marina" },
      { facility: "Piscina", title: "200 M (hasta :40)", category: "COMPETICIÓN", referee: "Adrian / Daniel" },
      { facility: "Pádel", title: "SF - SB", category: "PARTIDO", referee: "Adrian / Daniel" },
      { facility: "Arena Ajedrez", title: "Juego", category: "GENERAL", referee: "Marcos Incze" },
      { facility: "Arena Petanca", title: "Juego", category: "GENERAL", referee: "reppeto" },
      { facility: "Cross", title: "Carrera", category: "GENERAL", referee: "Sergio Ortez" }
    ]
  },
  { time: "12:40 - 12:50", events: [
      { facility: "Campo Grande", title: "SF - SB", category: "PARTIDO", referee: "Santiago Gascon" },
      { facility: "Piscina", title: "200 M", category: "COMPETICIÓN", referee: "Sara Pellicer / Kevin / Angel Marmol" },
      { facility: "Arena Ajedrez", title: "Juego", category: "GENERAL", referee: "Carla Emily" },
      { facility: "Arena Petanca", title: "Juego", category: "GENERAL", referee: "Marcos" },
      { facility: "Cross", title: "Carrera", category: "GENERAL", referee: "Iker quesada" }
    ]
  },
  { time: "12:50 - 12:55", events: [
      { facility: "Arena Ajedrez", title: "Juego", category: "CAD FEM", referee: "Mendieta" },
      { facility: "Arena Petanca", title: "Juego", category: "CAD FEM", referee: "Bruno" },
      { facility: "Cross", title: "Carrera", category: "CAD FEM" }
    ]
  },
  { time: "13:00 - 13:10", events: [
      { facility: "Campo Grande", title: "SB - MC", category: "PARTIDO", referee: "Gael Gutierrez" },
      { facility: "Cross", title: "Carrera", category: "GENERAL", referee: "Samuel Gutierrez" }
    ]
  },
  { time: "13:10 - 13:15", events: [
      { facility: "Campo Grande", title: "MC - SF", category: "PARTIDO" },
      { facility: "Pádel", title: "MC - SF", category: "PARTIDO" },
      { facility: "Cross", title: "Carrera", category: "GENERAL", referee: "Triana" }
    ]
  },
  { time: "13:20 - 13:30", events: [
      { facility: "Campo Grande", title: "SF - SB", category: "PARTIDO", referee: "Mendieta" },
      { facility: "Campo Pequeño", title: "SB - MC", category: "PARTIDO", referee: "Adrian" },
      { facility: "Gimnasio", title: "MC - SF", category: "PARTIDO" }
    ]
  },
  { time: "13:30 - 13:35", events: [
      { facility: "Piscina", title: "Relevos", category: "INFANTIL", referee: "Lucia Fernandez / Melania / Clara" },
      { facility: "Pádel", title: "SF - SB", category: "PARTIDO", referee: "Ruben Sanz" }
    ]
  },
  { time: "13:40 - 13:50", events: [
      { facility: "Campo Grande", title: "MC - SF", category: "PARTIDO", referee: "Santiago gascon" },
      { facility: "Campo Pequeño", title: "SF - SB", category: "PARTIDO", referee: "Iker quesada" },
      { facility: "Gimnasio", title: "SF - SB", category: "PARTIDO", referee: "Miguel y Gael" },
      { facility: "Piscina", title: "Relevos", category: "CADETE", referee: "Aaron" }
    ]
  },
  { time: "13:50 - 13:55", events: [
      { facility: "Pádel", title: "SB - MC", category: "PARTIDO", referee: "Adrian / Daniel" }
    ]
  },
  { time: "14:00 - 14:10", events: [
      { facility: "Campo Grande", title: "SB - MC", category: "PARTIDO", referee: "Marcos Serrano" },
      { facility: "Campo Pequeño", title: "MC - SF", category: "PARTIDO", referee: "Bruno" },
      { facility: "Gimnasio", title: "MC - SB", category: "PARTIDO", referee: "Lucia / Monica / Elsa" },
      { facility: "Piscina", title: "Libre", category: "GENERAL", referee: "Sara Pellicer" }
    ]
  },
  { time: "14:20 - 14:30", events: [
      { facility: "Campo Grande", title: "SB - MC", category: "PARTIDO", referee: "Santiago Gascon" },
      { facility: "Campo Pequeño", title: "SB - MC", category: "PARTIDO", referee: "Iker quesada" },
      { facility: "Gimnasio", title: "SB - MC", category: "PARTIDO", referee: "Miguel y Gael" },
      { facility: "Piscina", title: "SB - SF", category: "PARTIDO", referee: "Hugo Naranjo" },
      { facility: "Pádel", title: "SB - MC", category: "PARTIDO", referee: "Gonzalo / Edu" },
      { facility: "Arena Ajedrez", title: "SB - MC", category: "PARTIDO", referee: "Marcos Incze" }
    ]
  },
  { time: "14:30 - 14:40", events: [
      { facility: "Campo Grande", title: "SB - SF", category: "PARTIDO", referee: "Gael Gutierrez" },
      { facility: "Campo Pequeño", title: "SB - SF", category: "PARTIDO", referee: "Sebastián" },
      { facility: "Gimnasio", title: "SB - SF", category: "PARTIDO", referee: "Mónica / Candela" },
      { facility: "Piscina", title: "SB - SF", category: "PARTIDO", referee: "Aaron" }
    ]
  },
  { time: "14:40 - 14:50", events: [
      { facility: "Campo Grande", title: "SF - MC", category: "PARTIDO", referee: "Reppeto" },
      { facility: "Campo Pequeño", title: "SF - MC", category: "PARTIDO", referee: "Luis" },
      { facility: "Gimnasio", title: "SF - MC", category: "PARTIDO", referee: "Adrian" },
      { facility: "Piscina", title: "SF - MC", category: "PARTIDO", referee: "Kevin" }
    ]
  },
  { time: "14:50 - 15:00", events: [
      { facility: "Campo Grande", title: "Entrega de Trofeos y Clausura", category: "GENERAL", referee: "Organización" }
    ]
  }
];

// --- SISTEMA DE COMPRESIÓN DE DATOS PARA EVITAR LÍMITES DE MEMORIA ---
const expand = (sport, data) => {
  const res = [];
  for (const school in data) {
    for (const category in data[school]) {
      data[school][category].split(',').forEach(name => {
        if(name.trim()) res.push({ sport, school, category, name: name.trim(), id: `${sport}-${school}-${Math.random().toString(36).substr(2, 6)}` });
      });
    }
  }
  return res;
};

const INITIAL_PARTICIPANTS = [
  ...expand('Pádel', {
    SB: { 'ALE MASC': 'Juandi,Pablo Gallego', 'ALE FEM': 'Emma ó Sara,Nerea', 'INF MAS': 'Angel Muñoz 1c,Hector 2a', 'CAD MAS': 'camacho / adrian,Felix 3b / Pablo 3b', 'CAD FEM': 'marta / ainhoa,aitana / daniela,diego rueda / Adrian,Carla' },
    SF: { 'ALE MASC': 'Pablo,Sergio', 'ALE FEM': 'Valeria,Daniela', 'INF MAS': 'Mario,Ian', 'INF FEM': 'Raquel,Valentina', 'CAD MAS': 'Hugo,Iker', 'CAD FEM': 'Angela,Daniela' },
    MC: { 'ALE MASC': 'Edgar,Olmo', 'ALE FEM': 'Ainhoa,Erika', 'CAD MAS': 'Arturo,Ruben,Avacom', 'CAD FEM': 'Maria Elena,Andrea,Carmen' }
  }),
  ...expand('Voleibol', {
    SB: { 'INF': 'Paula Contera 1c,Irene Rivera 1c,Lucas Cabrera 1c,Ariadna Infantes 2a,Iwola 2a,Alvaro Ariza 2a,Ainhoa 1b,Martrin 2c', 'CAD': 'Roa 3d,Kevin,victoria 3c,Adrian,eva 3c,Nerea,Orlando 3b,Pablo 3b,Esther,Delfina,ainhara 3a,Elena Lahoz 3a,Sara del olmo 3a,Zaira,Lucia Lopez,Bea,Alba Lopez 4a,Andrea 4a,Irene Sobreviela 4a' },
    SF: { 'INF': 'Sofia,Alejandro,Rebeca,Isabela,Sara,Lucia,Olalla,Michael,Paula,Alya,Alba,Prisco,Manuel,Claudia,Izan', 'CAD': 'Izan,Kayque,Mayeline,Gabriela,Lucia,Jesus,Yamile,Jessica,Paula,Diego,Carla,Isabela,Lucia,Jorge,Dennis,Iker,Elys,Karam' },
    MC: { 'INF': 'Dani,Axcel,Janna,Jonal,Juan Pablo,Elvis,Daria,Violeta,Nuria,Claudia', 'CAD': 'Pilar,Andrei,Ines,Lucia,Valentina,Mostafa,Elena,Dina,Kenny,Juan Carlos,Yassir' }
  }),
  ...expand('Baloncesto', {
    SB: { 'ALE MASC': 'Daniel G,Quique,Luis,Moussa,Paulo,Anthony,Eliel,Gabriel', 'ALE FEM': 'Maira,Valentina,Carla O.,Ana C.,Julia R.,Carla S.,Susana,Samira', 'INF MAS': 'Sammy Andres 1c,Oliver 2B,Dilan Gael 1c,Amores 1c,Carlos Moises 1b,Daniel marius 2c', 'INF FEM': 'Estrella Muzo 1c,Elena Perez 2a,Almudena 2a,Nayara 2c', 'CAD MAS': 'Franly 3d,Sebas 3a,Culebras 3b,adrian 3a,Diego 3a', 'CAD FEM': 'Lucia Baeza 3c,Maria Baeza 3b,Carla 3a,Irene Sanjuan 3a,Bea 4a' },
    SF: { 'ALE MASC': 'Joseph,Zeus,Daniel,Luca,Aitor,Victor,Juan Felipe,Zakaria,Diego', 'ALE FEM': 'Nahiara,Inés,Lucía,Erika,Sara', 'INF MAS': 'Neizan,Carlos,Mario,Ali,Hector,Javier,Gonzalo,Alejandro,Jayden', 'CAD MAS': 'Diego,Elys,Izan,Lucas,Samuel', 'CAD FEM': 'Sofia,María,Daniela,Claudia' },
    MC: { 'INF MAS': 'David,Ruben,Luis Ángel,Pablo', 'ALE MASC': 'Jose Luis,Guillermo,Saber,Olmo', 'ALE FEM': 'Nilde,Natalia,Iratxe', 'CAD MAS': 'Omar,Arturo,Juan Carlos' }
  }),
  ...expand('Petanca', {
    SB: { 'ALE MASC': 'Daniela,Pablo,Elena,Yuxi,Quique,Lorenzo,Aldara,Cristina,Antonio,Emma,Uriel,Gabriel,Samara,Moreta,Sebas,Carmen,AITANA GUAMAN,YAIZA DE LA CAL,SARA JAREÑO,ARTURO ARRIBAS,PEDRO PRIOR,CARLOS CARBALLO,MANUELA ESTEBAN,EVA CAMACHO,MARÍA CUESTA', 'INF MAS': 'Noa 2b,Patricia 2b,Julia 1b,Fernanda 1b,Marcos Perez 1c,Lynet Terrero 1c,Dylan 2a,Elena Perez 2a,Cesar 2a,Almudena 2a,Stere 2a,Jorge 2c,Annabeth 2c,Sofía Spolosino 1a,Victoria Peruga 1a', 'CAD MAS': 'Preda 3c,Silvia Florentin 3c,Jose 3c,Lucia Conejo 3a,Lucia Martin 3a,Lucia Lopez 3a,Sara Garcia 3a,Maria Garcia 3a,Partricia Pintilie 3a,Olimpia 4a,Pilar 4a,Luna 4a,Azucena 4a,Gadea 4a,Sara 4a,Daniela q 4a,Carlota 4a,Marta 4a,Irene sobreviela' },
    SF: { 'ALE MASC': 'Nahiara,Raquel,Ismael,Alyss,Vicor,Celia,Olivia,Sergio,Claudia,Alisson,Cristofer,Diego,Juan,Manuela,Pablo,Valeria,Sara,Sheyla,Mariana,Ariadna,Oliver,Luca', 'INF MAS': 'Natalia,Sofia,Manuel,Alexia,Pablo', 'CAD MAS': 'Roberto,Isabela,Lucia,Maria,Daniela,Sofia,Ana,Yamile,Lucas,Jimena' }
  }),
  ...expand('Ajedrez', {
    SB: { 'ALE': 'MOUSSA MBENGUE,IAGO VILLEGAS,FABIO LOPEZ,SAMUEL DIAZ,LAURA GONZALES,MIRANDA RODRIGUEZ,ANAIS TURBATU,DRAKE MENDOZA,ZECHUAN,IÑAKI RUIZ,SHANTAL RODRIGUEZ,LUZ MARQUEZ,Lorenzo,Pablo,Quique,Facundo,Antonio,Santi,Miguel,Gabriel', 'INF': 'Arturo Dominguez 1c,Marcos Perez 1c,Claudia 1c,Dylan 2a,Celia Mendez 2a,Leo de las Heras,Leo Lahoz,Pedro Peruga,Morena,Rivera', 'CAD': 'Hanyu 3d,Felix Gonzalez 3b,Irene perez 4a,Maria Lara 4b,Alvaro Martin 4b,Sofia arenillas 4b,Natalia Gallego' },
    SF: { 'ALE': 'Roberto,Samuel,Javier,Zeus,Fayz,Marco,Nicolás,Juan,Marcelo,Aitor,Saúl,Diego,Dylan,Lucia', 'INF': 'Izan,Gabriel,Hugo,Alejandro,Valentina,Mario,Aleksander,Héctor,David', 'CAD': 'Marcos,Hugo,Miguel' }
  }),
  ...expand('Fútbol', {
    SB: { 'BENJ MASC': 'Mario,Juanse,Alex,Dani,Hugo,Marcos', 'BENJ FEM': 'Camila,Sara Bullido,Carmen,Alba,Jade,Vega', 'ALE MASC': 'Rodrigo,Javi,Iván,Félix,Derek,Pablo,Raúl,DANI,RUBÉN,SALVA,ALEX R,ALEJANDRO B.,ALEX L,SAMUEL', 'ALE FEM': 'Daniela,Nagore,Sara R,Sara C,Yma,Catalina,Fabi,Irina,Emma H.,Valle,MJose,Alma,Emma B.', 'INF MAS': 'Dani de Leon 1c,Adrian Ramos 1c,Nacho 2a,Iago 2a,Raul del Pino 1b,Carmelo 1b,Alonso 2c,Aday 2c,Raul Muñoz 1a,Adrián Maroto 1a', 'INF FEM': 'Yara Grados 1c,Lynet 1c,Adela 2a,Maria 2a,Candela 2c,Elena 2c,aitana 2b,amaya 2b', 'CAD MAS': 'Ruben Perez 3d,Castaño 3d,Kevin 3d,Potosi 3b,Culebras 3b,Nacho 3a,Ivan 3a,Alexis 3a,Izan 3a,sebastian 4a,cava 4b,gallego 4b,alecsis 4c,Gualan 4c,Navarro 4d', 'CAD FEM': 'Silvia Florentin 3c,Laura Moreno 3b,nerea Granados 3b,Irene San Juan 3a,Sofia,Carla 3a,Carlota Vazquez 4c,Ainhoa Sainz 4c' },
    SF: { 'ALE MASC': 'Mateo,Hamza,Hugo,Marco,Javier,Gabriel,Rubén,Iván,Alejandro,Leo,Oliver,Saúl', 'ALE FEM': 'Daniela,Eva,Carla,Carlota,Gabriela,Noelia,Mariana,Marwa', 'INF MAS': 'Fabián,Hector,Pablo,Ali,Mario,Raúl,Ian,Oliver,Gonzalo,Jayden', 'CAD MAS': 'Óliver,Álvaro,Matías,Alejandro,Jorge,Jose,Elys,Iker,Karam,Dennis,Lucas,Abel,Hugo,Mateo', 'CAD FEM': 'Daniela,Jessica,Angela,Inas,Yaiza' }
  }),
  ...expand('Natación', {
    SB: { 'ALE MASC': 'Ángel (e),Santi (equipo)', 'ALE FEM': 'ELSA GONZALEZ (e),EVA BAGIU,PAULA R.,ADRIANA C.,Aldara,Naza,Elena,Lía,Sofía (e),Bea', 'INF MAS': 'Gabriel Ogando 1b,Cristian Mamani 1b,Capello 2a,Ignacio Escobar 2a,Pelayo 2c,Pablo Granados 1b,Alvaro Gallego 2a,Michel 2c', 'INF FEM': 'Carla 1b,Alejandra Alonso 1a,Marian Estrada 1a,Martina 1a,Alba 2c,Amanda 1b,Irene Rubio 1b,Sara sanchez 1a,Villegas (2C)', 'CAD MAS': 'David 4a,hugo 4b,fran 4b,Jose 4c,camacho 3c,antonio 3a,dani 4b', 'CAD FEM': 'alba,miriam 3c,Laura Moreno 3b,maria 3a,Paula 4a,Sofía Rodriguez 4c,eva bursuc 3c,sara davi 3a,sara 3a,ruth 4a' },
    SF: { 'ALE MASC': 'Marco', 'ALE FEM': 'Sofía,Inés,Leire,Valeria,Manuela,Alyss,Adriana', 'INF MAS': 'Neizan,Ali,Michael,Carlos,Javier', 'INF FEM': 'Raquel,Sofia,Mª Milagros,Emma,Natalia,Alexia', 'CAD MAS': 'Adrián,Karam,Dennis', 'CAD FEM': 'Noemi,Gemma,Sofia,Maria,Ana,Gabriela,Lucia' }
  }),
  ...expand('Cross', {
    SB: { 'ALE MASC': 'Antonio,Raúl,Daniel Gª,Nico,Marcos,Gerson,Eric,Juandi,MOUSSA MBENGUE,ENRIQUE MUÑOZ,PABLO PEREZ,IAGO VILLEGAS,LEO MENDIETA,DANIEL MORENO,ALEJANDRO BRICEÑO,GONZALO ABAJO,SANTIAGO VIDAL,ALEJANDRO RODRIGUEZ,Martín', 'ALE FEM': 'NICOLE SOTO,TERESA VIDAL,Yuxi,Sara R.,Cristina,Daniela,Amaya,Valentina,Irina,Fabi,Sara C,MARTINA HERNANZ,EVA BAGIU,ALMA VILLA,SUSANA FERNANDEZ,Catalina', 'INF MAS': 'Lingres 1B,Lukas 1B,Dylan 1B,Victor Danca 1A,Angel Muñoz 1C,Abel Lopez 1A,Alvaro Gallego 2A,Carlos Mathias 2A,Iago 2A,Michel Cherkai 2C,Dario 2C,Jesus Asiel 2C,Diego Gonzalez', 'INF FEM': 'Gema 1B,Sofía 1B,Sara 2B,1a,Irene contreras 1C,Estefanía Vazquez 1C,Adela 2A,Celia 2A,Alicia 2C,Iria 2C', 'CAD MAS': 'Castaño 3D,Alexis 3A,Sebastian 4A,Cava 4B,Gualan 4C,Alecsis 4C', 'CAD FEM': 'Irene Zapete 3D,Laura Baeza,Irene Perez 4A,Elena Lahoz 3A,Aitana 4A,Marta 4,Luna 4A,Gadea 4A,Pilar 4A,Carlota Vazquez 4C' },
    SF: { 'ALE MASC': 'Leo,Ismael,Daniel,Mateo,Hamza,Hugo,Zakaria,Marco,Luca,Aitor,Saúl,Oliver', 'ALE FEM': 'Valeria,Daniela,Eva', 'INF MAS': 'Michael,Ali,Alejandro', 'INF FEM': 'Mª Milagros,Sofia,Valent', 'CAD MAS': 'Diego,Marcos', 'CAD FEM': 'Ashley,Inas' },
    MC: { 'ALE MASC': 'Jose Luis,Jaime,Brandon,Hugo,Ayman,Mario,Marcus' }
  })
];

const CORE_SPORTS = ['Pádel', 'Voleibol', 'Baloncesto', 'Petanca', 'Ajedrez', 'Fútbol', 'Natación', 'Cross'];

export default function App() {
  const [activeTab, setActiveTab] = useState('horario');
  
  const [schedule, setSchedule] = useState(() => {
    try {
      const saved = window.localStorage.getItem('intercentros_schedule_v13');
      return saved ? JSON.parse(saved) : INITIAL_SCHEDULE;
    } catch (e) { return INITIAL_SCHEDULE; }
  });

  const [participants, setParticipants] = useState(() => {
    try {
      const saved = window.localStorage.getItem('intercentros_participants_v13');
      return saved ? JSON.parse(saved) : INITIAL_PARTICIPANTS;
    } catch (e) { return INITIAL_PARTICIPANTS; }
  });

  const [isAdmin, setIsAdmin] = useState(false);
  const [editingItem, setEditingItem] = useState(null); 
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');
  
  const [sheetUrls, setSheetUrls] = useState(() => {
    try { 
      const saved = window.localStorage.getItem('intercentros_sheet_urls');
      return saved ? JSON.parse(saved) : { horario: '' }; 
    } catch(e){ return { horario: '' }; }
  });

  const [autoSync, setAutoSync] = useState(() => {
    try { return window.localStorage.getItem('intercentros_autosync') === 'true'; } catch(e){return false;}
  });
  const [syncStatus, setSyncStatus] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  const scheduleRef = useRef(schedule);
  const participantsRef = useRef(participants);

  useEffect(() => { scheduleRef.current = schedule; }, [schedule]);
  useEffect(() => { participantsRef.current = participants; }, [participants]);

  const [selectedFacility, setSelectedFacility] = useState('Todas');
  const [selectedSchoolFilter, setSelectedSchoolFilter] = useState('Todos');
  const [showMyRoute, setShowMyRoute] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSport, setSelectedSport] = useState(null);
  const [expandedAthlete, setExpandedAthlete] = useState(null);

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0 });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isSimulatingLive, setIsSimulatingLive] = useState(false);

  const sportsList = useMemo(() => [...new Set([...CORE_SPORTS, ...participants.map(p => p.sport)])].sort(), [participants]);

  const updateSheetUrl = (key, url) => {
    const newUrls = { ...sheetUrls, [key]: url };
    setSheetUrls(newUrls);
    window.localStorage.setItem('intercentros_sheet_urls', JSON.stringify(newUrls));
  };

  const parseCSVRow = (str) => {
    let result = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < str.length; i++) {
        if (str[i] === '"') inQuotes = !inQuotes;
        else if (str[i] === ',' && !inQuotes) {
            result.push(cur.replace(/^"|"$/g, '').trim());
            cur = '';
        } else {
            cur += str[i];
        }
    }
    result.push(cur.replace(/^"|"$/g, '').trim());
    return result;
  };

  const fetchAndParseCSV = async (url, silent = false) => {
    if (!url) return;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('CORS');
      const text = await res.text();
      
      const rows = text.split(/\r?\n/).map(parseCSVRow);
      if (rows.length < 2) return;
      
      const normalize = (str) => str?.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim() || "";
      const headers = rows[0].map(normalize);
      
      const facMap = {};
      Object.keys(FACILITIES).forEach(fac => {
         const normFac = normalize(fac);
         let idx = headers.findIndex(h => h === normFac || (normFac === 'CAMPO PEQUENO' && h.includes('PEQUENO')));
         if(idx !== -1) facMap[fac] = idx;
      });
      const legendIdx = headers.findIndex(h => h.includes('LEYENDA'));

      const newSchedule = [];
      for (let i = 1; i < rows.length; i++) {
         const row = rows[i];
         if (row.length < 2) continue;
         const time = row[0].trim();
         if (!time || !time.includes('-')) continue;

         const category = legendIdx !== -1 && row[legendIdx] ? row[legendIdx].trim() : "GENERAL";
         const events = [];

         Object.entries(facMap).forEach(([fac, idx]) => {
            const title = row[idx]?.trim();
            if (title && title !== '') {
               let existingScore = "";
               let existingReferee = "";
               
               if (i + 1 < rows.length) {
                   const nextRow = rows[i+1];
                   const nextTime = nextRow[0]?.trim();
                   if (!nextTime || !nextTime.includes('-')) {
                       const possibleReferee = nextRow[idx]?.trim();
                       if (possibleReferee && possibleReferee !== '') {
                           existingReferee = possibleReferee;
                       }
                   }
               }

               const existingSlot = scheduleRef.current.find(s => s.time === time);
               if (existingSlot) {
                  const existingEv = existingSlot.events.find(e => e.facility === fac);
                  if (existingEv) {
                     if (existingEv.score) existingScore = existingEv.score;
                     if (existingEv.referee && existingReferee === "") existingReferee = existingEv.referee;
                  }
               }
               events.push({ facility: fac, title, category, score: existingScore, referee: existingReferee });
            }
         });
         if (events.length > 0) newSchedule.push({ time, events });
      }

      if (newSchedule.length > 0) {
         setSchedule(newSchedule);
         window.localStorage.setItem('intercentros_schedule_v13', JSON.stringify(newSchedule));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAndParseAthletes = async (sport, url) => {
    if (!url) return [];
    try {
        const res = await fetch(url);
        if (!res.ok) return [];
        const text = await res.text();
        const rows = text.split(/\r?\n/).map(parseCSVRow);
        if (rows.length < 2) return [];

        let headers = rows[0];
        let startIndex = 1;
        
        if (rows[1] && rows[1].some(cell => cell.toUpperCase().includes('VELOCIDAD') || cell.toUpperCase().includes('RESISTENCIA'))) {
            startIndex = 2;
        } else if (!headers[2] && rows[1] && rows[1][2]) {
            headers = rows[1];
            startIndex = 2;
        }

        const fetched = [];
        let lastSchool = 'SB'; 

        for (let i = startIndex; i < rows.length; i++) {
            const row = rows[i];
            if (row.length < 2) continue;

            let schoolRaw = String(row[1] || "").toUpperCase().trim();
            let school = lastSchool;

            if (schoolRaw.includes('SB') || schoolRaw.includes('BUENAVENTURA')) school = 'SB';
            else if (schoolRaw.includes('SF') || schoolRaw.includes('FRANCISCO')) school = 'SF';
            else if (schoolRaw.includes('MC') || schoolRaw.includes('MELCHOR') || schoolRaw.includes('CANO')) school = 'MC';
            else if (schoolRaw === '') school = lastSchool;

            lastSchool = school;

            for (let c = 2; c < row.length; c++) {
                let name = row[c]?.trim();
                if (name && name !== '') {
                    name = name.replace(/[\"?]/g, '');

                    const upName = name.toUpperCase();
                    if (['VELOCIDAD', 'RESISTENCIA'].includes(upName)) continue;
                    if (upName.includes('MAS') || upName.includes('FEM') || upName.includes('ESO') || upName.includes('EP')) continue;

                    let cat = headers[c]?.trim() || "";
                    if (!cat) {
                        for(let k = c; k >= 2; k--) {
                           if(headers[k]?.trim()) { cat = headers[k]?.trim(); break; }
                        }
                    }
                    if (!cat) cat = "GENERAL";

                    fetched.push({
                        id: `${sport}-${school}-${c}-${i}-${Math.random().toString(36).substr(2, 5)}`,
                        sport,
                        school,
                        category: cat,
                        name
                    });
                }
            }
        }
        return fetched;
    } catch(e) {
        return [];
    }
  };

  const handleFullSync = async (silent = false) => {
    setIsSyncing(true);
    if (!silent) setSyncStatus('Sincronizando Horario...');
    
    if (sheetUrls.horario) await fetchAndParseCSV(sheetUrls.horario, silent);

    let newParticipants = [...participantsRef.current];
    for (const sport of CORE_SPORTS) {
        const url = sheetUrls[sport];
        if (url && url.trim() !== '') {
            if (!silent) setSyncStatus(`Descargando datos de ${sport}...`);
            const fetched = await fetchAndParseAthletes(sport, url);
            if (fetched.length > 0) {
                newParticipants = newParticipants.filter(p => p.sport !== sport);
                newParticipants = [...newParticipants, ...fetched];
            }
        }
    }
    
    setParticipants(newParticipants);
    window.localStorage.setItem('intercentros_participants_v13', JSON.stringify(newParticipants));
    if (!silent) setSyncStatus('✅ ¡Sincronización Completa con el Excel!');
    setIsSyncing(false);
  };

  useEffect(() => {
    if (!autoSync) return;
    const interval = setInterval(() => {
       handleFullSync(true);
    }, 60000); 
    return () => clearInterval(interval);
  }, [autoSync, sheetUrls]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isSimulatingLive) setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, [isSimulatingLive]);

  useEffect(() => {
    const targetDate = new Date('2026-04-17T10:00:00');
    const updateCountdown = () => {
      const now = new Date();
      const diff = targetDate - now;
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          mins: Math.floor((diff / 1000 / 60) % 60)
        });
      }
    };
    updateCountdown();
    const int = setInterval(updateCountdown, 60000);
    return () => clearInterval(int);
  }, []);

  const [favorites, setFavorites] = useState(() => {
    try {
      const item = window.localStorage.getItem('intercentros_favs');
      return item ? JSON.parse(item) : [];
    } catch (error) { return []; }
  });

  const toggleFavorite = (id, e) => {
    e.stopPropagation();
    setFavorites(prev => {
      const newFavs = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id];
      window.localStorage.setItem('intercentros_favs', JSON.stringify(newFavs));
      return newFavs;
    });
  };

  const favoriteAthletesFullData = useMemo(() => participants.filter(p => favorites.includes(p.id)), [favorites, participants]);

  const filteredSchedule = useMemo(() => {
    return schedule.map(slot => {
      const filteredEvents = slot.events.filter(event => {
        if (showMyRoute && favoriteAthletesFullData.length > 0) {
          const isGeneral = event.category === "GENERAL" || event.category === "COMPETICIÓN";
          if (isGeneral) return true;

          const matchesFav = favoriteAthletesFullData.some(fav => {
            const facsForFavSport = SPORT_TO_FACILITY[fav.sport] || [];
            const matchesFacility = facsForFavSport.includes(event.facility);
            const matchesSchool = event.title.includes(SCHOOLS[fav.school].short);
            return matchesFacility && matchesSchool;
          });
          if (!matchesFav) return false;
        }
        if (selectedFacility !== 'Todas' && event.facility !== selectedFacility) return false;
        if (selectedSchoolFilter !== 'Todos' && !showMyRoute) {
          const mentionsAnySchool = /(SB|SF|MC)/.test(event.title);
          if (mentionsAnySchool && !event.title.includes(selectedSchoolFilter)) return false;
        }
        return true;
      });
      return { ...slot, events: filteredEvents };
    }).filter(slot => slot.events.length > 0);
  }, [schedule, selectedFacility, selectedSchoolFilter, showMyRoute, favoriteAthletesFullData]);

  const isTimeSlotActive = (timeString) => {
    const timeToUse = isSimulatingLive ? new Date('2026-04-17T12:25:00') : currentTime; 
    if (!isSimulatingLive && (timeToUse.getFullYear() !== 2026 || timeToUse.getMonth() !== 3 || timeToUse.getDate() !== 17)) return false; 
    
    const [startStr, endStr] = timeString.split(' - ');
    if (!startStr || !endStr) return false;

    const [startH, startM] = startStr.split(':').map(Number);
    const [endH, endM] = endStr.split(':').map(Number);
    
    const start = new Date(timeToUse).setHours(startH, startM, 0);
    const end = new Date(timeToUse).setHours(endH, endM, 0);
    const now = timeToUse.getTime();

    return now >= start && now <= end;
  };

  const currentLiveSlot = useMemo(() => filteredSchedule.find(slot => isTimeSlotActive(slot.time)), [filteredSchedule, currentTime, isSimulatingLive]);
  const facilitiesList = ['Todas', ...Object.keys(FACILITIES)];

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase().trim();
    return participants.filter(p => p.name.toLowerCase().includes(query));
  }, [searchQuery, participants]);

  const sportParticipants = useMemo(() => {
    if (!selectedSport) return [];
    return participants.filter(p => p.sport === selectedSport);
  }, [selectedSport, participants]);

  const handleAdminLogin = () => {
    if (isAdmin) {
      setShowAdminPanel(true);
      return;
    }
    setShowAdminLogin(true);
  };

  const handlePasswordSubmit = () => {
    if (adminPassword === "admin2026") {
      setIsAdmin(true);
      setShowAdminLogin(false);
      setAdminPassword('');
      setAdminError('');
    } else {
      setAdminError("Contraseña incorrecta.");
    }
  };

  const handleSaveEdit = () => {
    if (editingItem.type === 'athlete') {
        const updated = participants.map(p => p.id === editingItem.data.id ? editingItem.data : p);
        setParticipants(updated);
        window.localStorage.setItem('intercentros_participants_v13', JSON.stringify(updated));
    } else if (editingItem.type === 'match') {
        const updatedSchedule = [...schedule];
        updatedSchedule[editingItem.slotIndex].events[editingItem.eventIndex] = editingItem.data;
        setSchedule(updatedSchedule);
        window.localStorage.setItem('intercentros_schedule_v13', JSON.stringify(updatedSchedule));
    }
    setEditingItem(null);
  };

  const shareWhatsApp = () => {
    let text = "🏆 *Mi Ruta VIP - Intercentros 2026* 🏆\n\n";
    filteredSchedule.forEach(slot => {
      text += `⏰ *${slot.time}*\n`;
      slot.events.forEach(ev => { text += `📍 ${ev.facility}: ${ev.title} _(${ev.category})_\n`; });
      text += `\n`;
    });
    text += "📲 _Sigue el torneo en directo desde la App!_";
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const AthleteCard = ({ p }) => {
    const isFav = favorites.includes(p.id);
    const isExpanded = expandedAthlete === p.id;
    const facilities = SPORT_TO_FACILITY[p.sport] || [];

    return (
      <div 
        className={`bg-white rounded-2xl sm:rounded-[20px] shadow-sm transition-all duration-300 cursor-pointer overflow-hidden ${isExpanded ? 'ring-2 ring-indigo-500 shadow-lg' : 'hover:shadow-md border border-slate-100 hover:border-indigo-200'} mb-3 relative`}
        onClick={() => setExpandedAthlete(isExpanded ? null : p.id)}
      >
        <div className="p-3.5 sm:p-5 flex items-center justify-between">
          <div className="flex-1 pr-2">
            <h4 className="font-extrabold text-slate-800 text-base sm:text-lg flex items-center tracking-tight">
              {p.name}
              {isFav && <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1.5 text-yellow-400 fill-yellow-400 drop-shadow-sm" />}
            </h4>
            <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
              <span className={`text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-md text-white shadow-sm ${SCHOOLS[p.school]?.badge || 'bg-gray-500'}`}>
                {SCHOOLS[p.school]?.name || p.school}
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500 uppercase tracking-wider">
                {p.category}
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 uppercase tracking-wider border border-indigo-100">
                {p.sport}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <button 
                onClick={(e) => { e.stopPropagation(); setEditingItem({ type: 'athlete', data: p }); }}
                className="p-2 sm:p-3 rounded-full transition-all duration-300 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 z-10"
              >
                <Edit3 className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            )}
            <button 
              onClick={(e) => toggleFavorite(p.id, e)}
              className={`p-2.5 sm:p-3.5 rounded-full transition-all duration-300 transform active:scale-90 z-10 ${isFav ? 'bg-yellow-100 text-yellow-500 shadow-inner' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
            >
              <Star className={`w-4 h-4 sm:w-5 sm:h-5 ${isFav ? 'fill-yellow-500 drop-shadow-sm' : ''}`} />
            </button>
          </div>
        </div>

        {isExpanded && (
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50/30 border-t border-indigo-100/50 p-4 sm:p-5">
             <h5 className="text-[10px] sm:text-xs font-black text-indigo-900 uppercase tracking-widest mb-3 sm:mb-4 flex items-center opacity-80">
               <MapPin className="w-3.5 h-3.5 mr-1.5" /> Zonas de Juego
             </h5>
             <div className="grid grid-cols-1 gap-2">
               {facilities.map(fac => (
                 <div key={fac} className="bg-white border border-indigo-100/60 rounded-xl sm:rounded-2xl p-3 sm:p-4 flex items-center shadow-sm hover:shadow-md transition-shadow">
                   <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-lg sm:text-xl mr-3 bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200/60`}>
                     {FACILITIES[fac]?.icon}
                   </div>
                   <div>
                     <p className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-widest">Instalación</p>
                     <p className="text-xs sm:text-sm font-black text-slate-700 leading-tight">{fac}</p>
                   </div>
                 </div>
               ))}
               {facilities.length === 0 && (
                 <p className="text-xs text-slate-500 italic">Asignación de zona pendiente.</p>
               )}
             </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans pb-20 sm:pb-24 selection:bg-indigo-200">
      
      {/* HEADER ULTRA PREMIUM CON COUNTDOWN */}
      <div className="relative bg-slate-950 pt-10 pb-20 sm:pb-28 px-4 rounded-b-[32px] sm:rounded-b-[60px] shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col items-center text-center">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff22_1px,transparent_1px)] [background-size:20px_20px] opacity-40"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-600/30 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-purple-500/20 rounded-full blur-[100px] pointer-events-none"></div>

        {timeLeft.days > 0 && (
          <div className="absolute top-2 right-2 sm:top-6 sm:right-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-[14px] sm:rounded-2xl px-3 py-1.5 sm:px-4 sm:py-2 flex items-center gap-2 sm:gap-3 text-white shadow-xl z-20">
             <Timer className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-300 animate-pulse" />
             <div className="flex gap-1.5 sm:gap-2 font-mono text-xs sm:text-sm font-bold">
               <div className="flex flex-col items-center"><span className="text-base sm:text-lg leading-none">{timeLeft.days}</span><span className="text-[7px] sm:text-[8px] uppercase tracking-wider text-indigo-200">Días</span></div>:
               <div className="flex flex-col items-center"><span className="text-base sm:text-lg leading-none">{timeLeft.hours}</span><span className="text-[7px] sm:text-[8px] uppercase tracking-wider text-indigo-200">Hrs</span></div>:
               <div className="flex flex-col items-center"><span className="text-base sm:text-lg leading-none">{timeLeft.mins}</span><span className="text-[7px] sm:text-[8px] uppercase tracking-wider text-indigo-200">Min</span></div>
             </div>
          </div>
        )}

        <div className="relative z-10 w-full max-w-4xl flex flex-col items-center mt-6 sm:mt-0">
          <div className="bg-white p-2.5 sm:p-3.5 rounded-[20px] sm:rounded-[28px] shadow-2xl mb-4 sm:mb-6 border-2 sm:border-4 border-white/10 transform hover:scale-105 transition-all duration-500 hover:rotate-2">
            <img src="https://i.ibb.co/zHNcDDxQ/Oracion-franciscana-y-post-instagram-franciscanos-conventuales.png" alt="Logo Intercentros" className="w-16 h-16 sm:w-24 sm:h-24 object-contain rounded-xl bg-white" />
          </div>

          <div className="inline-flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-1.5 rounded-full font-black uppercase tracking-widest text-[9px] sm:text-[11px] mb-3 sm:mb-5 shadow-lg">
            <Sparkles className="w-3.5 h-3.5 mr-1.5 text-yellow-400" /> Edición 2026
          </div>
          
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black mb-4 sm:mb-6 text-white tracking-tight leading-[1.1] drop-shadow-md">
            Encuentro <br className="sm:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-300">Intercentros</span>
          </h1>
          
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-6 sm:mb-8 max-w-sm sm:max-w-none mx-auto">
            <span className="flex items-center justify-center bg-blue-500/10 border border-blue-400/20 text-blue-100 px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-xl sm:rounded-2xl text-[10px] sm:text-sm font-bold backdrop-blur-sm">
              <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-blue-400 mr-2 shadow-[0_0_8px_rgba(96,165,250,0.8)]"></div> San Buenaventura
            </span>
            <span className="flex items-center justify-center bg-orange-500/10 border border-orange-400/20 text-orange-100 px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-xl sm:rounded-2xl text-[10px] sm:text-sm font-bold backdrop-blur-sm">
              <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-orange-400 mr-2 shadow-[0_0_8px_rgba(251,146,60,0.8)]"></div> San Francisco
            </span>
            <span className="flex items-center justify-center bg-purple-500/10 border border-purple-400/20 text-purple-100 px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-xl sm:rounded-2xl text-[10px] sm:text-sm font-bold backdrop-blur-sm">
              <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-purple-400 mr-2 shadow-[0_0_8px_rgba(192,132,252,0.8)]"></div> Melchor Cano
            </span>
          </div>

          <div className="inline-flex items-center justify-center text-indigo-100/80 font-semibold text-xs sm:text-base">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 opacity-80" /> Viernes 17 de Abril, Madrid
          </div>
        </div>
      </div>

      {/* TARJETAS DE ACCESO RÁPIDO */}
      <div className="relative z-20 max-w-4xl mx-auto px-4 -mt-12 sm:-mt-16">
        <div className="grid grid-cols-4 gap-2 sm:gap-5">
            <a href="https://www.google.com/maps/dir//Colegio+San+Buenaventura,+C.+de+El+Greco,+16,+Latina,+28011+Madrid/@40.3898368,-3.6503552,19191m/data=!3m1!1e3!4m8!4m7!1m0!1m5!1m1!1s0xd4188016d2f5f1f:0x5da776b8af34efdf!2m2!1d-3.7469336!2d40.4076194?entry=ttu&g_ep=EgoyMDI2MDQxMi4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noopener noreferrer" className="bg-white rounded-[16px] sm:rounded-[24px] p-2.5 sm:p-5 flex flex-col items-center justify-center shadow-[0_10px_40px_rgba(0,0,0,0.08)] hover:shadow-[0_15px_50px_rgba(99,102,241,0.15)] border border-slate-100/50 hover:border-indigo-300 transition-all duration-300 transform hover:-translate-y-1.5 group">
              <div className="bg-blue-50 group-hover:bg-blue-500 text-blue-600 group-hover:text-white p-2.5 sm:p-3 rounded-xl sm:rounded-[16px] mb-2 sm:mb-3 transition-colors duration-300"><MapPin className="w-5 h-5 sm:w-6 sm:h-6" /></div>
              <span className="font-extrabold text-[9px] sm:text-xs text-slate-700 uppercase tracking-wider text-center leading-tight">Cómo<br className="sm:hidden"/> Llegar</span>
            </a>
            <a href="https://drive.google.com/file/d/1yFsKClAlw8s6PxO3Bdi9SM9Ou-avxyce/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="bg-white rounded-[16px] sm:rounded-[24px] p-2.5 sm:p-5 flex flex-col items-center justify-center shadow-[0_10px_40px_rgba(0,0,0,0.08)] hover:shadow-[0_15px_50px_rgba(99,102,241,0.15)] border border-slate-100/50 hover:border-indigo-300 transition-all duration-300 transform hover:-translate-y-1.5 group">
              <div className="bg-indigo-50 group-hover:bg-indigo-500 text-indigo-600 group-hover:text-white p-2.5 sm:p-3 rounded-xl sm:rounded-[16px] mb-2 sm:mb-3 transition-colors duration-300"><FileText className="w-5 h-5 sm:w-6 sm:h-6" /></div>
              <span className="font-extrabold text-[9px] sm:text-xs text-slate-700 uppercase tracking-wider text-center leading-tight">Horario<br className="sm:hidden"/> PDF</span>
            </a>
            <a href="https://drive.google.com/file/d/1NWvgAKL286hLw6AL3sP-V7MtobhUc2xf/view?usp=drive_link" target="_blank" rel="noopener noreferrer" className="bg-white rounded-[16px] sm:rounded-[24px] p-2.5 sm:p-5 flex flex-col items-center justify-center shadow-[0_10px_40px_rgba(0,0,0,0.08)] hover:shadow-[0_15px_50px_rgba(99,102,241,0.15)] border border-slate-100/50 hover:border-indigo-300 transition-all duration-300 transform hover:-translate-y-1.5 group">
              <div className="bg-emerald-50 group-hover:bg-emerald-500 text-emerald-600 group-hover:text-white p-2.5 sm:p-3 rounded-xl sm:rounded-[16px] mb-2 sm:mb-3 transition-colors duration-300"><MapIcon className="w-5 h-5 sm:w-6 sm:h-6" /></div>
              <span className="font-extrabold text-[9px] sm:text-xs text-slate-700 uppercase tracking-wider text-center leading-tight">Mapa<br className="sm:hidden"/> Centro</span>
            </a>
            <a href="https://docs.google.com/document/d/1zMlj92i4pB2PFasjnPMugL95iePaR4Vt8aIEnWJbA_A/edit?usp=sharing" target="_blank" rel="noopener noreferrer" className="bg-white rounded-[16px] sm:rounded-[24px] p-2.5 sm:p-5 flex flex-col items-center justify-center shadow-[0_10px_40px_rgba(0,0,0,0.08)] hover:shadow-[0_15px_50px_rgba(99,102,241,0.15)] border border-slate-100/50 hover:border-indigo-300 transition-all duration-300 transform hover:-translate-y-1.5 group">
              <div className="bg-amber-50 group-hover:bg-amber-500 text-amber-600 group-hover:text-white p-2.5 sm:p-3 rounded-xl sm:rounded-[16px] mb-2 sm:mb-3 transition-colors duration-300"><ClipboardList className="w-5 h-5 sm:w-6 sm:h-6" /></div>
              <span className="font-extrabold text-[9px] sm:text-xs text-slate-700 uppercase tracking-wider text-center leading-tight">Normas<br className="sm:hidden"/> Roles</span>
            </a>
        </div>
      </div>

      {/* MENÚ FLOTANTE NAVEGACIÓN */}
      <div className="sticky top-2 sm:top-4 z-40 px-3 sm:px-4 mt-6 sm:mt-8">
        <div className="bg-white/85 backdrop-blur-xl rounded-[20px] sm:rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-1 sm:p-1.5 flex w-full max-w-sm mx-auto border border-white/50 relative">
          <button 
            onClick={() => { setActiveTab('horario'); setSelectedSport(null); setSearchQuery(''); setExpandedAthlete(null); }}
            className={`flex-1 flex items-center justify-center py-2.5 sm:py-3 px-3 sm:px-4 rounded-[16px] sm:rounded-[20px] text-xs sm:text-sm font-black transition-all duration-300 ease-out ${activeTab === 'horario' ? 'bg-indigo-600 text-white shadow-md transform scale-[1.02]' : 'text-slate-500 hover:text-indigo-600 hover:bg-indigo-50/50'}`}
          >
            <Clock className="w-4 h-4 mr-1.5 sm:mr-2" /> Horarios
          </button>
          <button 
            onClick={() => setActiveTab('listados')}
            className={`flex-1 flex items-center justify-center py-2.5 sm:py-3 px-3 sm:px-4 rounded-[16px] sm:rounded-[20px] text-xs sm:text-sm font-black transition-all duration-300 ease-out ${activeTab === 'listados' ? 'bg-indigo-600 text-white shadow-md transform scale-[1.02]' : 'text-slate-500 hover:text-indigo-600 hover:bg-indigo-50/50'}`}
          >
            <Users className="w-4 h-4 mr-1.5 sm:mr-2" /> Atletas
          </button>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <main className="px-3 sm:px-4 pt-6 sm:pt-8 pb-12 max-w-3xl mx-auto relative z-30">
        
        {/* ===================== VISTA HORARIOS ===================== */}
        {activeTab === 'horario' && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            
            {/* BOTÓN DEBUG MODO LIVE */}
            <div className="flex justify-end mb-4 sm:mb-6">
               <button onClick={() => setIsSimulatingLive(!isSimulatingLive)} className={`flex items-center text-[9px] sm:text-[10px] font-bold px-3 py-1.5 rounded-full border shadow-sm transition-colors ${isSimulatingLive ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}>
                  <PlayCircle className="w-3 h-3 mr-1.5" /> {isSimulatingLive ? 'Detener Simulación' : 'Simular Día del Evento'}
               </button>
            </div>

            {/* SECCIÓN "LO QUE SE ESTÁ JUGANDO AHORA" */}
            {currentLiveSlot && (
              <div className="mb-8 sm:mb-10 bg-gradient-to-br from-red-50/80 to-orange-50/80 border border-red-100 rounded-[24px] sm:rounded-[32px] pt-4 sm:pt-5 pb-5 sm:pb-6 shadow-[0_8px_30px_rgba(239,68,68,0.06)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-400/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3"></div>
                <div className="flex items-center justify-between mb-4 sm:mb-5 relative z-10 px-4 sm:px-6">
                  <h3 className="text-xs sm:text-sm font-black text-red-600 uppercase tracking-widest flex items-center">
                    <div className="relative flex h-2.5 w-2.5 sm:h-3 sm:w-3 mr-2 sm:mr-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-red-500"></span>
                    </div>
                    Jugando Ahora
                  </h3>
                  <span className="bg-red-500 text-white px-3 py-1 rounded-xl text-[10px] sm:text-[11px] font-black shadow-sm tracking-wider">
                    {currentLiveSlot.time}
                  </span>
                </div>
                
                <div className="flex overflow-x-auto pb-2 px-4 sm:px-6 snap-x hide-scrollbar gap-3 sm:gap-4 relative z-10">
                  {currentLiveSlot.events.map((event, evtIndex) => {
                    const style = FACILITIES[event.facility] || { color: "bg-gray-100 text-gray-800 border-gray-200", icon: "📍" };
                    const matchObj = event.title.match(/^(SB|SF|MC)\s*-\s*(SB|SF|MC)$/);
                    
                    return (
                      <div key={evtIndex} className="snap-start shrink-0 w-[240px] sm:w-[280px] bg-white rounded-[20px] p-4 shadow-sm border border-red-100/50 hover:border-red-200 transition-colors relative">
                         {isAdmin && (
                            <button onClick={(e) => { e.stopPropagation(); setEditingItem({ type: 'match', slotIndex: filteredSchedule.findIndex(s=>s.time === currentLiveSlot.time), eventIndex: evtIndex, data: event }); }} className="absolute -top-2 -right-2 p-2 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 rounded-full shadow-sm z-20">
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                         )}
                        <div className="flex justify-between items-start mb-3 sm:mb-4">
                          <span className={`text-[10px] sm:text-[11px] font-black px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg sm:rounded-xl border ${style.color} flex items-center w-fit shadow-sm`}>
                            <span className="mr-1.5 text-xs sm:text-sm">{style.icon}</span> {event.facility}
                          </span>
                          <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md sm:rounded-lg tracking-wider uppercase">
                            {event.category}
                          </span>
                        </div>
                        {matchObj ? (
                          <>
                            <div className="flex items-center justify-between gap-1 mt-3 sm:mt-4 mb-1">
                              <div className={`flex-1 flex items-center justify-center text-center px-1 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-black leading-tight shadow-sm text-white ${SCHOOLS[matchObj[1]].badge}`}>
                                {SCHOOLS[matchObj[1]].name}
                              </div>
                              
                              {/* MARCADOR LIVE EN CARRUSEL */}
                              {event.score ? (
                                <span className="bg-slate-900 text-white font-black text-[10px] sm:text-xs px-2 py-1.5 rounded-lg shadow-inner z-10 whitespace-nowrap mx-0.5 border border-slate-700">
                                  {event.score}
                                </span>
                              ) : (
                                <span className="text-slate-300 font-black text-[9px] sm:text-[10px] px-1 sm:px-1.5 italic">VS</span>
                              )}

                              <div className={`flex-1 flex items-center justify-center text-center px-1 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-black leading-tight shadow-sm text-white ${SCHOOLS[matchObj[2]].badge}`}>
                                {SCHOOLS[matchObj[2]].name}
                              </div>
                            </div>
                            {event.referee && (
                              <div className="flex items-center text-[9px] sm:text-[10px] font-bold text-slate-500 mt-2 bg-slate-50 border border-slate-100 px-2 py-1 rounded-md w-fit">
                                <ClipboardList className="w-3 h-3 mr-1 text-indigo-400" />
                                <span className="opacity-80">Resp:</span>&nbsp;<span className="text-slate-700">{event.referee}</span>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="flex flex-col mt-1">
                            <div className="flex justify-between items-center">
                              <p className="font-black text-slate-800 text-sm sm:text-base">{event.title}</p>
                              {event.score && (
                                 <span className="bg-slate-900 text-white font-black text-[10px] sm:text-xs px-2 py-1 rounded-lg shadow-inner whitespace-nowrap ml-2 border border-slate-700">
                                   {event.score}
                                 </span>
                              )}
                            </div>
                            {event.referee && (
                              <div className="flex items-center text-[9px] sm:text-[10px] font-bold text-slate-500 mt-2 bg-slate-50 border border-slate-100 px-2 py-1 rounded-md w-fit">
                                <ClipboardList className="w-3 h-3 mr-1 text-indigo-400" />
                                <span className="opacity-80">Resp:</span>&nbsp;<span className="text-slate-700">{event.referee}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* FEATURE 3: MI RUTA VIP + BOTÓN COMPARTIR WHATSAPP */}
            {favorites.length > 0 && (
              <div className="mb-6 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-[20px] sm:rounded-[24px] p-[2px] shadow-lg transform transition-all hover:scale-[1.01]">
                <div className="bg-white rounded-[18px] sm:rounded-[22px] p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                  <div className="flex items-center text-left w-full sm:w-auto">
                    <div className="bg-amber-100 p-2.5 sm:p-3 rounded-full mr-3"><Navigation className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" /></div>
                    <div>
                      <h3 className="font-black text-slate-800 text-sm sm:text-base leading-none mb-1">Mi Ruta VIP</h3>
                      <p className="text-[10px] sm:text-xs text-slate-500 font-bold">Horario de tus {favorites.length} favoritos</p>
                    </div>
                  </div>
                  
                  <div className="flex w-full sm:w-auto gap-2">
                    <button 
                      onClick={() => { setShowMyRoute(!showMyRoute); setSelectedFacility('Todas'); setSelectedSchoolFilter('Todos'); }}
                      className={`flex-1 sm:flex-none px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl sm:rounded-[16px] text-xs sm:text-sm font-black transition-all shadow-sm ${showMyRoute ? 'bg-slate-800 text-white' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'}`}
                    >
                      {showMyRoute ? 'Ocultar Ruta' : 'Ver Mi Horario'}
                    </button>

                    {showMyRoute && (
                      <button 
                        onClick={shareWhatsApp} 
                        className="flex-1 sm:flex-none px-3 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-[16px] text-white text-xs sm:text-sm font-black transition-all shadow-sm bg-green-500 hover:bg-green-600 flex items-center justify-center"
                      >
                        <Send className="w-4 h-4 sm:mr-2" /> <span className="hidden sm:inline">Enviar</span>
                      </button>
                    )}
                  </div>

                </div>
              </div>
            )}

            {/* FILTROS REGULARES */}
            {!showMyRoute && (
              <>
                <div className="bg-white rounded-[20px] sm:rounded-[24px] p-4 sm:p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 mb-6">
                  <div className="flex justify-between items-center mb-3 sm:mb-4 px-1">
                    <h3 className="text-[10px] sm:text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                      <Medal className="w-3.5 h-3.5 mr-1.5" /> Mi Colegio
                    </h3>
                  </div>
                  <div className="flex gap-1.5 sm:gap-2">
                    <button onClick={() => setSelectedSchoolFilter('Todos')} className={`flex-1 py-2.5 sm:py-3 px-1 sm:px-3 rounded-xl sm:rounded-2xl text-[10px] sm:text-xs font-black transition-all duration-300 ${selectedSchoolFilter === 'Todos' ? 'bg-slate-800 text-white shadow-md transform scale-[1.02]' : 'bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100'}`}>Todos</button>
                    {Object.values(SCHOOLS).map(school => (
                      <button key={school.short} onClick={() => setSelectedSchoolFilter(school.short)} className={`flex-1 py-2.5 sm:py-3 px-1 sm:px-3 rounded-xl sm:rounded-2xl text-[10px] sm:text-xs font-black transition-all duration-300 ${selectedSchoolFilter === school.short ? `${school.badge} text-white shadow-md transform scale-[1.02]` : 'bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100'}`}>{school.short}</button>
                    ))}
                  </div>
                </div>

                <div className="mb-8 sm:mb-10">
                  <div className="flex items-center text-slate-700 font-black text-[10px] sm:text-[11px] uppercase tracking-widest mb-3 sm:mb-4 px-1">
                    <Filter className="w-3.5 h-3.5 mr-1.5 text-indigo-500" /> Instalación
                  </div>
                  <div className="flex overflow-x-auto pb-4 -mx-3 px-3 sm:-mx-4 sm:px-4 snap-x hide-scrollbar gap-2 sm:gap-2.5">
                    {facilitiesList.map((facility) => {
                      const isSelected = selectedFacility === facility;
                      const facilityData = FACILITIES[facility];
                      return (
                        <button key={facility} onClick={() => setSelectedFacility(facility)} className={`snap-start whitespace-nowrap flex items-center px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold transition-all duration-300 ${isSelected ? 'bg-indigo-600 text-white shadow-md transform scale-[1.02]' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>
                          {facilityData?.icon && <span className="mr-1.5 sm:mr-2 text-base sm:text-lg drop-shadow-sm">{facilityData.icon}</span>}
                          {facility}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {/* TIMELINE HORARIOS */}
            <div className="relative border-l-[2px] border-dashed border-indigo-200 ml-3 sm:ml-8 pl-5 sm:pl-10 space-y-8 sm:space-y-12">
              {filteredSchedule.length === 0 ? (
                <div className="text-center py-12 sm:py-16 bg-white rounded-[24px] sm:rounded-[32px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                  <Activity className="w-12 h-12 sm:w-16 sm:h-16 text-indigo-100 mx-auto mb-3 sm:mb-4" />
                  <p className="text-sm sm:text-base text-slate-500 font-bold">No hay eventos para estos filtros.</p>
                </div>
              ) : (
                filteredSchedule.map((slot, index) => {
                  const isLive = isTimeSlotActive(slot.time);

                  return (
                    <div key={index} className="relative">
                      <div className={`absolute left-[-29px] sm:left-[-51px] top-1 w-5 h-5 sm:w-6 sm:h-6 bg-white border-[4px] sm:border-[6px] rounded-full z-10 ${isLive ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.6)] animate-pulse' : 'border-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.3)]'}`}></div>
                      
                      <h3 className="text-lg sm:text-xl font-black text-slate-800 mb-3 sm:mb-5 flex items-center gap-2 sm:gap-3">
                        <span className={`px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-lg sm:rounded-xl border tracking-tight shadow-sm transition-colors ${isLive ? 'bg-red-50 text-red-700 border-red-200 ring-2 ring-red-500/20' : 'bg-indigo-50 text-indigo-700 border-indigo-100/50'}`}>
                          {slot.time}
                        </span>
                        {isLive && <span className="bg-red-600 text-white text-[8px] sm:text-[9px] uppercase tracking-widest font-black px-1.5 py-0.5 sm:px-2 sm:py-1 rounded flex-shrink-0 animate-bounce">En Curso</span>}
                      </h3>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        {slot.events.map((event, evtIndex) => {
                          const style = FACILITIES[event.facility] || { color: "bg-gray-100 text-gray-800 border-gray-200", icon: "📍" };
                          let isHighlightedBySchool = false;
                          if (selectedSchoolFilter !== 'Todos' && !showMyRoute && /(SB|SF|MC)/.test(event.title)) {
                             isHighlightedBySchool = event.title.includes(selectedSchoolFilter);
                          }

                          return (
                            <div key={evtIndex} className={`bg-white rounded-[20px] sm:rounded-[24px] p-3.5 sm:p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border transition-all duration-300 group hover:-translate-y-1 relative ${isHighlightedBySchool ? 'ring-2 ring-indigo-400 border-transparent shadow-lg' : isLive ? 'border-red-100 hover:border-red-300 hover:shadow-lg ring-1 ring-red-50' : 'border-slate-100 hover:border-indigo-200 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]'}`}>
                              
                              {/* ADMIN EDIT BUTTON */}
                              {isAdmin && (
                                <button 
                                  onClick={(e) => { e.stopPropagation(); setEditingItem({ type: 'match', slotIndex: index, eventIndex: evtIndex, data: event }); }}
                                  className="absolute top-3 right-3 p-2 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 rounded-full shadow-sm z-20"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                              )}

                              <div className="flex justify-between items-start mb-3 sm:mb-4">
                                <span className={`text-[10px] sm:text-[11px] font-black px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl border ${style.color} flex items-center w-fit shadow-sm`}>
                                  <span className="mr-1.5 text-xs sm:text-sm">{style.icon}</span> {event.facility}
                                </span>
                                <span className={`text-[9px] sm:text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-md sm:rounded-lg tracking-wider uppercase ${isAdmin ? 'mr-8' : ''}`}>
                                  {event.category}
                                </span>
                              </div>
                              
                              {(() => {
                                const matchObj = event.title.match(/^(SB|SF|MC)\s*-\s*(SB|SF|MC)$/);
                                if (matchObj) {
                                  const team1 = SCHOOLS[matchObj[1]];
                                  const team2 = SCHOOLS[matchObj[2]];
                                  return (
                                    <>
                                      <div className="flex items-center justify-between gap-1 sm:gap-1.5 mt-3 sm:mt-5 mb-1 relative">
                                        <div className={`flex-1 flex items-center justify-center text-center px-1 py-2 sm:py-3.5 rounded-xl sm:rounded-2xl text-[11px] sm:text-[13px] font-black leading-tight shadow-sm text-white transition-all ${team1?.badge || 'bg-slate-500'} ${selectedSchoolFilter === team1?.short ? 'ring-2 sm:ring-4 ring-indigo-500/30 scale-105 z-10' : ''}`}>
                                          {team1?.name || matchObj[1]}
                                        </div>
                                        
                                        {/* MARCADOR EN VIVO */}
                                        {event.score ? (
                                          <span className="bg-slate-900 text-white font-black text-xs sm:text-sm px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl shadow-lg z-10 whitespace-nowrap mx-0.5 border border-slate-700">
                                            {event.score}
                                          </span>
                                        ) : (
                                          <span className="text-slate-300 font-black text-[9px] sm:text-[10px] px-1 sm:px-2 italic">VS</span>
                                        )}

                                        <div className={`flex-1 flex items-center justify-center text-center px-1 py-2 sm:py-3.5 rounded-xl sm:rounded-2xl text-[11px] sm:text-[13px] font-black leading-tight shadow-sm text-white transition-all ${team2?.badge || 'bg-slate-500'} ${selectedSchoolFilter === team2?.short ? 'ring-2 sm:ring-4 ring-indigo-500/30 scale-105 z-10' : ''}`}>
                                          {team2?.name || matchObj[2]}
                                        </div>
                                      </div>
                                      {/* ENCARGADO / ÁRBITRO DEL PARTIDO */}
                                      {event.referee && (
                                        <div className="flex items-center text-[9px] sm:text-[10px] font-bold text-slate-500 mt-2 bg-slate-50 border border-slate-100 px-2 py-1 rounded-md w-fit">
                                          <ClipboardList className="w-3 h-3 mr-1 text-indigo-400" />
                                          <span className="opacity-80">Resp:</span>&nbsp;<span className="text-slate-700">{event.referee}</span>
                                        </div>
                                      )}
                                    </>
                                  );
                                }
                                return (
                                  <div className="flex flex-col mt-2">
                                    <div className="flex justify-between items-center group-hover:text-indigo-600 transition-colors">
                                      <p className="font-black text-slate-800 text-base sm:text-lg pr-8">{event.title}</p>
                                      {/* MARCADOR EVENTO GENERAL */}
                                      {event.score && (
                                         <span className="bg-slate-900 text-white font-black text-[10px] sm:text-xs px-3 py-1.5 rounded-lg shadow-inner whitespace-nowrap ml-2 border border-slate-700">
                                           {event.score}
                                         </span>
                                      )}
                                    </div>
                                    {/* ENCARGADO / ÁRBITRO EVENTO GENERAL */}
                                    {event.referee && (
                                      <div className="flex items-center text-[9px] sm:text-[10px] font-bold text-slate-500 mt-2.5 bg-slate-50 border border-slate-100 px-2.5 py-1.5 rounded-lg w-fit">
                                        <ClipboardList className="w-3 h-3 mr-1.5 text-indigo-400" />
                                        <span className="opacity-80">Resp:</span>&nbsp;<span className="text-slate-700">{event.referee}</span>
                                      </div>
                                    )}
                                  </div>
                                );
                              })()}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            
            {filteredSchedule.length > 0 && (
              <div className="mt-12 sm:mt-16 text-center flex flex-col items-center justify-center">
                 <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-slate-300 mb-1.5 sm:mb-2"></div>
                 <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-slate-300 mb-1.5 sm:mb-2"></div>
                 <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-slate-300 mb-4 sm:mb-5"></div>
                 <span className="text-[9px] sm:text-[10px] text-slate-400 font-black uppercase tracking-widest bg-slate-200/50 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full">Fin de la Jornada</span>
              </div>
            )}
          </div>
        )}

        {/* ===================== VISTA LISTADOS (ATLETAS) ===================== */}
        {activeTab === 'listados' && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            
            {/* BUSCADOR */}
            {!selectedSport && (
              <div className="relative mb-8 sm:mb-10 group">
                <div className="absolute inset-y-0 left-0 pl-5 sm:pl-6 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-400 group-focus-within:text-indigo-600 transition-colors" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-12 pr-12 py-3.5 sm:py-5 bg-white border border-slate-200 rounded-[20px] sm:rounded-[24px] text-slate-900 font-bold text-base sm:text-lg placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all"
                  placeholder="Buscar a un atleta..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute inset-y-0 right-0 pr-5 sm:pr-6 flex items-center text-slate-400 hover:text-indigo-600 transition-colors">
                    <X className="h-5 w-5 sm:h-6 sm:w-6" />
                  </button>
                )}
              </div>
            )}

            {/* SECCIÓN FAVORITOS */}
            {searchQuery.trim() === '' && !selectedSport && favorites.length > 0 && (
              <div className="mb-10 sm:mb-12 animate-in fade-in duration-700">
                <div className="flex items-center justify-between mb-4 sm:mb-5 px-1 sm:px-2">
                  <h3 className="text-xs sm:text-sm font-black text-amber-500 uppercase tracking-widest flex items-center">
                    <Star className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 fill-amber-400 text-amber-400 drop-shadow-sm" /> Mis Favoritos
                  </h3>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  {favoriteParticipants.map(p => <AthleteCard key={`fav-${p.id}`} p={p} />)}
                </div>
              </div>
            )}

            {/* RESULTADOS BÚSQUEDA */}
            {searchQuery.trim() !== '' && !selectedSport && (
              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-[10px] sm:text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4 sm:mb-5 px-1 sm:px-2 flex items-center justify-between">
                  <span>Resultados Búsqueda</span>
                  <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg text-[10px] sm:text-xs">{searchResults.length}</span>
                </h3>
                {searchResults.length === 0 ? (
                  <div className="text-center py-12 sm:py-16 bg-white rounded-[24px] sm:rounded-[32px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                    <Users className="w-12 h-12 sm:w-16 sm:h-16 text-slate-200 mx-auto mb-3 sm:mb-4" />
                    <p className="text-sm sm:text-base text-slate-500 font-bold">No se encontraron atletas.</p>
                  </div>
                ) : (
                  searchResults.map(p => <AthleteCard key={p.id} p={p} />)
                )}
              </div>
            )}

            {/* NAVEGACIÓN DE DEPORTES */}
            {searchQuery.trim() === '' && !selectedSport && (
              <div>
                <h3 className="text-[10px] sm:text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4 sm:mb-5 px-1 sm:px-2 flex items-center">
                  <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" /> Categorías Deportivas
                </h3>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {sportsList.map(sport => {
                    const count = participants.filter(p => p.sport === sport).length;
                    return (
                      <button 
                        key={sport} 
                        onClick={() => setSelectedSport(sport)}
                        className="bg-white p-4 sm:p-6 rounded-[20px] sm:rounded-[28px] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 hover:border-indigo-400 hover:shadow-[0_8px_30px_rgba(99,102,241,0.15)] transition-all duration-300 text-left group flex flex-col items-center sm:items-start relative overflow-hidden transform hover:-translate-y-1"
                      >
                        <div className="absolute -right-2 -bottom-2 sm:-right-4 sm:-bottom-4 opacity-[0.03] text-5xl sm:text-7xl group-hover:scale-110 transition-transform duration-500">
                          {FACILITIES[SPORT_TO_FACILITY[sport]?.[0]]?.icon || "🏆"}
                        </div>
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-indigo-50 flex items-center justify-center text-xl sm:text-2xl mb-3 sm:mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300 shadow-sm relative z-10">
                           {FACILITIES[SPORT_TO_FACILITY[sport]?.[0]]?.icon || "🏆"}
                        </div>
                        <span className="font-black text-slate-800 text-base sm:text-xl mb-1 sm:mb-1.5 group-hover:text-indigo-600 transition-colors relative z-10">{sport}</span>
                        <span className="text-[9px] sm:text-[11px] text-slate-500 font-bold bg-slate-100 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl relative z-10">{count} inscritos</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* VISTA DE DEPORTE ESPECÍFICO */}
            {selectedSport && (
              <div className="animate-in slide-in-from-right-8 duration-500">
                <button 
                  onClick={() => { setSelectedSport(null); setExpandedAthlete(null); }}
                  className="flex items-center text-indigo-600 font-bold text-xs sm:text-sm mb-6 sm:mb-8 hover:text-white hover:bg-indigo-600 transition-all duration-300 bg-white border border-indigo-100 shadow-[0_4px_20px_rgb(0,0,0,0.04)] px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl sm:rounded-2xl w-fit group"
                >
                  <ChevronRight className="w-4 h-4 mr-1 sm:mr-2 rotate-180 group-hover:-translate-x-1 transition-transform" /> 
                  Volver al panel
                </button>
                
                <div className="flex items-center justify-between mb-6 sm:mb-10 px-1 sm:px-2">
                  <div className="flex items-center">
                     <span className="text-3xl sm:text-5xl mr-2 sm:mr-4 drop-shadow-sm">{FACILITIES[SPORT_TO_FACILITY[selectedSport]?.[0]]?.icon}</span>
                     <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">{selectedSport}</h2>
                  </div>
                  <span className="bg-indigo-100 text-indigo-800 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-black border border-indigo-200 shadow-sm">
                    {sportParticipants.length} <span className="hidden sm:inline">atletas</span>
                  </span>
                </div>

                <div className="space-y-5 sm:space-y-8">
                  {Object.keys(SCHOOLS).map(schoolKey => {
                    const schoolParticipants = sportParticipants.filter(p => p.school === schoolKey);
                    if (schoolParticipants.length === 0) return null;
                    
                    return (
                      <div key={schoolKey} className="bg-white rounded-[24px] sm:rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
                        <div className={`px-4 py-3.5 sm:px-6 sm:py-5 border-b border-white/20 flex items-center justify-between text-white ${SCHOOLS[schoolKey].badge}`}>
                          <div className="flex items-center">
                            <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-2.5 opacity-80" />
                            <h3 className="font-black text-sm sm:text-base uppercase tracking-widest">{SCHOOLS[schoolKey].name}</h3>
                          </div>
                          <span className="font-black text-[10px] sm:text-xs bg-black/20 px-2 py-1 sm:px-3 sm:py-1.5 rounded-md sm:rounded-lg shadow-inner">{schoolParticipants.length}</span>
                        </div>
                        <div className="p-3 sm:p-6 bg-slate-50/50 space-y-2 sm:space-y-3">
                           {schoolParticipants.map(p => <AthleteCard key={p.id} p={p} />)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        )}

      </main>

      {/* BOTTOM NAVIGATION BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-2xl border-t border-slate-200/60 pb-6 sm:pb-4 pt-2 shadow-[0_-10px_40px_rgba(0,0,0,0.08)]">
        <div className="max-w-md mx-auto px-4 flex items-center justify-between gap-2">
          <button onClick={() => { setActiveTab('horario'); setSelectedSport(null); setSearchQuery(''); setExpandedAthlete(null); setShowAdminPanel(false); }} className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-[16px] transition-all duration-300 ${activeTab === 'horario' && !showAdminPanel ? 'text-indigo-600 bg-indigo-50/80 scale-105' : 'text-slate-400 hover:text-indigo-500 hover:bg-slate-50'}`}>
            <Clock className={`w-6 h-6 mb-1 ${activeTab === 'horario' && !showAdminPanel ? 'stroke-indigo-100 fill-indigo-600' : ''}`} />
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider">Horarios</span>
          </button>
          <button onClick={() => { setActiveTab('listados'); setShowAdminPanel(false); }} className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-[16px] transition-all duration-300 ${activeTab === 'listados' && !showAdminPanel ? 'text-indigo-600 bg-indigo-50/80 scale-105' : 'text-slate-400 hover:text-indigo-500 hover:bg-slate-50'}`}>
            <Users className={`w-6 h-6 mb-1 ${activeTab === 'listados' && !showAdminPanel ? 'stroke-indigo-100 fill-indigo-600' : ''}`} />
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider">Atletas</span>
          </button>
          <button onClick={handleAdminLogin} className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-[16px] transition-all duration-300 ${isAdmin || showAdminPanel ? 'text-indigo-600 bg-indigo-50/80 scale-105' : 'text-slate-300 hover:text-slate-500 hover:bg-slate-50'}`}>
            {isAdmin ? <Database className="w-6 h-6 mb-1 stroke-indigo-100 fill-indigo-600" /> : <Lock className="w-6 h-6 mb-1" />}
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider">{isAdmin ? 'Nube / Admin' : 'Acceso'}</span>
          </button>
        </div>
      </div>

      {/* ===================== MODAL DE LOGIN ADMIN ===================== */}
      {showAdminLogin && !isAdmin && (
        <div className="fixed inset-0 z-[110] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
           <div className="bg-white rounded-[32px] p-6 sm:p-8 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200">
               <div className="w-16 h-16 bg-indigo-50 rounded-[20px] flex items-center justify-center mb-5 mx-auto shadow-inner">
                 <Lock className="w-8 h-8 text-indigo-600" />
               </div>
               <h3 className="text-xl font-black text-slate-800 mb-2 text-center tracking-tight">
                  Área de Organización
               </h3>
               <p className="text-xs text-slate-500 mb-6 text-center font-bold">
                  Introduce la contraseña para habilitar la edición manual y sincronización en la nube.
               </p>
               
               <div className="space-y-3">
                 <input 
                    type="password" value={adminPassword} onChange={(e) => { setAdminPassword(e.target.value); setAdminError(''); }} onKeyDown={(e) => e.key === 'Enter' && handlePasswordSubmit()}
                    className={`w-full bg-slate-50 border ${adminError ? 'border-red-300 ring-2 ring-red-500/20' : 'border-slate-200 focus:border-indigo-500'} rounded-xl px-4 py-4 text-center text-lg font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all shadow-sm`} 
                    placeholder="Contraseña" autoFocus
                 />
                 {adminError && <p className="text-[10px] text-red-500 font-black text-center uppercase tracking-widest">{adminError}</p>}
               </div>

               <div className="flex gap-3 mt-8">
                  <button onClick={() => { setShowAdminLogin(false); setAdminPassword(''); setAdminError(''); }} className="flex-1 py-3.5 rounded-xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors">Cancelar</button>
                  <button onClick={handlePasswordSubmit} className="flex-1 py-3.5 rounded-xl font-black text-white bg-indigo-600 hover:bg-indigo-700 transition-colors flex items-center justify-center shadow-[0_4px_15px_rgba(79,70,229,0.3)] hover:shadow-[0_8px_20px_rgba(79,70,229,0.4)]">Desbloquear</button>
               </div>
           </div>
        </div>
      )}

      {/* ===================== PANEL DE CONTROL ADMIN (NUBE & EDICIÓN) ===================== */}
      {showAdminPanel && isAdmin && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex flex-col justify-end sm:justify-center p-4 sm:p-0 animate-in fade-in duration-200">
           <div className="bg-white rounded-[32px] p-5 sm:p-8 w-full max-w-md shadow-2xl mx-auto animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-300 pb-28 sm:pb-8">
               
               <div className="flex justify-between items-center mb-5 border-b border-slate-100 pb-4">
                 <h3 className="text-lg sm:text-xl font-black text-slate-800 flex items-center">
                    <Database className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-indigo-500" />
                    Central de Sincronización
                 </h3>
                 <button onClick={() => setShowAdminPanel(false)} className="bg-slate-100 p-2 rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-600"><X className="w-5 h-5" /></button>
               </div>

               <p className="text-[11px] sm:text-xs text-slate-500 mb-5 font-medium leading-relaxed">
                  Pega los enlaces CSV públicos de tus hojas de Google Sheets. <b>Cada vez que modifiques tu Excel, los horarios y alumnos se actualizarán en la app.</b>
               </p>

               <div className="space-y-4">
                  
                  {/* Lista Scrolleable de Inputs */}
                  <div className="max-h-[35vh] overflow-y-auto pr-2 space-y-3 sm:space-y-4 hide-scrollbar">
                    
                    {/* Input Horario General */}
                    <div className="bg-indigo-50/50 p-3 rounded-2xl border border-indigo-100/50">
                      <label className="block text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2 ml-1">URL Horario General (CSV)</label>
                      <input type="url" value={sheetUrls.horario || ''} onChange={(e) => updateSheetUrl('horario', e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="https://docs.google.com/spreadsheets/..." />
                    </div>

                    {/* Inputs de Deportes Dinámicos */}
                    {CORE_SPORTS.map(sport => (
                      <div key={sport} className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">URL Listado {sport} (CSV)</label>
                        <input type="url" value={sheetUrls[sport] || ''} onChange={(e) => updateSheetUrl(sport, e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder={`URL de los participantes de ${sport}`} />
                      </div>
                    ))}
                  </div>

                  {/* AutoSync Toggle */}
                  <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-800">Actualización en vivo</span>
                      <span className="text-[10px] text-slate-400 font-bold">Busca cambios en el Excel cada minuto</span>
                    </div>
                    <button onClick={() => { setAutoSync(!autoSync); window.localStorage.setItem('intercentros_autosync', !autoSync); }} className={`w-12 h-6 rounded-full transition-colors relative shadow-inner ${autoSync ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                       <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${autoSync ? 'left-7' : 'left-1'}`}></span>
                    </button>
                  </div>

                  {/* Status text */}
                  {syncStatus && (
                    <div className={`text-center text-[10px] font-black uppercase tracking-widest py-3 rounded-xl border flex items-center justify-center ${syncStatus.includes('Error') || syncStatus.includes('❌') ? 'bg-red-50 text-red-600 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                      {isSyncing && <RefreshCw className="w-3.5 h-3.5 mr-2 animate-spin" />}
                      {syncStatus}
                    </div>
                  )}
               </div>

               <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <button onClick={() => { setIsAdmin(false); setShowAdminPanel(false); }} className="w-full py-3.5 rounded-xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center order-2 sm:order-1">
                     <Unlock className="w-4 h-4 mr-2" /> Cerrar Sesión
                  </button>
                  <button onClick={() => handleFullSync(false)} disabled={isSyncing} className="w-full py-3.5 rounded-xl font-black text-white bg-indigo-600 hover:bg-indigo-700 shadow-[0_4px_15px_rgba(79,70,229,0.3)] transition-all flex items-center justify-center order-1 sm:order-2 disabled:opacity-50">
                     <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} /> {isSyncing ? 'Sincronizando...' : 'Forzar Sincronización'}
                  </button>
               </div>
           </div>
        </div>
      )}

      {/* ===================== MODAL DE EDICIÓN LOCAL ===================== */}
      {editingItem && (
        <div className="fixed inset-0 z-[120] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
           <div className="bg-white rounded-[32px] p-6 sm:p-8 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200">
               <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center">
                  <Edit3 className="w-5 h-5 mr-2 text-indigo-500" />
                  {editingItem.type === 'match' ? 'Editar Evento' : 'Editar Atleta'}
               </h3>
               
               <div className="space-y-4">
                   {editingItem.type === 'match' && (
                      <>
                         <div>
                           <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Título / Equipos</label>
                           <input type="text" value={editingItem.data.title} onChange={(e) => setEditingItem({...editingItem, data: {...editingItem.data, title: e.target.value}})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" placeholder="Ej: SB - MC" />
                         </div>
                         <div>
                           <label className="block text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1.5 ml-1">
                             Resultado Final o En Vivo
                           </label>
                           <input type="text" value={editingItem.data.score || ''} onChange={(e) => setEditingItem({...editingItem, data: {...editingItem.data, score: e.target.value}})} className="w-full bg-slate-800 text-white border border-slate-700 rounded-xl px-4 py-3 text-sm font-black focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-inner" placeholder="Ej: 2 - 1 o 'Gana SF'" />
                         </div>
                         <div>
                           <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
                             Responsable / Árbitro
                           </label>
                           <input type="text" value={editingItem.data.referee || ''} onChange={(e) => setEditingItem({...editingItem, data: {...editingItem.data, referee: e.target.value}})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" placeholder="Ej: Marcos Serrano" />
                         </div>
                         <div>
                           <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Instalación</label>
                           <select value={editingItem.data.facility} onChange={(e) => setEditingItem({...editingItem, data: {...editingItem.data, facility: e.target.value}})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all">
                              {Object.keys(FACILITIES).map(f => <option key={f} value={f}>{f}</option>)}
                           </select>
                         </div>
                         <div>
                           <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Categoría</label>
                           <input type="text" value={editingItem.data.category} onChange={(e) => setEditingItem({...editingItem, data: {...editingItem.data, category: e.target.value}})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" placeholder="Ej: INF MAS" />
                         </div>
                      </>
                   )}

                   {editingItem.type === 'athlete' && (
                      <>
                         <div>
                           <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Nombre del Alumno</label>
                           <input type="text" value={editingItem.data.name} onChange={(e) => setEditingItem({...editingItem, data: {...editingItem.data, name: e.target.value}})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                         </div>
                         <div>
                           <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Colegio</label>
                           <select value={editingItem.data.school} onChange={(e) => setEditingItem({...editingItem, data: {...editingItem.data, school: e.target.value}})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all">
                              {Object.keys(SCHOOLS).map(s => <option key={s} value={s}>{SCHOOLS[s].name}</option>)}
                           </select>
                         </div>
                         <div>
                           <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Deporte</label>
                           <input type="text" value={editingItem.data.sport} onChange={(e) => setEditingItem({...editingItem, data: {...editingItem.data, sport: e.target.value}})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                         </div>
                         <div>
                           <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Categoría</label>
                           <input type="text" value={editingItem.data.category} onChange={(e) => setEditingItem({...editingItem, data: {...editingItem.data, category: e.target.value}})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                         </div>
                      </>
                   )}
               </div>

               <div className="flex gap-3 mt-8">
                  <button onClick={() => setEditingItem(null)} className="flex-1 py-3 rounded-xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors">
                     Cancelar
                  </button>
                  <button onClick={handleSaveEdit} className="flex-1 py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors flex items-center justify-center">
                     <Save className="w-4 h-4 mr-2" /> Guardar
                  </button>
               </div>
           </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}
