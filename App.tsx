
import React, { useState, useMemo, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';
import { 
  Calculator, 
  Globe, 
  Settings, 
  TrendingUp, 
  Layers, 
  FileText, 
  Zap,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  PieChart as PieIcon,
  Sparkles,
  Loader2
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie
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

  // Logic to calculate estimated prices based on variables
  const estimatedPrices = useMemo(() => {
    const baseExtra = config.languages * 250;
    const complexityMultiplier = config.complexity === Complexity.HIGH ? 1.5 : (config.complexity === Complexity.MEDIUM ? 1.2 : 1.0);
    const contentMultiplier = config.contentVolume === Complexity.HIGH ? 1.4 : (config.contentVolume === Complexity.MEDIUM ? 1.1 : 0.9);
    
    // Aligned with the tiers ranges
    let setup = recommendedTier.setupRange[0] * complexityMultiplier;
    let monthly = recommendedTier.monthlyRange[0] * contentMultiplier + (config.languages - 1) * 150;

    return {
      setup: Math.round(setup),
      monthly: Math.round(monthly),
      linkbuilding: recommendedTier.linkbuildingRange[0]
    };
  }, [config, recommendedTier]);

  const generateAIProposal = async () => {
    setIsGenerating(true);
    setAiProposal('');
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        Actúa como un Consultor Senior de SEO Internacional.
        Genera un resumen ejecutivo persuasivo para una propuesta comercial de SEO Internacional.
        Detalles del proyecto:
        - Idiomas: ${config.languages}
        - Tipo de sitio: ${config.siteType}
        - Complejidad técnica: ${config.complexity}
        - Deuda técnica inicial: ${config.technicalDebt}
        - Volumen de contenidos deseado: ${config.contentVolume}
        - Plan recomendado: ${recommendedTier.name}
        - Coste Setup: ${estimatedPrices.setup}€
        - Coste Mensual: ${estimatedPrices.monthly}€
        
        El tono debe ser profesional, estratégico y enfocado a resultados. 
        Estructura el texto en:
        1. Desafío Estratégico.
        2. Nuestra Solución (basada en el plan ${recommendedTier.name}).
        3. Valor Diferencial (menciona SEO para IA y escalabilidad multidioma).
        4. Inversión estimada.
        Usa Markdown para el formato. Máximo 300 palabras.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setAiProposal(response.text || 'No se pudo generar el texto.');
    } catch (error) {
      console.error(error);
      setAiProposal('Error al conectar con la IA. Por favor, revisa tu conexión.');
    } finally {
      setIsGenerating(false);
    }
  };

  const chartData = [
    { name: 'Setup One-off', value: estimatedPrices.setup },
    { name: 'Mensual Fee', value: estimatedPrices.monthly },
    { name: 'Linkbuilding Est.', value: estimatedPrices.linkbuilding }
  ];

  const COLORS = ['#6366f1', '#10b981', '#f59e0b'];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Globe className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">SEO Int <span className="text-indigo-600">Budget Pro</span></h1>
          </div>
          <div className="hidden md:flex items-center gap-4 text-sm font-medium text-gray-500">
            <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4" /> Calculadora Profesional</span>
            <span className="flex items-center gap-1"><Sparkles className="w-4 h-4" /> Generación por IA</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Calculator Inputs */}
          <div className="lg:col-span-4 space-y-6">
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-6">
                <Calculator className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-semibold">Configuración del Proyecto</h2>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex justify-between">
                    Idiomas / Mercados
                    <span className="text-indigo-600 font-bold">{config.languages}</span>
                  </label>
                  <input 
                    type="range" 
                    min="1" 
                    max="10" 
                    value={config.languages}
                    onChange={(e) => setConfig({...config, languages: parseInt(e.target.value)})}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>1</span>
                    <span>10</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Sitio</label>
                  <select 
                    value={config.siteType}
                    onChange={(e) => setConfig({...config, siteType: e.target.value as SiteType})}
                    className="w-full border-gray-200 rounded-xl text-sm focus:ring-indigo-500 focus:border-indigo-500 p-2.5 bg-gray-50"
                  >
                    <option value={SiteType.BLOG_SaaS}>{SiteType.BLOG_SaaS}</option>
                    <option value={SiteType.ECOMMERCE}>{SiteType.ECOMMERCE}</option>
                    <option value={SiteType.ENTERPRISE}>{SiteType.ENTERPRISE}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Complejidad Técnica</label>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.values(Complexity).map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() => setConfig({...config, complexity: lvl})}
                        className={`py-2 px-3 text-xs rounded-lg font-medium transition-all ${
                          config.complexity === lvl 
                          ? 'bg-indigo-600 text-white shadow-md' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Deuda Técnica Inicial</label>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.values(Complexity).map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() => setConfig({...config, technicalDebt: lvl})}
                        className={`py-2 px-3 text-xs rounded-lg font-medium transition-all ${
                          config.technicalDebt === lvl 
                          ? 'bg-indigo-600 text-white shadow-md' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Volumen de Crecimiento (Contenidos)</label>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.values(Complexity).map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() => setConfig({...config, contentVolume: lvl})}
                        className={`py-2 px-3 text-xs rounded-lg font-medium transition-all ${
                          config.contentVolume === lvl 
                          ? 'bg-indigo-600 text-white shadow-md' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <div className="bg-indigo-900 text-indigo-100 p-6 rounded-2xl shadow-xl overflow-hidden relative">
              <div className="relative z-10">
                <h3 className="font-bold text-lg mb-2">¿Necesitas un resumen para el cliente?</h3>
                <p className="text-sm text-indigo-200 mb-4">Usa nuestra IA para redactar los puntos clave de la propuesta comercial basados en estos datos.</p>
                <button 
                  onClick={generateAIProposal}
                  disabled={isGenerating}
                  className="w-full py-3 bg-white text-indigo-900 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-50 transition-colors disabled:opacity-70"
                >
                  {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                  Generar con IA
                </button>
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-indigo-700/50 rounded-full blur-2xl"></div>
            </div>
          </div>

          {/* Right Column: Dashboard & Results */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Tiers Highlight */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {TIERS.map((tier) => (
                <div 
                  key={tier.name}
                  className={`p-5 rounded-2xl border-2 transition-all ${
                    recommendedTier.name === tier.name 
                    ? 'border-indigo-600 bg-indigo-50/50 ring-4 ring-indigo-50' 
                    : 'border-white bg-white grayscale opacity-80 scale-95'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      recommendedTier.name === tier.name ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'
                    }`}>
                      {recommendedTier.name === tier.name ? 'Recomendado' : 'Opción'}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900">{tier.name}</h3>
                  <p className="text-[11px] text-gray-500 mt-1 h-8 leading-tight">{tier.target}</p>
                  <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Setup:</span>
                      <span className="font-semibold">{tier.setupRange[0]}€ - {tier.setupRange[1]}€</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Mensual:</span>
                      <span className="font-semibold">{tier.monthlyRange[0]}€ - {tier.monthlyRange[1]}€</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Detailed Estimation Section */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    Inversión Estimada
                    <ShieldCheck className="w-6 h-6 text-green-500" />
                  </h2>
                  <p className="text-gray-500 mt-1">Valores proyectados según el perfil del sitio y alcance definido.</p>
                </div>
                <div className="flex items-center gap-4">
                   <div className="text-center p-3 bg-gray-50 rounded-2xl min-w-[120px]">
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Setup (One-off)</p>
                      <p className="text-2xl font-bold text-indigo-600">{estimatedPrices.setup}€</p>
                   </div>
                   <div className="text-center p-3 bg-indigo-600 rounded-2xl min-w-[120px]">
                      <p className="text-[10px] font-bold text-indigo-200 uppercase">Mensual (Fee)</p>
                      <p className="text-2xl font-bold text-white">{estimatedPrices.monthly}€</p>
                   </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-8 border-r border-gray-50">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" /> Distribución de Costes
                  </h3>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
                        <YAxis hide />
                        <Tooltip 
                          cursor={{ fill: 'transparent' }}
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-white p-3 shadow-lg border border-gray-100 rounded-xl">
                                  <p className="text-xs font-bold text-gray-900">{payload[0].name}</p>
                                  <p className="text-sm font-bold text-indigo-600">{payload[0].value}€</p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={40}>
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-6 flex flex-wrap gap-4">
                     <div className="flex items-center gap-2 text-xs">
                        <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                        <span>Setup Estratégico</span>
                     </div>
                     <div className="flex items-center gap-2 text-xs">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span>Operativa Mensual</span>
                     </div>
                     <div className="flex items-center gap-2 text-xs">
                        <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                        <span>Publicidad / Linkbuilding</span>
                     </div>
                  </div>
                </div>

                <div className="p-8 bg-gray-50/30">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">¿Qué incluye este plan?</h3>
                  <ul className="space-y-4">
                    {recommendedTier.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="mt-1 bg-green-100 p-0.5 rounded-full">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        </div>
                        <span className="text-sm text-gray-700 font-medium">{feature}</span>
                      </li>
                    ))}
                    <li className="flex items-start gap-3 border-t border-gray-100 pt-4">
                       <div className="mt-1 bg-orange-100 p-0.5 rounded-full">
                          <Zap className="w-4 h-4 text-orange-600" />
                       </div>
                       <div>
                          <span className="text-sm font-bold text-gray-900">Linkbuilding recomendado</span>
                          <p className="text-xs text-gray-500">{recommendedTier.linkbuildingRange[0]}€ - {recommendedTier.linkbuildingRange[1]}€ / mes</p>
                       </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* AI Generated Text Output */}
            {(aiProposal || isGenerating) && (
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-indigo-100 animate-in fade-in duration-500">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-600" />
                    <h3 className="font-bold text-lg">Resumen Ejecutivo IA</h3>
                  </div>
                  <button 
                    onClick={() => navigator.clipboard.writeText(aiProposal)}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                  >
                    <FileText className="w-4 h-4" /> Copiar Texto
                  </button>
                </div>
                {isGenerating ? (
                  <div className="space-y-4 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ) : (
                  <div className="prose prose-sm prose-indigo max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {aiProposal}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer Floating Call to Action */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-2xl md:hidden">
        <div className="flex items-center justify-between gap-4">
           <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase">Mensual Estimado</p>
              <p className="text-lg font-bold text-indigo-600">{estimatedPrices.monthly}€</p>
           </div>
           <button 
            onClick={generateAIProposal}
            className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2"
           >
             <Sparkles className="w-4 h-4" /> Resumen IA
           </button>
        </div>
      </div>
    </div>
  );
};

export default App;
