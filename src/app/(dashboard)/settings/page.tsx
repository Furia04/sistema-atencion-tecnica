'use client';

import React, { useState } from 'react';
import {
  Settings,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  Sliders,
  Layers,
  Store,
  Receipt,
  Type,
  Hash,
  ListFilter,
  CheckSquare,
  AlignLeft,
  ChevronRight,
  Eye,
} from 'lucide-react';
import {
  CustomFieldDefinition,
  DeviceCategoryTemplate,
  FieldType,
} from '@/types';
import { CustomFieldsRenderer } from '@/components/orders/custom-fields-renderer';

const DEFAULT_TEMPLATES: DeviceCategoryTemplate[] = [
  {
    id: 'tmpl-1',
    category_name: 'Celulares & Tablets',
    fields: [
      { id: 'f1', name: 'passcode', label: 'Patrón / Clave de Desbloqueo', type: 'text', required: false, placeholder: 'Ej: 1234' },
      { id: 'f2', name: 'has_sim', label: 'Trae Tarjeta SIM', type: 'checkbox', required: false },
      { id: 'f3', name: 'battery_state', label: 'Estado de Batería', type: 'select', required: false, options: ['Buena (Original)', 'Degradada', 'Inflada / Dañada'] },
    ],
  },
  {
    id: 'tmpl-2',
    category_name: 'Notebooks & Computadoras',
    fields: [
      { id: 'f4', name: 'charger_included', label: 'Incluye Cargador Original', type: 'checkbox', required: true },
      { id: 'f5', name: 'ram_size', label: 'Memoria RAM Instalada (GB)', type: 'number', required: false, placeholder: 'Ej: 16' },
      { id: 'f6', name: 'os_user_pass', label: 'Usuario / Clave de Inicio de Sesión', type: 'text', required: false },
    ],
  },
  {
    id: 'tmpl-3',
    category_name: 'Automotores & Módulos ECU',
    fields: [
      { id: 'f7', name: 'mileage', label: 'Kilometraje Actual del Vehículo', type: 'number', required: true, placeholder: 'Ej: 120000' },
      { id: 'f8', name: 'license_plate', label: 'Patente / Dominio', type: 'text', required: true, placeholder: 'Ej: AA123BB' },
      { id: 'f9', name: 'fault_codes', label: 'Códigos DTC de Falla Escáner', type: 'textarea', required: false, placeholder: 'Ej: P0300, P0171' },
    ],
  },
];

