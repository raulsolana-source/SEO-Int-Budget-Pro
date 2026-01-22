
import React, { useState, useMemo } from 'react';
import { GoogleGenAI } from '@google/genai';
import { 
  Calculator, 
  Globe, 
  TrendingUp, 
  FileText, 
  Zap,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Loader2,
  Plus,
  Minus,
  MessageSquare,
  FileCode,
  Layout
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell
} from 'recharts';
import { Complexity, SiteType, BudgetConfig } from './types';
import { TIERS } from './constants';

const App: React.FC = () => {
  const [config, setConfig] = useState<BudgetConfig>({
    languages: 2,
    complexity: Complexity.MEDIUM,
    siteType: SiteType.BLOG_SaaS,
    technicalDebt: Complexity.MEDIUM,
    contentVolume: Complexity.MEDIUM,
  });

  const [addons, setAddons] = useState({
    extraArticles: 0,
    extraLandings: 0,
    extraTechSprints: 0
  });

  const [aiProposal, setAiProposal] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Logic to determine recommended tier
  const recommendedTier = useMemo(() => {
    if (config.languages >= 4 || config.siteType === SiteType.ENTERPRISE || config.complexity === Complexity.HIGH) {
      return TIERS[2];
    }
    if (config.languages >= 2 || config.siteType === SiteType.ECOMMERCE || config.complexity === Complexity.MEDIUM) {
      return TIERS[1];
    }
    return TIERS[0];
  }, [config]);

  // Pricing constants for Add-ons
  const ADDON_COSTS = {
    langSetup: 400,
    langMonthly: 400,
    article: 400,
    landing: 625,
    sprint: 325
  };

  // Logic to calculate estimated prices
  const estimatedPrices = useMemo(() => {
    let setup = recommendedTier.setupRange[0];
    let monthly = recommendedTier.monthlyRange[0];

    if (config.complexity === Complexity.HIGH) setup *= 1.2;
    if (config.technicalDebt === Complexity.HIGH) setup *= 1.1;

    const baseLangs = recommendedTier.name.includes('Starter') ? 1 : recommendedTier.name.includes('Growth') ? 2 : 3;
    const extraLangs = Math.max(0, config.languages - baseLangs);
    
    setup += extraLangs * ADDON_COSTS.langSetup;
    monthly += extraLangs * ADDON_COSTS.langMonthly;

    monthly += addons.extraArticles * ADDON_COSTS.article;
    monthly += addons.extraLandings * ADDON_COSTS.landing;
    monthly += addons.extraTechSprints * ADDON_COSTS.sprint;

    return {
      setup: Math.round(setup),
      monthly: Math.round(monthly),
      linkbuilding: recommendedTier.linkbuildingRange[0],
      extraLangs
    };
  }, [config, recommendedTier, addons]);

  const generateAIProposal = async () => {
    setIsGenerating(true);
    setAiProposal('');
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        Act as a Senior International SEO Consultant.
        Generate a persuasive executive summary for a commercial SEO proposal under the "Partner" pricing model.
        Project details:
        - Total languages: ${config.languages} (includes ${estimatedPrices.extraLangs} additional languages)
        - Site type: ${config.siteType}
        - Complexity: ${config.complexity}
        - Recommended plan: ${recommendedTier.name}
        - Extras: ${addons.extraArticles} extra articles, ${addons.extraLandings} extra landings, ${addons.extraTechSprints} technical sprints.
        - Setup Cost: ${estimatedPrices.setup}€
        - Monthly Fee: ${estimatedPrices.monthly}€
        
        The tone must be professional, strategic, and results-oriented.
        Output in English. Structure the text in:
        1. Strategic Challenge.
        2. Our Solution (detail why the ${recommendedTier.name} plan is the right fit).
        3. Value of selected Add-ons.
        4. Estimated investment and next steps.
        Use Markdown for formatting. Maximum 300 words.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setAiProposal(response.text || 'Could not generate text.');
    } catch (error) {
      console.error(error);
      setAiProposal('Error connecting to AI. Please check your connection.');
    } finally {
      setIsGenerating(false);
    }
  };

  const chartData = [
    { name: 'Base Monthly', value: recommendedTier.monthlyRange[0] },
    { name: 'Extras/Langs', value: estimatedPrices.monthly - recommendedTier.monthlyRange[0] },
    { name: 'Setup', value: estimatedPrices.setup }
  ];

  const COLORS = ['#10b981', '#6366f1', '#f59e0b'];

  const updateAddon = (key: keyof typeof addons, delta: number) => {
    setAddons(prev => ({ ...prev, [key]: Math.max(0, prev[key] + delta) }));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Globe className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">SEO Int <span className="text-indigo-600">Partner Pro</span></h1>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-500">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-500" /> Partner Pricing 2025</span>
            <button onClick={generateAIProposal} className="flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-colors">
              <Sparkles className="w-4 h-4" /> Generate Proposal
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Inputs Column */}
          <div className="lg:col-span-4 space-y-6">
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-6">
                <Calculator className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-semibold">Base Configuration</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3 flex justify-between">
                    Languages / Markets
                    <span className="bg-indigo-100 text-indigo-700 px-2.5 py-0.5 rounded-full text-xs font-bold">{config.languages}</span>
                  </label>
                  <input 
                    type="range" 
                    min="1" 
                    max="10" 
                    value={config.languages}
                    onChange={(e) => setConfig({...config, languages: parseInt(e.target.value)})}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  {estimatedPrices.extraLangs > 0 && (
                    <p className="text-[10px] text-orange-600 font-bold mt-2 flex items-center gap-1">
                      <Plus className="w-3 h-3" /> {estimatedPrices.extraLangs} extra language(s) detected
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Site Type</label>
                  <select 
                    value={config.siteType}
                    onChange={(e) => setConfig({...config, siteType: e.target.value as SiteType})}
                    className="w-full border-slate-200 rounded-xl text-sm focus:ring-indigo-500 focus:border-indigo-500 p-2.5 bg-slate-50"
                  >
                    {Object.values(SiteType).map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Technical Complexity</label>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.values(Complexity).map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() => setConfig({...config, complexity: lvl})}
                        className={`py-2 px-3 text-xs rounded-lg font-bold transition-all ${
                          config.complexity === lvl 
                          ? 'bg-indigo-600 text-white shadow-md' 
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-transparent'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Add-ons Section */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-6">
                <Zap className="w-5 h-5 text-orange-500" />
                <h2 className="text-lg font-semibold">Add-ons (Extras)</h2>
              </div>

              <div className="space-y-4">
                {[
                  { key: 'extraArticles' as const, label: 'Extra article', icon: <MessageSquare className="w-4 h-4" /> },
                  { key: 'extraLandings' as const, label: 'Extra landing', icon: <Layout className="w-4 h-4" /> },
                  { key: 'extraTechSprints' as const, label: 'Tech sprint (2-4h)', icon: <FileCode className="w-4 h-4" /> }
                ].map((addon) => (
                  <div key={addon.key} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="text-slate-400">{addon.icon}</div>
                      <span className="text-xs font-bold text-slate-700">{addon.label}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => updateAddon(addon.key, -1)} className="p-1 hover:bg-slate-200 rounded-lg transition-colors"><Minus className="w-4 h-4 text-slate-400" /></button>
                      <span className="text-sm font-bold w-4 text-center">{addons[addon.key]}</span>
                      <button onClick={() => updateAddon(addon.key, 1)} className="p-1 hover:bg-slate-200 rounded-lg transition-colors"><Plus className="w-4 h-4 text-indigo-600" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Tier Indicator */}
            <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-6">
              <div className="bg-indigo-600 text-white p-4 rounded-2xl flex flex-col items-center justify-center min-w-[140px]">
                <ShieldCheck className="w-8 h-8 mb-1" />
                <span className="text-[10px] font-bold uppercase tracking-tighter opacity-80">Partner Plan</span>
                <span className="font-bold text-center leading-tight">{recommendedTier.name.split(' ')[1] || recommendedTier.name}</span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900">{recommendedTier.name}</h3>
                <p className="text-sm text-slate-500">{recommendedTier.target}</p>
                <div className="mt-3 flex gap-2 flex-wrap">
                  {recommendedTier.features.slice(0, 3).map((f, i) => (
                    <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-bold">{f}</span>
                  ))}
                  <span className="text-[10px] text-indigo-600 font-bold">+ See all below</span>
                </div>
              </div>
              <div className="text-right border-l border-slate-100 pl-6 hidden md:block">
                <p className="text-[10px] font-bold text-slate-400 uppercase">From</p>
                <p className="text-2xl font-black text-indigo-600">{recommendedTier.monthlyRange[0]}€<span className="text-xs font-normal">/mo</span></p>
              </div>
            </div>

            {/* Total Investment Card */}
            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
              <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Projected Final Investment</h2>
                  <p className="text-slate-500 mt-1 flex items-center gap-1.5"><TrendingUp className="w-4 h-4 text-emerald-500" /> Optimized budget including add-ons.</p>
                </div>
                <div className="flex items-center gap-4">
                   <div className="text-center p-4 bg-white rounded-2xl border border-slate-200 min-w-[140px] shadow-sm">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Setup One-off</p>
                      <p className="text-3xl font-black text-slate-800">{estimatedPrices.setup}€</p>
                   </div>
                   <div className="text-center p-4 bg-indigo-600 rounded-2xl min-w-[140px] shadow-lg shadow-indigo-200">
                      <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest">Monthly Fee</p>
                      <p className="text-3xl font-black text-white">{estimatedPrices.monthly}€</p>
                   </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-8 border-r border-slate-50">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-8">Investment Breakdown</h3>
                  <div className="h-60 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" fontSize={10} axisLine={false} tickLine={false} width={80} />
                        <Tooltip 
                          cursor={{ fill: 'transparent' }}
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-white p-3 shadow-xl border border-slate-100 rounded-xl">
                                  <p className="text-sm font-black text-indigo-600">{payload[0].value}€</p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={24}>
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="p-8 bg-slate-50/20">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">What's included in your proposal?</h3>
                  <ul className="space-y-4">
                    {recommendedTier.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5" />
                        <span className="text-sm text-slate-700 font-semibold">{feature}</span>
                      </li>
                    ))}
                    {(addons.extraArticles > 0 || addons.extraLandings > 0 || addons.extraTechSprints > 0) && (
                      <li className="pt-4 border-t border-slate-100">
                        <p className="text-xs font-black text-indigo-600 uppercase mb-2">Selected Add-ons:</p>
                        {addons.extraArticles > 0 && <p className="text-sm text-slate-600 flex justify-between"><span>Extra Articles:</span> <span className="font-bold">{addons.extraArticles}</span></p>}
                        {addons.extraLandings > 0 && <p className="text-sm text-slate-600 flex justify-between"><span>Extra Landings:</span> <span className="font-bold">{addons.extraLandings}</span></p>}
                        {addons.extraTechSprints > 0 && <p className="text-sm text-slate-600 flex justify-between"><span>Tech Sprints:</span> <span className="font-bold">{addons.extraTechSprints}</span></p>}
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {/* AI Text Block */}
            {(aiProposal || isGenerating) && (
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-indigo-100">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="bg-indigo-600 p-2 rounded-xl">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-black text-xl tracking-tight">Strategic Summary</h3>
                  </div>
                  <button 
                    onClick={() => navigator.clipboard.writeText(aiProposal)}
                    className="text-xs font-bold text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors border border-indigo-100 flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4" /> Copy for proposal
                  </button>
                </div>
                {isGenerating ? (
                  <div className="space-y-5 animate-pulse">
                    <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                    <div className="h-4 bg-slate-100 rounded w-full"></div>
                    <div className="h-4 bg-slate-100 rounded w-5/6"></div>
                    <div className="h-4 bg-slate-100 rounded w-2/3"></div>
                  </div>
                ) : (
                  <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-sm">
                    {aiProposal}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Floating CTA for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-slate-200 p-4 shadow-2xl md:hidden flex items-center justify-between z-40">
        <div>
           <p className="text-[10px] font-black text-slate-400 uppercase">Monthly with Add-ons</p>
           <p className="text-xl font-black text-indigo-600">{estimatedPrices.monthly}€</p>
        </div>
        <button 
          onClick={generateAIProposal}
          className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 active:scale-95 transition-transform"
        >
          {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          AI Proposal
        </button>
      </div>
    </div>
  );
};

export default App;
