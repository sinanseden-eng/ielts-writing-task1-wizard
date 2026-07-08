import React, { useState, useEffect, useRef } from 'react';
import { 
  BarChart2, Save, Send, RefreshCw, CheckCircle, 
  AlertCircle, Activity, PieChart, Map as MapIcon, 
  GitMerge, Lightbulb, FileSpreadsheet, ArrowRight,
  ChevronLeft, Zap, Search, Edit3, MessageSquare,
  TrendingUp, BookOpen, Repeat, Copy
} from 'lucide-react';

// ============================================================================
// 0. LIQUID GLASS UNIVERSAL CARD COMPONENT
// ============================================================================

const LiquidCard = ({ children, className = "", style = {}, onClick, topBarColor }) => (
  <div 
    onClick={onClick}
    className={`relative rounded-[2rem] p-6 flex flex-col transition-all duration-300 shadow-xl border border-white/70 overflow-hidden ${onClick ? 'cursor-pointer hover:scale-[1.02] hover:shadow-2xl' : ''} ${className}`}
    style={{
      background: 'linear-gradient(180deg, rgba(230, 245, 255, 0.75) 0%, rgba(200, 230, 255, 0.5) 45%, rgba(150, 210, 255, 0.8) 100%)',
      boxShadow: '0 12px 30px rgba(0, 70, 150, 0.2), inset 0 4px 10px rgba(255, 255, 255, 0.95), inset 0 -8px 16px rgba(50, 150, 255, 0.5), inset 0 0 5px rgba(255,255,255,0.6)',
      backdropFilter: 'blur(10px)',
      ...style
    }}>
    {/* Colored Top Bar - Clipped cleanly by overflow-hidden */}
    {topBarColor && (
      <div className={`absolute top-0 left-0 w-full h-3.5 ${topBarColor} z-20 rounded-t-[1.9rem]`} />
    )}
    {/* Top Glossy Droplet Highlight */}
    <div className="absolute top-0 left-[5%] w-[90%] h-[45%] pointer-events-none rounded-b-[100px] z-0"
         style={{
           background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.05) 100%)',
           boxShadow: 'inset 0 2px 3px rgba(255,255,255,1)'
         }}></div>
    <div className="relative z-10 flex flex-col h-full w-full">
      {children}
    </div>
  </div>
);

// ============================================================================
// 1. VISUAL RENDERING COMPONENTS (Charts, Tables, Maps, Processes)
// ============================================================================

