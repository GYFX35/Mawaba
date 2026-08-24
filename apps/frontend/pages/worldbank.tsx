import { getApiUrl, API_BASE_URL } from '../components/apiConfig';
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import {
  Globe,
  TrendingUp,
  FolderGit2,
  Search,
  Filter,
  BarChart2,
  DollarSign,
  Building,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ShieldAlert,
  Info
} from 'lucide-react';

const API_BASE = getApiUrl('/api/worldbank');

interface Country {
  id: string;
  iso2Code: string;
  name: string;
  region: string;
  incomeLevel: string;
  lendingType: string;
  capitalCity: string;
}

interface IndicatorItem {
  indicatorId: string;
  indicatorName: string;
  countryId: string;
  countryName: string;
  year: string;
  value: number | null;
  unit: string;
}

interface Project {
  id: string;
  project_name: string;
  regionname: string;
  countryname: string;
  totalamt: string;
  grantamt: string;
  boardapprovaldate: string;
  closingdate: string;
  status: string;
  url: string;
  sector: string;
}

const COMMON_INDICATORS = [
  { id: 'NY.GDP.MKTP.CD', name: 'GDP (Current US$)' },
  { id: 'NY.GDP.PCAP.CD', name: 'GDP per capita (Current US$)' },
  { id: 'SP.POP.TOTL', name: 'Population, Total' },
  { id: 'SE.PRM.CMPT.ZS', name: 'Primary Education Completion Rate (%)' },
  { id: 'EG.FEC.RNEW.ZS', name: 'Renewable Energy Consumption (%)' },
  { id: 'SH.XPD.CHEX.GD.ZS', name: 'Current Health Expenditure (% of GDP)' }
];