export default function ErgonomicSettingsPage() {
  const [activeMainTab, setActiveMainTab] = useState<'general' | 'fields'>('fields');

  // Shop Settings State
  const [shopName, setShopName] = useState('ProRepair Ops - North Station');
  const [whatsappPhone, setWhatsappPhone] = useState('+5491122334455');
  const [ticketTerms, setTicketTerms] = useState(
    'No nos responsabilizamos por pérdida de datos. Los presupuestos tienen una validez de 15 días. Garantía de reparación: 30 días.'
  );

  // Dynamic Templates State
  const [templates, setTemplates] = useState<DeviceCategoryTemplate[]>(DEFAULT_TEMPLATES);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('tmpl-1');
  const [showAddFieldForm, setShowAddFieldForm] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // New field form state
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldType, setNewFieldType] = useState<FieldType>('text');
  const [newFieldRequired, setNewFieldRequired] = useState(false);
  const [newFieldOptions, setNewFieldOptions] = useState('');

  // Sample values for live preview
  const [previewValues, setPreviewValues] = useState<Record<string, any>>({});

  const currentTemplate =
    templates.find((t) => t.id === selectedTemplateId) || templates[0];

  const handleAddField = () => {
    if (!newFieldLabel.trim()) return;

    const fieldKey =
      newFieldName.trim() ||
      newFieldLabel.toLowerCase().replace(/[^a-z0-9]/g, '_');

    const optionsArray =
      newFieldType === 'select'
        ? newFieldOptions
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        : undefined;

    const newField: CustomFieldDefinition = {
      id: `f_${Date.now()}`,
      name: fieldKey,
      label: newFieldLabel.trim(),
      type: newFieldType,
      required: newFieldRequired,
      options: optionsArray,
    };

    setTemplates((prev) =>
      prev.map((tmpl) =>
        tmpl.id === selectedTemplateId
          ? { ...tmpl, fields: [...tmpl.fields, newField] }
          : tmpl
      )
    );

    // Reset form
    setNewFieldLabel('');
    setNewFieldName('');
    setNewFieldType('text');
    setNewFieldRequired(false);
    setNewFieldOptions('');
    setShowAddFieldForm(false);
  };

  const handleRemoveField = (fieldId: string) => {
    setTemplates((prev) =>
      prev.map((tmpl) =>
        tmpl.id === selectedTemplateId
          ? {
              ...tmpl,
              fields: tmpl.fields.filter((f) => f.id !== fieldId),
            }
          : tmpl
      )
    );
  };

  const handleAddCategory = () => {
    const categoryName = prompt('Nombre de la nueva categoría de equipos (ej: Consolas, Drones, Audio):');
    if (!categoryName) return;

    const newTmpl: DeviceCategoryTemplate = {
      id: `tmpl_${Date.now()}`,
      category_name: categoryName.trim(),
      fields: [],
    };

    setTemplates((prev) => [...prev, newTmpl]);
    setSelectedTemplateId(newTmpl.id);
  };

  const handleSaveSettings = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const getFieldIcon = (type: FieldType) => {
    switch (type) {
      case 'text':
        return <Type className="w-4 h-4 text-sky-400" />;
      case 'number':
        return <Hash className="w-4 h-4 text-emerald-400" />;
      case 'select':
        return <ListFilter className="w-4 h-4 text-purple-400" />;
      case 'checkbox':
        return <CheckSquare className="w-4 h-4 text-amber-400" />;
      case 'textarea':
        return <AlignLeft className="w-4 h-4 text-orange-400" />;
      default:
        return <Type className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-6 pb-12">
      {/* Header Ergonómico de la Página */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline-variant/60 pb-5">
        <div>
          <h2 className="font-display-lg text-display-lg text-on-surface flex items-center gap-3">
            <Sliders className="w-7 h-7 text-primary" /> Configuración y Campos Dinámicos
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Administra el perfil de tu taller y personaliza qué datos solicitar al recibir cada equipo.
          </p>
        </div>
        <button
          onClick={handleSaveSettings}
          className="self-start sm:self-auto bg-primary-container text-on-primary-container font-title-sm text-title-sm px-6 py-2.5 rounded-lg hover:bg-primary transition-colors flex items-center gap-2 shadow-md font-semibold"
        >
          {savedSuccess ? (
            <>
              <CheckCircle2 className="w-5 h-5 text-emerald-300" /> Cambios Guardados
            </>
          ) : (
            <>
              <Save className="w-5 h-5" /> Guardar Cambios
            </>
          )}
        </button>
      </div>

      {/* Pestañas Principales Ergonomía Espaciosa */}
      <div className="flex gap-3 border-b border-outline-variant/50 pb-1">
        <button
          onClick={() => setActiveMainTab('fields')}
          className={`px-5 py-2.5 rounded-t-lg font-title-sm text-body-md transition-all flex items-center gap-2 border-b-2 ${
            activeMainTab === 'fields'
              ? 'border-primary text-primary bg-surface-container-high/60 font-bold'
              : 'border-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
          }`}
        >
          <Layers className="w-5 h-5" /> Plantillas y Campos por Categoría
        </button>
        <button
          onClick={() => setActiveMainTab('general')}
          className={`px-5 py-2.5 rounded-t-lg font-title-sm text-body-md transition-all flex items-center gap-2 border-b-2 ${
            activeMainTab === 'general'
              ? 'border-primary text-primary bg-surface-container-high/60 font-bold'
              : 'border-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
          }`}
        >
          <Store className="w-5 h-5" /> Perfil del Taller y Ticket Térmico
        </button>
      </div>

      {/* TAB 1: PERFIL DEL TALLER (Espaciado y Limpio) */}
      {activeMainTab === 'general' && (
        <div className="space-y-6 max-w-3xl">
          <div className="bg-surface-container border border-outline-variant rounded-xl p-6 space-y-5">
            <div className="flex items-center gap-2 text-primary font-title-sm font-bold border-b border-outline-variant/40 pb-3">
              <Store className="w-5 h-5" />
              <h3>Información General del Taller</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block font-label-caps text-xs text-on-surface-variant mb-1 uppercase font-semibold">
                  Nombre del Taller / Sucursal
                </label>
                <input
                  type="text"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-2.5 font-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary/50"
                />
              </div>

              <div>
                <label className="block font-label-caps text-xs text-on-surface-variant mb-1 uppercase font-semibold">
                  Teléfono de Contacto (WhatsApp para Notificaciones B2C)
                </label>
                <input
                  type="text"
                  value={whatsappPhone}
                  onChange={(e) => setWhatsappPhone(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-2.5 font-mono-data text-on-surface focus:border-primary focus:ring-1 focus:ring-primary/50"
                />
              </div>
            </div>
          </div>

          <div className="bg-surface-container border border-outline-variant rounded-xl p-6 space-y-5">
            <div className="flex items-center gap-2 text-primary font-title-sm font-bold border-b border-outline-variant/40 pb-3">
              <Receipt className="w-5 h-5" />
              <h3>Términos y Condiciones para Ticket Imprimible (80mm)</h3>
            </div>

            <div>
              <label className="block font-label-caps text-xs text-on-surface-variant mb-1 uppercase font-semibold">
                Contrato de Recepción / Garantía
              </label>
              <textarea
                value={ticketTerms}
                onChange={(e) => setTicketTerms(e.target.value)}
                rows={5}
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-4 font-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary/50 resize-none"
              />
              <p className="text-xs text-on-surface-variant mt-2">
                Este texto se imprimirá al pie del ticket térmico entregado al cliente en el Punto de Recepción.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PLANTILLAS Y CAMPOS EN LISTA ERGONOMICA */}
      {activeMainTab === 'fields' && (
        <div className="space-y-6">
          {/* Selector de Categoría en Fila Limpia */}
          <div className="bg-surface-container border border-outline-variant rounded-xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-outline-variant/40 pb-3">
              <div>
                <h3 className="font-title-sm text-title-sm text-on-surface font-bold">
                  Categorías de Dispositivos
                </h3>
                <p className="font-body-sm text-xs text-on-surface-variant mt-0.5">
                  Selecciona una categoría para personalizar los datos dinámicos solicitados al cliente.
                </p>
              </div>
              <button
                onClick={handleAddCategory}
                className="self-start sm:self-auto bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 px-3.5 py-1.5 rounded-lg text-xs font-label-caps font-bold transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Nueva Categoría
              </button>
            </div>

            {/* List horizontal pills */}
            <div className="flex flex-wrap gap-2">
              {templates.map((tmpl) => {
                const isSelected = selectedTemplateId === tmpl.id;
                return (
                  <button
                    key={tmpl.id}
                    onClick={() => setSelectedTemplateId(tmpl.id)}
                    className={`px-4 py-2.5 rounded-lg font-title-sm text-sm transition-all flex items-center gap-2 border ${
                      isSelected
                        ? 'bg-primary-container text-on-primary-container border-primary font-bold shadow-md'
                        : 'bg-surface-container-low text-on-surface-variant border-outline-variant hover:bg-surface-container-high hover:text-on-surface'
                    }`}
                  >
                    <span>{tmpl.category_name}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono-data font-bold ${
                        isSelected
                          ? 'bg-primary/20 text-on-primary-container'
                          : 'bg-surface-variant text-on-surface-variant'
                      }`}
                    >
                      {tmpl.fields.length} campos
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Lista Estructurada de Campos Configurados */}
          <div className="bg-surface-container border border-outline-variant rounded-xl p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-outline-variant/40 pb-4">
              <div>
                <h3 className="font-title-sm text-title-sm text-on-surface font-bold flex items-center gap-2">
                  Campos Configurados en <span className="text-primary font-bold">"{currentTemplate.category_name}"</span>
                </h3>
                <p className="font-body-sm text-xs text-on-surface-variant mt-0.5">
                  Lista ordenada de atributos que el técnico completará al crear una orden para esta categoría.
                </p>
              </div>

              {!showAddFieldForm && (
                <button
                  onClick={() => setShowAddFieldForm(true)}
                  className="bg-primary-container text-on-primary-container hover:bg-primary transition-colors px-4 py-2 rounded-lg font-title-sm text-xs flex items-center gap-1.5 font-semibold self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" /> Agregar Campo a esta Categoría
                </button>
              )}
            </div>

            {/* Formulario Estructurado Desplegable para Agregar Campo */}
            {showAddFieldForm && (
              <div className="bg-surface-container-low border-2 border-primary/40 rounded-xl p-5 space-y-4 animate-in fade-in duration-200">
                <div className="flex justify-between items-center border-b border-outline-variant/40 pb-2">
                  <h4 className="font-title-sm text-sm text-primary font-bold flex items-center gap-1.5">
                    <Plus className="w-4 h-4" /> Configurar Nuevo Campo Dinámico
                  </h4>
                  <button
                    onClick={() => setShowAddFieldForm(false)}
                    className="text-xs text-on-surface-variant hover:text-on-surface underline"
                  >
                    Cancelar
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-label-caps text-xs text-on-surface-variant mb-1 uppercase font-semibold">
                      Nombre / Etiqueta del Campo
                    </label>
                    <input
                      type="text"
                      value={newFieldLabel}
                      onChange={(e) => setNewFieldLabel(e.target.value)}
                      placeholder="Ej: Patrón de desbloqueo"
                      className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 font-body-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary/50"
                    />
                  </div>

                  <div>
                    <label className="block font-label-caps text-xs text-on-surface-variant mb-1 uppercase font-semibold">
                      Tipo de Campo (Input)
                    </label>
                    <select
                      value={newFieldType}
                      onChange={(e) => setNewFieldType(e.target.value as FieldType)}
                      className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 font-body-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary/50"
                    >
                      <option value="text">Texto Corto (Text)</option>
                      <option value="number">Número (Number)</option>
                      <option value="select">Lista Desplegable (Select)</option>
                      <option value="checkbox">Casilla de Verificación (Checkbox)</option>
                      <option value="textarea">Texto Multilínea (Textarea)</option>
                    </select>
                  </div>

                  <div className="flex items-end pb-2 gap-2">
                    <input
                      type="checkbox"
                      id="reqCheck"
                      checked={newFieldRequired}
                      onChange={(e) => setNewFieldRequired(e.target.checked)}
                      className="w-4 h-4 rounded border-outline-variant bg-surface-container-lowest text-primary focus:ring-primary"
                    />
                    <label htmlFor="reqCheck" className="font-body-sm text-sm text-on-surface cursor-pointer select-none">
                      Es Campo Obligatorio
                    </label>
                  </div>
                </div>

                {newFieldType === 'select' && (
                  <div>
                    <label className="block font-label-caps text-xs text-on-surface-variant mb-1 uppercase font-semibold">
                      Opciones Desplegables (Separadas por comas)
                    </label>
                    <input
                      type="text"
                      value={newFieldOptions}
                      onChange={(e) => setNewFieldOptions(e.target.value)}
                      placeholder="Ej: Excelente, Bueno, Roto / Inflado"
                      className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 font-body-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary/50"
                    />
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => setShowAddFieldForm(false)}
                    className="px-4 py-2 rounded-lg text-xs font-title-sm text-on-surface-variant hover:bg-surface-container-high"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleAddField}
                    className="bg-primary-container text-on-primary-container hover:bg-primary font-title-sm text-xs px-5 py-2 rounded-lg font-semibold shadow-sm"
                  >
                    Añadir a la Lista
                  </button>
                </div>
              </div>
            )}

            {/* LISTA LIMPIA Y ERGONÓMICA DE CAMPOS */}
            {currentTemplate.fields.length === 0 ? (
              <div className="text-center py-10 border-2 border-dashed border-outline-variant/50 rounded-xl">
                <p className="text-sm text-on-surface-variant">
                  No hay campos definidos para la categoría <strong className="text-on-surface">{currentTemplate.category_name}</strong>.
                </p>
                <button
                  onClick={() => setShowAddFieldForm(true)}
                  className="mt-3 text-xs text-primary font-bold hover:underline inline-flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> Agregar el primer campo
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {currentTemplate.fields.map((field, idx) => (
                  <div
                    key={field.id}
                    className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-outline transition-colors shadow-sm"
                  >
                    <div className="flex items-center gap-4">
                      {/* Badge de número / orden */}
                      <span className="w-7 h-7 rounded-full bg-surface-bright text-on-surface-variant font-mono-data text-xs flex items-center justify-center font-bold">
                        {idx + 1}
                      </span>

                      {/* Icono del tipo de campo */}
                      <div className="p-2 rounded-lg bg-surface-container-high border border-outline-variant/40">
                        {getFieldIcon(field.type)}
                      </div>

                      {/* Información del campo */}
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-title-sm text-sm text-on-surface font-semibold">
                            {field.label}
                          </h4>
                          {field.required ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-label-caps font-bold bg-error/15 text-error border border-error/30 uppercase">
                              Obligatorio
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-label-caps text-on-surface-variant bg-surface-bright/50">
                              Opcional
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3 mt-1 text-xs text-on-surface-variant">
                          <span className="font-mono-data text-[11px] text-primary/80">
                            Clave JSONB: <strong>{field.name}</strong>
                          </span>
                          <span>•</span>
                          <span className="capitalize font-mono-data text-[11px]">
                            Tipo: {field.type}
                          </span>
                          {field.options && field.options.length > 0 && (
                            <>
                              <span>•</span>
                              <span className="text-[11px] text-slate-400">
                                Opciones: [{field.options.join(', ')}]
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Acciones */}
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        onClick={() => handleRemoveField(field.id)}
                        className="p-2 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-lg transition-colors"
                        title="Eliminar campo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* TARJETA SEPARADA DE PREVISUALIZACIÓN ERGONÓMICA */}
          <div className="bg-surface-container border border-outline-variant rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-primary font-title-sm font-bold border-b border-outline-variant/40 pb-3">
              <Eye className="w-5 h-5" />
              <h3>Vista Previa del Formulario para "{currentTemplate.category_name}"</h3>
            </div>
            <p className="font-body-sm text-xs text-on-surface-variant">
              Así es como el recepcionista del taller verá y completará los datos al ingresar un equipo en esta categoría:
            </p>

            <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/60">
              <CustomFieldsRenderer
                fields={currentTemplate.fields}
                values={previewValues}
                onChange={(key, val) =>
                  setPreviewValues((prev) => ({ ...prev, [key]: val }))
                }
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
