"use client";

import React, { useEffect, useState, useCallback } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { supabase } from "@/lib/supabase";
import { KPICard } from "./KPICard";
import { EstrategiaForm } from "./EstrategiaForm";
import { Users, UserPlus, FileText, Send, Eye, Heart, MessageCircle, Activity } from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar
} from "recharts";
import { useLayout } from "@/context/LayoutContext";
import { Calendar } from "lucide-react";

interface MetricsData {
  id: string;
  fecha: string;
  seguidores: number;
  nuevos_seguidores: number;
  num_publicaciones: number;
  contenidos_entregados: number;
  impresiones: number;
  reacciones_likes: number;
  comentarios_respuestas: number;
  social_performance_score: number;
  contenidos_publicados: number;
  publicaciones_principales: string;
  sentimiento_positivo: number;
  sentimiento_neutro: number;
  sentimiento_negativo: number;
}

const COLORS = {
  primary: "#003893",
  secondary: "#fcd116",
  tertiary: "#ce1126",
  emerald: "#10b981",
  rose: "#f43f5e",
  blue: "#3b82f6",
  purple: "#8b5cf6",
};

export function SentimentFigures({ positive, negative, title }: { positive: any, negative: any, title?: string }) {
  // Extract numerical values safely in case they are text strings like "40%"
  const extractNumber = (val: any) => {
    if (val === undefined || val === null || val === '') return 0;
    // Replace comma decimal separator (Spanish format: "1,5" → "1.5")
    const normalized = String(val).replace(',', '.').replace(/[^0-9.-]+/g, '');
    const num = parseFloat(normalized);
    return isNaN(num) ? 0 : num;
  };

  const posNum = extractNumber(positive);
  const negNum = extractNumber(negative);
  
  // ALWAYS calculate automatically
  const finalNeutral = Number(Math.max(0, 100 - posNum - negNum).toFixed(1));

  // Helper to display % only if it's not already in the string
  const formatDisplay = (val: any) => {
    // Si es un número puro o string numérico, redondear a 1 decimal
    const num = Number(val);
    if (!isNaN(num) && val !== null && val !== '') {
      return `${Number(num.toFixed(1))}%`;
    }
    
    // Si ya trae texto como "40%"
    const str = String(val);
    return str.includes('%') ? str : `${str}%`;
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm h-full flex flex-col">
      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">{title ?? 'Análisis de Sentimiento'}</h3>
      <div className="flex-1 flex flex-col justify-center gap-3">
        
        <div className="flex items-center justify-between bg-emerald-50 rounded-2xl px-4 py-3">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Positivo</span>
          <span className="text-2xl font-black text-emerald-500">{formatDisplay(positive || 0)}</span>
        </div>

        <div className="flex items-center justify-between bg-slate-50 rounded-2xl px-4 py-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Neutral</span>
          <span className="text-2xl font-black text-slate-400">{formatDisplay(finalNeutral)}</span>
        </div>

        <div className="flex items-center justify-between bg-rose-50 rounded-2xl px-4 py-3">
          <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">Negativo</span>
          <span className="text-2xl font-black text-rose-500">{formatDisplay(negative || 0)}</span>
        </div>

      </div>
    </div>
  );
}

