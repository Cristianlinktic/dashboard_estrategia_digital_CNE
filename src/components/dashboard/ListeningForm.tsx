"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { supabase } from "@/lib/supabase";
import { X, Save, Plus, AlertCircle, Loader2, Upload } from "lucide-react";
import { useLayout } from "@/context/LayoutContext";

interface ListeningFormProps {
  onSuccess: () => void;
  initialData?: any;
  selectedDate?: string;
}

function DynamicListInput({ label, items, onChange }: { label: string, items: { text: string, importance: string }[], onChange: (items: { text: string, importance: string }[]) => void }) {
  const [text, setText] = useState("");
  const [importance, setImportance] = useState("alta");

  const handleAdd = () => {
    if (!text.trim()) return;
    onChange([...items, { text: text.trim(), importance }]);
    setText("");
  };

  const handleRemove = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="col-span-1 sm:col-span-2 space-y-2">
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{label}</label>
      <div className="flex gap-2">
        <input 
          type="text" 
          value={text} 
          onChange={e => setText(e.target.value)} 
          className="flex-1 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#003893]/20 focus:border-[#003893] transition-all font-medium"
          placeholder="Ej. #elecciones" 
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAdd(); } }}
        />
        <select 
          value={importance} 
          onChange={e => setImportance(e.target.value)}
          className="bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#003893]/20 focus:border-[#003893] transition-all font-medium"
        >
          <option value="alta">Alta</option>
          <option value="media">Media</option>
          <option value="baja">Baja</option>
        </select>
        <button 
          type="button" 
          onClick={handleAdd}
          className="bg-[#003893] text-white px-4 py-3 rounded-xl font-bold hover:bg-[#002b70] transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
      {items.length > 0 && (
        <div className="flex flex-col gap-2 mt-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-slate-200 shadow-sm">
              <span className="text-sm font-bold text-slate-700">{item.text}</span>
              <div className="flex items-center gap-3">
                <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full ${
                  item.importance === 'alta' ? "bg-rose-100 text-rose-600" :
                  item.importance === 'media' ? "bg-amber-100 text-amber-600" :
                  "bg-slate-200 text-slate-600"
                }`}>
                  {item.importance}
                </span>
                <button type="button" onClick={() => handleRemove(idx)} className="text-slate-400 hover:text-rose-500 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DynamicImpactInput({ label, idLabel, idPlaceholder, items, onChange }: { label: string, idLabel: string, idPlaceholder: string, items: { nombre: string, identificador: string, impacto: string }[], onChange: (items: { nombre: string, identificador: string, impacto: string }[]) => void }) {
  const [nombre, setNombre] = useState("");
  const [identificador, setIdentificador] = useState("");
  const [impacto, setImpacto] = useState("positivo");

  const handleAdd = () => {
    if (!nombre.trim() || !identificador.trim()) return;
    onChange([...items, { nombre: nombre.trim(), identificador: identificador.trim(), impacto }]);
    setNombre("");
    setIdentificador("");
  };

  const handleRemove = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="col-span-1 sm:col-span-2 space-y-2 mt-4 pt-4 border-t border-slate-100">
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{label}</label>
      <div className="flex flex-col sm:flex-row gap-2">
        <input 
          type="text" 
          value={nombre} 
          onChange={e => setNombre(e.target.value)} 
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAdd(); } }}
          className="flex-1 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#003893]/20 focus:border-[#003893] transition-all font-medium"
          placeholder="Nombre" 
        />
        <input 
          type="text" 
          value={identificador} 
          onChange={e => setIdentificador(e.target.value)} 
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAdd(); } }}
          className="flex-1 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#003893]/20 focus:border-[#003893] transition-all font-medium"
          placeholder={idPlaceholder} 
        />
        <select 
          value={impacto} 
          onChange={e => setImpacto(e.target.value)}
          className="bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#003893]/20 focus:border-[#003893] transition-all font-medium"
        >
          <option value="positivo">Positivo 😀</option>
          <option value="neutral">Neutral 😐</option>
          <option value="negativo">Negativo 😡</option>
        </select>
        <button 
          type="button" 
          onClick={handleAdd}
          className="bg-[#003893] text-white px-4 py-3 rounded-xl font-bold hover:bg-[#002b70] transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
      {items.length > 0 && (
        <div className="flex flex-col gap-2 mt-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-slate-200 shadow-sm">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-700">{item.nombre}</span>
                <span className="text-xs text-slate-500">{item.identificador}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xl" title={item.impacto}>
                  {item.impacto === 'positivo' ? "😀" : item.impacto === 'negativo' ? "😡" : "😐"}
                </span>
                <button type="button" onClick={() => handleRemove(idx)} className="text-slate-400 hover:text-rose-500 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function ListeningForm({ onSuccess, initialData, selectedDate }: ListeningFormProps) {
  const { userRole } = useLayout();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [activityPeakFile, setActivityPeakFile] = useState<File | null>(null);
  const [tendenciaFile, setTendenciaFile] = useState<File | null>(null);
  const [hashtagsFile, setHashtagsFile] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    fecha: selectedDate || format(new Date(), 'yyyy-MM-dd'),
    resultados: "",
    interacciones: "",
    alcance_potencial: "",
    sentimiento_positivo: "",
    sentimiento_negativo: "",
  });

  const [hashtagsParaUsar, setHashtagsParaUsar] = useState<{ text: string, importance: string }[]>([]);
  const [palabrasClavesParaUsar, setPalabrasClavesParaUsar] = useState<{ text: string, importance: string }[]>([]);
  const [queNoUsar, setQueNoUsar] = useState<{ text: string, importance: string }[]>([]);

  const [cuentasImpacto, setCuentasImpacto] = useState<{ nombre: string, identificador: string, impacto: string }[]>([]);
  const [sitiosImpacto, setSitiosImpacto] = useState<{ nombre: string, identificador: string, impacto: string }[]>([]);

  React.useEffect(() => {
    if (isOpen && initialData) {
      setFormData({
        fecha: initialData.fecha,
        resultados: initialData.resultados || "",
        interacciones: initialData.interacciones || "",
        alcance_potencial: initialData.alcance_potencial || "",
        sentimiento_positivo: initialData.sentimiento_positivo || "",
        sentimiento_negativo: initialData.sentimiento_negativo || "",
      });
      setHashtagsParaUsar(initialData.hashtags_para_usar || []);
      setPalabrasClavesParaUsar(initialData.palabras_claves_para_usar || []);
      setQueNoUsar(initialData.que_no_usar || []);
      setCuentasImpacto(initialData.cuentas_impacto || []);
      setSitiosImpacto(initialData.sitios_impacto || []);
    } else if (isOpen && !initialData) {
      setFormData(prev => ({
        ...prev,
        fecha: selectedDate || format(new Date(), 'yyyy-MM-dd')
      }));
    }
  }, [isOpen, initialData, selectedDate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const uploadImage = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `listening-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const { error: uploadError } = await supabase.storage
      .from('dashboard_images')
      .upload(fileName, file);
    
    if (uploadError) {
      console.error("Upload error details:", uploadError);
      throw new Error("Error al subir imagen. Asegúrate de tener el bucket 'dashboard_images' como público.");
    }

    const { data: { publicUrl } } = supabase.storage
      .from('dashboard_images')
      .getPublicUrl(fileName);
    
    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userRole === 'viewer') return;
    setIsLoading(true);
    setError("");

    try {
      let activityPeakUrl = null;
      if (activityPeakFile) {
        activityPeakUrl = await uploadImage(activityPeakFile);
      }

      let tendenciaUrl = null;
      if (tendenciaFile) {
        tendenciaUrl = await uploadImage(tendenciaFile);
      }

      let hashtagsUrl = null;
      if (hashtagsFile) {
        hashtagsUrl = await uploadImage(hashtagsFile);
      }

      const upsertData: any = { 
        ...formData,
        hashtags_para_usar: hashtagsParaUsar,
        palabras_claves_para_usar: palabrasClavesParaUsar,
        que_no_usar: queNoUsar,
        cuentas_impacto: cuentasImpacto,
        sitios_impacto: sitiosImpacto
      };
      if (activityPeakUrl) upsertData.activity_peak = activityPeakUrl;
      if (tendenciaUrl) upsertData.tendencia = tendenciaUrl;
      if (hashtagsUrl) upsertData.hashtags = hashtagsUrl;

      const { error: upsertError } = await supabase
        .from('listening_metrics')
        .upsert(upsertData, { onConflict: 'fecha' });

      if (upsertError) throw upsertError;

      setIsOpen(false);
      setActivityPeakFile(null);
      setTendenciaFile(null);
      setHashtagsFile(null);
      setHashtagsParaUsar([]);
      setPalabrasClavesParaUsar([]);
      setQueNoUsar([]);
      setCuentasImpacto([]);
      setSitiosImpacto([]);
      onSuccess();
    } catch (err: any) {
      console.error("Error saving data:", err);
      setError(err.message || "Error al guardar los datos.");
    } finally {
      setIsLoading(false);
    }
  };

  if (userRole === 'viewer') return null;

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-[#003893] text-white px-4 py-2.5 rounded-xl font-bold hover:bg-[#002b70] transition-colors shadow-md shadow-[#003893]/20"
      >
        <Plus className="w-4 h-4" />
        {initialData ? "Editar / Ingresar" : "Ingresar Datos"}
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h2 className="text-xl font-black text-slate-800">Actualizar Listening</h2>
            <p className="text-sm font-medium text-slate-500">Métricas diarias</p>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {error && (
            <div className="mb-6 p-4 bg-rose-50 border-l-4 border-rose-500 rounded-r-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <p className="text-sm text-rose-700 font-medium">{error}</p>
            </div>
          )}

          <form id="listening-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="col-span-1 sm:col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Fecha</label>
                <input
                  type="date"
                  name="fecha"
                  required
                  value={formData.fecha}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#003893]/20 focus:border-[#003893] transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Resultados</label>
                <input
                  type="text"
                  name="resultados"
                  required
                  value={formData.resultados}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#003893]/20 focus:border-[#003893] transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Interacciones</label>
                <input
                  type="text"
                  name="interacciones"
                  required
                  value={formData.interacciones}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#003893]/20 focus:border-[#003893] transition-all font-medium"
                />
              </div>

              <div className="col-span-1 sm:col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Alcance Potencial</label>
                <input
                  type="text"
                  name="alcance_potencial"
                  required
                  value={formData.alcance_potencial}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#003893]/20 focus:border-[#003893] transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Sentimiento Positivo (%)</label>
                <input
                  type="text"
                  name="sentimiento_positivo"
                  required
                  value={formData.sentimiento_positivo}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#003893]/20 focus:border-[#003893] transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Sentimiento Negativo (%)</label>
                <input
                  type="text"
                  name="sentimiento_negativo"
                  required
                  value={formData.sentimiento_negativo}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#003893]/20 focus:border-[#003893] transition-all font-medium"
                />
              </div>

              <div className="col-span-1 sm:col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Activity Peak (Imagen)</label>
                <div className="relative w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus-within:ring-2 focus-within:ring-[#003893]/20 focus-within:border-[#003893] transition-all font-medium flex items-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setActivityPeakFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex items-center gap-2 pointer-events-none">
                    <Upload className="w-5 h-5 text-slate-400" />
                    <span className="text-sm text-slate-500">
                      {activityPeakFile ? activityPeakFile.name : "Seleccionar imagen para Activity Peak..."}
                    </span>
                  </div>
                </div>
              </div>

              <div className="col-span-1 sm:col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Tendencia (Imagen)</label>
                <div className="relative w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus-within:ring-2 focus-within:ring-[#003893]/20 focus-within:border-[#003893] transition-all font-medium flex items-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setTendenciaFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex items-center gap-2 pointer-events-none">
                    <Upload className="w-5 h-5 text-slate-400" />
                    <span className="text-sm text-slate-500">
                      {tendenciaFile ? tendenciaFile.name : "Seleccionar imagen para Tendencia..."}
                    </span>
                  </div>
                </div>
              </div>

              <div className="col-span-1 sm:col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Hashtags (Imagen)</label>
                <div className="relative w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus-within:ring-2 focus-within:ring-[#003893]/20 focus-within:border-[#003893] transition-all font-medium flex items-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setHashtagsFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex items-center gap-2 pointer-events-none">
                    <Upload className="w-5 h-5 text-slate-400" />
                    <span className="text-sm text-slate-500">
                      {hashtagsFile ? hashtagsFile.name : "Seleccionar imagen para Hashtags..."}
                    </span>
                  </div>
                </div>
              </div>

              <DynamicListInput 
                label="Hashtags para usar" 
                items={hashtagsParaUsar} 
                onChange={setHashtagsParaUsar} 
              />
              
              <DynamicListInput 
                label="Palabras Claves para usar" 
                items={palabrasClavesParaUsar} 
                onChange={setPalabrasClavesParaUsar} 
              />
              
              <DynamicListInput 
                label="Qué NO usar" 
                items={queNoUsar} 
                onChange={setQueNoUsar} 
              />

              <DynamicImpactInput
                label="Cuentas con Mayor Impacto"
                idLabel="Arroba (@)"
                idPlaceholder="Ej. @usuario"
                items={cuentasImpacto}
                onChange={setCuentasImpacto}
              />

              <DynamicImpactInput
                label="Sitios con Mayor Impacto"
                idLabel="URL"
                idPlaceholder="Ej. https://ejemplo.com"
                items={sitiosImpacto}
                onChange={setSitiosImpacto}
              />

            </div>
          </form>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3 mt-auto">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="px-5 py-2.5 rounded-xl font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            Cancelar
          </button>
          <button
            form="listening-form"
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#003893] text-white rounded-xl font-bold hover:bg-[#002b70] transition-colors shadow-md shadow-[#003893]/20 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Guardar Datos
          </button>
        </div>
      </div>
    </div>
  );
}
