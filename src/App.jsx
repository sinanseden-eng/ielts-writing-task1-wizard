import React, { useState, useEffect, useRef } from 'react';
import { 
  BarChart2, Save, Send, RefreshCw, CheckCircle, 
  AlertCircle, Activity, PieChart, Map as MapIcon, 
  GitMerge, Lightbulb, FileSpreadsheet, ArrowRight,
  ChevronLeft, Zap, Search, Edit3, MessageSquare
} from 'lucide-react';

// ============================================================================
// 0. VISUAL RENDERING COMPONENTS (Charts, Tables, Maps, Processes)
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
  <div className="overflow-x-auto w-full bg-white rounded-lg border border-gray-200 shadow-sm">
    <table className="w-full text-sm text-left text-gray-700 border-collapse">
      <thead className="bg-indigo-50 text-indigo-900 font-bold border-b-2 border-indigo-200">
        <tr>
          {data.headers.map((h, i) => <th key={i} className="px-4 py-3 whitespace-nowrap">{h}</th>)}
        </tr>
      </thead>
      <tbody>
        {data.rows.map((row, i) => (
          <tr key={i} className="border-b border-gray-100 hover:bg-indigo-50/50 transition-colors">
            {row.map((cell, j) => (
              <td key={j} className={`px-4 py-3 ${j === 0 ? 'font-semibold text-gray-800' : ''}`}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const ProcessVisual = ({ steps }) => (
  <div className="flex flex-wrap items-center justify-center gap-2 bg-amber-50 p-6 rounded-lg border border-amber-100 shadow-inner w-full">
    {steps.map((step, idx) => (
      <React.Fragment key={idx}>
        <div className="bg-white px-4 py-3 rounded-lg shadow-md border border-amber-200 text-amber-900 font-bold text-sm text-center min-w-[100px]">
          {step}
        </div>
        {idx < steps.length - 1 && <ArrowRight className="w-5 h-5 text-amber-500 font-black animate-pulse" />}
      </React.Fragment>
    ))}
  </div>
);

const MapVisual = ({ title1, items1, title2, items2 }) => (
  <div className="grid grid-cols-2 gap-4 bg-emerald-50 p-4 rounded-lg border border-emerald-100 w-full">
    <div className="bg-white p-3 rounded-lg shadow-md border border-emerald-200">
      <h4 className="font-bold text-emerald-900 mb-2 text-center border-b pb-1 text-sm">{title1}</h4>
      <div className="grid grid-cols-2 gap-2">
        {items1.map((item, i) => (
          <div key={i} className="bg-emerald-100 text-emerald-800 text-xs p-1 rounded text-center h-12 flex items-center justify-center font-bold">
            {item}
          </div>
        ))}
      </div>
    </div>
    <div className="bg-white p-3 rounded-lg shadow-md border border-emerald-200">
      <h4 className="font-bold text-indigo-900 mb-2 text-center border-b pb-1 text-sm">{title2}</h4>
      <div className="grid grid-cols-2 gap-2">
        {items2.map((item, i) => (
          <div key={i} className="bg-indigo-100 text-indigo-800 text-xs p-1 rounded text-center h-12 flex items-center justify-center font-bold shadow-sm">
            {item}
          </div>
        ))}
      </div>
    </div>
  </div>
);

const VisualRenderer = ({ visual, height, options = {} }) => {
  if (visual.type === 'table') return <TableVisual data={visual.data} />;
  if (visual.type === 'process') return <ProcessVisual steps={visual.data.steps} />;
  if (visual.type === 'map') return <MapVisual {...visual.data} />;
  return <ChartCanvas type={visual.type} data={visual.data} height={height || "220px"} options={{ plugins: { legend: { position: 'bottom' } }, ...options }} />;
};

// ============================================================================
// 1. DATA HUB
// ============================================================================

const dataHub = {
  newcomerGuide: [
    { 
      type: 'Line Graph', icon: <Activity className="w-6 h-6 text-blue-500"/>, 
      advice: 'Group lines that follow a similar pattern. Highlight the peaks and troughs. Don\'t list every year unless you want the examiner to fall asleep.',
      title: 'Declining Will to Live (Mon vs Fri)',
      visual: { type: 'line', data: { labels: ['Mon','Tue','Wed','Thu','Fri'], datasets: [{ label: 'Motivation', data: [90, 60, 40, 20, 5], borderColor: '#ef4444', tension: 0.3 }, { label: 'Coffee Intake', data: [2, 4, 6, 8, 10], borderColor: '#10b981', tension: 0.3 }] } }
    },
    { 
      type: 'Bar Chart', icon: <BarChart2 className="w-6 h-6 text-indigo-500"/>, 
      advice: 'Compare the heights. Identify the highest and lowest categories. Do not describe them from left to right like a robot scanning a barcode.',
      title: 'Top Excuses for Missing Deadlines',
      visual: { type: 'bar', data: { labels: ['Wi-Fi Died', 'Dog ate it', 'Existential Dread', 'Forgot'], datasets: [{ label: 'Frequency', data: [85, 5, 95, 40], backgroundColor: ['#4f46e5', '#8b5cf6', '#ef4444', '#cbd5e1'] }] } }
    },
    { 
      type: 'Pie Chart', icon: <PieChart className="w-6 h-6 text-rose-500"/>, 
      advice: 'Focus on proportions. Compare the largest and smallest slices. If there are multiple pies, compare the same slice across pies, not pie by pie.',
      title: 'What I Actually Do on the Internet',
      visual: { type: 'doughnut', data: { labels: ['Cat Videos', 'Arguing', 'Working'], datasets: [{ data: [75, 24, 1], backgroundColor: ['#f59e0b', '#f43f5e', '#10b981'] }] } }
    },
    { 
      type: 'Table', icon: <FileSpreadsheet className="w-6 h-6 text-emerald-500"/>, 
      advice: 'Scan for extremes. Pick out the most striking comparisons. Treat it like a spreadsheet of despair—only report the cells that actually matter.',
      title: 'Survival Rate of House Plants',
      visual: { type: 'table', data: { headers: ['Plant', 'Days Alive', 'Cause of Death'], rows: [['Cactus', '400', 'Overwatered'], ['Fern', '12', 'Neglect'], ['Orchid', '2', 'Looked at it wrong']] } }
    },
    { 
      type: 'Process Diagram', icon: <GitMerge className="w-6 h-6 text-amber-500"/>, 
      advice: 'No trends here! Describe steps in order using the passive voice ("Mistakes were made"). Use time connectors (First, subsequently, finally).',
      title: 'How to Write an Essay at 3 AM',
      visual: { type: 'process', data: { steps: ['Panic', 'Drink Coffee', 'Type Garbage', 'Submit'] } }
    },
    { 
      type: 'Map / Plan', icon: <MapIcon className="w-6 h-6 text-purple-500"/>, 
      advice: 'Look at the "Before" and "After". Describe what was demolished, built, or expanded. Use directions (North, South-West).',
      title: 'My Desk Layout',
      visual: { type: 'map', data: { title1: 'Start of Term', items1: ['Neat Notes', 'Pencils', 'Laptop', 'Hope'], title2: 'End of Term', items2: ['Coffee Mugs', 'Tears', 'Laptop', 'More Mugs'] } }
    }
  ],
  structureGuide: {
    chart: {
      type: 'bar',
      data: {
        labels: ['Actually Working', 'Staring at Screen', 'Snacking', 'Scrolling Social Media'],
        datasets: [{ label: 'Hours per day (WFH)', data: [1.5, 3, 2, 4.5], backgroundColor: ['#10b981', '#64748b', '#f59e0b', '#ef4444'] }]
      }
    }
  },
  paraphrasing: [
    { context: "Internet Usage (2010-2020)", original: "The graph shows the daily hours millennials spent doomscrolling in the UK and US from 2010 to 2020.", synonyms: ["The line chart brutalises our attention spans by illustrating daily internet usage in the UK and USA over a decade.", "The visual highlights the tragic amount of hours wasted on social feeds by Millennials between 2010 and 2020."], chartType: 'line', chartData: { labels: ['2010','2020'], datasets: [{ label: 'UK', data: [2,7], borderColor: '#4f46e5' }, { label: 'US', data: [3,8], borderColor: '#ef4444' }] } },
    { context: "Coffee Consumption (2022)", original: "The bar chart compares the tons of overpriced artisanal coffee consumed in London, Paris, and Rome in 2022.", synonyms: ["The bar chart exposes the alarming intake of expensive caffeine across three major European capitals during 2022.", "The diagram illustrates the volume of premium coffee purchased by residents of London, Paris, and Rome in 2022."], chartType: 'bar', chartData: { labels: ['London','Paris', 'Rome'], datasets: [{ label: 'Tons', data: [500,450, 300], backgroundColor: ['#ef4444','#10b981', '#f59e0b'] }] } },
    { context: "Zoom Excuses (2021)", original: "The pie chart breaks down the primary reasons employees muted their microphones during Zoom calls in 2021.", synonyms: ["The chart categorizes the excuses remote workers used to avoid participating in virtual meetings throughout 2021.", "The pie chart delineates the main justifications for microphone muting in corporate video conferences in 2021."], chartType: 'doughnut', chartData: { labels: ['Eating','Yelling at kids','Watching TV', 'Actually working'], datasets: [{ data: [40, 30, 25, 5], backgroundColor: ['#f59e0b', '#f43f5e', '#8b5cf6', '#10b981'] }] } },
    { context: "Ignored Subscriptions (2023)", original: "The table illustrates the number of digital subscriptions actively ignored by Gen Z and Boomers in 2023.", synonyms: ["The table highlights our modern inability to cancel unused streaming platforms across two distinct generations in 2023.", "The data compares the quantity of neglected digital memberships held by Gen Z versus Boomers during 2023."], chartType: 'bar', chartData: { labels: ['Gen Z','Boomers'], datasets: [{ label: 'Ignored Subs', data: [7, 2], backgroundColor: '#8b5cf6' }] } },
    { context: "Neighborhood Gentrification", original: "The map details the tragic gentrification of a local neighborhood in Brooklyn between 2010 and 2024.", synonyms: ["The maps illustrate the transformation of a Brooklyn district from affordable to overpriced over a 14-year period.", "The diagrams depict the urban redevelopment that occurred in a Brooklyn community between 2010 and 2024."], chartType: 'doughnut', chartData: { labels: ['Local Shops', 'Luxury Cafes'], datasets: [{ data: [80, 20], backgroundColor: ['#10b981', '#f43f5e'] }, { data: [10, 90], backgroundColor: ['#10b981', '#f43f5e'] }] } },
    { context: "Sleep Deprivation (Undergrads)", original: "The line graph tracks the declining hours of sleep university students got per night from Year 1 to Year 4.", synonyms: ["The graph grimly illustrates the sleep deprivation epidemic among undergraduates over their four-year degree.", "The line chart measures the average nightly rest obtained by university attendees from their freshman to senior year."], chartType: 'line', chartData: { labels: ['Yr 1', 'Yr 2', 'Yr 3', 'Yr 4'], datasets: [{ label: 'Hours', data: [8, 6, 4, 3], borderColor: '#3b82f6' }] } },
    { context: "Impulsive Shopping (2 AM)", original: "The bar chart categorises the regrettable purchases made by adults during late-night scrolling in 2022.", synonyms: ["The visual breaks down impulsive e-commerce trends occurring post-midnight among adults in 2022.", "The chart compares the types of unnecessary items bought online at 2 AM over the course of 2022."], chartType: 'bar', chartData: { labels: ['Gadgets', 'Clothes', 'Snacks'], datasets: [{ label: '% of purchases', data: [60, 25, 15], backgroundColor: '#ec4899' }] } },
    { context: "New Year's Resolutions", original: "The pie chart brutally exposes the drop-off in gym attendance from January to December 2023.", synonyms: ["The visual breaks down the illusion of consistent fitness commitments over the span of 2023.", "The pie chart illustrates the sharp decline in health club visits between the start and end of 2023."], chartType: 'pie', chartData: { labels: ['Jan', 'Feb-Mar', 'Apr-Dec'], datasets: [{ data: [70, 20, 10], backgroundColor: ['#14b8a6', '#f59e0b', '#94a3b8'] }] } },
    { context: "Office Jargon Frequency", original: "The chart shows the most used meaningless buzzwords in corporate emails during Q1 2024.", synonyms: ["The bar chart ranks the most insufferable corporate phrases utilized in professional correspondence in the first quarter of 2024.", "The visual details the frequency of specific jargon used in workplace emails from January to March 2024."], chartType: 'bar', chartData: { labels: ['Circle back', 'Synergy', 'Bandwidth'], datasets: [{ label: 'Uses/Day', data: [45, 30, 80], backgroundColor: '#64748b' }] } },
    { context: "Dating App Success (2018-2023)", original: "The line graph charts the dismal probability of finding true love via swiping between 2018 and 2023.", synonyms: ["The chart illustrates the declining success rates of digital matchmaking platforms over a five-year period.", "The graph provides data on the falling likelihood of establishing meaningful relationships on dating apps from 2018 to 2023."], chartType: 'line', chartData: { labels: ['2018', '2023'], datasets: [{ label: 'Success %', data: [15, 2], borderColor: '#e11d48' }] } }
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
      prompt: "The line graph illustrates the percentage of remote workers experiencing existential dread in the UK, USA, and Canada over a three-year period starting in 2020.",
      options: [
        { text: "The graph shows how many people felt sad in America and Canada.", type: "bad" },
        { text: "The line chart tracks the proportion of telecommuters suffering from existential angst across three Western nations over a three-year timeframe from 2020.", type: "good" },
        { text: "The chart compares the percentage of remote workers experiencing existential dread in the UK, USA, and Canada.", type: "bad" }
      ]
    },
    {
      prompt: "The pie charts compare the primary reasons for resigning from a corporate job, by percentage, in Tokyo and New York for the year 2022.",
      options: [
        { text: "The charts show why people quit their jobs in 2022.", type: "bad" },
        { text: "The pie charts break down the main factors driving employee resignation, represented as percentages, in two major global cities during the year 2022.", type: "good" },
        { text: "The diagrams illustrate the percentage of people who left their jobs in Tokyo and New York.", type: "bad" }
      ]
    },
    {
      prompt: "The bar chart provides information about the total revenue (in millions of dollars) generated by three rival streaming platforms globally from 2015 to 2021.",
      options: [
        { text: "The bar chart compares the financial earnings, measured in millions of USD, of three competing streaming services on a global scale over a six-year period starting in 2015.", type: "good" },
        { text: "The chart shows the money made by streaming companies from 2015 to 2021.", type: "bad" },
        { text: "The bar graph illustrates the total revenue in dollars generated by streaming platforms.", type: "bad" }
      ]
    },
    {
      prompt: "The diagram details the chronological process of manufacturing cheap plastic toys in a factory located in Shenzen.",
      options: [
        { text: "The diagram shows how toys are made in a factory.", type: "bad" },
        { text: "The flowchart outlines the sequential steps involved in producing inexpensive plastic playthings at a manufacturing plant in Shenzen.", type: "good" },
        { text: "The image illustrates the process of making cheap plastic toys.", type: "bad" }
      ]
    }
  ],
  languageOfChange: [
    { title: 'The Skyrocket', icon: '🚀', words: 'surged, soared, shot up, skyrocketed', example: '"The number of unread emails skyrocketed after the weekend."', colors: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800' }, chartType: 'line', chartData: { labels: ['Fri','Mon'], datasets: [{ data: [5, 450], borderColor: '#10b981', fill: true, backgroundColor: 'rgba(16,185,129,0.1)', tension: 0.2 }] } },
    { title: 'The Abyss', icon: '🕳️', words: 'plummeted, plunged, collapsed, sank', example: '"My bank balance plunged dramatically after payday."', colors: { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-800' }, chartType: 'line', chartData: { labels: ['Payday','Day 2'], datasets: [{ data: [2000, 12], borderColor: '#f43f5e', fill: true, backgroundColor: 'rgba(244,63,94,0.1)', tension: 0.2 }] } },
    { title: 'The Plateau of Boredom', icon: '➡️', words: 'remained steady, flatlined, stagnated', example: '"My career progression flatlined at middle management."', colors: { bg: 'bg-slate-100', border: 'border-slate-300', text: 'text-slate-800' }, chartType: 'line', chartData: { labels: ['2015','2017', '2019', '2021', '2023'], datasets: [{ data: [50, 50, 50, 50, 50], borderColor: '#64748b', fill: true, backgroundColor: 'rgba(100,116,139,0.1)', tension: 0 }] } },
    { title: 'The Rollercoaster', icon: '🎢', words: 'fluctuated wildly, was highly erratic', example: '"My stability fluctuated wildly during the exam."', colors: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800' }, chartType: 'line', chartData: { labels: ['Q1','Q2','Q3','Q4'], datasets: [{ data: [90, 10, 85, 5], borderColor: '#f59e0b', fill: true, backgroundColor: 'rgba(245,158,11,0.1)', tension: 0.3 }] } }
  ],
  trendSentences: [
    { text: "Coffee sales soared dramatically from 10 to 90 cups.", data: [10, 20, 40, 90] },
    { text: "Motivation plummeted to an all-time low of 5% by Friday.", data: [80, 50, 20, 5] },
    { text: "Meetings remained agonizingly steady at 4 per day.", data: [4, 4.1, 3.9, 4] },
    { text: "Productivity fluctuated wildly, oscillating between 10% and 90%.", data: [20, 90, 10, 80] },
    { text: "The number of unread emails climbed steadily to 70.", data: [10, 30, 50, 70] },
    { text: "Patience dipped slightly on Tuesday before recovering.", data: [50, 30, 45, 60] },
    { text: "Office gossip reached a peak of 50 whispers per hour.", data: [10, 30, 50, 20] },
    { text: "Willpower bottomed out completely at exactly 3 PM.", data: [60, 30, 10, 40] },
    { text: "The use of the word 'synergy' grew exponentially.", data: [5, 10, 40, 100] },
    { text: "Employee morale collapsed abruptly after the mandate.", data: [90, 85, 80, 10] },
    { text: "Sales figures levelled off at 80 units after a surge.", data: [20, 80, 79, 81] },
    { text: "Late-night snacking increased significantly in winter.", data: [10, 20, 50, 70] },
    { text: "People pretending to work remained constant at 95%.", data: [95, 94, 96, 95] },
    { text: "IT complaints saw a sudden, sharp spike on Monday.", data: [5, 5, 80, 10] },
    { text: "Enthusiasm dwindled gradually as the meeting dragged on.", data: [90, 70, 50, 30] }
  ],
  prepositions: [
    { text: "Patience decreased _ 100% _ Monday _ Friday.", answers: ["by", "from", "to"] },
    { text: "Procrastination peaked _ 11 PM.", answers: ["at"] },
    { text: "The amount of pointless meetings stood _ 5 per day.", answers: ["at"] },
    { text: "Motivation fell _ a high _ 90 _ a low _ zero.", answers: ["from", "of", "to", "of"] },
    { text: "My anxiety fluctuated _ panic _ extreme panic.", answers: ["between", "and"] },
    { text: "Unread emails started _ 50 on Monday.", answers: ["at"] },
    { text: "There was a dramatic increase _ the consumption of snacks.", answers: ["in"] },
    { text: "Existential dread experienced a rise _ 40%.", answers: ["of"] }
  ],
  errors: [
    { sentence: "The number of useless meetings have increased.", errorWord: "have", correction: "has", context: "Subject-Verb Agreement" },
    { sentence: "There was a dramatically drop in my patience.", errorWord: "dramatically", correction: "dramatic", context: "Word Form (Adj vs Adv)" },
    { sentence: "Avocados increased from 10 to 100.", errorWord: "Avocados", correction: "Consumption of avocados", context: "Logical Subject" },
    { sentence: "The amount of followers on my Instagram is sad.", errorWord: "amount", correction: "number", context: "Countable vs Uncountable" },
    { sentence: "My grades were downwarded rapidly in 2023.", errorWord: "downwarded", correction: "decreased", context: "Invented Word" },
    { sentence: "There was a steady fail in my attempts to diet.", errorWord: "fail", correction: "failure", context: "Word Form (Noun vs Verb)" }
  ],
  deepDiveTopics: [
    { 
      id: 'line', title: 'Mastering Line Graphs', subtitle: 'Tracking the rollercoaster of data over time.', 
      content: 'Group your data by trends. Put all the "winners" (things going up) in one paragraph, and the "losers" (things going down or flatlining) in another. Do not write a boring list of years.', 
      guidingQuestion: "Look at the complex chart above containing four erratic variables. If you had to group these four lines into two logical body paragraphs, which ones would go together and why? What connecting word would bridge the paragraphs?",
      visual: { type: 'line', data: { labels: ['2015','2018','2021','2024'], datasets: [{ label: 'Coffee Prices ($)', data: [3, 4.5, 6, 8], borderColor: '#8b5cf6' }, { label: 'Rent ($100s)', data: [10, 15, 25, 40], borderColor: '#f59e0b' }, { label: 'My Salary ($10ks)', data: [5, 5.1, 5.1, 5.1], borderColor: '#ef4444' }, { label: 'Free Time (Hrs)', data: [20, 15, 10, 2], borderColor: '#10b981' }] } } 
    },
    { 
      id: 'bar', title: 'Beating Bar Charts', subtitle: 'Stacking up categories without sounding like a robot.', 
      content: 'Focus on the extremes. What is the tallest bar? What is the shortest? Are there any bars that are completely identical? Contrast the highest categories against the lowest. Group the data by size.', 
      guidingQuestion: "Identify the most striking comparison in this stacked bar chart. Write one complete complex sentence contrasting the highest and lowest data points across the four-year period.",
      visual: { type: 'bar', data: { labels: ['2020', '2021', '2022', '2023'], datasets: [{ label: 'Scrolling', data: [20, 25, 30, 35], backgroundColor: '#3b82f6' }, { label: 'Actual Work', data: [15, 12, 8, 2], backgroundColor: '#ef4444' }, { label: 'Snacking', data: [5, 10, 15, 20], backgroundColor: '#10b981' }, { label: 'Crying', data: [2, 5, 8, 12], backgroundColor: '#f59e0b' }] }, options: { scales: { x: { stacked: true }, y: { stacked: true } } } } 
    },
    { 
      id: 'pie', title: 'Conquering Pie Charts', subtitle: 'Slicing through the data (and finding the biggest piece).', 
      content: 'Pie charts are all about fractions and proportions. Use language like "a vast majority", "a tiny fraction", "exactly a quarter". If there are multiple pies over time, look at how the slices grow or shrink.', 
      guidingQuestion: "Compare these two pie charts. Write a sophisticated overview sentence summarizing the primary shift in budget allocation between Year 1 and Year 5. What shrank, and what dominated?",
      visual: { type: 'pie', data: { labels: ['Taxes', 'Rent', 'Food', 'Fun', 'Savings'], datasets: [{ label: 'Year 1', data: [20, 30, 20, 20, 10], backgroundColor: ['#ef4444', '#3b82f6', '#10b981', '#cbd5e1', '#8b5cf6'] }, { label: 'Year 5', data: [35, 50, 10, 5, 0], backgroundColor: ['#ef4444', '#3b82f6', '#10b981', '#cbd5e1', '#8b5cf6'] }] } } 
    },
    { 
      id: 'table', title: 'Taming Tables', subtitle: 'Surviving the spreadsheet of doom.', 
      content: 'Tables have too much data. Period. Your job is to ignore 60% of it. Find the highest numbers, the lowest numbers, and the most obvious patterns across columns. Group similar rows together.', 
      guidingQuestion: "Scan this complex table. Which two rows share a similar inverse correlation, and which row is the complete outlier? Write a sentence explaining your choice.",
      visual: { type: 'table', data: { headers: ['Generation', 'Tech Skill (1-10)', 'Sarcasm (1-10)', 'Savings ($)', 'Avg Sleep (Hrs)'], rows: [['Boomer', '2', '3', '85,000', '8'], ['Gen X', '6', '7', '40,000', '6'], ['Millennial', '9', '10', '42', '5'], ['Gen Z', '10', '10', '-500', '4'], ['Gen Alpha', '11', '12', '0', '3']] } } 
    }
  ],
  practiceTasks: [
    { id: "line-001", type: "Line Graph", topic: "Declining Attention Spans", description: "The graph shows the average human attention span (in seconds) compared to a goldfish from 2000 to 2020.", key_data: "Human span plummeted from 12s to 8s. Goldfish remained steady at 9s.", visuals: [{ type: 'line', data: { labels: ['2000', '2005', '2010', '2015', '2020'], datasets: [ { label: 'Human (seconds)', data: [12, 10, 8.5, 8.2, 8], borderColor: '#ef4444', tension: 0.2 }, { label: 'Goldfish (seconds)', data: [9, 9, 9, 9, 9], borderColor: '#f59e0b', tension: 0.2 } ] } }] },
    { id: "bar-001", type: "Bar Chart", topic: "Corporate Buzzwords", description: "The chart highlights the frequency of insufferable office jargon used in meetings across three departments.", key_data: "'Circle Back' dominates Management (80 times). IT mostly uses 'Bandwidth'.", visuals: [{ type: 'bar', data: { labels: ['Management', 'Sales', 'IT'], datasets: [ { label: 'Circle Back', data: [80, 40, 10], backgroundColor: '#0ea5e9' }, { label: 'Synergy', data: [60, 90, 5], backgroundColor: '#8b5cf6' }, { label: 'Bandwidth', data: [20, 10, 75], backgroundColor: '#f59e0b' } ] } }] },
    { id: "pie-001", type: "Pie Chart", topic: "WFH Activity Breakdown", description: "The pie chart brutally exposes how remote workers actually spend their 8-hour shift.", key_data: "Actual work is only 25%. 'Looking busy on Slack' takes up 40%.", visuals: [{ type: 'doughnut', data: { labels: ['Actual Work', 'Looking Busy', 'Snacks', 'Petting Dog'], datasets: [{ data: [25, 40, 15, 20], backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ec4899'] }] } }] },
    { id: "table-001", type: "Table", topic: "The Economics of Avocado Toast", description: "The table compares the cost of avocado toast versus the ability to buy a house in 4 major cities.", key_data: "Sydney has the highest toast cost ($22) and 0% home ownership chance. Direct inverse correlation.", visuals: [{ type: 'table', data: { headers: ['City', 'Avg Toast Cost', 'House Price ($M)', 'Chance of Buying'], rows: [['Sydney', '$22', '1.5', '0%'], ['London', '$18', '1.2', '2%'], ['New York', '$20', '1.4', '1%'], ['Some Village', '$5', '0.2', '80%']] } }] },
    { id: "map-001", type: "Map", topic: "Gentrification of a Neighbourhood", description: "The maps show a cool, affordable neighbourhood in 2010 and its current gentrified state.", key_data: "Local bakery replaced by $7 coffee shop. Affordable housing demolished for luxury lofts.", visuals: [{ type: 'map', data: { title1: '2010 (Affordable)', items1: ['Local Bakery', 'Cheap Rent', 'Dive Bar', 'Park'], title2: '2024 (Gentrified)', items2: ['$7 Coffee', 'Luxury Lofts', 'IPA Brewery', 'Dog Spa'] } }] },
    { id: "process-001", type: "Process", topic: "The Modern Dating Cycle", description: "The diagram illustrates the repetitive and soul-crushing process of modern app dating.", key_data: "4 main stages. Download app, swipe endlessly, go on terrible date, delete app (repeat).", visuals: [{ type: 'process', data: { steps: ['Download App', 'Swipe Endlessly', 'Awkward Date', 'Delete App', 'Repeat'] } }] },
    { id: "multi-001", type: "Multiple Graphs", topic: "Coffee Intake vs Productivity", description: "The bar chart shows cups of coffee consumed, and the line graph shows actual tasks completed over a workday.", key_data: "Coffee peaks at 9 AM and 2 PM. Productivity peaks once at 10 AM, then plummets to zero by 3 PM.", visuals: [
        { type: 'bar', data: { labels: ['9 AM', '11 AM', '1 PM', '3 PM', '5 PM'], datasets: [ { label: 'Coffee Cups', data: [3, 1, 2, 4, 1], backgroundColor: '#8b4513' } ] } },
        { type: 'line', data: { labels: ['9 AM', '11 AM', '1 PM', '3 PM', '5 PM'], datasets: [ { label: 'Tasks Completed', data: [1, 5, 2, 0, 0], borderColor: '#10b981', tension: 0.3 } ] } }
      ] 
    },
    { id: "multi-002", type: "Multiple Graphs", topic: "Meetings That Could Have Been Emails", description: "The pie chart shows the percentage of useless meetings, and the table shows the cost to company morale.", key_data: "80% of meetings are useless. Morale drops by 50% for every 'Synergy Sync'.", visuals: [
        { type: 'doughnut', data: { labels: ['Useless', 'Somewhat Useful', 'Crucial'], datasets: [{ data: [80, 15, 5], backgroundColor: ['#ef4444', '#f59e0b', '#10b981'] }] } },
        { type: 'table', data: { headers: ['Meeting Type', 'Duration', 'Morale Impact', 'Emails Sent Instead'], rows: [['Synergy Sync', '1 Hr', '-50%', '0'], ['Standup', '30 Min', '-20%', '0'], ['Actual Emergency', '10 Min', '+10%', '0']] } }
      ] 
    },
    { id: "multi-003", type: "Multiple Graphs", topic: "Social Media Usage by Generation", description: "The bar chart shows daily hours on social media, while the pie chart shows preferred platforms for Gen Z.", key_data: "Gen Z spends 6 hours daily. TikTok completely dominates their platform choice (70%).", visuals: [
        { type: 'bar', data: { labels: ['Boomers', 'Gen X', 'Millennials', 'Gen Z'], datasets: [ { label: 'Hours/Day', data: [2, 3, 5, 6], backgroundColor: '#3b82f6' } ] } },
        { type: 'pie', data: { labels: ['TikTok', 'Insta', 'Snapchat', 'Facebook'], datasets: [{ data: [70, 20, 9, 1], backgroundColor: ['#0f172a', '#ec4899', '#eab308', '#3b82f6'] }] } }
      ] 
    },
    { id: "multi-004", type: "Multiple Graphs", topic: "Online Shopping Regrets", description: "The pie chart breaks down items bought impulsively online, and the bar chart shows the regret level out of 10.", key_data: "Gadgets make up 50% of purchases but have the highest regret score (9.5/10).", visuals: [
        { type: 'doughnut', data: { labels: ['Gadgets', 'Clothes', 'Gym Gear', 'Books'], datasets: [{ data: [50, 30, 15, 5], backgroundColor: ['#8b5cf6', '#ec4899', '#10b981', '#3b82f6'] }] } },
        { type: 'bar', data: { labels: ['Gadgets', 'Clothes', 'Gym Gear', 'Books'], datasets: [ { label: 'Regret Level (1-10)', data: [9.5, 7, 8, 2], backgroundColor: '#ef4444' } ] } }
      ] 
    },
    { id: "multi-005", type: "Multiple Graphs", topic: "Dating App Swipes vs Reality", description: "The line graph tracks the volume of right swipes over a week, while the table details the reasons for ghosting.", key_data: "Swipes peak on Sunday. The primary reason for ghosting is 'Found a better option' (45%).", visuals: [
        { type: 'line', data: { labels: ['Mon', 'Wed', 'Fri', 'Sun'], datasets: [ { label: 'Right Swipes', data: [50, 60, 150, 300], borderColor: '#ec4899', tension: 0.4 } ] } },
        { type: 'table', data: { headers: ['Reason for Ghosting', '% of Users'], rows: [['Found a better option', '45%'], ['Too clingy', '25%'], ['Forgot to reply', '20%'], ['Existential crisis', '10%']] } }
      ] 
    }
  ]
};

// ============================================================================
// 2. BACKEND CONNECTOR
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
// 3. MAIN REACT COMPONENT
// ============================================================================

export default function App() {
  const [activeTab, setActiveTab] = useState('basics');

  // --- Paraphrase State ---
  const [revealedChips, setRevealedChips] = useState({});
  const [paraphraseInput, setParaphraseInput] = useState('');
  const [paraphraseFeedback, setParaphraseFeedback] = useState(null);
  const [isEvaluatingParaphrase, setIsEvaluatingParaphrase] = useState(false);
  const paraphrasePracticePrompt = "The table shows the amount of coffee consumed per person in Italy, France, and Germany from 2010 to 2015.";

  // Paraphrase Quiz State
  const [activeQuizQuestion, setActiveQuizQuestion] = useState(0);
  const [selectedQuizOption, setSelectedQuizOption] = useState(null);
  const [quizFeedback, setQuizFeedback] = useState(null);
  const [isEvaluatingQuiz, setIsEvaluatingQuiz] = useState(false);

  const toggleChip = (qIdx, sIdx) => {
    setRevealedChips(prev => ({ ...prev, [`${qIdx}-${sIdx}`]: !prev[`${qIdx}-${sIdx}`] }));
  };

  const handleParaphraseSubmit = async () => {
    setIsEvaluatingParaphrase(true);
    setParaphraseFeedback(null);
    const result = await callEvaluatorAPI('paraphrase', {
      paraphrase: paraphraseInput,
      original: paraphrasePracticePrompt
    });
    setParaphraseFeedback(result);
    setIsEvaluatingParaphrase(false);
  };

  const handleQuizSubmit = async () => {
    if (selectedQuizOption === null) return;
    setIsEvaluatingQuiz(true);
    setQuizFeedback(null);
    const q = dataHub.paraphraseQuiz[activeQuizQuestion];
    const option = q.options[selectedQuizOption];
    
    const result = await callEvaluatorAPI('quiz', {
      prompt: q.prompt,
      optionText: option.text
    });
    setQuizFeedback(result);
    setIsEvaluatingQuiz(false);
  };

  const nextQuizQuestion = () => {
      setSelectedQuizOption(null);
      setQuizFeedback(null);
      setActiveQuizQuestion((prev) => (prev + 1) % dataHub.paraphraseQuiz.length);
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
      const result = await callEvaluatorAPI('deepdive', {
        question: selectedStudyType.guidingQuestion,
        answer: deepDiveAnswer
      });
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

  return (
    <div className="bg-slate-900 app-bg pb-20 min-h-screen">
      
      {/* Header Section */}
      <header className="pt-12 pb-8 px-4 text-center animate-fade-in drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-lora font-bold text-white tracking-tight mb-3">Unit 1: IELTS Task 1</h1>
        <p className="text-lg md:text-xl font-medium text-slate-100 max-w-2xl mx-auto italic">Because a picture is worth 150 words (and your sanity).</p>
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Hardcoded glassmorphism to guarantee contrast and clean spacing */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl border border-white/60">
          
          {/* Navigation Tabs - Full inline padding and grid locks prevents compression */}
          <nav className="bg-white/60 border-b border-gray-200 flex overflow-x-auto no-scrollbar">
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
          <div className="p-6 md:p-10">
            
            {/* TAB 0: NEWCOMER GUIDE */}
            {activeTab === 'basics' && (
              <section className="space-y-10">
                <div>
                  <h2 className="text-3xl font-lora font-bold text-indigo-900 mb-4 flex items-center">
                    <Zap className="mr-3 text-amber-500" fill="currentColor" /> Welcome to the Chaos
                  </h2>
                  <p className="text-slate-700 text-lg leading-relaxed">
                    If you are new to IELTS Writing Task 1, congratulations. You are about to spend 20 minutes describing data that literally no one cares about. Here is a totally serious (not really) guide to the six types of visuals you will encounter.
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {dataHub.newcomerGuide.map((item, idx) => (
                    <div key={idx} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm flex flex-col h-full relative overflow-hidden hover:shadow-md transition-shadow">
                      <div className="flex items-center mb-3 pb-3 border-b border-gray-100">
                        <div className="p-3 bg-gray-50 rounded-lg mr-4">
                          {item.icon}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg">{item.type}</h3>
                          <p className="text-xs text-gray-500 italic mt-0.5">{item.title}</p>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50/80 p-3 rounded-lg mb-4 border border-gray-100 flex-shrink-0">
                        <VisualRenderer visual={item.visual} height="130px" options={{ animation: false }} />
                      </div>

                      <div className="flex flex-col flex-grow mt-auto">
                         <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2 flex items-center">
                            <Lightbulb className="w-4 h-4 mr-1" /> The Real Advice
                         </h4>
                         <p className="text-slate-600 leading-relaxed text-sm">
                           {item.advice}
                         </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* TAB 1: STRUCTURE */}
            {activeTab === 'structure' && (
              <section className="space-y-10">
                <div>
                  <h2 className="text-3xl font-lora font-bold text-indigo-900 mb-4">The 3-Step Survival Structure</h2>
                  <p className="text-slate-700 text-lg leading-relaxed">
                    Deviating from this structure is a fantastic way to secure a Band 5. Memorize this format. Let's apply it to a highly relevant academic topic: <strong className="text-indigo-600">"Average daily hours spent WFH (Working From Home)"</strong>.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm mb-8">
                  <ChartCanvas type={dataHub.structureGuide.chart.type} data={dataHub.structureGuide.chart.data} height="200px" options={{ indexAxis: 'y', plugins: { legend: { display: false } } }} />
                </div>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-xl p-6 border-t-4 border-indigo-500 shadow-md">
                    <h3 className="font-bold text-indigo-800 text-xl mb-3 flex items-center">
                      <span className="bg-indigo-100 text-indigo-800 w-8 h-8 rounded-full flex items-center justify-center mr-2 text-sm">1</span> 
                      Introduction
                    </h3>
                    <p className="text-slate-600 text-sm mb-4">Paraphrase the prompt. State what the chart shows without spilling the data.</p>
                    <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 font-lora text-indigo-900 italic text-sm">
                      "The bar chart brutally exposes how remote workers allocate their time across four daily activities."
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-6 border-t-4 border-emerald-500 shadow-md relative transform md:-translate-y-4">
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Crucial</div>
                    <h3 className="font-bold text-emerald-800 text-xl mb-3 flex items-center">
                      <span className="bg-emerald-100 text-emerald-800 w-8 h-8 rounded-full flex items-center justify-center mr-2 text-sm">2</span> 
                      Overview
                    </h3>
                    <p className="text-slate-600 text-sm mb-4">Summarise the main trends. No numbers allowed here. If you miss this, you fail Task Achievement.</p>
                    <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100 font-lora text-indigo-900 italic text-sm">
                      "Overall, scrolling social media and staring blankly heavily dominate the day, while actual productive work is the least prevalent activity."
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-6 border-t-4 border-amber-500 shadow-md">
                    <h3 className="font-bold text-amber-800 text-xl mb-3 flex items-center">
                      <span className="bg-amber-100 text-amber-800 w-8 h-8 rounded-full flex items-center justify-center mr-2 text-sm">3</span> 
                      Details
                    </h3>
                    <p className="text-slate-600 text-sm mb-4">Group similar data logically. Provide the actual numbers to prove your overview isn't a lie.</p>
                    <div className="bg-amber-50 p-4 rounded-lg border border-amber-100 font-lora text-indigo-900 italic text-sm space-y-2">
                      <p>"Specifically, scrolling consumes a staggering 4.5 hours, which is exactly triple the time spent actually working (1.5 hours)."</p>
                      <p className="font-bold text-amber-700">"Furthermore, staring blankly at the screen accounts for a solid 3 hours, completely overshadowing the time dedicated to snacking."</p>
                      <p className="font-bold text-amber-800 border-t border-amber-200 pt-2 mt-2">"In stark contrast, actual productive work ranks the lowest, plateauing at a mere 1.5 hours daily."</p>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* TAB 2: TRENDS */}
            {activeTab === 'change' && (
              <section className="space-y-10">
                <div>
                  <h2 className="text-3xl font-lora font-bold text-indigo-900 mb-4">Describing Trends & Chaos</h2>
                  <p className="text-slate-700 text-lg leading-relaxed">
                    If you use the word "increase" four times in one paragraph, the examiner will cry. Use these advanced phrases to describe the trajectory of your data.
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {dataHub.languageOfChange.map((item, idx) => (
                    <div key={idx} className={`rounded-xl p-6 ${item.colors.bg} border ${item.colors.border} flex flex-col h-full shadow-sm`}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className={`font-bold ${item.colors.text} text-2xl flex items-center`}>
                          <span className="mr-3 text-3xl">{item.icon}</span> {item.title}
                        </h3>
                      </div>
                      
                      <div className="bg-white/90 rounded-xl p-3 mb-5 border border-white/60 shadow-sm">
                        <ChartCanvas type={item.chartType} data={item.chartData} height="120px" options={{ plugins: { legend: { display: false } }, animation: false }} />
                      </div>
                      
                      <p className={`font-bold ${item.colors.text} mb-4 text-base flex-grow tracking-wide`}>{item.words}</p>
                      <div className="bg-white/80 p-4 rounded-lg border border-white/50 relative">
                         <div className="absolute top-0 left-4 transform -translate-y-1/2 bg-white px-2 text-xs font-bold text-gray-400 uppercase tracking-widest">In the Wild</div>
                         <p className="text-slate-700 font-lora italic text-sm mt-1">{item.example}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-8 border-t border-gray-200">
                   <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                      <Activity className="mr-2 text-indigo-600" /> The 15 Sentences of Chaos (Mini-Drill)
                   </h3>
                   <p className="text-slate-600 mb-8">Study these highly realistic sentences to master the vocabulary of despair and triumph.</p>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {dataHub.trendSentences.map((sentence, sIdx) => (
                         <div key={sIdx} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex items-center space-x-4">
                            <div className="w-16 h-10 flex-shrink-0 bg-slate-50 rounded border border-slate-100 p-1">
                               <ChartCanvas 
                                type="line" 
                                data={{ labels: ['1','2','3','4'], datasets: [{ data: sentence.data, borderColor: '#6366f1', tension: 0.3 }] }} 
                                height="100%" 
                                options={{ plugins: { legend: { display: false }, tooltip: { enabled: false } }, scales: { x: { display: false }, y: { display: false } }, animation: false }} 
                               />
                            </div>
                            <p className="text-sm font-medium text-slate-700">{sentence.text}</p>
                         </div>
                      ))}
                   </div>
                </div>
              </section>
            )}

            {/* TAB 3: PARAPHRASING LAB */}
            {activeTab === 'paraphrase' && (
              <section className="space-y-8">
                <div>
                  <h2 className="text-3xl font-lora font-bold text-indigo-900 mb-4">Paraphrasing Lab</h2>
                  <p className="text-slate-700 text-lg leading-relaxed mb-6">
                    <strong>Rule 1:</strong> Don't copy the prompt. <br/>
                    <strong>Rule 2:</strong> Don't use a synonym if you don't know exactly how it works. <br/>
                    How do we paraphrase? Here are the 3 main techniques:
                  </p>
                  
                  <div className="grid md:grid-cols-3 gap-6 mb-8">
                     <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                        <h4 className="font-bold text-indigo-800 mb-2 border-b border-indigo-100 pb-2">1. Use Synonyms</h4>
                        <p className="text-sm text-slate-600 mb-2">Replace words with identical meanings.</p>
                        <p className="text-xs text-gray-500 line-through">"shows the number of"</p>
                        <p className="text-sm text-indigo-600 font-bold">"illustrates the proportion of"</p>
                     </div>
                     <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                        <h4 className="font-bold text-indigo-800 mb-2 border-b border-indigo-100 pb-2">2. Change Word Class</h4>
                        <p className="text-sm text-slate-600 mb-2">Change a noun to a verb, etc.</p>
                        <p className="text-xs text-gray-500 line-through">"consumption of fast food"</p>
                        <p className="text-sm text-indigo-600 font-bold">"how much fast food was consumed"</p>
                     </div>
                     <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                        <h4 className="font-bold text-indigo-800 mb-2 border-b border-indigo-100 pb-2">3. Change the Structure</h4>
                        <p className="text-sm text-slate-600 mb-2">Move from Active to Passive voice.</p>
                        <p className="text-xs text-gray-500 line-through">"people spent money on..."</p>
                        <p className="text-sm text-indigo-600 font-bold">"money was spent by people on..."</p>
                     </div>
                  </div>
                </div>
                
                {/* Spot the Bad Paraphrase Game */}
                <div className="bg-indigo-50/50 p-6 md:p-8 rounded-2xl border border-indigo-100 mb-8 animate-fade-in">
                    <h3 className="text-2xl font-bold text-indigo-900 mb-4 flex items-center">
                      <AlertCircle className="w-6 h-6 mr-2 text-rose-500" /> Spot the Terrible Paraphrase
                    </h3>
                    <p className="text-slate-700 mb-6">Read the prompt below. Choose the best paraphrase. If you pick the wrong one, the AI will sarcastically explain why you missed crucial items or dates.</p>
                    
                    <div className="bg-white p-5 rounded-xl border border-gray-300 font-lora text-lg font-bold text-slate-800 mb-6 shadow-sm">
                      Prompt: "{dataHub.paraphraseQuiz[activeQuizQuestion].prompt}"
                    </div>
                    
                    <div className="space-y-3 mb-6">
                      {dataHub.paraphraseQuiz[activeQuizQuestion].options.map((option, idx) => (
                         <div 
                           key={idx} 
                           onClick={() => setSelectedQuizOption(idx)}
                           className={`p-4 rounded-xl cursor-pointer flex items-start border-2 transition-all ${
                             selectedQuizOption === idx 
                             ? 'border-indigo-600 bg-indigo-50/50' 
                             : 'bg-white border-gray-200 shadow-sm hover:border-indigo-300'
                           }`}
                         >
                            <div className={`w-5 h-5 rounded-full border-2 mr-4 mt-0.5 flex-shrink-0 ${selectedQuizOption === idx ? 'border-indigo-600 bg-indigo-600' : 'border-gray-400'}`}></div>
                            <span className="text-slate-800 font-medium">{option.text}</span>
                         </div>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <button 
                        onClick={handleQuizSubmit}
                        disabled={isEvaluatingQuiz || selectedQuizOption === null}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center transition-colors shadow-md disabled:bg-slate-300"
                      >
                        {isEvaluatingQuiz ? <RefreshCw className="w-5 h-5 mr-2 animate-spin" /> : <MessageSquare className="w-5 h-5 mr-2" />}
                        Evaluate Choice
                      </button>
                      {quizFeedback && (
                         <button onClick={nextQuizQuestion} className="px-6 py-3 bg-white border border-gray-300 text-slate-700 font-bold rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center">
                            Next Question
                         </button>
                      )}
                    </div>

                    {quizFeedback && (
                      <div className="mt-6 p-6 bg-white border border-indigo-200 rounded-xl shadow-md prose prose-indigo max-w-none">
                        <h4 className="font-bold text-lg m-0 flex items-center mb-3 text-slate-900">
                          <Zap className="w-5 h-5 text-amber-500 mr-2" fill="currentColor"/> AI Examiner Feedback
                        </h4>
                        <div className="text-slate-700 whitespace-pre-wrap">{quizFeedback}</div>
                      </div>
                    )}
                </div>

                <h3 className="text-2xl font-bold text-slate-800 mt-12 mb-6">Quick Reference Examples</h3>
                <div className="grid lg:grid-cols-2 gap-6">
                  {dataHub.paraphrasing.map((item, qIdx) => (
                    <div key={qIdx} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 grid md:grid-cols-[1.5fr_1fr] gap-6 items-center hover:shadow-md transition-shadow">
                      <div>
                        <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 bg-indigo-50 rounded-lg px-3 py-1.5 w-fit uppercase tracking-wider mb-4">
                          <BarChart2 className="w-4 h-4" /> {item.context}
                        </div>
                        <p className="font-lora text-base text-slate-900 mb-4 pb-4 border-b border-gray-50 italic">"{item.original}"</p>
                        <div className="flex flex-wrap gap-2">
                          {item.synonyms.map((synonym, sIdx) => {
                            const isRevealed = revealedChips[`${qIdx}-${sIdx}`];
                            return (
                              <button 
                                key={sIdx} 
                                onClick={() => toggleChip(qIdx, sIdx)}
                                className={`px-4 py-2 text-xs font-semibold rounded-full border transition-all ${
                                  isRevealed 
                                  ? 'bg-indigo-100 border-indigo-400 text-indigo-800 font-bold' 
                                  : 'bg-white border-gray-300 text-slate-500 hover:border-indigo-400'
                                }`}
                              >
                                {isRevealed ? synonym : `Reveal Option ${sIdx + 1}`}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      <div className="bg-gray-50/80 p-3 rounded-xl border border-gray-100 w-full h-full flex flex-col justify-center">
                        <ChartCanvas type={item.chartType} data={item.chartData} height="120px" options={{ plugins: { legend: { display: false } }, animation: false }} />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* TAB 4: PREPOSITIONS */}
            {activeTab === 'prepositions' && (
              <section className="space-y-8 animate-fade-in">
                <div>
                  <h2 className="text-3xl font-lora font-bold text-indigo-900 mb-4">The Preposition Minefield</h2>
                  <p className="text-slate-700 text-lg leading-relaxed">
                    Nothing exposes a weak grammar score faster than saying something "increased <i>to</i> 20%" when you meant "increased <i>by</i> 20%". Fill in the gaps correctly.
                  </p>
                </div>
                
                <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-200">
                  <div className="grid lg:grid-cols-2 gap-x-12 gap-y-8">
                    {dataHub.prepositions.map((item, qIdx) => {
                      const parts = item.text.split('_');
                      return (
                        <div key={qIdx} className="text-lg text-slate-800 leading-loose pb-4 border-b border-gray-50 flex flex-wrap items-center">
                          {parts.map((part, pIdx) => (
                            <React.Fragment key={pIdx}>
                              {part}
                              {pIdx < parts.length - 1 && (
                                <input 
                                  className={`border-b-2 mx-2 text-center font-bold text-slate-950 outline-none w-20 transition-all ${
                                    prepChecked 
                                    ? (prepInputs[`${qIdx}-${pIdx}`]?.toLowerCase().trim() === item.answers[pIdx] ? 'bg-emerald-50 border-emerald-500 text-emerald-800' : 'bg-rose-50 border-rose-500 text-rose-800') 
                                    : 'border-slate-300 focus:border-indigo-600'
                                  }`}
                                  value={prepInputs[`${qIdx}-${pIdx}`] || ''}
                                  onChange={(e) => handlePrepChange(qIdx, pIdx, e.target.value)}
                                  placeholder="?"
                                />
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="pt-10 mt-6 border-t border-gray-200 flex justify-center">
                    <button onClick={() => setPrepChecked(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-16 text-lg rounded-xl shadow-lg transition-colors shadow-indigo-500/20">
                      Check My Grammar
                    </button>
                  </div>
                </div>
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
                      <div key={qIdx} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 flex flex-col hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2 text-xs font-bold text-rose-600 bg-rose-50 rounded-lg px-3 py-1.5 w-fit uppercase tracking-wider mb-6 border border-rose-100">
                          <AlertCircle className="w-4 h-4" /> Issue: {item.context}
                        </div>
                        
                        <p className="text-xl leading-relaxed flex flex-wrap gap-1 font-lora mb-6">
                          {words.map((w, wIdx) => {
                            const cleanWord = w.replace(/[.,]/g, '');
                            const isError = cleanWord === item.errorWord;
                            const status = errorStatus[`${qIdx}-${w}`];
                            return (
                              <span 
                                key={wIdx} 
                                onClick={() => handleErrorClick(qIdx, isError, w)}
                                className={`cursor-pointer px-1.5 py-0.5 rounded transition-all ${
                                  status === 'correct' ? 'bg-emerald-100 text-emerald-800 font-bold' :
                                  status === 'wrong' ? 'bg-rose-100 text-rose-800' : 'hover:bg-slate-100'
                                }`}
                              >
                                {w}
                              </span>
                            );
                          })}
                        </p>
                        
                        {Object.keys(errorStatus).some(k => k.startsWith(`${qIdx}-`) && errorStatus[k] === 'correct') && (
                          <div className="mt-auto p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 font-medium flex items-center animate-fade-in text-sm shadow-inner">
                            <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0 text-emerald-500" /> Correct! It should be "{item.correction}".
                          </div>
                        )}
                      </div>
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
                      <p className="text-slate-700 text-lg leading-relaxed">
                        Before you work in the Exam Simulator, take a moment to study the specific strategies for each chart type. Click a card to start.
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {dataHub.deepDiveTopics.map(topic => (
                        <div 
                          key={topic.id} 
                          onClick={() => { setSelectedStudyType(topic); setDeepDiveAnswer(''); setDeepDiveFeedback(null); }}
                          className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm cursor-pointer group relative overflow-hidden hover:border-indigo-400 hover:shadow-md transition-all"
                        >
                          <div className="absolute top-0 right-0 bg-indigo-50 w-24 h-24 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                          <h3 className="font-bold text-xl text-slate-900 mb-2 relative z-10">{topic.title}</h3>
                          <p className="text-slate-500 text-sm mb-4 relative z-10">{topic.subtitle}</p>
                          <div className="mt-4 flex items-center text-indigo-600 font-semibold text-sm relative z-10 group-hover:translate-x-2 transition-transform">
                            Study Now <ArrowRight className="w-4 h-4 ml-1" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="animate-fade-in bg-white p-8 rounded-3xl shadow-lg border border-gray-200">
                    <button 
                      onClick={() => setSelectedStudyType(null)}
                      className="flex items-center text-slate-500 hover:text-indigo-600 transition-colors font-bold text-sm uppercase tracking-wider mb-8 bg-gray-50 px-4 py-2 rounded-full w-fit"
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" /> Back to Topics
                    </button>

                    <div className="grid lg:grid-cols-12 gap-12 items-start">
                      <div className="lg:col-span-6">
                        <h2 className="text-4xl font-lora font-bold text-slate-900 mb-3">{selectedStudyType.title}</h2>
                        <p className="text-xl text-indigo-600 font-medium mb-8 italic">{selectedStudyType.subtitle}</p>
                        
                        <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 relative mb-8">
                           <div className="absolute -top-3 left-6 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">The Strategy</div>
                           <p className="text-slate-800 text-lg leading-relaxed font-lora">
                             {selectedStudyType.content}
                           </p>
                        </div>

                        <div className="bg-amber-50 p-6 rounded-2xl border border-amber-200">
                           <h4 className="font-bold text-amber-900 mb-3 flex items-center"><Edit3 className="w-5 h-5 mr-2"/> Think & Apply</h4>
                           <p className="text-amber-800 text-sm mb-4 font-semibold">{selectedStudyType.guidingQuestion}</p>
                           <textarea 
                              className="w-full p-4 rounded-xl border border-amber-300 focus:ring-2 focus:ring-amber-500 outline-none mb-4 font-lora text-lg bg-white"
                              rows="4"
                              placeholder="Answer the guiding question above to test your skills..."
                              value={deepDiveAnswer}
                              onChange={(e) => setDeepDiveAnswer(e.target.value)}
                           />
                           <button 
                              onClick={handleDeepDiveSubmit}
                              disabled={isEvaluatingDeepDive || !deepDiveAnswer.trim()}
                              className="w-full flex justify-center items-center text-white font-bold py-3 rounded-xl transition-all shadow-md disabled:bg-slate-300"
                              style={{ background: 'linear-gradient(135deg, #f59e0b, #ea580c)' }}
                           >
                             {isEvaluatingDeepDive ? <RefreshCw className="w-5 h-5 mr-2 animate-spin" /> : <MessageSquare className="w-5 h-5 mr-2" />} 
                             Get Tutor Feedback
                           </button>

                           {deepDiveFeedback && (
                              <div className="mt-6 p-5 bg-white rounded-xl border border-amber-100 shadow-sm max-w-none text-sm animate-fade-in text-slate-800">
                                <div className="whitespace-pre-wrap">{deepDiveFeedback}</div>
                              </div>
                           )}
                        </div>
                      </div>

                      <div className="lg:col-span-6 bg-gray-50 rounded-2xl p-6 border border-gray-200 shadow-inner flex flex-col justify-center sticky top-24 w-full overflow-hidden">
                         <VisualRenderer visual={selectedStudyType.visual} height="350px" />
                      </div>
                    </div>
                  </div>
                )}

              </section>
            )}

            {/* TAB 7: EXAM SIMULATOR */}
            {activeTab === 'simulator' && (
              <section className="space-y-8 animate-fade-in">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                  <div>
                    <h2 className="text-3xl font-lora font-bold text-indigo-900 mb-2">The Execution Zone</h2>
                    <p className="text-slate-700 text-lg">Analyze the visual data, write 150+ words, and get automated examiner analysis.</p>
                  </div>
                  <select 
                    value={selectedTaskIndex}
                    onChange={(e) => setSelectedTaskIndex(Number(e.target.value))}
                    className="bg-white border-2 border-indigo-200 text-indigo-900 rounded-xl block p-3 shadow-sm font-bold outline-none cursor-pointer max-w-full truncate w-full md:w-auto transition-colors hover:border-indigo-300"
                  >
                    {dataHub.practiceTasks.map((task, idx) => (
                      <option key={task.id} value={idx}>{task.type}: {task.topic}</option>
                    ))}
                  </select>
                </div>

                <div className="grid lg:grid-cols-12 gap-8">
                  
                  {/* Left Column: Prompt & Chart */}
                  <div className="lg:col-span-6 xl:col-span-5 space-y-6">
                    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-md border border-gray-200">
                      <div className="flex items-center space-x-3 mb-5">
                        <span className="px-3 py-1 bg-indigo-600 text-white text-xs font-black uppercase rounded-lg tracking-widest shadow-sm">{activeTask.type}</span>
                        <h3 className="text-xl font-bold text-gray-900 leading-tight">{activeTask.topic}</h3>
                      </div>
                      <p className="text-slate-700 font-lora italic text-lg border-l-4 border-indigo-400 pl-5 mb-8 bg-gray-50 py-3 rounded-r-lg">
                        "{activeTask.description}"
                      </p>
                      
                      <div className="space-y-6">
                        {activeTask.visuals.map((visual, vIdx) => (
                          <div key={vIdx} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm flex justify-center w-full overflow-x-auto relative">
                             <VisualRenderer visual={visual} height={activeTask.visuals.length > 1 ? "200px" : "280px"} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Editor */}
                  <div className="lg:col-span-6 xl:col-span-7 flex flex-col h-full">
                    <div className="bg-white shadow-xl rounded-2xl border border-gray-200 overflow-hidden flex flex-col h-[600px] lg:h-full min-h-[550px]">
                      <div className="p-4 bg-gray-100 border-b border-gray-200 flex justify-between items-center">
                        <div className="flex space-x-2">
                          <div className="w-3.5 h-3.5 rounded-full bg-rose-400 shadow-sm"></div>
                          <div className="w-3.5 h-3.5 rounded-full bg-amber-400 shadow-sm"></div>
                          <div className="w-3.5 h-3.5 rounded-full bg-emerald-400 shadow-sm"></div>
                        </div>
                        <span className="text-xs font-black text-slate-500 uppercase tracking-widest hidden sm:block">IELTS Official Writing Sandbox</span>
                        <div className="w-12 hidden sm:block"></div>
                      </div>
                      
                      <textarea
                        className="w-full flex-grow p-8 bg-white focus:ring-0 focus:outline-none font-lora text-lg text-slate-800 leading-loose resize-none placeholder:text-slate-300"
                        placeholder="Begin writing here. Ensure you include an overview..."
                        value={essay}
                        onChange={handleTextChange}
                      />

                      <div className="p-5 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4 mt-auto">
                        <div className="flex items-center space-x-4 w-full sm:w-auto">
                          <div className={`flex items-center px-4 py-2 rounded-xl border-2 font-bold transition-colors ${wordCount < 150 ? 'bg-rose-50 text-rose-700 border-rose-300' : 'bg-emerald-50 text-emerald-800 border-emerald-300'}`}>
                            Words: {wordCount}
                          </div>
                          <span className="text-sm font-bold text-indigo-600 transition-opacity">{saveStatus}</span>
                        </div>
                        
                        <div className="flex space-x-3 w-full sm:w-auto">
                          <button onClick={handleSaveProgress} className="flex-1 sm:flex-none flex items-center justify-center px-6 py-3 bg-white border-2 border-gray-200 text-slate-700 rounded-xl hover:bg-gray-100 transition font-bold shadow-sm">
                            <Save className="w-4 h-4 mr-2" /> Save
                          </button>
                          <button 
                            onClick={handleSubmit}
                            disabled={isEvaluating || essay.trim().length === 0}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white flex-1 sm:flex-none flex items-center justify-center whitespace-nowrap px-8 py-3 text-lg font-bold rounded-xl transition-colors disabled:bg-slate-300 shadow-md"
                          >
                            {isEvaluating ? <RefreshCw className="w-5 h-5 mr-2 animate-spin" /> : <Send className="w-5 h-5 mr-2" />} 
                            {isEvaluating ? 'Judging...' : 'Submit Essay'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Feedback */}
                {feedback && (
                  <div className="bg-gray-900 rounded-3xl overflow-hidden shadow-2xl animate-fade-in border border-gray-800 mt-12 relative">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
                    <div className="bg-gray-800/50 p-6 flex items-center border-b border-gray-700">
                      <CheckCircle className="w-8 h-8 text-emerald-400 mr-4" />
                      <div>
                        <h3 className="text-2xl font-bold text-white font-lora">The Verdict</h3>
                        <p className="text-gray-400 text-sm mt-1">Review your formal feedback diagnostics.</p>
                      </div>
                    </div>
                    <div className="p-8 md:p-10 text-gray-300 leading-relaxed font-inter">
                      <div className="whitespace-pre-wrap">{feedback}</div>
                    </div>
                  </div>
                )}
              </section>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