export function EstrategiaDashboardView({ categoria, title }: { categoria: string, title: string }) {
  const { userRole } = useLayout();
  const [data, setData] = useState<MetricsData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const getTodayString = () => {
    return format(new Date(), 'yyyy-MM-dd');
  };

  const [selectedDate, setSelectedDate] = useState<string>(getTodayString());

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    const { data: metrics, error } = await supabase
      .from('estrategia_digital_metrics')
      .select('*')
      .eq('categoria', categoria)
      .order('fecha', { ascending: true });
      
    if (error) {
      console.error("Error fetching data:", error);
    } else {
      setData(metrics || []);
    }
    setIsLoading(false);
  }, [categoria]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filter data up to selected date
  const filteredData = React.useMemo(() => {
    if (!selectedDate) return data;
    return data.filter(item => item.fecha <= selectedDate);
  }, [data, selectedDate]);

  // Calculate latest stats
  const latest = filteredData.length > 0 ? filteredData[filteredData.length - 1] : null;
  const previous = filteredData.length > 1 ? filteredData[filteredData.length - 2] : null;

  const calculateTrend = (current: number, prev: number) => {
    if (!prev || prev === 0) return 0;
    return Number((((current - prev) / prev) * 100).toFixed(1));
  };

  return (
    <div className="p-6 md:p-8 lg:p-10 space-y-8 max-w-7xl mx-auto pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-800">{title}</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Métricas y rendimiento digital</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm">
            <Calendar className="w-4 h-4 text-slate-400" />
            <input 
              type="date" 
              value={selectedDate}
              max={getTodayString()}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="text-sm border-none bg-transparent text-slate-600 focus:outline-none focus:ring-0 w-[110px]"
              title="Fecha del reporte"
            />
          </div>
          <EstrategiaForm categoria={categoria} onSuccess={fetchData} initialData={latest} selectedDate={selectedDate} />
        </div>
      </div>

      {isLoading ? (
        <div className="h-[60vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003893]"></div>
        </div>
      ) : data.length === 0 ? (
        <div className="h-[60vh] flex flex-col items-center justify-center bg-white rounded-3xl border border-slate-200">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <Users className="w-8 h-8 text-slate-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-700">Aún no hay datos para {title}</h2>
          <p className="text-slate-500 mt-2 max-w-md text-center">
            {userRole === 'viewer' 
              ? "No se han registrado métricas para esta categoría todavía. Contacta al administrador."
              : "Ingresa los primeros datos usando el botón \"Ingresar Datos\" en la parte superior derecha."}
          </p>
        </div>
      ) : (
        <>
          {/* KPI Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <KPICard 
              title="Social Performance Score" 
              value={latest?.social_performance_score || 0} 
              icon={Activity}
              valueSuffix={<span className="text-lg text-slate-400 font-bold">/1000</span>}
              colorClass="text-[#003893]"
            />
            <KPICard 
              title="Seguidores Totales" 
              value={latest?.seguidores || 0} 
              icon={Users}
            />
            <KPICard 
              title="Nuevos Seguidores" 
              value={latest?.nuevos_seguidores || 0} 
              icon={UserPlus}
              colorClass="text-[#fcd116]"
            />
            <KPICard 
              title="Impresiones de publicaciones" 
              value={latest?.impresiones || 0} 
              icon={Eye}
              colorClass="text-emerald-500"
            />
            <KPICard 
              title="Reacciones y Likes de publicaciones" 
              value={latest?.reacciones_likes || 0} 
              icon={Heart}
              colorClass="text-rose-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KPICard 
              title="Comentarios de publicaciones" 
              value={latest?.comentarios_respuestas || 0} 
              icon={MessageCircle}
              colorClass="text-orange-500"
            />
            <KPICard 
              title="Publicaciones" 
              value={latest?.num_publicaciones || 0} 
              icon={FileText}
              colorClass="text-blue-500"
            />
            <KPICard 
              title="Contenidos Entregados" 
              value={latest?.contenidos_entregados || 0} 
              icon={Send}
              colorClass="text-purple-500"
            />
            <KPICard 
              title="Contenidos Publicados" 
              value={latest?.contenidos_publicados || 0} 
              icon={FileText}
              colorClass="text-emerald-600"
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SentimentFigures 
              positive={latest?.sentimiento_positivo || 0} 
              negative={latest?.sentimiento_negativo || 0} 
              title="Análisis de Sentimiento General"
            />

            {/* Publicaciones Principales (Imagen) */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm h-[400px] flex flex-col">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Publicaciones Principales</h3>
              <div className="flex-1 w-full relative bg-slate-50 rounded-xl overflow-hidden border border-slate-100 flex items-center justify-center">
                {latest?.publicaciones_principales ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img 
                    src={latest.publicaciones_principales} 
                    alt="Publicaciones Principales" 
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-slate-400 flex flex-col items-center">
                    <Activity className="w-8 h-8 mb-2 opacity-30" />
                    <span className="text-sm font-medium">No hay captura disponible para esta fecha</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
