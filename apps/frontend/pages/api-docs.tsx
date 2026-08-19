import React, { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import {
  Terminal,
  Code,
  Play,
  Layers,
  Cpu,
  Database,
  CheckCircle2,
  XCircle,
  Send,
  ThumbsUp,
  MessageSquare,
  Info
} from 'lucide-react';

interface Endpoint {
  method: 'GET' | 'POST';
  path: string;
  description: string;
  sampleBody?: any;
}

// Entities schemas
const schemas = [
  {
    name: "Idea",
    desc: "Represents a global developmental, business, or education idea/opinion shared by a member.",
    fields: [
      { name: "id", type: "string", desc: "Unique generated identifier" },
      { name: "title", type: "string", desc: "Short descriptive title of the idea" },
      { name: "category", type: "string", desc: "Pillar category ('Health' | 'Education' | 'Business' | 'Development')" },
      { name: "description", type: "string", desc: "Detailed breakdown of the innovation" },
      { name: "author", type: "string", desc: "Name of the publisher" },
      { name: "likes", type: "number", desc: "Upvote count" },
      { name: "comments", type: "Comment[]", desc: "Array of discussion comments" },
      { name: "createdAt", type: "string (ISO)", desc: "Timestamp of creation" }
    ]
  },
  {
    name: "ForumMessage",
    desc: "Represents a message sent to the global communication chat room.",
    fields: [
      { name: "id", type: "string", desc: "Unique message identifier" },
      { name: "username", type: "string", desc: "Chat user handle" },
      { name: "discipline", type: "string", desc: "Pillar topic ('STEM & Sciences' | 'Literature & Languages' | etc.)" },
      { name: "message", type: "string", desc: "Text content of the message" },
      { name: "timestamp", type: "string (ISO)", desc: "Timestamp when published" }
    ]
  }
];

const endpoints: Endpoint[] = [
  {
    method: 'GET',
    path: '/api/health',
    description: 'Fetch the runtime status, uptime, and timestamp of Mawaba Core API.'
  },
  {
    method: 'GET',
    path: '/api/ideas',
    description: 'Retrieve a list of all active development and business ideas.'
  },
  {
    method: 'POST',
    path: '/api/ideas',
    description: 'Publish a new global developmental or business idea.',
    sampleBody: {
      title: "Decentralized Clean Water Filters",
      category: "Development",
      description: "Deploying bio-sand water filtration kits tracked via local SMS queries.",
      author: "Evelyn Carter"
    }
  },
  {
    method: 'POST',
    path: '/api/ideas/{id}/like',
    description: 'Upvote/like a specific idea by providing its unique identifier.',
  },
  {
    method: 'POST',
    path: '/api/ideas/{id}/comments',
    description: 'Append an expert discussion comment/feedback to a specific idea.',
    sampleBody: {
      author: "Dr. Rachel Green",
      text: "We should pilot this in East Africa. The SMS telemetry is extremely promising!"
    }
  },
  {
    method: 'GET',
    path: '/api/forums/messages',
    description: 'Fetch all live communication and forum messages. Filter by ?discipline if needed.'
  },
  {
    method: 'POST',
    path: '/api/forums/messages',
    description: 'Publish an instant message to the global collaborative chat channels.',
    sampleBody: {
      username: "TeslaGiga",
      message: "Green energy storage is key to making solar clinics feasible 24/7.",
      discipline: "STEM & Sciences"
    }
  },
  {
    method: 'POST',
    path: '/api/ai/tutor',
    description: 'Interact with AI tutor powered by Google Gemini, OpenAI GPT, or Mawaba Engine.',
    sampleBody: {
      question: "How do we implement sustainable micro-grids?",
      discipline: "World Development",
      provider: "gemini",
      level: "Intermediate",
      responseType: "Explanation"
    }
  },
  {
    method: 'GET',
    path: '/api/integrations',
    description: 'Get all point-of-sale and commerce integration modules (Square, Clover, NCR, Toast, etc.).'
  },
  {
    method: 'GET',
    path: '/api/worldbank/countries',
    description: 'Fetch paginated global country profiles, regions, and income levels from World Bank API.'
  },
  {
    method: 'GET',
    path: '/api/worldbank/indicators',
    description: 'Fetch real-time development indicators (GDP, population, renewable energy, health expenditure) for a given country.'
  },
  {
    method: 'GET',
    path: '/api/worldbank/projects',
    description: 'Search official World Bank international development projects and funding initiatives.'
  }
];

const ApiDocsPage: NextPage = () => {
  const [activeTab, setActiveTab] = useState<'docs' | 'explorer'>('docs');
  const [activeLang, setActiveLang] = useState<'curl' | 'js' | 'python'>('curl');
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);

  // Explorer States
  const [selectedEndpoint, setSelectedEndpoint] = useState<number>(0);
  const [requestBody, setRequestBody] = useState<string>('');
  const [requestParam, setRequestParam] = useState<string>('');
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responseBody, setResponseBody] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Code Snippets generator
  const getCodeSnippet = (endpoint: Endpoint) => {
    const fullUrl = `http://localhost:3001${endpoint.path.replace('{id}', requestParam || '1')}`;
    const bodyStr = endpoint.sampleBody ? JSON.stringify(endpoint.sampleBody, null, 2) : '';

    if (activeLang === 'curl') {
      if (endpoint.method === 'GET') {
        return `curl -X GET "${fullUrl}"`;
      } else {
        return `curl -X POST "${fullUrl}" \\\n  -H "Content-Type: application/json" \\\n  -d '${bodyStr.replace(/\n/g, '\n  ')}'`;
      }
    } else if (activeLang === 'js') {
      if (endpoint.method === 'GET') {
        return `fetch("${fullUrl}")\n  .then(res => res.json())\n  .then(data => console.log(data));`;
      } else {
        return `fetch("${fullUrl}", {\n  method: "POST",\n  headers: { "Content-Type": "application/json" },\n  body: JSON.stringify(${bodyStr.replace(/\n/g, '\n  ')})\n})\n  .then(res => res.json())\n  .then(data => console.log(data));`;
      }
    } else { // Python
      if (endpoint.method === 'GET') {
        return `import requests\n\nresponse = requests.get("${fullUrl}")\nprint(response.json())`;
      } else {
        return `import requests\n\npayload = ${bodyStr.replace(/true/g, 'True').replace(/false/g, 'False')}\nresponse = requests.post(\n    "${fullUrl}",\n    json=payload\n)\nprint(response.json())`;
      }
    }
  };

  useEffect(() => {
    // Check if backend is running
    fetch('http://localhost:3001/api/health')
      .then(res => {
        if (res.ok) setBackendOnline(true);
        else setBackendOnline(false);
      })
      .catch(() => setBackendOnline(false));
  }, []);

  useEffect(() => {
    // Sync sample body when selected endpoint changes
    const endpoint = endpoints[selectedEndpoint];
    if (endpoint && endpoint.sampleBody) {
      setRequestBody(JSON.stringify(endpoint.sampleBody, null, 2));
    } else {
      setRequestBody('');
    }
    setResponseStatus(null);
    setResponseBody('');
    if (endpoint && endpoint.path.includes('{id}')) {
      setRequestParam('1'); // Default test id
    } else {
      setRequestParam('');
    }
  }, [selectedEndpoint]);

  const handleExecuteRequest = async () => {
    setLoading(true);
    setResponseStatus(null);
    setResponseBody('');

    const endpoint = endpoints[selectedEndpoint];
    let path = endpoint.path;
    if (path.includes('{id}')) {
      if (!requestParam.trim()) {
        setResponseStatus(400);
        setResponseBody(JSON.stringify({ error: "Required route parameter '{id}' is empty." }, null, 2));
        setLoading(false);
        return;
      }
      path = path.replace('{id}', requestParam.trim());
    }

    const fullUrl = `http://localhost:3001${path}`;

    try {
      const options: RequestInit = {
        method: endpoint.method,
        headers: {
          'Content-Type': 'application/json'
        }
      };

      if (endpoint.method === 'POST' && requestBody) {
        options.body = requestBody;
      }

      const res = await fetch(fullUrl, options);
      setResponseStatus(res.status);
      const data = await res.json();
      setResponseBody(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setResponseStatus(500);
      setResponseBody(JSON.stringify({
        error: "Failed to connect to backend API.",
        suggestion: "Ensure your backend server is running locally via 'npm --workspace=backend run dev' and listening on port 3001.",
        details: err.message
      }, null, 2));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Developer Portal & API Docs | Mawaba</title>
        <meta name="description" content="Integrate with Mawaba's developer API for global partnerships, idea sharing, and forums." />
      </Head>

      <div className="bg-gray-50 min-h-screen pb-20">
        {/* Portal Header */}
        <div className="bg-slate-900 text-white py-12 border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-blue-400 bg-blue-500/10 px-3 py-1.5 rounded-full border border-blue-500/20">
                  Developer Center
                </span>
                <h1 className="text-4xl font-extrabold tracking-tight mt-3 text-white">
                  Mawaba Core API Engine
                </h1>
                <p className="text-slate-400 mt-2 max-w-2xl text-sm md:text-base">
                  Connect your applications directly to Mawaba&apos;s global social workspace, peer forums, POS systems, and artificial intelligence tutors.
                </p>
              </div>

              {/* Server Status Badge */}
              <div className="flex items-center gap-3 bg-slate-800/80 p-4 rounded-2xl border border-slate-700 w-fit">
                <Database className="h-5 w-5 text-blue-400" />
                <div>
                  <span className="text-xs text-slate-400 block">API Environment</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`w-2 h-2 rounded-full ${backendOnline ? 'bg-green-500 animate-pulse' : 'bg-amber-500'}`}></span>
                    <span className="text-xs font-bold text-white">
                      {backendOnline === null ? 'Checking Status...' : backendOnline ? 'Local Backend Live (3001)' : 'Offline (Simulated)'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tab selector */}
            <div className="flex gap-2 mt-10 border-b border-slate-800">
              <button
                onClick={() => setActiveTab('docs')}
                className={`py-3 px-6 font-semibold text-sm transition-all border-b-2 flex items-center gap-2 ${
                  activeTab === 'docs' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Layers className="h-4 w-4" /> Reference & Schemas
              </button>
              <button
                onClick={() => setActiveTab('explorer')}
                className={`py-3 px-6 font-semibold text-sm transition-all border-b-2 flex items-center gap-2 ${
                  activeTab === 'explorer' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Terminal className="h-4 w-4" /> Interactive API Playground
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
          {activeTab === 'docs' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

              {/* Left Column: Specs */}
              <div className="lg:col-span-8 space-y-8">
                <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Info className="h-5 w-5 text-blue-600" /> Quick Start Guide
                  </h2>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    The Mawaba Core API is designed around REST design guidelines. All requests require JSON format for payloads, and respond with compliant HTTP status codes.
                  </p>
                  <div className="bg-amber-50 text-amber-800 p-4 rounded-xl text-xs flex gap-3 border border-amber-100 leading-relaxed">
                    <Cpu className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block mb-1">Local Testing Environment</span>
                      To communicate dynamically with the API, execute the backend workspace on your console:
                      <code className="block bg-amber-900/10 text-amber-950 p-2 rounded mt-1.5 font-semibold">
                        npm --workspace=backend run dev
                      </code>
                    </div>
                  </div>
                </section>

                {/* Endpoint Reference */}
                <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Code className="h-5 w-5 text-blue-600" /> Endpoint Index
                  </h2>
                  <div className="space-y-4">
                    {endpoints.map((ep, idx) => (
                      <div key={idx} className="p-4 rounded-xl border border-gray-50 bg-gray-50/50 hover:bg-gray-50 transition-all">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase ${
                            ep.method === 'GET' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-blue-100 text-blue-800 border border-blue-200'
                          }`}>
                            {ep.method}
                          </span>
                          <code className="text-sm font-bold text-gray-900">{ep.path}</code>
                        </div>
                        <p className="text-xs text-gray-500 mt-2 leading-relaxed">{ep.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* Right Column: Schemas & Structures */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Layers className="h-5 w-5 text-blue-600" /> Object Schemas
                  </h2>

                  <div className="space-y-6">
                    {schemas.map((schema, sIdx) => (
                      <div key={sIdx} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                        <span className="text-sm font-extrabold text-blue-600 block">{schema.name}</span>
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed mb-3">{schema.desc}</p>

                        <div className="bg-slate-50 rounded-xl p-3 max-h-[220px] overflow-y-auto border border-gray-100">
                          <table className="w-full text-left text-[11px]">
                            <thead>
                              <tr className="text-gray-400 border-b border-gray-100">
                                <th className="pb-1 font-bold">Field</th>
                                <th className="pb-1 font-bold">Type</th>
                              </tr>
                            </thead>
                            <tbody>
                              {schema.fields.map((f, fIdx) => (
                                <tr key={fIdx} className="border-b border-gray-50 last:border-none">
                                  <td className="py-1.5 font-mono font-bold text-slate-800">{f.name}</td>
                                  <td className="py-1.5 font-mono text-purple-600">{f.type}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          ) : (
            /* INTERACTIVE EXPLORER */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

              {/* Explorer Left Menu */}
              <div className="lg:col-span-4 space-y-3 bg-white p-4 rounded-2xl border border-gray-100 h-fit">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2 block mb-2">Select Endpoint</span>
                {endpoints.map((ep, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedEndpoint(idx)}
                    className={`w-full text-left p-3 rounded-xl border text-xs font-medium transition-all flex flex-col gap-1.5 ${
                      selectedEndpoint === idx
                        ? 'bg-blue-50 border-blue-200 text-blue-900 shadow-sm'
                        : 'bg-white border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                        ep.method === 'GET' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {ep.method}
                      </span>
                      <code className="font-mono text-[11px] truncate block max-w-[200px]">{ep.path}</code>
                    </div>
                    <span className="text-[10px] text-gray-400 line-clamp-1">{ep.description}</span>
                  </button>
                ))}
              </div>

              {/* Explorer Sandbox Right */}
              <div className="lg:col-span-8 space-y-6">
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-6">

                  {/* Selected Spec Detail */}
                  <div className="border-b border-gray-100 pb-4">
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <span className={`text-xs font-extrabold px-3 py-1 rounded-md uppercase ${
                        endpoints[selectedEndpoint].method === 'GET' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-blue-100 text-blue-800 border border-blue-200'
                      }`}>
                        {endpoints[selectedEndpoint].method}
                      </span>
                      <code className="text-base font-extrabold text-gray-900">
                        {endpoints[selectedEndpoint].path}
                      </code>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {endpoints[selectedEndpoint].description}
                    </p>
                  </div>

                  {/* Inputs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* Path Params or inputs if contains {id} */}
                    {endpoints[selectedEndpoint].path.includes('{id}') && (
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                          Route Param: <code className="text-[10px] text-blue-600 bg-blue-50 px-1 py-0.5 rounded">&#123;id&#125;</code>
                        </label>
                        <input
                          type="text"
                          value={requestParam}
                          onChange={(e) => setRequestParam(e.target.value)}
                          placeholder="e.g. 1"
                          className="w-full p-2.5 border border-gray-200 rounded-lg text-xs font-mono focus:ring-1 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>
                    )}

                    {/* Request Payload Editor */}
                    {endpoints[selectedEndpoint].method === 'POST' && endpoints[selectedEndpoint].sampleBody && (
                      <div className="col-span-2 space-y-1.5">
                        <label className="text-xs font-bold text-gray-700">Request Body (JSON)</label>
                        <textarea
                          rows={6}
                          value={requestBody}
                          onChange={(e) => setRequestBody(e.target.value)}
                          className="w-full p-3 font-mono text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none bg-slate-50"
                        />
                      </div>
                    )}
                  </div>

                  {/* Code Tabs & Action */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center flex-wrap gap-4">
                      {/* Language tabs */}
                      <div className="flex border border-gray-200 rounded-xl overflow-hidden text-xs font-semibold">
                        {['curl', 'js', 'python'].map((lang) => (
                          <button
                            key={lang}
                            onClick={() => setActiveLang(lang as any)}
                            className={`py-1.5 px-4 transition-all ${
                              activeLang === lang ? 'bg-slate-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            {lang === 'js' ? 'Fetch API' : lang.toUpperCase()}
                          </button>
                        ))}
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Copy Code Snippet */}
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(getCodeSnippet(endpoints[selectedEndpoint]));
                            alert('Code snippet copied to clipboard!');
                          }}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-200"
                        >
                          Copy Code
                        </button>

                        {/* Execute Button */}
                        <button
                          onClick={handleExecuteRequest}
                          disabled={loading}
                          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm shrink-0"
                        >
                          <Play className="h-3.5 w-3.5 fill-current" /> {loading ? 'Fetching...' : 'Send Request'}
                        </button>
                      </div>
                    </div>

                    {/* Pre-formatted code display */}
                    <div className="bg-slate-900 rounded-2xl p-4 font-mono text-[11px] text-slate-300 border border-slate-800 overflow-x-auto whitespace-pre leading-relaxed">
                      {getCodeSnippet(endpoints[selectedEndpoint])}
                    </div>
                  </div>

                  {/* Response display */}
                  <div className="space-y-2 pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-gray-700">Response Panel</span>
                      {responseStatus !== null && (
                        <span className={`font-semibold px-2.5 py-1 rounded ${
                          responseStatus >= 200 && responseStatus < 300
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          Status: {responseStatus}
                        </span>
                      )}
                    </div>

                    {responseBody ? (
                      <pre className="bg-slate-950 text-emerald-400 p-4 rounded-2xl font-mono text-[11px] border border-slate-900 overflow-x-auto max-h-[350px]">
                        {responseBody}
                      </pre>
                    ) : (
                      <div className="border border-dashed border-gray-200 rounded-2xl py-12 text-center text-xs text-gray-400 italic">
                        Click &quot;Send Request&quot; to invoke the mock backend API and examine real-time response schema.
                      </div>
                    )}
                  </div>

                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ApiDocsPage;
