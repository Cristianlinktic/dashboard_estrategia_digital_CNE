"use client";

import React, { useEffect, useState, useCallback } from "react";
import { format } from "date-fns";
import { supabase } from "@/lib/supabase";
import { KPICard } from "./KPICard";
import { ListeningForm } from "./ListeningForm";
import { FileText, MessageCircle, Eye, Activity } from "lucide-react";
import { useLayout } from "@/context/LayoutContext";
import { Calendar } from "lucide-react";
import { SentimentFigures } from "./EstrategiaDashboardView";

interface ListeningMetrics {
  id: string;
  fecha: string;
  resultados: number;
  interacciones: number;
  alcance_potencial: number;
  sentimiento_positivo: number;
  sentimiento_negativo: number;
  activity_peak: string;
  tendencia: string;
  hashtags: string;
  hashtags_para_usar: { text: string, importance: string }[];
  palabras_claves_para_usar: { text: string, importance: string }[];
  que_no_usar: { text: string, importance: string }[];
  cuentas_impacto: { nombre: string, identificador: string, impacto: string }[];
  sitios_impacto: { nombre: string, identificador: string, impacto: string }[];
}

export function ListCard({ title, items }: { title: string, items: { text: string, importance: string }[] }) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col min-h-[300px]">
      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">{title}</h3>
      <div className="flex-1 overflow-y-auto space-y-3">
        {!items || items.length === 0 ? (
          <div className="text-sm text-slate-400 italic text-center mt-10">No hay datos</div>
        ) : (
          items.map((item, idx) => {
            const isAlta = item.importance === 'alta';
            const isMedia = item.importance === 'media';
            return (
              <div key={idx} className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-sm font-bold text-slate-700">{item.text}</span>
                <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full ${isAlta ? "bg-rose-100 text-rose-600" :
                  isMedia ? "bg-amber-100 text-amber-600" :
                    "bg-slate-200 text-slate-600"
                  }`}>
                  {item.importance}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export function ImpactCard({ title, items, isUrl }: { title: string, items: { nombre: string, identificador: string, impacto: string }[], isUrl?: boolean }) {
  const getEmoji = (imp: string) => {
    if (imp === 'positivo') return "😀";
    if (imp === 'negativo') return "😡";
    return "😐"; // neutral
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col min-h-[300px]">
      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">{title}</h3>
      <div className="flex-1 overflow-y-auto space-y-3">
        {!items || items.length === 0 ? (
          <div className="text-sm text-slate-400 italic text-center mt-10">No hay datos</div>
        ) : (
          items.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-700">{item.nombre}</span>
                {isUrl ? (
                  <a href={item.identificador.startsWith('http') ? item.identificador : `https://${item.identificador}`} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline">{item.identificador}</a>
                ) : (
                  <span className="text-xs text-slate-500">{item.identificador}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-black uppercase tracking-wide px-2 py-1 rounded-full ${item.impacto === 'positivo' ? 'bg-emerald-100 text-emerald-600' :
                  item.impacto === 'negativo' ? 'bg-rose-100 text-rose-600' :
                    'bg-slate-100 text-slate-500'
                  }`}>
                  {item.impacto === 'positivo' ? 'Positivo' : item.impacto === 'negativo' ? 'Negativo' : 'Neutral'}
                </span>
                <span className="text-2xl" title={item.impacto}>
                  {getEmoji(item.impacto)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export function ListeningDashboardView({ title }: { title: string }) {
  const { userRole } = useLayout();
  const [data, setData] = useState<ListeningMetrics[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getTodayString = () => {
    return format(new Date(), 'yyyy-MM-dd');
  };

  const [selectedDate, setSelectedDate] = useState<string>(getTodayString());

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    const { data: metrics, error } = await supabase
      .from('listening_metrics')
      .select('*')
      .order('fecha', { ascending: true });

    if (error) {
      console.error("Error fetching data:", error);
    } else {
      setData(metrics || []);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredData = React.useMemo(() => {
    if (!selectedDate) return data;
    return data.filter(item => item.fecha <= selectedDate);
  }, [data, selectedDate]);

  const latest = filteredData.length > 0 ? filteredData[filteredData.length - 1] : null;

  return (
    <div className="p-6 md:p-8 lg:p-10 space-y-8 max-w-7xl mx-auto pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-800">{title}</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Métricas de escucha social</p>
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
          <ListeningForm onSuccess={fetchData} initialData={latest} selectedDate={selectedDate} />
        </div>
      </div>

      {isLoading ? (
        <div className="h-[60vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003893]"></div>
        </div>
      ) : data.length === 0 ? (
        <div className="h-[60vh] flex flex-col items-center justify-center bg-white rounded-3xl border border-slate-200">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <Activity className="w-8 h-8 text-slate-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-700">Aún no hay datos para {title}</h2>
          <p className="text-slate-500 mt-2 max-w-md text-center">
            {userRole === 'viewer'
              ? "No se han registrado métricas para esta sección todavía. Contacta al administrador."
              : "Ingresa los primeros datos usando el botón \"Ingresar Datos\" en la parte superior derecha."}
          </p>
        </div>
      ) : (
        <>
          {/* KPI Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <KPICard
              title="Resultados"
              value={latest?.resultados || 0}
              icon={FileText}
              colorClass="text-[#003893]"
            />
            <KPICard
              title="Interacciones"
              value={latest?.interacciones || 0}
              icon={MessageCircle}
              colorClass="text-emerald-500"
            />
            <KPICard
              title="Alcance Potencial"
              value={latest?.alcance_potencial || 0}
              icon={Eye}
              colorClass="text-purple-500"
            />
          </div>

          {/* Sentimiento + Activity Peak en la misma fila */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SentimentFigures
              positive={latest?.sentimiento_positivo || 0}
              negative={latest?.sentimiento_negativo || 0}
              title="Análisis de Sentimiento de la conversación"
            />
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm min-h-[300px] flex flex-col">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Activity Peak</h3>
              <div className="flex-1 w-full relative bg-slate-50 rounded-xl overflow-hidden border border-slate-100 flex items-center justify-center">
                {latest?.activity_peak ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={latest.activity_peak}
                    alt="Activity Peak"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-slate-400 flex flex-col items-center">
                    <Activity className="w-8 h-8 mb-2 opacity-30" />
                    <span className="text-sm font-medium text-center">No hay captura disponible<br />para esta fecha</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tendencia (Ocupa fila completa) */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm min-h-[500px] flex flex-col w-full">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Tendencia</h3>
            <div className="flex-1 w-full relative bg-slate-50 rounded-xl overflow-hidden border border-slate-100 flex items-center justify-center">
              {latest?.tendencia ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={latest.tendencia}
                  alt="Tendencia"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-slate-400 flex flex-col items-center">
                  <Activity className="w-8 h-8 mb-2 opacity-30" />
                  <span className="text-sm font-medium text-center">No hay captura disponible<br />para esta fecha</span>
                </div>
              )}
            </div>
          </div>

          {/* Hashtags (Ocupa fila completa) */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm min-h-[500px] flex flex-col w-full">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Hashtags</h3>
            <div className="flex-1 w-full relative bg-slate-50 rounded-xl overflow-hidden border border-slate-100 flex items-center justify-center">
              {latest?.hashtags ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={latest.hashtags}
                  alt="Hashtags"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-slate-400 flex flex-col items-center">
                  <Activity className="w-8 h-8 mb-2 opacity-30" />
                  <span className="text-sm font-medium text-center">No hay captura disponible<br />para esta fecha</span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <ImpactCard title="Cuentas con Mayor Impacto" items={latest?.cuentas_impacto || []} />
            <ImpactCard title="Sitios con Mayor Impacto" items={latest?.sitios_impacto || []} isUrl />
          </div>

          {/* List Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <ListCard title="Hashtags para usar" items={latest?.hashtags_para_usar || []} />
            <ListCard title="Palabras Claves para usar" items={latest?.palabras_claves_para_usar || []} />
            <ListCard title="Qué NO usar" items={latest?.que_no_usar || []} />
          </div>
        </>
      )}
    </div>
  );
}