export default function WorldBankPage() {
  const [activeTab, setActiveTab] = useState<'countries' | 'indicators' | 'projects'>('countries');

  // Countries tab state
  const [countries, setCountries] = useState<Country[]>([]);
  const [countrySearch, setCountrySearch] = useState('');
  const [countryPage, setCountryPage] = useState(1);
  const [totalCountries, setTotalCountries] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingCountries, setLoadingCountries] = useState(false);

  // Indicators tab state
  const [selectedCountry, setSelectedCountry] = useState('USA');
  const [selectedIndicator, setSelectedIndicator] = useState('NY.GDP.MKTP.CD');
  const [indicatorData, setIndicatorData] = useState<IndicatorItem[]>([]);
  const [indicatorMeta, setIndicatorMeta] = useState<{ indicatorName?: string; countryName?: string }>({});
  const [loadingIndicator, setLoadingIndicator] = useState(false);

  // Projects tab state
  const [projectQuery, setProjectQuery] = useState('education');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);

  // Load countries
  const fetchCountries = async () => {
    setLoadingCountries(true);
    try {
      const res = await fetch(`${API_BASE}/countries?page=${countryPage}&per_page=12&search=${encodeURIComponent(countrySearch)}`);
      const data = await res.json();
      if (data.countries) {
        setCountries(data.countries);
        setTotalCountries(data.total);
        setTotalPages(data.totalPages || 1);
      }
    } catch (e) {
      console.error('Failed to fetch countries:', e);
    } finally {
      setLoadingCountries(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'countries') {
      fetchCountries();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countryPage, activeTab]);

  const handleCountrySearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCountryPage(1);
    fetchCountries();
  };

  // Load indicator
  const fetchIndicator = async () => {
    setLoadingIndicator(true);
    try {
      const res = await fetch(`${API_BASE}/indicators?country=${selectedCountry}&indicator=${selectedIndicator}`);
      const data = await res.json();
      if (data.data) {
        setIndicatorData(data.data.filter((item: IndicatorItem) => item.value !== null));
        setIndicatorMeta({ indicatorName: data.indicatorName, countryName: data.countryName });
      }
    } catch (e) {
      console.error('Failed to fetch indicator:', e);
    } finally {
      setLoadingIndicator(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'indicators') {
      fetchIndicator();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCountry, selectedIndicator, activeTab]);

  // Load projects
  const fetchProjects = async () => {
    setLoadingProjects(true);
    try {
      const res = await fetch(`${API_BASE}/projects?q=${encodeURIComponent(projectQuery)}&rows=12`);
      const data = await res.json();
      if (data.projects) {
        setProjects(data.projects);
      }
    } catch (e) {
      console.error('Failed to fetch projects:', e);
    } finally {
      setLoadingProjects(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'projects') {
      fetchProjects();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const handleProjectSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProjects();
  };

  const formatNumber = (num: number | null) => {
    if (num === null || num === undefined) return 'N/A';
    if (num >= 1e12) return (num / 1e12).toFixed(2) + ' Trillion';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + ' Billion';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + ' Million';
    return num.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>World Bank Global Open Data | Mawaba</title>
        <meta name="description" content="Explore World Bank economic indicators, country profiles, and development projects on Mawaba." />
      </Head>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Hero */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 -mt-10 -mr-10 opacity-10 pointer-events-none">
            <Globe className="w-96 h-96" />
          </div>
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 px-3.5 py-1.5 rounded-full text-blue-200 text-xs font-bold tracking-wide uppercase">
              <Globe className="w-4 h-4 text-blue-400" /> Live World Bank Open Data Integration
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
              Global Development & Economic Intelligence
            </h1>
            <p className="text-blue-100 text-base sm:text-lg leading-relaxed font-normal">
              Access real-time macro-economic statistics, global development indicators, country profiles, and official World Bank funding initiatives to empower local and international partnerships.
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-3 border-b border-gray-200 pb-4">
          <button
            onClick={() => setActiveTab('countries')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm transition-all duration-200 ${
              activeTab === 'countries'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <Building className="w-4 h-4" /> Country Profiles
          </button>
          <button
            onClick={() => setActiveTab('indicators')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm transition-all duration-200 ${
              activeTab === 'indicators'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <TrendingUp className="w-4 h-4" /> Development Indicators
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm transition-all duration-200 ${
              activeTab === 'projects'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <FolderGit2 className="w-4 h-4" /> Development Projects
          </button>
        </div>

        {/* TAB 1: COUNTRIES */}
        {activeTab === 'countries' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Global Country Profiles</h2>
                <p className="text-xs text-gray-500">Showing {countries.length} of {totalCountries} entries</p>
              </div>
              <form onSubmit={handleCountrySearch} className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    placeholder="Search country, capital, or code..."
                    value={countrySearch}
                    onChange={(e) => setCountrySearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md"
                >
                  Search
                </button>
              </form>
            </div>

            {loadingCountries ? (
              <div className="flex items-center justify-center py-20 bg-white rounded-3xl border border-gray-100">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                <span className="ml-3 font-semibold text-gray-600">Loading country records...</span>
              </div>
            ) : countries.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 space-y-3">
                <Info className="w-10 h-10 text-gray-400 mx-auto" />
                <h3 className="text-lg font-bold text-gray-800">No countries found</h3>
                <p className="text-sm text-gray-500">Try adjusting your search terms or clearing filters.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {countries.map((c) => (
                    <div key={c.id} className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="bg-blue-50 text-blue-700 font-mono text-xs font-extrabold px-2.5 py-1 rounded-lg border border-blue-100">
                            {c.id} / {c.iso2Code}
                          </span>
                          <span className="text-xs font-semibold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md">
                            {c.region}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">{c.name}</h3>
                        <p className="text-xs text-gray-500">Capital: <span className="font-semibold text-gray-700">{c.capitalCity}</span></p>
                      </div>

                      <div className="pt-3 border-t border-gray-100 space-y-1.5 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Income Level:</span>
                          <span className="font-semibold text-gray-800">{c.incomeLevel}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Lending Type:</span>
                          <span className="font-semibold text-gray-800">{c.lendingType}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedCountry(c.id);
                          setActiveTab('indicators');
                        }}
                        className="w-full text-center py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
                      >
                        <BarChart2 className="w-3.5 h-3.5" /> View Economic Indicators
                      </button>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between bg-white px-6 py-4 rounded-2xl border border-gray-200">
                  <button
                    disabled={countryPage <= 1}
                    onClick={() => setCountryPage((p) => Math.max(1, p - 1))}
                    className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl font-bold text-xs transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" /> Previous
                  </button>
                  <span className="text-xs font-bold text-gray-600">
                    Page {countryPage} of {totalPages}
                  </span>
                  <button
                    disabled={countryPage >= totalPages}
                    onClick={() => setCountryPage((p) => p + 1)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl font-bold text-xs transition-all"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* TAB 2: INDICATORS */}
        {activeTab === 'indicators' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Economic & Social Indicators Query</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Select Country Code (e.g. USA, WLD, CHN, DEU, IND)</label>
                  <input
                    type="text"
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value.toUpperCase())}
                    placeholder="e.g. USA or WLD"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none uppercase"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Select Metric / Indicator</label>
                  <select
                    value={selectedIndicator}
                    onChange={(e) => setSelectedIndicator(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none"
                  >
                    {COMMON_INDICATORS.map((ind) => (
                      <option key={ind.id} value={ind.id}>
                        {ind.name} ({ind.id})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {loadingIndicator ? (
              <div className="flex items-center justify-center py-20 bg-white rounded-3xl border border-gray-100">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                <span className="ml-3 font-semibold text-gray-600">Fetching indicator timeline...</span>
              </div>
            ) : indicatorData.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 space-y-3">
                <Info className="w-10 h-10 text-gray-400 mx-auto" />
                <h3 className="text-lg font-bold text-gray-800">No records available</h3>
                <p className="text-sm text-gray-500">No data returned for indicator code {selectedIndicator} in country {selectedCountry}.</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="bg-blue-900 text-white p-6 space-y-1">
                  <span className="bg-blue-800 text-blue-200 text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider">
                    {indicatorMeta.countryName || selectedCountry}
                  </span>
                  <h3 className="text-xl font-bold">{indicatorMeta.indicatorName || selectedIndicator}</h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase font-extrabold">
                        <th className="py-3.5 px-6">Year</th>
                        <th className="py-3.5 px-6">Recorded Value</th>
                        <th className="py-3.5 px-6">Formatted Display</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
                      {indicatorData.map((row, idx) => (
                        <tr key={idx} className="hover:bg-blue-50/50 transition-colors">
                          <td className="py-3.5 px-6 font-bold text-blue-900">{row.year}</td>
                          <td className="py-3.5 px-6 font-mono">{row.value ? row.value.toLocaleString() : 'N/A'}</td>
                          <td className="py-3.5 px-6 font-bold text-emerald-700">{formatNumber(row.value)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PROJECTS */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm">
              <div>
                <h2 className="text-xl font-bold text-gray-900">World Bank Development Initiatives & Operations</h2>
                <p className="text-xs text-gray-500">Querying active & historical international project grants/loans</p>
              </div>
              <form onSubmit={handleProjectSearch} className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    placeholder="e.g. education, health, energy..."
                    value={projectQuery}
                    onChange={(e) => setProjectQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md"
                >
                  Search Projects
                </button>
              </form>
            </div>

            {loadingProjects ? (
              <div className="flex items-center justify-center py-20 bg-white rounded-3xl border border-gray-100">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                <span className="ml-3 font-semibold text-gray-600">Searching World Bank project repository...</span>
              </div>
            ) : projects.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 space-y-3">
                <Info className="w-10 h-10 text-gray-400 mx-auto" />
                <h3 className="text-lg font-bold text-gray-800">No projects found</h3>
                <p className="text-sm text-gray-500">No official development projects matching &quot;{projectQuery}&quot;.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map((p) => (
                  <div key={p.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="bg-indigo-50 text-indigo-700 font-mono text-xs font-bold px-2.5 py-1 rounded-lg border border-indigo-100">
                          {p.id}
                        </span>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          p.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {p.status}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-gray-900 leading-snug">{p.project_name}</h3>
                      <p className="text-xs text-gray-500">Region: <span className="font-semibold text-gray-700">{p.regionname} ({p.countryname})</span></p>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-xl space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">Commitment Amount:</span>
                        <span className="font-extrabold text-blue-900 text-sm">
                          ${p.totalamt ? Number(p.totalamt).toLocaleString() : 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between text-gray-500">
                        <span>Approval Date:</span>
                        <span className="font-semibold text-gray-700">
                          {p.boardapprovaldate ? new Date(p.boardapprovaldate).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between text-gray-500">
                        <span>Sectors:</span>
                        <span className="font-semibold text-gray-700 truncate max-w-[200px]">{p.sector}</span>
                      </div>
                    </div>

                    {p.url && (
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 text-blue-600 hover:text-blue-800 text-xs font-bold pt-1"
                      >
                        View Official World Bank Dossier <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