const ChartCanvas = ({ type, data, options, height = '220px' }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    let isMounted = true;
    const initChart = () => {
      if (!isMounted || !chartRef.current) return;
      if (chartInstance.current) chartInstance.current.destroy();
      if (window.Chart) {
        chartInstance.current = new window.Chart(chartRef.current, {
          type,
          data,
          options: { responsive: true, maintainAspectRatio: false, ...options }
        });
      }
    };

    if (!window.Chart) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
      script.onload = initChart;
      document.head.appendChild(script);
    } else {
      initChart();
    }

    return () => {
      isMounted = false;
      if (chartInstance.current) chartInstance.current.destroy();
    };
  }, [type, data, options]);

  return (
    <div style={{ height, position: 'relative', width: '100%' }}>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

const TableVisual = ({ data }) => (
  <div className="overflow-x-auto w-full bg-white/60 backdrop-blur-md rounded-2xl border border-white/70 shadow-sm">
    <table className="w-full text-sm text-left text-slate-800 border-collapse">
      <thead className="bg-white/40 text-indigo-900 font-bold border-b-2 border-indigo-200/50">
        <tr>
          {data.headers.map((h, i) => <th key={i} className="px-4 py-3 whitespace-nowrap">{h}</th>)}
        </tr>
      </thead>
      <tbody>
        {data.rows.map((row, i) => (
          <tr key={i} className="border-b border-white/50 hover:bg-white/80 transition-colors">
            {row.map((cell, j) => (
              <td key={j} className={`px-4 py-3 ${j === 0 ? 'font-semibold text-slate-900' : ''}`}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const ProcessVisual = ({ title, steps }) => (
  <div className="w-full bg-white/40 backdrop-blur-md p-6 rounded-2xl border border-white/60 shadow-inner overflow-x-auto">
    {title && <h4 className="font-bold text-slate-900 mb-6 text-center drop-shadow-sm">{title}</h4>}
    <div className="flex items-center justify-start md:justify-center gap-3 min-w-max pb-4">
      {steps.map((step, idx) => (
        <React.Fragment key={idx}>
          <div className="bg-white/80 backdrop-blur-sm border-2 border-white p-4 rounded-xl flex flex-col items-center justify-center text-center shadow-md w-32 h-32 hover:border-indigo-400 transition-colors">
            <span className="text-3xl mb-3 drop-shadow-sm">{step.icon}</span>
            <span className="text-xs font-bold text-slate-800 leading-tight">{step.label}</span>
          </div>
          {idx < steps.length - 1 && <ArrowRight className="w-6 h-6 text-indigo-400/70 flex-shrink-0" />}
        </React.Fragment>
      ))}
    </div>
  </div>
);

const MapVisual = ({ title1, title2, features1, features2 }) => {
  const renderMap = (title, features) => (
    <div className="bg-white/60 backdrop-blur-md border border-white/70 rounded-2xl p-3 md:p-6 w-full shadow-sm">
      <h4 className="text-center font-bold text-slate-900 mb-3 md:mb-6 drop-shadow-sm">{title}</h4>
      <div className="relative w-full h-[300px] sm:h-[350px] md:h-[450px] bg-[#dcfce7]/80 border-2 border-white/80 rounded-xl overflow-hidden flex flex-col shadow-inner backdrop-blur-sm">
        {/* River layer - Centered Horizontally */}
        <div className="absolute top-1/2 left-0 w-full h-12 md:h-16 bg-blue-300/60 border-y-2 border-blue-200/80 transform -translate-y-1/2"></div>
        {/* Road layer - Centered Vertically */}
        <div className="absolute top-0 left-1/2 w-12 md:w-16 h-full bg-slate-400/50 border-x-2 border-slate-300/80 transform -translate-x-1/2"></div>
        
        {/* Plotted Features with Absolute Alignment coordinates to resolve overlap bugs */}
        {features.map((f, i) => (
          <div key={i} className={`absolute flex flex-col items-center justify-center p-1 sm:p-2 rounded-xl shadow-lg border-2 bg-white/95 backdrop-blur-md z-10 w-[72px] sm:w-[84px] md:w-[98px] ${f.pos}`}>
            <span className="text-xl sm:text-2xl md:text-3xl mb-0.5 drop-shadow-md">{f.icon}</span>
            <span className="text-[8px] sm:text-[10px] md:text-xs font-black mt-0.5 text-slate-800 text-center leading-tight break-words">{f.label}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 md:gap-8 w-full items-center justify-center bg-white/30 backdrop-blur-sm p-4 md:p-8 rounded-2xl border border-white/50 shadow-inner">
      {renderMap(title1, features1)}
      <div className="flex flex-col items-center justify-center px-2">
        <ArrowRight className="w-10 h-10 text-indigo-400/80 flex-shrink-0 rotate-90" />
      </div>
      {renderMap(title2, features2)}
    </div>
  );
};

const VisualRenderer = ({ visual, height, options = {} }) => {
  if (visual.type === 'table') return <TableVisual data={visual.data} />;
  if (visual.type === 'process') return <ProcessVisual {...visual.data} />;
  if (visual.type === 'map') return <MapVisual {...visual.data} />;
  return <ChartCanvas type={visual.type} data={visual.data} height={height || "220px"} options={{ plugins: { legend: { position: 'bottom' } }, ...options }} />;
};

// ============================================================================
// 2. DATA HUB
// ============================================================================

const dataHub = {
  newcomerGuide: [
    { 
      type: 'Line Graph', icon: <Activity className="w-6 h-6 text-blue-500"/>, 
      advice: 'Group lines that follow a similar pattern. Highlight the peaks and troughs. Don\'t list every year unless you want the examiner to fall asleep.',
      purpose: 'Used by economists and scientists to track continuous changes over time, revealing long-term trajectories, volatility, and sudden shifts.',
      title: 'Declining Will to Live (Mon vs Fri)',
      visual: { type: 'line', data: { labels: ['Mon','Tue','Wed','Thu','Fri'], datasets: [{ label: 'Motivation', data: [90, 60, 40, 20, 5], borderColor: '#ef4444', tension: 0.3 }, { label: 'Coffee Intake', data: [2, 4, 6, 8, 10], borderColor: '#10b981', tension: 0.3 }] } }
    },
    { 
      type: 'Bar Chart', icon: <BarChart2 className="w-6 h-6 text-indigo-500"/>, 
      advice: 'Compare the heights. Identify the highest and lowest categories. Do not describe them from left to right like a robot scanning a barcode.',
      purpose: 'Frequently used in business and demographic studies to easily compare different discrete groups or categories side-by-side at a specific moment.',
      title: 'Top Excuses for Missing Deadlines',
      visual: { type: 'bar', data: { labels: ['Wi-Fi Died', 'Dog ate it', 'Existential Dread', 'Forgot'], datasets: [{ label: 'Frequency', data: [85, 5, 95, 40], backgroundColor: ['#4f46e5', '#8b5cf6', '#ef4444', '#cbd5e1'] }] } }
    },
    { 
      type: 'Pie Chart', icon: <PieChart className="w-6 h-6 text-rose-500"/>, 
      advice: 'Focus on proportions. Compare the largest and smallest slices. If there are multiple pies, compare the same slice across pies, not pie by pie.',
      purpose: 'Ideal for illustrating budget allocations, market share, and survey results, showing exactly how a "whole" is divided into proportional segments.',
      title: 'What I Actually Do on the Internet',
      visual: { type: 'doughnut', data: { labels: ['Cat Videos', 'Arguing', 'Working'], datasets: [{ data: [75, 24, 1], backgroundColor: ['#f59e0b', '#f43f5e', '#10b981'] }] } }
    },
    { 
      type: 'Table', icon: <FileSpreadsheet className="w-6 h-6 text-emerald-500"/>, 
      advice: 'Scan for extremes. Pick out the most striking comparisons. Treat it like a spreadsheet of despair—only report the cells that actually matter.',
      purpose: 'The absolute standard for rigorous academic and financial reporting, allowing precise cross-referencing of incredibly dense, multi-variable data.',
      title: 'Survival Rate of House Plants',
      visual: { type: 'table', data: { headers: ['Plant', 'Days Alive', 'Cause of Death'], rows: [['Cactus', '400', 'Overwatered'], ['Fern', '12', 'Neglect'], ['Orchid', '2', 'Looked at it wrong']] } }
    },
    { 
      type: 'Process Diagram', icon: <GitMerge className="w-6 h-6 text-amber-500"/>, 
      advice: 'No trends here! Describe steps in order using the passive voice ("is heated", "is filtered"). Use time connectors (First, subsequently, finally).',
      purpose: 'Found in operational manuals and scientific reports to clearly explain the sequential stages of a manufacturing system or natural life cycle.',
      title: 'Brick Manufacturing Process',
      visual: { type: 'process', data: { title: 'How bricks are produced for the building industry', steps: [{ label: 'Digging Clay', icon: ' 🚜 ' }, { label: 'Metal Grid', icon: ' 🎛️ ' }, { label: 'Add Water', icon: ' 💧 ' }, { label: 'Wire Cutter', icon: ' ✂️ ' }, { label: 'Oven (48h)', icon: ' ♨️ ' }, { label: 'Kiln', icon: ' 🔥 ' }, { label: 'Delivery', icon: ' 🚚 ' }] } }
    },
    { 
      type: 'Map / Plan', icon: <MapIcon className="w-6 h-6 text-purple-500"/>, 
      advice: 'Look at the "Before" and "After". Describe what was demolished, built, or expanded. Use directions and prepositions (North, opposite, adjacent to).',
      purpose: 'Crucial for urban planners and historians to illustrate geographical evolution, infrastructural redevelopment, and shifts in spatial relationships.',
      title: 'Town Redevelopment',
      visual: { type: 'map', data: { 
        title1: 'Village in 2000', 
        features1: [{ label: 'Forest', icon: ' 🌲 ', pos: 'top-2 right-2 sm:top-4 sm:right-4 border-emerald-400' }, { label: 'Farm', icon: ' 🐄 ', pos: 'bottom-2 left-2 sm:bottom-4 sm:left-4 border-amber-400' }, { label: 'Post Office', icon: ' ✉️ ', pos: 'top-2 left-2 sm:top-4 sm:left-4 border-slate-400' }], 
        title2: 'Village in 2024', 
        features2: [{ label: 'Golf Course', icon: ' ⛳ ', pos: 'top-2 right-2 sm:top-4 sm:right-4 border-emerald-500' }, { label: 'Apartments', icon: ' 🏢 ', pos: 'bottom-2 left-2 sm:bottom-4 sm:left-4 border-rose-400' }, { label: 'Shopping Mall', icon: ' 🏬 ', pos: 'top-2 left-2 sm:top-4 sm:left-4 border-indigo-400' }] 
      } }
    }
  ],
  structureGuide: {
    chart: { type: 'bar', data: { labels: ['Actually Working', 'Staring at Screen', 'Snacking', 'Scrolling Social Media'], datasets: [{ label: 'Hours per day (WFH)', data: [1.5, 3, 2, 4.5], backgroundColor: ['#10b981', '#64748b', '#f59e0b', '#ef4444'] }] } }
  },
  trendVocab: [
    // Upward Trends
    { word: 'Rise', type: 'Upward', def: 'To move upwards or increase in amount.', example: 'Profits began to rise in the second quarter.', cols: 'Steadily, Sharply, Gradually', icon: ' 📈 ' },
    { word: 'Increase', type: 'Upward', def: 'To become larger in amount or number.', example: 'There was an increase in tourism.', cols: 'Significantly, Gradually', icon: ' ➕ ' },
    { word: 'Climb', type: 'Upward', def: 'To go up or increase, often steadily.', example: 'Interest rates climbed to 5%.', cols: 'Steadily, Slowly', icon: ' 🧗 ' },
    { word: 'Grow', type: 'Upward', def: 'To increase in size or amount over time.', example: 'The population continues to grow rapidly.', cols: 'Rapidly, Steadily', icon: ' 🌱 ' },
    { word: 'Go up', type: 'Upward', def: 'To become higher in level.', example: 'The cost of materials went up again.', cols: 'Slightly, Sharply', icon: ' ⬆️ ' },
    { word: 'Soar', type: 'Upward', def: 'To rise very quickly to a high level.', example: 'The cost of living continued to soar throughout 2022.', cols: 'Temperatures, Costs, Profits', icon: ' 🦅 ' },
    { word: 'Rocket', type: 'Upward', def: 'To rise extremely quickly or make rapid progress.', example: 'Inflation rocketed in the last quarter.', cols: 'Prices, Demand', icon: ' 🚀 ' },
    { word: 'Jump', type: 'Upward', def: 'To increase suddenly and by a large amount.', example: 'Sales jumped by 20% last month.', cols: 'Suddenly, Significantly', icon: ' 🦘 ' },
    { word: 'Surge', type: 'Upward', def: 'A sudden and great increase.', example: 'There was a sudden surge in online shopping.', cols: 'Interest, Demand, Prices', icon: ' 🌊 ' },
    { word: 'Leap', type: 'Upward', def: 'To make a large and sudden increase.', example: 'Profits leaped to a record high.', cols: 'Profits, Numbers', icon: ' 🏃‍♂️ ' },
    // Downward Trends
    { word: 'Fall', type: 'Downward', def: 'To go down to a lower level or amount.', example: 'The number of accidents fell sharply.', cols: 'Sharply, Steadily', icon: ' 📉 ' },
    { word: 'Decrease', type: 'Downward', def: 'To become less, or to make something become less.', example: 'The unemployment rate decreased.', cols: 'Significantly, Slowly', icon: ' ➖ ' },
    { word: 'Decline', type: 'Downward', def: 'To gradually become less, worse, or lower.', example: 'Manufacturing jobs declined in the 1990s.', cols: 'Gradually, Steadily', icon: '↘️' },
    { word: 'Drop', type: 'Downward', def: 'To fall to a lower amount or value.', example: 'Temperatures dropped overnight.', cols: 'Suddenly, Slightly', icon: ' 💧 ' },
    { word: 'Go down', type: 'Downward', def: 'To move to a lower level or point.', example: 'The percentage went down to 15%.', cols: 'Steadily, Gradually', icon: ' ⏬ ' },
    { word: 'Plummet', type: 'Downward', def: 'To fall very quickly and suddenly from a high level.', example: 'Share prices plummeted after the scandal.', cols: 'Prices, Values', icon: ' ☄️ ' },
    { word: 'Plunge', type: 'Downward', def: 'To go down suddenly and rapidly.', example: 'The temperature plunged below freezing.', cols: 'Markets, Rates', icon: ' 🤿 ' },
    { word: 'Slump', type: 'Downward', def: 'To fall heavily and suddenly.', example: 'Sales slumped during the winter months.', cols: 'Sales, Profits', icon: ' 😞 ' },
    { word: 'Sink', type: 'Downward', def: 'To go down or drop to a lower level.', example: 'The value of the currency sank.', cols: 'Values, Rates', icon: ' ⚓ ' },
    { word: 'Dip', type: 'Downward', def: 'To go down to a lower level temporarily, before recovering.', example: 'Sales dipped slightly in the summer.', cols: 'Slightly, Briefly', icon: ' 🥄 ' },
    // Extremes
    { word: 'Peak', type: 'Extremes', def: 'To reach the highest point or value.', example: 'Sales peaked at $2M in December.', cols: 'At, Highest', icon: ' 🏔️ ' },
    { word: 'Reach a high', type: 'Extremes', def: 'To attain the highest level.', example: 'The stock reached a high of $50.', cols: 'Record high, All-time', icon: ' 🔝 ' },
    { word: 'Hit a low', type: 'Extremes', def: 'To reach the absolute lowest value.', example: 'The temperature hit a low of -5°C.', cols: 'Record low, All-time', icon: ' 🔽 ' },
    { word: 'Bottom out', type: 'Extremes', def: 'To reach the lowest point and stop falling.', example: 'The recession finally bottomed out in 2009.', cols: 'Economy, Prices', icon: ' 🕳️ ' },
    // Stability
    { word: 'Remain stable', type: 'Stability', def: 'To stay the same without changing.', example: 'The figures remained stable for three years.', cols: 'Relatively, Completely', icon: ' 🧱 ' },
    { word: 'Stay constant', type: 'Stability', def: 'To not change in amount or level.', example: 'The proportion stayed constant at 10%.', cols: 'Figures, Rates', icon: ' ⚖️ ' },
    { word: 'Level off', type: 'Stability', def: 'To stop rising or falling and become steady.', example: 'After a sharp rise, prices levelled off.', cols: 'Prices, Rates', icon: ' 📏 ' },
    { word: 'Plateau', type: 'Stability', def: 'To reach a state of little or no change.', example: 'Population growth plateaued after a decade.', cols: 'Sales, Growth', icon: ' ⛰️ ' },
    { word: 'Remain the same', type: 'Stability', def: 'To show no difference over time.', example: 'The numbers remained the same throughout.', cols: 'Exactly, Broadly', icon: ' 🔄 ' },
    { word: 'Hold steady', type: 'Stability', def: 'To stay firm and unchanging.', example: 'Interest rates held steady this month.', cols: 'Rates, Markets', icon: ' 🛑 ' },
    // Volatility
    { word: 'Fluctuate', type: 'Volatility', def: 'To rise and fall irregularly in number or amount.', example: 'Temperatures fluctuated wildly during April.', cols: 'Wildly, Prices', icon: ' 〰️ ' },
    { word: 'Oscillate', type: 'Volatility', def: 'To swing back and forth between two points.', example: 'The rate oscillated between 2% and 4%.', cols: 'Rates, Percentages', icon: ' ⏱️ ' },
    { word: 'Vary', type: 'Volatility', def: 'To change or differ from something else.', example: 'The numbers varied significantly by region.', cols: 'Significantly, Widely', icon: ' 🔀 ' },
    // Speed & Degree (Adjectives)
    { word: 'Dramatic', type: 'Adjectives', def: 'Very sudden or noticeable change.', example: 'There was a dramatic increase in sales.', cols: 'Increase, Fall, Rise', icon: ' 🎭 ' },
    { word: 'Sharp', type: 'Adjectives', def: 'A sudden and rapid change.', example: 'A sharp drop in prices occurred.', cols: 'Drop, Decline, Rise', icon: ' 🔪 ' },
    { word: 'Significant', type: 'Adjectives', def: 'Large or important enough to be noticed.', example: 'A significant decline was seen.', cols: 'Decline, Growth', icon: ' ❗ ' },
    { word: 'Substantial', type: 'Adjectives', def: 'Large in amount or value.', example: 'There was a substantial rise in costs.', cols: 'Rise, Increase, Drop', icon: ' 📈 ' },
    { word: 'Steadily', type: 'Adjectives', def: 'Happening in a smooth, gradual, and regular way.', example: 'A steady climb in numbers.', cols: 'Climb, Fall, Increase', icon: ' 🚶 ' },
    { word: 'Gradual', type: 'Adjectives', def: 'Happening slowly over a period of time.', example: 'A gradual rise in temperature.', cols: 'Rise, Decrease', icon: ' 🐢 ' },
    { word: 'Slight', type: 'Adjectives', def: 'Small in degree or amount.', example: 'There was a slight dip in the market.', cols: 'Dip, Increase, Drop', icon: ' 🤏 ' },
    // Speed & Degree (Adverbs)
    { word: 'Dramatically', type: 'Adverbs', def: 'In a very sudden or noticeable way.', example: 'Sales increased dramatically in Q4.', cols: 'Increase, Fall, Rise', icon: ' 💥 ' },
    { word: 'Sharply', type: 'Adverbs', def: 'Quickly and suddenly.', example: 'Prices fell sharply.', cols: 'Fall, Rise, Drop', icon: ' ⚡ ' },
    { word: 'Significantly', type: 'Adverbs', def: 'In a large or important way.', example: 'Profits grew significantly.', cols: 'Grow, Decrease', icon: ' 📊 ' },
    { word: 'Steadily', type: 'Adverbs', def: 'Gradually and in an even and regular way.', example: 'The number of visitors rose steadily.', cols: 'Rise, Climb', icon: ' ⏳ ' },
    { word: 'Gradually', type: 'Adverbs', def: 'Slowly over a period of time.', example: 'The population increased gradually.', cols: 'Increase, Decline', icon: ' 🗓️ ' },
    { word: 'Slightly', type: 'Adverbs', def: 'A little.', example: 'Temperatures dropped slightly.', cols: 'Drop, Fall, Increase', icon: ' 📉 ' }
  ],
  trendQuiz: [
    { q: "If prices fall very quickly and suddenly, they have...", options: ["Plummeted", "Plateaued", "Fluctuated"], answer: "Plummeted" },
    { q: "If a line goes up and down unpredictably, it is...", options: ["Soaring", "Erratic", "Stagnating"], answer: "Erratic" },
    { q: "If numbers stop growing and stay exactly the same, they have...", options: ["Surged", "Dipped", "Flatlined"], answer: "Flatlined" },
    { q: "To rise very rapidly and dramatically is to...", options: ["Skyrocket", "Plunge", "Level off"], answer: "Skyrocket" },
    { q: "A small, temporary fall before a recovery is called a...", options: ["Collapse", "Dip", "Peak"], answer: "Dip" },
    { q: "If a company's profits go up smoothly over 5 years, they increased...", options: ["Wildly", "Steadily", "Erratically"], answer: "Steadily" },
    { q: "If a chart shows a sudden, sharp, and massive increase, it experienced a...", options: ["Surge", "Plateau", "Trough"], answer: "Surge" },
    { q: "When data reaches its absolute lowest point, it has...", options: ["Peaked", "Bottomed out", "Soared"], answer: "Bottomed out" },
    { q: "When an economy fails to grow for a long time, it...", options: ["Stagnates", "Fluctuates", "Skyrockets"], answer: "Stagnates" },
    { q: "To stay at the same level for a long time after a period of growth is to...", options: ["Plummet", "Plateau", "Dip"], answer: "Plateau" },
    { q: "When a line reaches its absolute highest point, it has...", options: ["Hit a peak", "Bottomed out", "Levelled off"], answer: "Hit a peak" },
    { q: "If sales fall, but then return to their original high position, they...", options: ["Collapsed", "Stagnated", "Bounced back"], answer: "Bounced back" }
  ],
  languageOfChange: [
    { title: 'The Skyrocket', icon: ' 🚀 ', words: 'surged, soared, shot up, skyrocketed', example: '"The number of unread emails skyrocketed after the weekend."', colors: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800' }, chartType: 'line', chartData: { labels: ['Fri','Mon'], datasets: [{ data: [5, 450], borderColor: '#10b981', fill: true, backgroundColor: 'rgba(16,185,129,0.1)', tension: 0.2 }] } },
    { title: 'The Abyss', icon: ' 🕳️ ', words: 'plummeted, plunged, collapsed, sank', example: '"My bank balance plunged dramatically after payday."', colors: { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-800' }, chartType: 'line', chartData: { labels: ['Payday','Day 2'], datasets: [{ data: [2000, 12], borderColor: '#f43f5e', fill: true, backgroundColor: 'rgba(244,63,94,0.1)', tension: 0.2 }] } },
    { title: 'The Plateau of Boredom', icon: ' ➡️ ', words: 'remained steady, flatlined, stagnated', example: '"My career progression flatlined at middle management."', colors: { bg: 'bg-slate-100', border: 'border-slate-300', text: 'text-slate-800' }, chartType: 'line', chartData: { labels: ['2015','2017', '2019', '2021', '2023'], datasets: [{ data: [50, 50, 50, 50, 50], borderColor: '#64748b', fill: true, backgroundColor: 'rgba(100,116,139,0.1)', tension: 0 }] } },
    { title: 'The Rollercoaster', icon: ' 🎢 ', words: 'fluctuated wildly, was highly erratic', example: '"My stability fluctuated wildly during the exam."', colors: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800' }, chartType: 'line', chartData: { labels: ['Q1','Q2','Q3','Q4'], datasets: [{ data: [90, 10, 85, 5], borderColor: '#f59e0b', fill: true, backgroundColor: 'rgba(245,158,11,0.1)', tension: 0.3 }] } }
  ],
  trendSentences: [
    { text: "Coffee sales soared dramatically from 10 to 90 cups.", data: [10, 20, 40, 90] },
    { text: "Motivation plummeted to an all-time low of 5% by Friday.", data: [80, 50, 20, 5] },
    { text: "Meetings remained agonizingly steady at 4 per day.", data: [4, 4.1, 3.9, 4] },
    { text: "Productivity fluctuated wildly, oscillating between 10% and 90%.", data: [20, 90, 10, 80] },
    { text: "The number of unread emails climbed steadily to 70.", data: [10, 30, 50, 70] },
    { text: "Patience dipped slightly on Tuesday before recovering.", data: [50, 30, 45, 60] }
  ],
  prepositions: [
    { text: "Patience decreased _ 100% _ Monday _ Friday.", answers: ["by", "from", "to"], explanation: "We use 'by' to express the size of the change or difference (decreased by 100%). We use 'from... to' to denote starting and ending points." },
    { text: "Procrastination peaked _ 11 PM.", answers: ["at"], explanation: "We use 'at' for precise values, times, levels, or points on a scale (peaked at 11 PM)." },
    { text: "The amount of pointless meetings stood _ 5 per day.", answers: ["at"], explanation: "We use 'at' with starting points or static figure descriptors (stood at 5 per day)." },
    { text: "Motivation fell _ a high _ 90 _ a low _ zero.", answers: ["from", "of", "to", "of"], explanation: "We fall 'from' a point 'to' another, and connect categorical benchmarks with 'of' (a high of 90, a low of zero)." },
    { text: "My anxiety fluctuated _ panic _ extreme panic.", answers: ["between", "and"], explanation: "The verb 'fluctuate' typically shifts dynamically 'between' two distinct benchmarks linked by 'and'." },
    { text: "Unread emails started _ 50 on Monday.", answers: ["at"], explanation: "Initial numerical values use the preposition 'at' (started at 50) and days of the week use 'on'." },
    { text: "There was a dramatic increase _ the consumption of snacks.", answers: ["in"], explanation: "The noun phrases 'increase in' or 'decrease in' specify the domain or category that undergoes the transformation." },
    { text: "Existential dread experienced a rise _ 40%.", answers: ["of"], explanation: "A 'rise of 40%' introduces the margin of variation when using 'rise' as a noun." },
    { text: "Profits surged _ $1M _ $5M.", answers: ["from", "to"], explanation: "Dynamic upward motion routes 'from' the original baseline 'to' the final destination figure." },
    { text: "There was a drop _ demand _ the new product.", answers: ["in", "for"], explanation: "We express a 'drop in' a metric, while establishing 'demand for' a specific item." },
    { text: "The population levelled off _ 2 million.", answers: ["at"], explanation: "The phrasal verb 'level off' relies on 'at' to specify the numerical plateau reached." },
    { text: "Prices dropped _ 15% during the sale.", answers: ["by"], explanation: "We use 'by' to outline the difference or margin between the start and finish states (dropped by 15%)." },
    { text: "Sales bottomed out _ just 5 units.", answers: ["at"], explanation: "The extreme threshold 'bottomed out' is grammatically pinned to its absolute floor with 'at'." },
    { text: "There was a peak _ 500 visitors _ Sunday.", answers: ["of", "on"], explanation: "We hit a 'peak of [value]' to denote the amount, and use 'on' for specific calendar days." },
    { text: "The figures oscillated _ 10% _ 20%.", answers: ["between", "and"], explanation: "The dynamic shifting verb 'oscillate' connects its boundaries using 'between... and'." }
  ],
  errors: [
    { sentence: "The number of useless meetings have increased.", errorWord: "have", correction: "has", context: "Subject-Verb Agreement" },
    { sentence: "There was a dramatically drop in my patience.", errorWord: "dramatically", correction: "dramatic", context: "Word Form (Adj vs Adv)" },
    { sentence: "Avocados increased from 10 to 100.", errorWord: "Avocados", correction: "Consumption of avocados", context: "Logical Subject" },
    { sentence: "The amount of followers on my Instagram is sad.", errorWord: "amount", correction: "number", context: "Countable vs Uncountable" },
    { sentence: "My grades were downwarded rapidly in 2023.", errorWord: "downwarded", correction: "decreased", context: "Invented Word" },
    { sentence: "There was a steady fail in my attempts to diet.", errorWord: "fail", correction: "failure", context: "Word Form (Noun vs Verb)" },
    { sentence: "Less people voted in the election in 2020.", errorWord: "Less", correction: "Fewer", context: "Countable vs Uncountable" },
    { sentence: "It reached at a peak of 50%.", errorWord: "at", correction: "(remove word)", context: "Extra Preposition" },
    { sentence: "The chart is showing the demographics.", errorWord: "showing", correction: "shows", context: "Wrong Tense (Use Present Simple)" },
    { sentence: "The sales bounced backwards to their original level.", errorWord: "backwards", correction: "back", context: "Wrong Phrasal Verb" },
    { sentence: "The population fluctuated between 10 to 20 million.", errorWord: "to", correction: "and", context: "Collocation (Between... And)" },
    { sentence: "From 1990 and 2000, there was a steady rise.", errorWord: "and", correction: "to", context: "Collocation (From... To)" },
    { sentence: "The figure accounted to 20% of the total.", errorWord: "to", correction: "for", context: "Wrong Preposition" },
    { sentence: "There was a significantly rise in prices.", errorWord: "significantly", correction: "significant", context: "Word Form (Adj vs Adv)" },
    { sentence: "The graph compares how much percentages changed.", errorWord: "much", correction: "many", context: "Countable vs Uncountable" },
    { sentence: "The number of cars were incredibly high.", errorWord: "were", correction: "was", context: "Subject-Verb Agreement" },
    { sentence: "It peaked to 50% in the summer.", errorWord: "to", correction: "at", context: "Wrong Preposition" },
    { sentence: "There was an upwardly trend in temperature.", errorWord: "upwardly", correction: "upward", context: "Invented Word Form" }
  ],
  paraphrasing: [
    { context: "Internet Usage (2010-2020)", original: "The graph shows the daily hours millennials spent doomscrolling in the UK and US from 2010 to 2020.", synonyms: ["The line chart brutalises our attention spans by illustrating daily internet usage in the UK and USA over a decade.", "The visual highlights the tragic amount of hours wasted on social feeds by Millennials between 2010 and 2020."], chartType: 'line', chartData: { labels: ['2010','2020'], datasets: [{ label: 'UK', data: [2,7], borderColor: '#4f46e5' }, { label: 'US', data: [3,8], borderColor: '#ef4444' }] } },
    { context: "Coffee Consumption (2022)", original: "The bar chart compares the tons of overpriced artisanal coffee consumed in London, Paris, and Rome in 2022.", synonyms: ["The bar chart exposes the alarming intake of expensive caffeine across three major European capitals during 2022.", "The diagram illustrates the volume of premium coffee purchased by residents of London, Paris, and Rome in 2022."], chartType: 'bar', chartData: { labels: ['London','Paris', 'Rome'], datasets: [{ label: 'Tons', data: [500,450, 300], backgroundColor: ['#ef4444','#10b981', '#f59e0b'] }] } },
    { context: "Zoom Excuses (2021)", original: "The pie chart breaks down the primary reasons employees muted their microphones during Zoom calls in 2021.", synonyms: ["The chart categorizes the excuses remote workers used to avoid participating in virtual meetings throughout 2021.", "The pie chart delineates the main justifications for microphone muting in corporate video conferences in 2021."], chartType: 'doughnut', chartData: { labels: ['Eating','Yelling at kids','Watching TV', 'Actually working'], datasets: [{ data: [40, 30, 25, 5], backgroundColor: ['#f59e0b', '#f43f5e', '#8b5cf6', '#10b981'] }] } },
  ],
  // Bad Paraphrasing Analysis (Enhanced with original context and comparison critiques)
  badParaphrases: [
    { 
      original: "The line graph outlines the number of individuals purchasing electric vehicles globally between 2015 and 2025.",
      bad: "The graph shows the numbers of people who bought electric cars.", 
      reason: "Comparison Critique: The original prompt asks you to paraphrase a formal, precise title ('number of individuals purchasing electric vehicles'). By writing 'the numbers of people', you made a basic grammatical error ('numbers' must be singular 'the number'). Furthermore, copying 'shows' directly from the prompt and oversimplifying 'electric vehicles' to 'electric cars' limits your lexical resource score." 
    },
    { 
      original: "The pie chart details the proportion of male respondents who reported cooking as their primary hobby in 2022.",
      bad: "The pie chart displays the percent of men who enjoy cooking.", 
      reason: "Comparison Critique: The original prompt specifies 'proportion of male respondents'. Your paraphrase attempts to simplify this to 'the percent of men'. Grammatically, 'percent' cannot be used as a noun on its own like this (it must be 'percentage' or 'proportion'). You can only use 'percent' after a specific number (e.g., 40 percent). Also, 'enjoy cooking' is too informal for 'reported cooking as their primary hobby'." 
    },
    { 
      original: "The bar chart compares the total number of registered passenger vehicles in three European cities over a five-year period.",
      bad: "It is clearly seen from the graph provided that the amount of cars increased.", 
      reason: "Comparison Critique: The original topic focuses on countable nouns ('registered passenger vehicles'). You used 'amount of cars'. 'Amount' is reserved strictly for uncountable nouns; for vehicles, you MUST use 'number of cars'. Additionally, 'It is clearly seen from the graph provided that' is memorized introductory filler fluff that examiners penalize. Get straight to the analysis!" 
    },
    { 
      original: "The table presents demographic shifts and population growth percentages across six metropolitan areas in the year 2020.",
      bad: "The table explains how much populations changed in 2020.", 
      reason: "Comparison Critique: The original prompt describes academic 'demographic shifts and population growth percentages'. Writing 'how much populations changed' is extremely colloquial and lacks academic register. Additionally, a table doesn't 'explain' (which implies giving reasons for a phenomenon); it 'presents', 'illustrates', or 'details' data points." 
    },
    { 
      original: "The two maps show the layout of a woodland park in 2010 and its subsequent commercial development in 2020.",
      bad: "The map illustrates the building of a new supermarket and cutting down trees.", 
      reason: "Comparison Critique: The original prompt describes a high-level geographical transformation ('layout of a woodland park... and subsequent commercial development'). By writing 'building of a new supermarket and cutting down trees', you are writing detailed body paragraph descriptions, not a high-level overview. A proper introduction or overview must summarize the whole transformation (e.g., 'the conversion of a recreational park into a commercial zone')." 
    }
  ],
  paraphraseQuiz: [
    {
      prompt: "The table shows the amount of coffee consumed per person, measured in kilograms, in Italy, France, and Germany between 2010 and 2015.",
      options: [
        { text: "The table illustrates coffee consumption in Europe.", type: "bad" },
        { text: "The tabular data compares the per capita intake of coffee, measured in kilograms, across three European nations (Italy, France, and Germany) over a five-year period from 2010.", type: "good" },
        { text: "The table shows how much coffee people drank in Italy, France, and Germany in 2010 and 2015.", type: "bad" }
      ]
    },
    {
      prompt: "The diagram details the chronological process of manufacturing cement in an industrial facility.",
      options: [
        { text: "The diagram shows how cement is made in a factory.", type: "bad" },
        { text: "The flowchart outlines the sequential stages involved in the production of cement at an industrial plant.", type: "good" },
        { text: "The image illustrates the process of making cement.", type: "bad" }
      ]
    }
  ],
  // Expanded to exactly 15 highly realistic academic IELTS Writing Task 1 prompts
  paraphrasePractice: [
    { id: 1, text: "The graph below shows the proportion of the population aged 65 and over between 1940 and 2040 in three different countries: Japan, Sweden and the USA." },
    { id: 2, text: "The maps below show the centre of a small town called Islip as it is now, and plans for its development in the year 2025." },
    { id: 3, text: "The diagram below shows the recycling process of aluminium cans in a UK facility." },
    { id: 4, text: "The chart below shows the total number of minutes (in billions) of telephone calls in the UK, divided into three categories (local, national/international, and mobile), from 1995 to 2002." },
    { id: 5, text: "The table below gives information on consumer spending on three different items (food, clothing, and leisure) in five different European countries in 2002." },
    { id: 6, text: "The charts below show the average percentage of energy consumed by household appliances in Australia in 2005 and 2015." },
    { id: 7, text: "The bar chart illustrates the percentage of high school graduates who went on to attend university in four different countries from 1990 to 2010." },
    { id: 8, text: "The table below compares the daily consumption of water per capita in litres across ten international cities in the year 2018." },
    { id: 9, text: "The flow chart outlines the steps involved in the collection, sorting, and processing of recycled plastic containers for industrial reuse." },
    { id: 10, text: "The maps below show the layout of an international airport terminal as it appeared in 2012 and the structural extensions made by 2022." },
    { id: 11, text: "The line graph details the annual change in the prices of three basic foodstuffs (wheat, sugar, and beef) globally over a thirty-year period starting from 1990." },
    { id: 12, text: "The pie charts compare the employment distribution across agriculture, manufacturing, and service industries in South Korea in 1980 and 2020." },
    { id: 13, text: "The diagram illustrates how geothermal energy is extracted from the earth and converted into electricity at a power station." },
    { id: 14, text: "The table below gives information about the preferred modes of transport for commuters in five major Canadian cities in the year 2016." },
    { id: 15, text: "The maps illustrate the changes that took place in the coastal village of Ryemouth between 1995 and 2025." }
  ],
  deepDiveTopics: [
    { 
      id: 'line', title: 'Mastering Line Graphs', subtitle: 'Tracking the rollercoaster of data over time.', 
      content: 'Group your data by trends. Put all the "winners" (things going up) in one paragraph, and the "losers" (things going down or flatlining) in another. Do not write a boring list of years.', 
      guidingQuestion: "Look at the complex chart above. If you had to group these four lines into two logical body paragraphs, which ones would go together and why?",
      visual: { type: 'line', data: { labels: ['2015','2018','2021','2024'], datasets: [{ label: 'Coffee Prices ($)', data: [3, 4.5, 6, 8], borderColor: '#8b5cf6' }, { label: 'Rent ($100s)', data: [10, 15, 25, 40], borderColor: '#f59e0b' }, { label: 'My Salary ($10ks)', data: [5, 5.1, 5.1, 5.1], borderColor: '#ef4444' }, { label: 'Free Time (Hrs)', data: [20, 15, 10, 2], borderColor: '#10b981' }] } } 
    },
    { 
      id: 'bar', title: 'Beating Bar Charts', subtitle: 'Stacking up categories without sounding like a robot.', 
      content: 'Focus on the extremes. What is the tallest bar? What is the shortest? Are there any bars that are completely identical? Contrast the highest categories against the lowest. Group the data by size.', 
      guidingQuestion: "Identify the most striking comparison in this stacked bar chart. Write one complete complex sentence contrasting the highest and lowest data points.",
      visual: { type: 'bar', data: { labels: ['2020', '2021', '2022', '2023'], datasets: [{ label: 'Scrolling', data: [20, 25, 30, 35], backgroundColor: '#3b82f6' }, { label: 'Actual Work', data: [15, 12, 8, 2], backgroundColor: '#ef4444' }, { label: 'Snacking', data: [5, 10, 15, 20], backgroundColor: '#10b981' }, { label: 'Crying', data: [2, 5, 8, 12], backgroundColor: '#f59e0b' }] }, options: { scales: { x: { stacked: true }, y: { stacked: true } } } } 
    },
    { 
      id: 'pie', title: 'Conquering Pie Charts', subtitle: 'Slicing through the data (and finding the biggest piece).', 
      content: 'Pie charts are all about fractions and proportions. Use language like "a vast majority", "a tiny fraction", "exactly a quarter". If there are multiple pies over time, look at how the slices grow or shrink.', 
      guidingQuestion: "Compare these two pie charts. Write a sophisticated overview sentence summarizing the primary shift in budget allocation between Year 1 and Year 5.",
      visual: { type: 'pie', data: { labels: ['Taxes', 'Rent', 'Food', 'Fun', 'Savings'], datasets: [{ label: 'Year 1', data: [20, 30, 20, 20, 10], backgroundColor: ['#ef4444', '#3b82f6', '#10b981', '#cbd5e1', '#8b5cf6'] }, { label: 'Year 5', data: [35, 50, 10, 5, 0], backgroundColor: ['#ef4444', '#3b82f6', '#10b981', '#cbd5e1', '#8b5cf6'] }] } } 
    },
    { 
      id: 'table', title: 'Taming Tables', subtitle: 'Surviving the spreadsheet of doom.', 
      content: 'Tables have too much data. Period. Your job is to ignore 60% of it. Find the highest numbers, the lowest numbers, and the most obvious patterns across columns. Group similar rows together.', 
      guidingQuestion: "Scan this complex table. Which two rows share a similar inverse correlation, and which row is the complete outlier?",
      visual: { type: 'table', data: { headers: ['Generation', 'Tech Skill', 'Sarcasm', 'Savings ($)'], rows: [['Boomer', '2', '3', '85,000'], ['Gen X', '6', '7', '40,000'], ['Millennial', '9', '10', '42'], ['Gen Z', '10', '10', '-500']] } } 
    },
    { 
      id: 'process', title: 'Decoding Processes', subtitle: 'Step-by-step without losing your mind.', 
      content: 'A process diagram requires sequence and passivity. You MUST use the passive voice (e.g., "The clay is heated", not "They heat the clay"). Group the steps logically into two paragraphs (e.g., Preparation vs Manufacturing). Use rich linking words: Initially, subsequently, following this, culminating in.', 
      guidingQuestion: "Look at the brick manufacturing process above. Write one complex sentence using the passive voice that connects the 'Drying Oven' stage to the 'Kiln' stage.",
      visual: { type: 'process', data: { title: 'Brick Production', steps: [{ label: 'Drying Oven (48h)', icon: '♨️' }, { label: 'Kiln (1300°C)', icon: '🔥' }, { label: 'Cooling Chamber', icon: '❄️' }, { label: 'Packaging', icon: '📦' }] } } 
    },
    { 
      id: 'map', title: 'Mapping the Changes', subtitle: 'North, South, Demolished, Constructed.', 
      content: 'Maps are all about prepositions of place and vocabulary of change. Never just list what is there. Focus on what was *demolished*, *constructed*, *replaced*, or *expanded*. Use compass directions (to the north of, south-west of) or relative positioning (adjacent to, opposite).', 
      guidingQuestion: "Compare the two complex maps above. Describe the redevelopment of the 'Forest' and 'Old Farm' areas using appropriate verbs of transformation and prepositions of place.",
      // Center position bug completely resolved here by matching proper icon and coordinates
      visual: { type: 'map', data: { 
        title1: 'Town 1990', 
        features1: [
          { label: 'Forest', icon: '🌲', pos: 'top-2 right-2 sm:top-4 sm:right-4 border-emerald-400' }, 
          { label: 'Old Farm', icon: '🐄', pos: 'bottom-2 left-2 sm:bottom-4 sm:left-4 border-amber-400' }, 
          { label: 'Post Office', icon: '✉️', pos: 'top-2 left-2 sm:top-4 sm:left-4 border-slate-400' },
          { label: 'Wooden Bridge', icon: '🌉', pos: 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-amber-800' },
          { label: 'Dirt Road', icon: '🛤️', pos: 'bottom-2 right-2 sm:bottom-4 sm:right-4 border-amber-700' }
        ], 
        title2: 'Town 2024', 
        features2: [
          { label: 'University', icon: '🎓', pos: 'top-2 right-2 sm:top-4 sm:right-4 border-indigo-500' }, 
          { label: 'Luxury Apts', icon: '🏢', pos: 'bottom-2 left-2 sm:bottom-4 sm:left-4 border-rose-400' }, 
          { label: 'Shopping Mall', icon: '🏬', pos: 'top-2 left-2 sm:top-4 sm:left-4 border-indigo-400' },
          { label: 'Concrete Bridge', icon: '🌉', pos: 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-slate-500' },
          { label: 'Dual Carriageway', icon: '🛣️', pos: 'bottom-2 right-2 sm:bottom-4 sm:right-4 border-slate-800' }
        ] 
      } } 
    },
    { 
      id: 'multi', title: 'Multiple Charts', subtitle: 'Connecting the dots between chaos.', 
      content: 'When given two different charts (e.g., a pie chart and a line graph), DO NOT describe them in the same paragraph unless they share the exact same data points. Usually, you give Chart 1 its own paragraph, and Chart 2 its own paragraph. However, your *overview* must summarise the main features of *both*.', 
      guidingQuestion: "If you have a pie chart showing 'Reasons for quitting' and a line graph showing 'Employee age', what is the danger of combining their details in one sentence?",
      visual: { type: 'line', data: { labels: ['Jan','Feb','Mar','Apr'], datasets: [{ label: 'Stress Levels', data: [20, 50, 80, 100], borderColor: '#ef4444' }] } } 
    }
  ],
  // REAL IELTS ACADEMIC DIFFICULTY EXERCISES (2 of each type + 4 Multi)
  practiceTasks: [
    // --- LINE GRAPHS (2) ---
    { id: "line-001", type: "Line Graph", topic: "CO2 Emissions by Sector", description: "The line graph below shows the amount of carbon dioxide emissions produced by three different sectors in the UK between 2000 and 2020.", key_data: "Transport sector emissions increased steadily. Industrial emissions declined sharply. Residential emissions fluctuated but remained largely stable.", visuals: [{ type: 'line', data: { labels: ['2000', '2005', '2010', '2015', '2020'], datasets: [ { label: 'Transport (million tonnes)', data: [110, 125, 130, 140, 145], borderColor: '#ef4444', tension: 0.2 }, { label: 'Industry', data: [160, 130, 100, 80, 70], borderColor: '#3b82f6', tension: 0.2 }, { label: 'Residential', data: [80, 85, 75, 82, 80], borderColor: '#10b981', tension: 0.2 } ] } }] },
    { id: "line-002", type: "Line Graph", topic: "International Student Enrollments", description: "The graph illustrates the number of international students enrolled in universities across four English-speaking countries from 1990 to 2020.", key_data: "USA remained the highest throughout but plateaued after 2010. Australia and the UK saw exponential growth.", visuals: [{ type: 'line', data: { labels: ['1990', '2000', '2010', '2020'], datasets: [ { label: 'USA', data: [400, 500, 600, 620], borderColor: '#3b82f6', tension: 0.3 }, { label: 'UK', data: [150, 200, 300, 450], borderColor: '#ef4444', tension: 0.3 }, { label: 'Australia', data: [50, 100, 250, 400], borderColor: '#f59e0b', tension: 0.3 }, { label: 'Canada', data: [80, 120, 150, 200], borderColor: '#10b981', tension: 0.3 } ] } }] },
    // --- BAR CHARTS (2) ---
    { id: "bar-001", type: "Bar Chart", topic: "Primary Energy Consumption", description: "The bar chart compares primary energy consumption in the USA and China by fuel type in the year 2015.", key_data: "China consumed significantly more coal than the USA, whereas the USA relied more heavily on oil and nuclear power.", visuals: [{ type: 'bar', data: { labels: ['Coal', 'Oil', 'Natural Gas', 'Nuclear', 'Renewables'], datasets: [ { label: 'USA (Exajoules)', data: [15, 35, 25, 8, 5], backgroundColor: '#3b82f6' }, { label: 'China (Exajoules)', data: [80, 20, 5, 2, 8], backgroundColor: '#ef4444' } ] } }] },
    { id: "bar-002", type: "Bar Chart", topic: "Reasons for Adult Education", description: "The bar chart shows the reasons why adults of different age groups decide to return to education.", key_data: "Younger adults study primarily for career advancement, while those over 50 study primarily out of personal interest.", visuals: [{ type: 'bar', data: { labels: ['Under 26', '26-39', '40-49', 'Over 50'], datasets: [ { label: 'Career Development (%)', data: [80, 65, 40, 15], backgroundColor: '#8b5cf6' }, { label: 'Personal Interest (%)', data: [10, 20, 45, 75], backgroundColor: '#10b981' } ] } }] },
    // --- PIE CHARTS (2) ---
    { id: "pie-001", type: "Pie Chart", topic: "Global Water Usage", description: "The pie charts compare the proportion of water used for agricultural, industrial, and domestic purposes globally and in Europe.", key_data: "Globally, agriculture accounts for the vast majority (69%) of water use. Conversely, in Europe, industrial use dominates at 53%.", visuals: [{ type: 'doughnut', data: { labels: ['Agriculture', 'Industrial', 'Domestic'], datasets: [{ label: 'Global', data: [69, 23, 8], backgroundColor: ['#10b981', '#3b82f6', '#f59e0b'] }, { label: 'Europe', data: [32, 53, 15], backgroundColor: ['#10b981', '#3b82f6', '#f59e0b'] }] } }] },
    { id: "pie-002", type: "Pie Chart", topic: "Causes of Land Degradation", description: "The pie chart details the primary causes of agricultural land degradation worldwide in the 1990s.", key_data: "Over-grazing (35%) and deforestation (30%) were the primary culprits, together accounting for nearly two-thirds of total degradation.", visuals: [{ type: 'pie', data: { labels: ['Over-grazing', 'Deforestation', 'Over-cultivation', 'Other'], datasets: [{ data: [35, 30, 28, 7], backgroundColor: ['#ef4444', '#f59e0b', '#8b5cf6', '#94a3b8'] }] } }] },
    // --- TABLES (2) ---
    { id: "table-001", type: "Table", topic: "Consumer Spending in Europe", description: "The table shows the percentage of national consumer expenditure on three different categories in five European countries in 2002.", key_data: "Food/Tobacco was the highest expenditure across all nations, notably in Turkey (32%). Leisure/Education was consistently the lowest.", visuals: [{ type: 'table', data: { headers: ['Country', 'Food/Drinks/Tobacco', 'Clothing/Footwear', 'Leisure/Education'], rows: [['Ireland', '28.9%', '6.4%', '2.2%'], ['Italy', '16.3%', '9.0%', '3.2%'], ['Spain', '16.3%', '6.5%', '4.3%'], ['Sweden', '15.7%', '5.4%', '3.2%'], ['Turkey', '32.1%', '6.6%', '4.3%']] } }] },
    { id: "table-002", type: "Table", topic: "Underground Railway Systems", description: "The table provides data on the underground railway networks in six major global cities.", key_data: "London has the oldest and longest system (394km). However, Tokyo handles the highest volume of passengers annually (1927 million).", visuals: [{ type: 'table', data: { headers: ['City', 'Date Opened', 'Kilometres of Route', 'Passengers/Year (Millions)'], rows: [['London', '1863', '394', '775'], ['Paris', '1900', '199', '1191'], ['Tokyo', '1927', '155', '1927'], ['Washington DC', '1976', '126', '144'], ['Kyoto', '1981', '11', '45'], ['Los Angeles', '2001', '28', '50']] } }] },
    // --- PROCESS DIAGRAMS (2) ---
    { id: "process-001", type: "Process", topic: "Cement Manufacturing", description: "The diagram illustrates the process of manufacturing cement in an industrial facility.", key_data: "There are roughly 5 main stages, starting with crushing limestone/clay, mixing, heating in a rotating heater, grinding, and finally packaging.", visuals: [{ type: 'process', data: { title: "Cement Production Flow", steps: [{ label: 'Crusher', icon: ' 🏗️ ' }, { label: 'Mixer', icon: ' 🔄 ' }, { label: 'Rotating Heater', icon: ' 🔥 ' }, { label: 'Grinder', icon: ' ⚙️ ' }, { label: 'Packaging', icon: ' 📦 ' }] } }] },
    { id: "process-002", type: "Process", topic: "Hydroelectric Power Generation", description: "The diagram shows how electricity is generated in a hydroelectric power station.", key_data: "Water flows from a high reservoir through an intake valve, spins a turbine, which powers a generator, before electricity is sent via power lines.", visuals: [{ type: 'process', data: { title: "Hydroelectric Dam Operation", steps: [{ label: 'Reservoir', icon: ' 🌊 ' }, { label: 'Intake Valve', icon: ' 🎛️ ' }, { label: 'Turbine', icon: ' ⚙️ ' }, { label: 'Generator', icon: ' ⚡ ' }, { label: 'Power Lines', icon: ' 🗼 ' }] } }] },
    // --- MAPS & PLANS (2) ---
    { id: "map-001", type: "Map", topic: "Island Tourist Resort", description: "The two maps show a small island before and after the construction of tourist facilities.", key_data: "A previously undeveloped island saw the construction of a hotel, restaurant, and pier. Trees were retained, but a beach area was developed for swimming.", visuals: [{ type: 'map', data: { title1: 'Before Development', features1: [{ label: 'Beach', icon: ' 🏖️ ', pos: 'bottom-2 left-2 sm:bottom-4 sm:left-4 border-amber-200' }, { label: 'Trees', icon: ' 🌴 ', pos: 'top-2 right-2 sm:top-4 sm:right-4 border-emerald-400' }], title2: 'After Development', features2: [{ label: 'Hotel', icon: ' 🏨 ', pos: 'bottom-2 left-2 sm:bottom-4 sm:left-4 border-rose-400' }, { label: 'Restaurant', icon: ' 🍽️ ', pos: 'top-2 right-2 sm:top-4 sm:right-4 border-indigo-400' }, { label: 'Pier', icon: ' ⛵ ', pos: 'bottom-2 right-2 sm:bottom-4 sm:right-4 border-slate-400' }] } }] },
    { id: "map-002", type: "Map", topic: "Hospital Parking Redevelopment", description: "The maps illustrate changes to the road access and parking facilities around a city hospital from 2007 to 2010.", key_data: "The staff car park and public parking were separated. Two new roundabouts and a new bus station were constructed to improve traffic flow.", visuals: [{ type: 'map', data: { title1: 'Hospital 2007', features1: [{ label: 'Mixed Parking', icon: ' 🚗 ', pos: 'bottom-2 left-2 sm:bottom-4 sm:left-4 border-slate-400' }, { label: 'Bus Stops', icon: ' 🚏 ', pos: 'top-2 right-2 sm:top-4 sm:right-4 border-amber-400' }], title2: 'Hospital 2010', features2: [{ label: 'Staff Parking', icon: ' 🅿️ ', pos: 'bottom-2 left-2 sm:bottom-4 sm:left-4 border-rose-400' }, { label: 'Public Parking', icon: ' 🚗 ', pos: 'top-2 right-2 sm:top-4 sm:right-4 border-indigo-400' }, { label: 'Roundabouts', icon: ' 🔄 ', pos: 'bottom-2 right-2 sm:bottom-4 sm:right-4 border-emerald-400' }] } }] },
    // --- MULTIPLE CHARTS (4) ---
    { id: "multi-001", type: "Multiple", topic: "Transport & Commuting", description: "The line graph shows car ownership in the UK from 1971 to 2007, while the bar chart compares the main methods of commuting to work in 2007.", key_data: "Car ownership grew steadily, with households owning 2 or more cars rising sharply. Consequently, in 2007, the car was the dominant commuting method.", visuals: [
        { type: 'line', data: { labels: ['1971', '1981', '1991', '2001', '2007'], datasets: [ { label: 'No car', data: [45, 38, 32, 28, 25], borderColor: '#94a3b8', tension: 0.2 }, { label: 'One car', data: [42, 45, 43, 44, 43], borderColor: '#3b82f6', tension: 0.2 }, { label: 'Two or more cars', data: [13, 17, 25, 28, 32], borderColor: '#ef4444', tension: 0.2 } ] } },
        { type: 'bar', data: { labels: ['Car', 'Walking', 'Bicycle', 'Bus', 'Train'], datasets: [ { label: 'Commuting Methods 2007 (Millions)', data: [15, 4, 1.5, 3, 2.5], backgroundColor: '#10b981' } ] } }
      ] 
    },
    { id: "multi-002", type: "Multiple", topic: "University Education Budgets", description: "The pie chart shows the funding sources for a UK university in 2015, while the table outlines its total expenditures.", key_data: "Government grants formed the bulk of income (60%). In terms of expenditure, staff salaries accounted for the majority of the budget.", visuals: [
        { type: 'pie', data: { labels: ['Govt Grants', 'Tuition Fees', 'Endowments', 'Other'], datasets: [{ data: [60, 25, 10, 5], backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#94a3b8'] }] } },
        { type: 'table', data: { headers: ['Expenditure Category', 'Percentage of Total'], rows: [['Teaching Staff Salaries', '55%'], ['Admin/Support Staff', '20%'], ['Campus Maintenance', '15%'], ['Library & Resources', '10%']] } }
      ] 
    },
    { id: "multi-003", type: "Multiple", topic: "Climate Change Impacts", description: "The line graph illustrates global average temperature rise since 1980, while the bar chart shows the corresponding reduction in Arctic sea ice.", key_data: "As global temperatures experienced a sharp upward trajectory, the extent of Arctic sea ice saw a consistent and inversely proportional decline.", visuals: [
        { type: 'line', data: { labels: ['1980', '1990', '2000', '2010', '2020'], datasets: [ { label: 'Temp Anomaly (°C)', data: [0.2, 0.4, 0.6, 0.8, 1.1], borderColor: '#ef4444', tension: 0.3 } ] } },
        { type: 'bar', data: { labels: ['1980', '1990', '2000', '2010', '2020'], datasets: [ { label: 'Sea Ice Area (M sq km)', data: [7.5, 6.8, 6.1, 5.0, 4.2], backgroundColor: '#0ea5e9' } ] } }
      ] 
    },
    { id: "multi-004", type: "Multiple", topic: "National Demographics", description: "The line graph shows overall population growth of a developing nation from 1950 to 2020, while the pie chart breaks down its age demographics in 2020.", key_data: "The population surged from 20 to 80 million. By 2020, the demographic was remarkably young, with 60% of citizens under the age of 30.", visuals: [
        { type: 'line', data: { labels: ['1950', '1970', '1990', '2010', '2020'], datasets: [ { label: 'Population (Millions)', data: [20, 35, 55, 75, 80], borderColor: '#8b5cf6', tension: 0.2 } ] } },
        { type: 'pie', data: { labels: ['0-14 Years', '15-29 Years', '30-59 Years', '60+ Years'], datasets: [{ data: [35, 25, 30, 10], backgroundColor: ['#ec4899', '#f43f5e', '#3b82f6', '#64748b'] }] } }
      ] 
    }
  ]
};

// ============================================================================
// 3. BACKEND CONNECTOR
// ============================================================================
const callEvaluatorAPI = async (type, payload) => {
  try {
    const response = await fetch('/api/ielts-evaluator', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, payload })
    });
    if (!response.ok) throw new Error('API Request Failed');
    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error("Backend connector error:", error);
    return "System Error: The AI Examiner is currently offline. Please ensure your netlify.toml proxy redirects are active.";
  }
};

// ============================================================================
// 4. MAIN REACT COMPONENT
// ============================================================================

export default function App() {
  const [activeTab, setActiveTab] = useState('basics');

  // --- Trends Vocabulary Matrix State ---
  const [vocabViewMode, setVocabViewMode] = useState('grid');
  const [flippedCards, setFlippedCards] = useState({});

  const toggleFlip = (idx) => {
    setFlippedCards(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  // --- Paraphrase State ---
  const [revealedChips, setRevealedChips] = useState({});
  const [revealedBadParaphrases, setRevealedBadParaphrases] = useState({});
  
  // Paraphrase Quiz State
  const [activeQuizQuestion, setActiveQuizQuestion] = useState(0);
  const [selectedQuizOption, setSelectedQuizOption] = useState(null);
  const [quizFeedback, setQuizFeedback] = useState(null);
  const [isEvaluatingQuiz, setIsEvaluatingQuiz] = useState(false);

  // Full Paraphrase Practice State
  const [practicePromptIndex, setPracticePromptIndex] = useState(0);
  const [practiceParaphraseInput, setPracticeParaphraseInput] = useState('');
  const [practiceFeedback, setPracticeFeedback] = useState(null);
  const [isEvaluatingPractice, setIsEvaluatingPractice] = useState(false);

  const toggleChip = (qIdx, sIdx) => {
    setRevealedChips(prev => ({ ...prev, [`${qIdx}-${sIdx}`]: !prev[`${qIdx}-${sIdx}`] }));
  };

  const toggleBadParaphrase = (idx) => {
    setRevealedBadParaphrases(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleQuizSubmit = async () => {
    if (selectedQuizOption === null) return;
    setIsEvaluatingQuiz(true);
    setQuizFeedback(null);
    const q = dataHub.paraphraseQuiz[activeQuizQuestion];
    const option = q.options[selectedQuizOption];
    
    const result = await callEvaluatorAPI('quiz', { prompt: q.prompt, optionText: option.text });
    setQuizFeedback(result);
    setIsEvaluatingQuiz(false);
  };

  const nextQuizQuestion = () => {
      setSelectedQuizOption(null);
      setQuizFeedback(null);
      setActiveQuizQuestion((prev) => (prev + 1) % dataHub.paraphraseQuiz.length);
  };

  const handlePracticeSubmit = async () => {
    if (!practiceParaphraseInput.trim()) return;
    setIsEvaluatingPractice(true);
    setPracticeFeedback(null);
    
    const originalPromptStrict = dataHub.paraphrasePractice[practicePromptIndex].text + " [AI INSTRUCTION: Give extremely strict, detailed feedback focusing specifically on any missing dates, categories, subjects, or metrics. Penalize omissions heavily and be ruthless but helpful in explaining exactly what data points were left out.]";
    
    const result = await callEvaluatorAPI('paraphrase', {
      paraphrase: practiceParaphraseInput,
      original: originalPromptStrict
    });
    setPracticeFeedback(result);
    setIsEvaluatingPractice(false);
  };

  // --- Trends Quiz State ---
  const [trendQuizAnswers, setTrendQuizAnswers] = useState({});
  const [trendQuizScore, setTrendQuizScore] = useState(null);

  const handleTrendQuizSelect = (qIdx, option) => {
    setTrendQuizAnswers(prev => ({ ...prev, [qIdx]: option }));
    setTrendQuizScore(null);
  };

  const checkTrendQuiz = () => {
    let score = 0;
    dataHub.trendQuiz.forEach((q, i) => {
      if (trendQuizAnswers[i] === q.answer) score++;
    });
    setTrendQuizScore(score);
  };

  // --- Preposition State ---
  const [prepInputs, setPrepInputs] = useState({});
  const [prepChecked, setPrepChecked] = useState(false);
  const handlePrepChange = (qIdx, aIdx, val) => {
    setPrepInputs(prev => ({ ...prev, [`${qIdx}-${aIdx}`]: val }));
    setPrepChecked(false);
  };

  // --- Error Correction State ---
  const [errorStatus, setErrorStatus] = useState({});
  const handleErrorClick = (qIdx, isError, word) => {
    setErrorStatus(prev => ({ ...prev, [`${qIdx}-${word}`]: isError ? 'correct' : 'wrong' }));
  };

  // --- Deep Dive State ---
  const [selectedStudyType, setSelectedStudyType] = useState(null);
  const [deepDiveAnswer, setDeepDiveAnswer] = useState('');
  const [deepDiveFeedback, setDeepDiveFeedback] = useState(null);
  const [isEvaluatingDeepDive, setIsEvaluatingDeepDive] = useState(false);

  const handleDeepDiveSubmit = async () => {
      setIsEvaluatingDeepDive(true);
      setDeepDiveFeedback(null);
      const result = await callEvaluatorAPI('deepdive', { question: selectedStudyType.guidingQuestion, answer: deepDiveAnswer });
      setDeepDiveFeedback(result);
      setIsEvaluatingDeepDive(false);
  };

  // --- Exam Simulator State ---
  const [selectedTaskIndex, setSelectedTaskIndex] = useState(0);
  const [essay, setEssay] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const activeTask = dataHub.practiceTasks[selectedTaskIndex];

  useEffect(() => {
    const savedDraft = localStorage.getItem(`ielts_draft_${activeTask.id}`);
    if (savedDraft) { setEssay(savedDraft); updateWordCount(savedDraft); } 
    else { setEssay(''); setWordCount(0); }
    setFeedback(null);
  }, [selectedTaskIndex]);

  const updateWordCount = (text) => {
    const words = text.trim().split(/\s+/).filter(w => w.length > 0);
    setWordCount(text.trim() === '' ? 0 : words.length);
  };
  const handleTextChange = (e) => { setEssay(e.target.value); updateWordCount(e.target.value); setSaveStatus(''); };
  const handleSaveProgress = () => { localStorage.setItem(`ielts_draft_${activeTask.id}`, essay); setSaveStatus('Saved!'); setTimeout(() => setSaveStatus(''), 3000); };
  
  const handleSubmit = async () => {
    setIsEvaluating(true); setFeedback(null);
    const result = await callEvaluatorAPI('essay', {
      essay,
      promptDetails: `${activeTask.type}: ${activeTask.topic}. Prompt: ${activeTask.description}. Target Key Data: ${activeTask.key_data}`
    });
    setFeedback(result); setIsEvaluating(false);
  };

  const handleCopyFeedback = () => {
    const contentToCopy = `================================\n` +
      `IELTS TASK 1 PROMPT:\n` +
      `${activeTask.topic}\n` +
      `================================\n\n` +
      `--- MY ESSAY ---\n` +
      `${essay}\n\n` +
      `--- AI EXAMINER FEEDBACK ---\n` +
      `${feedback}`;

    const textArea = document.createElement("textarea");
    textArea.value = contentToCopy;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000);
    } catch (err) {
      console.error('Copy failed', err);
    }
    document.body.removeChild(textArea);
  };

  return (
    <div className="bg-slate-900 app-bg pb-20 min-h-screen">
      
      {/* Header Section */}
      <header className="pt-12 pb-10 px-4 text-center animate-fade-in drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-lora font-bold text-white tracking-tight mb-3">IELTS Writing Task 1 Masterclass</h1>
        <p className="text-lg md:text-xl font-medium text-slate-100 max-w-2xl mx-auto italic mb-6">Because a picture is worth 150 words (and your sanity).</p>
        
        {/* Sarcastic Disclaimer Styled with Early macOS Liquid Glass accents */}
        <div className="max-w-4xl mx-auto rounded-[2.5rem] p-8 md:p-10 mb-8 border border-white/80 shadow-2xl relative overflow-hidden"
             style={{
               background: 'linear-gradient(135deg, rgba(240, 248, 255, 0.85) 0%, rgba(200, 225, 255, 0.7) 50%, rgba(160, 215, 255, 0.9) 100%)',
               boxShadow: '0 20px 45px rgba(0, 80, 200, 0.15), inset 0 4px 12px rgba(255,255,255,0.95), inset 0 -6px 12px rgba(40,140,255,0.4)',
               backdropFilter: 'blur(16px)'
             }}>
          {/* Top Glossy reflection highlight */}
          <div className="absolute top-0 left-[2.5%] w-[95%] h-[40%] pointer-events-none rounded-b-[150px]"
               style={{
                 background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.05) 100%)'
               }}></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-8">
            <div className="p-4 bg-indigo-600/90 rounded-3xl text-white shadow-lg border border-indigo-400 shrink-0 transform -rotate-3">
              <Zap className="w-10 h-10 text-amber-300 drop-shadow-sm" fill="currentColor" />
            </div>
            <div className="text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-600/90 text-white text-[10px] font-black uppercase rounded-full tracking-widest shadow-sm mb-3 border border-indigo-400">
                ⚠️ OFFICIAL ACADEMIC PLATFORM DISCLAIMER
              </div>
              <p className="text-slate-800 text-[15px] md:text-lg leading-relaxed font-semibold">
                Welcome to the only platform on the internet dedicated to teaching you how to stare at a <span className="text-indigo-800 font-extrabold underline decoration-indigo-400">profoundly meaningless chart</span> of 1994 cheese consumption and successfully <span className="text-pink-700 font-extrabold">hallucinate 150 highly academic words</span> about it. Our AI examiner is here to <span className="text-rose-700 font-extrabold">brutally judge</span> your grammar, mock your repetitive vocabulary, and ultimately transform you from a confused robot listing numbers into a sophisticated data analyst. Grab a coffee, suppress your existential dread, and let's conquer this test!
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl border border-white/60">
          
          {/* Navigation Tabs */}
          <nav className="bg-white/60 border-b border-gray-200 flex overflow-x-auto no-scrollbar relative z-20">
            {[
              { id: 'basics', label: 'Newcomer Guide' },
              { id: 'structure', label: 'Structure' },
              { id: 'change', label: 'Trends' },
              { id: 'paraphrase', label: 'Paraphrasing' },
              { id: 'prepositions', label: 'Prepositions' },
              { id: 'errors', label: 'Errors' },
              { id: 'deepdive', label: 'Deep Dive Study' },
              { id: 'simulator', label: 'Exam Simulator' }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setSelectedStudyType(null); }}
                className={`flex-shrink-0 px-6 py-4 text-[15px] font-bold transition-all border-b-4 whitespace-nowrap ${
                  activeTab === tab.id 
                  ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50' 
                  : 'border-transparent text-slate-500 hover:text-indigo-600 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Content Area */}
          <div className="p-6 md:p-10 relative z-10">
            
            {/* TAB 0: NEWCOMER GUIDE */}
            {activeTab === 'basics' && (
              <section className="space-y-10 animate-fade-in">
                <div>
                  <h2 className="text-3xl font-lora font-bold text-indigo-900 mb-4 flex items-center">
                    <Zap className="mr-3 text-amber-500" fill="currentColor" /> Welcome to the Chaos
                  </h2>
                  <p className="text-slate-700 text-lg leading-relaxed">
                    If you are new to IELTS Writing Task 1, congratulations. You are about to spend 20 minutes describing data that literally no one cares about. Here is a guide to the six types of visuals you will encounter and their real-life academic purposes.
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  {dataHub.newcomerGuide.map((item, idx) => (
                    <LiquidCard key={idx} className={item.type === 'Process Diagram' || item.type === 'Map / Plan' ? 'md:col-span-2' : ''}>
                      <div className="flex items-center mb-4 pb-4 border-b border-white/50">
                        <div className="p-3 bg-white/60 backdrop-blur-sm rounded-xl mr-4 shadow-sm border border-white/70">
                          {item.icon}
                        </div>
                        <div>
                          <h3 className="font-extrabold text-slate-800 text-lg drop-shadow-sm">{item.type}</h3>
                          <p className="text-xs text-slate-600 font-semibold italic mt-0.5">{item.title}</p>
                        </div>
                      </div>
                      
                      <div className="bg-white/50 backdrop-blur-md p-3 rounded-2xl mb-5 border border-white/60 shadow-inner flex-shrink-0 w-full overflow-hidden">
                        <VisualRenderer visual={item.visual} height="130px" options={{ animation: false }} />
                      </div>
                      <div className="flex flex-col flex-grow mt-auto space-y-4">
                         <div className="bg-white/40 backdrop-blur-sm p-3 rounded-xl border border-white/60 shadow-sm">
                           <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1 flex items-center drop-shadow-sm">
                              <BookOpen className="w-4 h-4 mr-1" /> Real-Life Purpose
                           </h4>
                           <p className="text-slate-800 font-medium leading-relaxed text-sm">
                             {item.purpose}
                           </p>
                         </div>
                         <div className="bg-white/40 backdrop-blur-sm p-3 rounded-xl border border-white/60 shadow-sm">
                           <h4 className="text-xs font-bold text-indigo-700 uppercase tracking-wider mb-1 flex items-center drop-shadow-sm">
                              <Lightbulb className="w-4 h-4 mr-1" /> The Real Advice
                           </h4>
                           <p className="text-slate-800 font-medium leading-relaxed text-sm">
                             {item.advice}
                           </p>
                         </div>
                      </div>
                    </LiquidCard>
                  ))}
                </div>
              </section>
            )}

            {/* TAB 1: STRUCTURE - Fixed top bar alignment issue visually */}
            {activeTab === 'structure' && (
              <section className="space-y-10 animate-fade-in">
                <div>
                  <h2 className="text-3xl font-lora font-bold text-indigo-900 mb-4">The 3-Step Survival Structure</h2>
                  <p className="text-slate-700 text-lg leading-relaxed">
                    Deviating from this structure is a fantastic way to secure a Band 5. Memorize this format. Let's apply it to a highly relevant academic topic: <strong className="text-indigo-600">"Average daily hours spent WFH (Working From Home)"</strong>.
                  </p>
                </div>
                <LiquidCard className="mb-8 p-6 md:p-8">
                  <div className="bg-white/50 backdrop-blur-md rounded-2xl p-4 border border-white/60 shadow-inner">
                    <ChartCanvas type={dataHub.structureGuide.chart.type} data={dataHub.structureGuide.chart.data} height="200px" options={{ indexAxis: 'y', plugins: { legend: { display: false } } }} />
                  </div>
                </LiquidCard>
                
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Clean structure cards using destructured parameters to avoid leak issues */}
                  <LiquidCard topBarColor="bg-indigo-500" className="pt-12">
                    <h3 className="font-bold text-indigo-900 text-xl mb-3 flex items-center drop-shadow-sm mt-2">
                      <span className="bg-indigo-100/80 border border-indigo-200 text-indigo-800 w-8 h-8 rounded-full flex items-center justify-center mr-2 text-sm shadow-sm">1</span> 
                      Introduction
                    </h3>
                    <p className="text-slate-700 font-medium text-sm mb-4">Paraphrase the prompt. State what the chart shows without spilling the data.</p>
                    <div className="bg-indigo-50/70 p-4 rounded-xl border border-indigo-100 font-lora text-indigo-900 italic text-sm shadow-inner backdrop-blur-sm">
                      "The bar chart brutally exposes how remote workers allocate their time across four daily activities."
                    </div>
                  </LiquidCard>
                  
                  <LiquidCard topBarColor="bg-emerald-500" className="pt-12 relative transform md:-translate-y-4">
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-emerald-500 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider shadow-md z-30 border border-white/40">Crucial</div>
                    <h3 className="font-bold text-emerald-900 text-xl mb-3 flex items-center drop-shadow-sm mt-2">
                      <span className="bg-emerald-100/80 border border-emerald-200 text-emerald-800 w-8 h-8 rounded-full flex items-center justify-center mr-2 text-sm shadow-sm">2</span> 
                      Overview
                    </h3>
                    <p className="text-slate-700 font-medium text-sm mb-4">Summarise the main trends. No numbers allowed here. If you miss this, you fail Task Achievement.</p>
                    <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-100 font-lora text-emerald-900 italic text-sm shadow-inner backdrop-blur-sm">
                      "Overall, scrolling social media and staring blankly heavily dominate the day, while actual productive work is the least prevalent activity."
                    </div>
                  </LiquidCard>
                  
                  <LiquidCard topBarColor="bg-amber-500" className="pt-12">
                    <h3 className="font-bold text-amber-900 text-xl mb-3 flex items-center drop-shadow-sm mt-2">
                      <span className="bg-amber-100/80 border border-amber-200 text-amber-900 w-8 h-8 rounded-full flex items-center justify-center mr-2 text-sm shadow-sm">3</span> 
                      Details
                    </h3>
                    <p className="text-slate-700 font-medium text-sm mb-4">Group similar data logically. Provide the actual numbers to prove your overview isn't a lie.</p>
                    <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200 font-lora text-amber-900 italic text-sm shadow-inner backdrop-blur-sm space-y-2">
                      <p>"Specifically, scrolling consumes a staggering 4.5 hours, which is exactly triple the time spent actually working (1.5 hours)."</p>
                      <p className="font-bold text-amber-800 drop-shadow-sm">"Furthermore, staring blankly at the screen accounts for a solid 3 hours, completely overshadowing the time dedicated to snacking."</p>
                      <p className="font-bold text-amber-900 border-t border-amber-200/50 pt-2 mt-2 drop-shadow-sm">"In stark contrast, actual productive work ranks the lowest, plateauing at a mere 1.5 hours daily."</p>
                    </div>
                  </LiquidCard>
                </div>
              </section>
            )}

            {/* TAB 2: TRENDS & QUIZ */}
            {activeTab === 'change' && (
              <section className="space-y-10 animate-fade-in">
                <div>
                  <h2 className="text-3xl font-lora font-bold text-indigo-900 mb-4">Describing Trends & Chaos</h2>
                  <p className="text-slate-700 text-lg leading-relaxed">
                    If you use the word "increase" four times in one paragraph, the examiner will cry. Use these advanced phrases to describe the trajectory of your data.
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {dataHub.languageOfChange.map((item, idx) => (
                    <LiquidCard key={idx}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className={`font-bold ${item.colors.text} text-2xl flex items-center drop-shadow-sm`}>
                          <span className="mr-3 text-3xl">{item.icon}</span> {item.title}
                        </h3>
                      </div>
                      
                      <div className="bg-white/50 backdrop-blur-md p-3 rounded-2xl mb-5 border border-white/60 shadow-inner flex-shrink-0 w-full overflow-hidden">
                        <ChartCanvas type={item.chartType} data={item.chartData} height="120px" options={{ plugins: { legend: { display: false } }, animation: false }} />
                      </div>
                      
                      <p className={`font-bold ${item.colors.text} mb-4 text-base flex-grow tracking-wide drop-shadow-sm`}>{item.words}</p>
                      <div className="bg-white/40 backdrop-blur-sm p-4 rounded-xl border border-white/50 shadow-sm relative">
                         <div className="absolute top-0 left-4 transform -translate-y-1/2 bg-white/80 backdrop-blur-md border border-white/60 px-3 py-0.5 rounded shadow-sm text-xs font-bold text-slate-500 uppercase tracking-widest">In the Wild</div>
                         <p className="text-slate-800 font-lora italic text-sm mt-1">{item.example}</p>
                      </div>
                    </LiquidCard>
                  ))}
                </div>
                <div className="pt-8 border-t border-slate-300/50">
                   <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                      <Activity className="mr-2 text-indigo-600" /> The 15 Sentences of Chaos (Mini-Drill)
                   </h3>
                   <p className="text-slate-700 mb-8">Study these highly realistic sentences to master the vocabulary of despair and triumph.</p>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
                      {dataHub.trendSentences.map((sentence, sIdx) => (
                         <LiquidCard key={sIdx} className="!p-4 flex-row items-center space-x-4">
                            <div className="w-16 h-10 flex-shrink-0 bg-white/60 backdrop-blur-sm rounded-xl border border-white/80 shadow-inner p-1">
                               <ChartCanvas 
                                type="line" 
                                data={{ labels: ['1','2','3','4'], datasets: [{ data: sentence.data, borderColor: '#6366f1', tension: 0.3 }] }} 
                                height="100%" 
                                options={{ plugins: { legend: { display: false }, tooltip: { enabled: false } }, scales: { x: { display: false }, y: { display: false } }, animation: false }} 
                               />
                            </div>
                            <p className="text-sm font-semibold text-slate-800 leading-snug">{sentence.text}</p>
                         </LiquidCard>
                      ))}
                   </div>
                   
                   {/* Vocabulary Presentation Matrix */}
                   <div className="pt-8 border-t border-slate-300/50">
                      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                        <h3 className="text-2xl font-bold text-slate-800 flex items-center">
                           <BookOpen className="mr-2 text-indigo-600" /> Vocabulary Matrix Research
                        </h3>
                        <div className="flex gap-2 relative z-20">
                          <button onClick={() => setVocabViewMode('grid')} className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors border border-white/50 shadow-sm ${vocabViewMode === 'grid' ? 'bg-indigo-600 text-white border-transparent' : 'bg-white/60 backdrop-blur-md text-slate-700 hover:bg-white/80'}`}>Grid View</button>
                          <button onClick={() => setVocabViewMode('board')} className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors border border-white/50 shadow-sm ${vocabViewMode === 'board' ? 'bg-indigo-600 text-white border-transparent' : 'bg-white/60 backdrop-blur-md text-slate-700 hover:bg-white/80'}`}>Semantic Board</button>
                        </div>
                      </div>
                      
                      {vocabViewMode === 'grid' ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-12">
                          {dataHub.trendVocab.map((vocab, idx) => {
                            const isFlipped = flippedCards[idx];
                            return (
                              <div key={idx} className="relative w-full h-48 cursor-pointer z-10" style={{ perspective: '1000px' }} onClick={() => toggleFlip(idx)}>
                                <div className="w-full h-full relative duration-500" style={{ transformStyle: 'preserve-3d', transition: 'transform 0.6s', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
                                  {/* Front */}
                                  <div className="absolute w-full h-full rounded-2xl p-4 flex flex-col items-center justify-center overflow-hidden" 
                                       style={{ 
                                         backfaceVisibility: 'hidden',
                                         background: 'linear-gradient(180deg, rgba(230, 245, 255, 0.8) 0%, rgba(150, 210, 255, 0.9) 100%)',
                                         boxShadow: 'inset 0 4px 10px rgba(255, 255, 255, 0.9), inset 0 -4px 10px rgba(50, 150, 255, 0.5), 0 4px 10px rgba(0,0,0,0.1)',
                                         border: '1px solid rgba(255,255,255,0.7)'
                                       }}>
                                    <div className="absolute top-0 left-[5%] w-[90%] h-[45%] pointer-events-none rounded-b-[50px] z-0"
                                         style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.05) 100%)' }}></div>
                                    <div className="relative z-10 flex flex-col items-center">
                                       <div className="absolute -top-3 right-0 text-[10px] font-bold text-indigo-600 bg-white/70 backdrop-blur-md px-2 py-0.5 rounded shadow-sm border border-white/50">{vocab.type}</div>
                                       <h3 className="text-xl font-black text-slate-800 mb-1 text-center leading-tight drop-shadow-sm">{vocab.word}</h3>
                                       <span className="text-3xl mt-1 mb-2 drop-shadow-sm">{vocab.icon}</span>
                                       <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center"><Repeat className="w-3 h-3 mr-1"/> Flip</p>
                                    </div>
                                  </div>
                                  {/* Back */}
                                  <div className="absolute w-full h-full bg-indigo-600 rounded-2xl shadow-lg p-4 flex flex-col items-center justify-center text-center border border-indigo-400" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                                    <p className="text-white font-medium text-xs mb-2 leading-snug">"{vocab.def}"</p>
                                    <p className="text-indigo-200 italic text-[10px] mb-3 border-b border-indigo-500 pb-2 leading-tight">Ex: {vocab.example}</p>
                                    <div className="bg-indigo-800/50 px-2 py-1.5 rounded w-full border border-indigo-500/50">
                                      <p className="text-[9px] text-indigo-300 uppercase tracking-wider mb-0.5">Collocates with:</p>
                                      <p className="text-[11px] font-bold text-white leading-tight">{vocab.cols}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      ) : (
                        <LiquidCard className="mb-12">
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
                             {/* Semantic Web Groupings */}
                             {['Upward', 'Downward', 'Extremes', 'Stability', 'Volatility', 'Adjectives', 'Adverbs'].map(type => {
                               const words = dataHub.trendVocab.filter(v => v.type === type);
                               if (words.length === 0) return null;
                               
                               let colors = '';
                               if (type === 'Upward') colors = 'border-emerald-500 text-emerald-700 bg-emerald-50';
                               else if (type === 'Downward') colors = 'border-rose-500 text-rose-700 bg-rose-50';
                               else if (type === 'Extremes') colors = 'border-purple-500 text-purple-700 bg-purple-50';
                               else if (type === 'Stability') colors = 'border-slate-400 text-slate-700 bg-slate-100';
                               else if (type === 'Volatility') colors = 'border-amber-500 text-amber-700 bg-amber-50';
                               else if (type === 'Adjectives') colors = 'border-sky-500 text-sky-700 bg-sky-50';
                               else colors = 'border-fuchsia-500 text-fuchsia-700 bg-fuchsia-50';
                               
                               return (
                                 <div key={type} className={`bg-white/40 backdrop-blur-md p-6 rounded-2xl border border-white/60 shadow-sm relative`}>
                                   <div className={`absolute -top-4 left-1/2 transform -translate-x-1/2 border-2 px-6 py-1.5 rounded-full font-black uppercase tracking-widest text-sm ${colors} bg-white whitespace-nowrap shadow-sm`}>
                                     {type}
                                   </div>
                                   <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                                     {words.map((w, i) => (
                                       <div key={i} className="border border-white/70 rounded-xl p-3 flex flex-col justify-center items-center text-center bg-white/50 backdrop-blur-sm hover:bg-white hover:border-indigo-300 hover:shadow-md transition-all cursor-default group shadow-sm">
                                         <span className="font-bold text-slate-800 text-sm leading-tight mb-1">{w.word}</span>
                                         <span className="text-2xl drop-shadow-sm">{w.icon}</span>
                                         <span className="text-[10px] text-slate-600 mt-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap overflow-hidden text-ellipsis max-w-full font-medium">
                                           e.g., {w.cols.split(',')[0]}
                                         </span>
                                       </div>
                                     ))}
                                   </div>
                                 </div>
                               )
                             })}
                           </div>
                        </LiquidCard>
                      )}
                   </div>
                   {/* Trends Vocabulary Quiz */}
                   <LiquidCard className="mt-8">
                     <h3 className="text-2xl font-bold text-indigo-900 mb-4 flex items-center drop-shadow-sm">
                       <TrendingUp className="mr-3 text-indigo-600" /> Trend Vocabulary Quiz
                     </h3>
                     <p className="text-slate-700 mb-8 font-medium">Test your knowledge of the trend vocabulary taught above. Choose the correct verb for each definition.</p>
                     
                     <div className="space-y-6 relative z-20">
                       {dataHub.trendQuiz.map((quiz, qIdx) => (
                         <div key={qIdx} className="bg-white/40 backdrop-blur-md p-5 rounded-2xl border border-white/60 shadow-sm">
                           <p className="font-bold text-slate-800 mb-3 drop-shadow-sm">{qIdx + 1}. {quiz.q}</p>
                           <div className="flex flex-wrap gap-3">
                             {quiz.options.map((opt, oIdx) => (
                               <button 
                                 key={oIdx}
                                 onClick={() => handleTrendQuizSelect(qIdx, opt)}
                                 className={`px-4 py-2 rounded-xl font-semibold border-2 transition-colors shadow-sm ${
                                   trendQuizAnswers[qIdx] === opt 
                                   ? 'bg-indigo-600 text-white border-indigo-600' 
                                   : 'bg-white/80 text-slate-700 border-white/50 hover:border-indigo-400 hover:bg-white'
                                 }`}
                               >
                                 {opt}
                               </button>
                             ))}
                           </div>
                         </div>
                       ))}
                     </div>
                     
                     <div className="mt-8 flex items-center gap-6 relative z-20">
                       <button onClick={checkTrendQuiz} className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-md border border-indigo-500">
                         Score My Quiz
                       </button>
                       {trendQuizScore !== null && (
                         <div className={`text-xl font-bold drop-shadow-sm ${trendQuizScore === dataHub.trendQuiz.length ? 'text-emerald-700' : 'text-rose-700'}`}>
                           You scored {trendQuizScore} / {dataHub.trendQuiz.length}
                           {trendQuizScore === dataHub.trendQuiz.length ? '  🎉  Perfect!' : '  😬  Review the vocabulary above.'}
                         </div>
                       )}
                     </div>
                   </LiquidCard>
                </div>
              </section>
            )}

            {/* TAB 3: PARAPHRASING LAB */}
            {activeTab === 'paraphrase' && (
              <section className="space-y-8 animate-fade-in">
                <div>
                  <h2 className="text-3xl font-lora font-bold text-indigo-900 mb-4">Paraphrasing Lab</h2>
                  <p className="text-slate-700 text-lg leading-relaxed mb-6 font-medium">
                    <strong>Rule 1:</strong> Don't copy the prompt. <br/>
                    <strong>Rule 2:</strong> Don't use a synonym if you don't know exactly how it works. <br/>
                    How do we paraphrase? Here are the 3 main techniques:
                  </p>
                  
                  <LiquidCard>
                    <div className="grid md:grid-cols-3 gap-6">
                       <div className="bg-white/50 backdrop-blur-md p-5 rounded-2xl border border-white/60 shadow-sm">
                          <h4 className="font-bold text-indigo-900 mb-2 border-b border-indigo-200/50 pb-2 drop-shadow-sm">1. Use Synonyms</h4>
                          <p className="text-sm text-slate-700 mb-2 font-medium">Replace words with identical meanings.</p>
                          <p className="text-xs text-slate-500 line-through">"shows the number of"</p>
                          <p className="text-sm text-indigo-700 font-bold drop-shadow-sm">"illustrates the proportion of"</p>
                       </div>
                       <div className="bg-white/50 backdrop-blur-md p-5 rounded-2xl border border-white/60 shadow-sm">
                          <h4 className="font-bold text-indigo-900 mb-2 border-b border-indigo-200/50 pb-2 drop-shadow-sm">2. Change Word Class</h4>
                          <p className="text-sm text-slate-700 mb-2 font-medium">Change a noun to a verb, etc.</p>
                          <p className="text-xs text-slate-500 line-through">"consumption of fast food"</p>
                          <p className="text-sm text-indigo-700 font-bold drop-shadow-sm">"how much fast food was consumed"</p>
                       </div>
                       <div className="bg-white/50 backdrop-blur-md p-5 rounded-2xl border border-white/60 shadow-sm">
                          <h4 className="font-bold text-indigo-900 mb-2 border-b border-indigo-200/50 pb-2 drop-shadow-sm">3. Change the Structure</h4>
                          <p className="text-sm text-slate-700 mb-2 font-medium">Move from Active to Passive voice.</p>
                          <p className="text-xs text-slate-500 line-through">"people spent money on..."</p>
                          <p className="text-sm text-indigo-700 font-bold drop-shadow-sm">"money was spent by people on..."</p>
                       </div>
                    </div>
                  </LiquidCard>
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mt-12 mb-6 drop-shadow-sm">Quick Reference Examples</h3>
                <div className="grid lg:grid-cols-2 gap-6 mb-12">
                  {dataHub.paraphrasing.map((item, qIdx) => (
                    <LiquidCard key={qIdx} className="grid md:grid-cols-[1.5fr_1fr] gap-6 items-center mb-0">
                      <div className="relative z-20">
                        <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 bg-white/70 backdrop-blur-md border border-white/50 rounded-xl px-3 py-1.5 w-fit uppercase tracking-wider mb-4 shadow-sm">
                          <BarChart2 className="w-4 h-4" /> {item.context}
                        </div>
                        <p className="font-lora text-base text-slate-900 mb-4 pb-4 border-b border-white/50 italic font-medium drop-shadow-sm">"{item.original}"</p>
                        <div className="flex flex-wrap gap-2">
                          {item.synonyms.map((synonym, sIdx) => {
                            const isRevealed = revealedChips[`${qIdx}-${sIdx}`];
                            return (
                              <button 
                                key={sIdx} 
                                onClick={() => toggleChip(qIdx, sIdx)}
                                className={`px-4 py-2 text-xs font-semibold rounded-full border transition-all shadow-sm ${
                                  isRevealed 
                                  ? 'bg-indigo-100 border-indigo-400 text-indigo-800 font-bold' 
                                  : 'bg-white/80 backdrop-blur-sm border-white/50 text-slate-700 hover:border-indigo-400 hover:bg-white'
                                }`}
                              >
                                {isRevealed ? synonym : `Reveal Option ${sIdx + 1}`}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      <div className="bg-white/50 backdrop-blur-md p-3 rounded-2xl border border-white/60 w-full h-full flex flex-col justify-center shadow-inner">
                        <ChartCanvas type={item.chartType} data={item.chartData} height="120px" options={{ plugins: { legend: { display: false } }, animation: false }} />
                      </div>
                    </LiquidCard>
                  ))}
                </div>
                
                {/* Bad Paraphrasing Analysis - Enhanced with original context comparison */}
                <LiquidCard className="mb-8 mt-12 border-rose-200/50" style={{ background: 'linear-gradient(180deg, rgba(255, 240, 245, 0.8) 0%, rgba(255, 230, 240, 0.6) 100%)' }}>
                    <h3 className="text-2xl font-bold text-rose-900 mb-4 flex items-center drop-shadow-sm">
                      <AlertCircle className="w-6 h-6 mr-2 text-rose-600" /> Terrible Paraphrasing Analysis
                    </h3>
                    <p className="text-rose-900/80 mb-6 font-medium">Compare these 5 examples of extremely poor paraphrasing directly against their original academic prompts. Click "Why is this bad?" to reveal the detailed critique.</p>
                    
                    <div className="space-y-4 relative z-20">
                      {dataHub.badParaphrases.map((item, idx) => {
                        const isRevealed = revealedBadParaphrases[idx];
                        return (
                          <div key={idx} className="bg-white/65 backdrop-blur-md p-5 rounded-2xl border border-white/70 shadow-sm flex flex-col gap-4">
                            <div className="flex flex-col gap-2.5">
                              {/* Original Academic Prompt */}
                              <div className="text-[10px] font-black tracking-widest text-slate-500 uppercase bg-white/40 border border-white/40 rounded px-2.5 py-1 w-fit shadow-inner">
                                Original Academic Prompt Context:
                              </div>
                              <p className="font-lora text-sm font-semibold text-slate-700 italic border-l-4 border-indigo-400 pl-3.5 mb-2">
                                "{item.original}"
                              </p>
                              {/* Bad / Lazy Paraphrase */}
                              <div className="text-[10px] font-black tracking-widest text-rose-500 uppercase">
                                Student's Lazy / Bad Paraphrase:
                              </div>
                              <p className="font-lora text-lg font-black text-rose-800 leading-snug drop-shadow-sm">
                                "{item.bad}"
                              </p>
                            </div>
                            
                            <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-4 border-t border-white/40 pt-4">
                              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Status: Heavily Penalized by Examiner</span>
                              <button 
                                onClick={() => toggleBadParaphrase(idx)}
                                className={`px-4 py-2 rounded-xl font-bold border transition-colors shadow-sm text-sm whitespace-nowrap ${isRevealed ? 'bg-rose-100 border-rose-300 text-rose-800' : 'bg-white/80 border-white/50 text-slate-700 hover:border-rose-400 hover:text-rose-700 hover:bg-white'}`}
                              >
                                {isRevealed ? 'Hide Critique' : 'Why is this bad?'}
                              </button>
                            </div>
                            
                            {isRevealed && (
                              <div className="bg-rose-100/70 backdrop-blur-sm p-4 rounded-xl border border-rose-200 text-rose-900 text-sm animate-fade-in shadow-inner font-semibold leading-relaxed">
                                <strong className="font-black uppercase tracking-wider text-rose-700 text-xs mr-2">Examiner Feedback:</strong>
                                {item.reason}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                </LiquidCard>

                {/* Full Paraphrase Practice Challenge - Expanded to 15 Prompts */}
                <LiquidCard className="mt-12">
                  <h3 className="text-2xl font-bold text-indigo-900 mb-4 flex items-center drop-shadow-sm">
                    <Edit3 className="w-6 h-6 mr-2 text-indigo-600" /> Full Paraphrase Challenge (15-Question Bank)
                  </h3>
                  <p className="text-slate-800 mb-6 font-medium">
                    Now it's your turn. Read the full prompt below and write a complete paraphrase. The AI examiner will strictly evaluate you on missing details (dates, categories, locations) and lexical resource.
                  </p>
                  
                  <div className="bg-white/60 backdrop-blur-md p-6 rounded-2xl border border-white/70 shadow-sm mb-6 relative z-20">
                    <div className="flex justify-between items-center border-b border-indigo-200/50 pb-3 mb-4">
                      <span className="text-xs font-bold text-indigo-700 uppercase tracking-widest bg-white/50 px-3 py-1 rounded-lg border border-white shadow-sm">Official IELTS Prompt {practicePromptIndex + 1} / {dataHub.paraphrasePractice.length}</span>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => {setPracticePromptIndex(prev => Math.max(0, prev - 1)); setPracticeFeedback(null); setPracticeParaphraseInput('');}} 
                          disabled={practicePromptIndex === 0} 
                          className="bg-white/60 border border-white/80 hover:bg-white text-indigo-600 disabled:opacity-40 p-2 rounded-lg shadow-sm transition-colors"
                        >
                          <ChevronLeft className="w-5 h-5"/>
                        </button>
                        <button 
                          onClick={() => {setPracticePromptIndex(prev => Math.min(dataHub.paraphrasePractice.length - 1, prev + 1)); setPracticeFeedback(null); setPracticeParaphraseInput('');}} 
                          disabled={practicePromptIndex === dataHub.paraphrasePractice.length - 1} 
                          className="bg-white/60 border border-white/80 hover:bg-white text-indigo-600 disabled:opacity-40 p-2 rounded-lg shadow-sm transition-colors"
                        >
                          <ArrowRight className="w-5 h-5"/>
                        </button>
                      </div>
                    </div>
                    <p className="font-lora text-xl font-bold text-slate-900 leading-relaxed drop-shadow-sm">
                      "{dataHub.paraphrasePractice[practicePromptIndex].text}"
                    </p>
                  </div>
                  <textarea
                    className="w-full p-6 rounded-2xl border border-white/80 focus:ring-2 focus:ring-indigo-500 outline-none mb-6 font-lora text-lg bg-white/70 backdrop-blur-sm shadow-inner resize-none relative z-20 placeholder:text-slate-400 font-medium text-slate-800"
                    rows="3"
                    placeholder="Type your complete paraphrase here..."
                    value={practiceParaphraseInput}
                    onChange={(e) => setPracticeParaphraseInput(e.target.value)}
                  />
                  <div className="relative z-20">
                    <button 
                      onClick={handlePracticeSubmit}
                      disabled={isEvaluatingPractice || !practiceParaphraseInput.trim()}
                      className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-xl flex items-center justify-center transition-colors shadow-md border border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isEvaluatingPractice ? <RefreshCw className="w-5 h-5 mr-2 animate-spin" /> : <Send className="w-5 h-5 mr-2" />}
                      Submit Paraphrase
                    </button>
                  </div>
                  {practiceFeedback && (
                    <div className="mt-8 p-6 bg-white/80 backdrop-blur-md border border-white shadow-xl rounded-2xl prose prose-indigo max-w-none animate-fade-in relative z-20">
                      <h4 className="font-bold text-xl m-0 flex items-center mb-4 text-slate-900 border-b border-slate-200 pb-3">
                        <CheckCircle className="w-6 h-6 text-emerald-500 mr-2 drop-shadow-sm" /> Examiner Feedback
                      </h4>
                      <div className="text-slate-800 font-medium whitespace-pre-wrap">{practiceFeedback}</div>
                    </div>
                  )}
                </LiquidCard>
              </section>
            )}

            {/* TAB 4: PREPOSITIONS - Enhanced with numbered labels & rich interactive grammatical critiques */}
            {activeTab === 'prepositions' && (
              <section className="space-y-8 animate-fade-in">
                <div>
                  <h2 className="text-3xl font-lora font-bold text-indigo-900 mb-4">The Preposition Minefield</h2>
                  <p className="text-slate-700 text-lg leading-relaxed font-medium">
                    Nothing exposes a weak grammar score faster than saying something "increased <i>to</i> 20%" when you meant "increased <i>by</i> 20%". Fill in the gaps correctly.
                  </p>
                </div>
                
                <LiquidCard>
                  <div className="bg-white/40 backdrop-blur-md p-8 md:p-12 rounded-2xl shadow-inner border border-white/60 relative z-20">
                    <div className="grid lg:grid-cols-2 gap-x-12 gap-y-8">
                      {dataHub.prepositions.map((item, qIdx) => {
                        const parts = item.text.split('_');
                        const isCorrect = item.answers.every((ans, aIdx) => 
                          prepInputs[`${qIdx}-${aIdx}`]?.toLowerCase().trim() === ans
                        );
                        return (
                          <div key={qIdx} className="text-lg text-slate-800 font-medium leading-loose pb-6 border-b border-white/50 flex flex-col gap-2">
                            <div className="flex flex-wrap items-center">
                              {/* Integrated numbered labels */}
                              <span className="font-extrabold text-indigo-700 mr-3 shrink-0">{qIdx + 1}.</span>
                              {parts.map((part, pIdx) => (
                                <React.Fragment key={pIdx}>
                                  {part}
                                  {pIdx < parts.length - 1 && (
                                    <input 
                                      className={`border-b-2 mx-2 text-center font-bold text-slate-950 outline-none w-20 transition-all shadow-sm ${
                                        prepChecked 
                                        ? (prepInputs[`${qIdx}-${pIdx}`]?.toLowerCase().trim() === item.answers[pIdx] ? 'bg-emerald-100 border-emerald-500 text-emerald-800' : 'bg-rose-100 border-rose-500 text-rose-800') 
                                        : 'bg-white/80 border-white focus:bg-white focus:border-indigo-500'
                                      }`}
                                      value={prepInputs[`${qIdx}-${pIdx}`] || ''}
                                      onChange={(e) => handlePrepChange(qIdx, pIdx, e.target.value)}
                                      placeholder="?"
                                    />
                                  )}
                                </React.Fragment>
                              ))}
                            </div>
                            
                            {/* Rich corrective explanations with answers */}
                            {prepChecked && (
                              <div className="mt-2 p-4 rounded-xl text-sm transition-all duration-300 animate-fade-in bg-white/60 border border-white/80 shadow-inner">
                                <div className="font-semibold text-slate-800 flex items-center mb-1.5">
                                  {isCorrect ? (
                                    <span className="text-emerald-700 flex items-center gap-1.5"><CheckCircle className="w-4 h-4" /> Perfect!</span>
                                  ) : (
                                    <span className="text-rose-700 flex items-center gap-1.5"><AlertCircle className="w-4 h-4" /> Correct Answers: <span className="font-mono bg-white px-2 py-0.5 rounded border border-rose-200">{item.answers.join(', ')}</span></span>
                                  )}
                                </div>
                                <p className="text-slate-700 leading-relaxed font-medium">
                                  {item.explanation}
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="pt-10 mt-6 border-t border-white/60 flex justify-center">
                      <button onClick={() => setPrepChecked(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-16 text-lg rounded-xl shadow-lg transition-colors border border-indigo-500">
                        Check My Grammar
                      </button>
                    </div>
                  </div>
                </LiquidCard>
              </section>
            )}

            {/* TAB 5: ERROR CORRECTION */}
            {activeTab === 'errors' && (
              <section className="space-y-8 animate-fade-in">
                <div>
                  <h2 className="text-3xl font-lora font-bold text-indigo-900 mb-4">Error Spotting</h2>
                  <p className="text-slate-700 text-lg leading-relaxed">
                    Examiners love failing you for these exact mistakes. Click on the single word containing the grammatical or logical error in the sentence.
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {dataHub.errors.map((item, qIdx) => {
                    const words = item.sentence.split(' ');
                    return (
                      <LiquidCard key={qIdx}>
                        <div className="relative z-20 h-full flex flex-col">
                          <div className="flex items-center gap-2 text-xs font-bold text-rose-700 bg-white/70 backdrop-blur-md rounded-xl px-3 py-1.5 w-fit uppercase tracking-wider mb-6 border border-white/80 shadow-sm">
                            <AlertCircle className="w-4 h-4" /> Issue: {item.context}
                          </div>
                          
                          <p className="text-xl leading-relaxed flex flex-wrap gap-1 font-lora mb-6 font-medium text-slate-800 drop-shadow-sm">
                            {words.map((w, wIdx) => {
                              const cleanWord = w.replace(/[.,]/g, '');
                              const isError = cleanWord === item.errorWord;
                              const status = errorStatus[`${qIdx}-${w}`];
                              return (
                                <span 
                                  key={wIdx} 
                                  onClick={() => handleErrorClick(qIdx, isError, w)}
                                  className={`cursor-pointer px-1.5 py-0.5 rounded-lg transition-all border border-transparent shadow-sm ${
                                    status === 'correct' ? 'bg-emerald-200/80 text-emerald-900 font-bold border-emerald-300' :
                                    status === 'wrong' ? 'bg-rose-200/80 text-rose-900 border-rose-300' : 'bg-white/50 hover:bg-white hover:border-white/80'
                                  }`}
                                >
                                  {w}
                                </span>
                              );
                            })}
                          </p>
                          
                          {Object.keys(errorStatus).some(k => k.startsWith(`${qIdx}-`) && errorStatus[k] === 'correct') && (
                            <div className="mt-auto p-4 bg-emerald-100/80 backdrop-blur-md rounded-xl border border-emerald-300 text-emerald-900 font-bold flex items-center animate-fade-in text-sm shadow-inner">
                              <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0 text-emerald-600 drop-shadow-sm" /> Correct! It should be "{item.correction}".
                            </div>
                          )}
                        </div>
                      </LiquidCard>
                    );
                  })}
                </div>
              </section>
            )}

            {/* TAB 6: DEEP DIVE STUDY */}
            {activeTab === 'deepdive' && (
              <section className="space-y-8 animate-fade-in">
                
                {!selectedStudyType ? (
                  <>
                    <div>
                      <h2 className="text-3xl font-lora font-bold text-indigo-900 mb-4 flex items-center">
                        <Search className="mr-3 text-indigo-600" /> Deep Dive Study
                      </h2>
                      <p className="text-slate-700 text-lg leading-relaxed font-medium">
                        Before you work in the Exam Simulator, take a moment to study the specific strategies for each chart type. We've added comprehensive guides for Processes, Maps, and Multiple Charts! Click a card to start.
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {dataHub.deepDiveTopics.map(topic => (
                        <LiquidCard key={topic.id} onClick={() => { setSelectedStudyType(topic); setDeepDiveAnswer(''); setDeepDiveFeedback(null); }}>
                          <div className="absolute top-0 right-0 bg-white/40 backdrop-blur-md border-l border-b border-white/60 w-24 h-24 rounded-bl-[4rem] transition-transform group-hover:scale-110 shadow-sm z-0"></div>
                          <div className="relative z-20 flex flex-col h-full">
                            <h3 className="font-extrabold text-xl text-slate-900 mb-2 drop-shadow-sm">{topic.title}</h3>
                            <p className="text-slate-700 text-sm mb-4 font-medium">{topic.subtitle}</p>
                            <div className="mt-auto flex items-center text-indigo-700 font-bold text-sm bg-white/60 backdrop-blur-sm w-fit px-4 py-2 rounded-xl border border-white/80 shadow-sm group-hover:bg-white transition-colors">
                              Study Now <ArrowRight className="w-4 h-4 ml-2" />
                            </div>
                          </div>
                        </LiquidCard>
                      ))}
                    </div>
                  </>
                ) : (
                  <LiquidCard className="!p-8">
                    <div className="relative z-20">
                      <button 
                        onClick={() => setSelectedStudyType(null)}
                        className="flex items-center text-slate-700 bg-white/70 backdrop-blur-md hover:bg-white hover:text-indigo-700 transition-colors font-bold text-sm uppercase tracking-wider mb-8 px-5 py-2.5 rounded-xl w-fit shadow-sm border border-white/80"
                      >
                        <ChevronLeft className="w-5 h-5 mr-1" /> Back to Topics
                      </button>

                      <div className="grid lg:grid-cols-12 gap-12 items-start">
                        <div className="lg:col-span-6 xl:col-span-5">
                          <h2 className="text-4xl font-lora font-extrabold text-slate-900 mb-3 drop-shadow-sm">{selectedStudyType.title}</h2>
                          <p className="text-xl text-indigo-700 font-bold mb-8 italic drop-shadow-sm">{selectedStudyType.subtitle}</p>
                          
                          <div className="bg-white/50 backdrop-blur-md p-6 rounded-2xl border border-white/80 relative mb-8 shadow-sm">
                             <div className="absolute -top-3 left-6 bg-indigo-600 text-white text-xs font-bold px-4 py-1.5 rounded-xl uppercase tracking-wider shadow-md border border-indigo-400">The Strategy</div>
                             <p className="text-slate-800 text-lg leading-relaxed font-lora font-medium mt-2">
                               {selectedStudyType.content}
                             </p>
                          </div>

                          <div className="bg-amber-100/50 backdrop-blur-md p-6 rounded-2xl border border-amber-200/60 shadow-inner">
                             <h4 className="font-bold text-amber-900 mb-3 flex items-center text-lg drop-shadow-sm"><Edit3 className="w-6 h-6 mr-2"/> Think & Apply</h4>
                             <p className="text-amber-900/80 text-sm mb-4 font-semibold">{selectedStudyType.guidingQuestion}</p>
                             <textarea 
                                className="w-full p-5 rounded-2xl border border-white/80 focus:ring-2 focus:ring-amber-500 outline-none mb-5 font-lora text-lg bg-white/80 backdrop-blur-sm shadow-inner placeholder:text-amber-900/40 text-slate-900 font-medium resize-none"
                                rows="4"
                                placeholder="Answer the guiding question above to test your skills..."
                                value={deepDiveAnswer}
                                onChange={(e) => setDeepDiveAnswer(e.target.value)}
                             />
                             <button 
                                onClick={handleDeepDiveSubmit}
                                disabled={isEvaluatingDeepDive || !deepDiveAnswer.trim()}
                                className="w-full flex justify-center items-center text-white font-bold py-3.5 rounded-xl transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed border border-amber-500"
                                style={{ background: 'linear-gradient(135deg, #f59e0b, #ea580c)' }}
                             >
                               {isEvaluatingDeepDive ? <RefreshCw className="w-6 h-6 mr-2 animate-spin" /> : <MessageSquare className="w-6 h-6 mr-2" />} 
                               Get Tutor Feedback
                             </button>

                             {deepDiveFeedback && (
                                <div className="mt-6 p-6 bg-white/90 backdrop-blur-md rounded-2xl border border-white shadow-lg max-w-none text-sm animate-fade-in text-slate-800 font-medium">
                                  <div className="whitespace-pre-wrap">{deepDiveFeedback}</div>
                                </div>
                             )}
                          </div>
                        </div>

                        <div className="lg:col-span-6 xl:col-span-7 flex flex-col justify-center sticky top-24 w-full overflow-hidden">
                           <div className="bg-white/40 backdrop-blur-md rounded-3xl p-6 border border-white/60 shadow-inner">
                             <VisualRenderer visual={selectedStudyType.visual} height="350px" />
                           </div>
                        </div>
                      </div>
                    </div>
                  </LiquidCard>
                )}

              </section>
            )}

            {/* TAB 7: EXAM SIMULATOR */}
            {activeTab === 'simulator' && (
              <section className="space-y-8 animate-fade-in">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                  <div>
                    <h2 className="text-3xl font-lora font-bold text-indigo-900 mb-2">The Execution Zone</h2>
                    <p className="text-slate-700 text-lg font-medium">Analyze the visual data, write 150+ words, and get automated examiner analysis.</p>
                  </div>
                  <select 
                    value={selectedTaskIndex}
                    onChange={(e) => setSelectedTaskIndex(Number(e.target.value))}
                    className="bg-white/80 backdrop-blur-md border border-white/80 text-indigo-900 rounded-xl block p-3.5 shadow-sm font-bold outline-none cursor-pointer max-w-full truncate w-full md:w-auto transition-colors focus:ring-2 focus:ring-indigo-500"
                  >
                    {dataHub.practiceTasks.map((task, idx) => (
                      <option key={task.id} value={idx}>{task.type}: {task.topic}</option>
                    ))}
                  </select>
                </div>

                <div className="grid lg:grid-cols-12 gap-8">
                  
                  {/* Left Column: Official Prompt Format & Chart */}
                  <div className="lg:col-span-6 xl:col-span-5 space-y-6">
                    <LiquidCard>
                      <div className="relative z-20">
                        <div className="flex items-center space-x-3 mb-6">
                          <span className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-black uppercase rounded-lg tracking-widest shadow-sm border border-indigo-400">{activeTask.type}</span>
                          <h3 className="text-xl font-extrabold text-slate-900 leading-tight drop-shadow-sm">{activeTask.topic}</h3>
                        </div>
                        
                        {/* Realistic IELTS Test Prompt Block */}
                        <div className="border border-slate-300 shadow-sm p-6 bg-white/90 backdrop-blur-md font-sans text-black relative mb-8 rounded-xl">
                           <div className="absolute top-0 left-0 bg-slate-800 text-white px-3 py-1 text-[10px] font-bold tracking-widest uppercase rounded-br-lg rounded-tl-xl shadow-sm">Academic Writing Task 1</div>
                           <p className="font-bold mt-5 mb-4 text-[15px]">You should spend about 20 minutes on this task.</p>
                           <p className="mb-4 text-base leading-relaxed font-medium text-slate-800">{activeTask.description}</p>
                           <p className="font-bold mb-2 text-[15px]">Summarise the information by selecting and reporting the main features, and make comparisons where relevant.</p>
                           <p className="font-bold text-[15px]">Write at least 150 words.</p>
                        </div>
                        
                        <div className="space-y-6">
                          {activeTask.visuals.map((visual, vIdx) => (
                            <div key={vIdx} className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/80 shadow-inner flex justify-center w-full overflow-x-auto relative">
                               <VisualRenderer visual={visual} height={activeTask.visuals.length > 1 ? "200px" : "280px"} />
                            </div>
                          ))}
                        </div>
                      </div>
                    </LiquidCard>
                  </div>

                  {/* Right Column: Editor */}
                  <div className="lg:col-span-6 xl:col-span-7 flex flex-col h-full">
                    <LiquidCard className="!p-0 h-[600px] lg:h-full min-h-[550px] overflow-hidden border border-white/80">
                      <div className="relative z-20 flex flex-col h-full w-full bg-white/50 backdrop-blur-md">
                        <div className="p-4 bg-white/60 border-b border-white/70 flex justify-between items-center shadow-sm">
                          <div className="flex space-x-2.5">
                            <div className="w-3.5 h-3.5 rounded-full bg-rose-400 shadow-sm border border-rose-300"></div>
                            <div className="w-3.5 h-3.5 rounded-full bg-amber-400 shadow-sm border border-amber-300"></div>
                            <div className="w-3.5 h-3.5 rounded-full bg-emerald-400 shadow-sm border border-emerald-300"></div>
                          </div>
                          <span className="text-xs font-black text-slate-500 uppercase tracking-widest hidden sm:block drop-shadow-sm">IELTS Official Writing Sandbox</span>
                          <div className="w-12 hidden sm:block"></div>
                        </div>
                        
                        <textarea
                          className="w-full flex-grow p-8 bg-transparent focus:ring-0 focus:outline-none font-lora text-lg text-slate-800 font-medium leading-loose resize-none placeholder:text-slate-400"
                          placeholder="Begin writing here. Ensure you include an overview..."
                          value={essay}
                          onChange={handleTextChange}
                        />

                        <div className="p-5 bg-white/60 border-t border-white/70 flex flex-col sm:flex-row justify-between items-center gap-4 mt-auto shadow-sm">
                          <div className="flex items-center space-x-4 w-full sm:w-auto">
                            <div className={`flex items-center px-4 py-2.5 rounded-xl border-2 font-bold transition-colors shadow-sm ${wordCount < 150 ? 'bg-rose-100 text-rose-800 border-rose-300' : 'bg-emerald-100 text-emerald-800 border-emerald-300'}`}>
                              Words: {wordCount}
                            </div>
                            <span className="text-sm font-bold text-indigo-700 transition-opacity drop-shadow-sm">{saveStatus}</span>
                          </div>
                          
                          <div className="flex space-x-3 w-full sm:w-auto">
                            <button onClick={handleSaveProgress} className="flex-1 sm:flex-none flex items-center justify-center px-6 py-3 bg-white/90 border border-white text-slate-800 rounded-xl hover:bg-white transition font-bold shadow-md">
                              <Save className="w-5 h-5 mr-2" /> Save
                            </button>
                            <button 
                              onClick={handleSubmit}
                              disabled={isEvaluating || essay.trim().length === 0}
                              className="bg-indigo-600 hover:bg-indigo-700 text-white flex-1 sm:flex-none flex items-center justify-center whitespace-nowrap px-8 py-3 text-lg font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg border border-indigo-500"
                            >
                              {isEvaluating ? <RefreshCw className="w-6 h-6 mr-2 animate-spin" /> : <Send className="w-6 h-6 mr-2" />} 
                              {isEvaluating ? 'Judging...' : 'Submit Essay'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </LiquidCard>
                  </div>
                </div>

                {/* AI Feedback */}
                {feedback && (
                  <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-2xl animate-fade-in border border-slate-700 mt-12 relative">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
                    <div className="bg-slate-800/80 p-6 flex items-center border-b border-slate-700 backdrop-blur-md">
                      <CheckCircle className="w-8 h-8 text-emerald-400 mr-4 drop-shadow-sm" />
                      <div>
                        <h3 className="text-2xl font-bold text-white font-lora drop-shadow-sm">The Verdict</h3>
                        <p className="text-slate-300 text-sm mt-1 font-medium">Review your formal feedback diagnostics.</p>
                      </div>
                    </div>
                    <div className="p-8 md:p-10 text-slate-200 leading-relaxed font-inter font-medium text-lg">
                      <div className="whitespace-pre-wrap">{feedback}</div>
                    </div>
                    <div className="bg-slate-800/50 p-6 border-t border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-4">
                      <p className="text-slate-400 text-sm italic">
                        * Optional: You can copy your essay and feedback to share with your teacher.
                      </p>
                      <button 
                        onClick={handleCopyFeedback}
                        className="flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-colors shadow-lg border border-indigo-400 shrink-0"
                      >
                        {copySuccess ? <CheckCircle className="w-5 h-5 mr-2 text-emerald-300" /> : <Copy className="w-5 h-5 mr-2" />}
                        {copySuccess ? 'Copied to Clipboard!' : 'Copy Essay & Feedback'}
                      </button>
                    </div>
                  </div>
                )}
              </section>
            )}

          </div>

          {/* Elegant Translucent Signature Footer with Single Correct Function Closing Layout */}
          <footer className="py-6 border-t border-slate-200/40 flex flex-col items-center justify-center relative overflow-hidden bg-white/20 backdrop-blur-sm rounded-b-2xl">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 drop-shadow-sm">Crafted with ❤️ by</p>
            <span style={{ fontFamily: "'Brush Script MT', 'Lucida Handwriting', 'Pacifico', 'Apple Chancery', cursive" }} className="text-3xl italic tracking-widest text-indigo-700 drop-shadow-sm hover:text-indigo-500 transition-colors cursor-default select-none">
              Sinan
            </span>
          </footer>

        </div>
      </div>
    </div>
  );
}
