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
  Smartphone,
  Laptop,
  Car,
  Gamepad2,
} from 'lucide-react';
import {
  CustomFieldDefinition,
  DeviceCategoryTemplate,
  FieldType,
  ShopSettings,
} from '@/types';
import { CustomFieldsRenderer } from '@/components/orders/custom-fields-renderer';

const DEFAULT_TEMPLATES: DeviceCategoryTemplate[] = [
  {
    id: 'tmpl-1',
    category_name: 'Celulares & Tablets',
    fields: [
      { id: 'f1', name: 'passcode', label: 'Patrón / Clave', type: 'text', required: false, placeholder: 'Ej: 1234' },
      { id: 'f2', name: 'has_sim', label: 'Trae Chip SIM', type: 'checkbox', required: false },
      { id: 'f3', name: 'battery_state', label: 'Estado de Batería', type: 'select', required: false, options: ['Buena (Original)', 'Degradada', 'Inflada'] },
    ],
  },
  {
    id: 'tmpl-2',
    category_name: 'Notebooks & PC',
    fields: [
      { id: 'f4', name: 'charger_included', label: 'Incluye Cargador', type: 'checkbox', required: true },
      { id: 'f5', name: 'ram_size', label: 'Memoria RAM (GB)', type: 'number', required: false, placeholder: 'Ej: 16' },
      { id: 'f6', name: 'os_user_pass', label: 'Usuario / Clave SO', type: 'text', required: false },
    ],
  },
  {
    id: 'tmpl-3',
    category_name: 'Automotores & Módulos ECU',
    fields: [
      { id: 'f7', name: 'mileage', label: 'Kilometraje Actual', type: 'number', required: true, placeholder: 'Ej: 120000' },
      { id: 'f8', name: 'license_plate', label: 'Patente / Dominio', type: 'text', required: true, placeholder: 'Ej: AA123BB' },
      { id: 'f9', name: 'fault_codes', label: 'Códigos DTC Escáner', type: 'textarea', required: false, placeholder: 'Ej: P0300, P0171' },
    ],
  },
];

export default function SettingsPage() {
  // Shop Settings State
  const [shopName, setShopName] = useState('ProRepair Ops - North Station');
  const [whatsappPhone, setWhatsappPhone] = useState('+5491122334455');
  const [ticketTerms, setTicketTerms] = useState(
    'No nos responsabilizamos por pérdida de datos. Los presupuestos tienen una validez de 15 días. Garantía de reparación: 30 días.'
  );

  // Dynamic Templates State
  const [templates, setTemplates] = useState<DeviceCategoryTemplate[]>(DEFAULT_TEMPLATES);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('tmpl-1');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // New field modal / inline form state
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

    // Reset inputs
    setNewFieldLabel('');
    setNewFieldName('');
    setNewFieldType('text');
    setNewFieldRequired(false);
    setNewFieldOptions('');
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
    const categoryName = prompt('Nombre de la nueva categoría (ej: Consolas, Drones):');
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

  return (
    <div className="flex flex-col gap-6">
      {/* Page Title & Save Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-display-lg text-display-lg text-on-surface">
            Settings & Dynamic Fields
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Configura los datos del taller y el Diseñador de Campos Dinámicos JSONB.
          </p>
        </div>
        <button
          onClick={handleSaveSettings}
          className="bg-primary-container text-on-primary-container font-title-sm text-title-sm px-5 py-2.5 rounded-lg hover:bg-primary transition-colors flex items-center gap-2 shadow-sm font-semibold"
        >
          {savedSuccess ? (
            <>
              <CheckCircle2 className="w-5 h-5 text-emerald-300" /> ¡Guardado!
            </>
          ) : (
            <>
              <Save className="w-5 h-5" /> Guardar Cambios
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Workshop Settings (shop_settings) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-surface-container border border-outline-variant rounded-xl p-5 flex flex-col gap-4">
            <div className="flex items-center gap-2 text-primary font-title-sm font-bold border-b border-outline-variant/50 pb-3">
              <Settings className="w-5 h-5" />
              <h3>Configuración del Taller</h3>
            </div>

            <div>
              <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1 uppercase">
                Nombre del Taller / Sucursal
              </label>
              <input
                type="text"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant rounded px-3 py-2 font-body-sm text-body-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary/50"
              />
            </div>

            <div>
              <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1 uppercase">
                Teléfono de Contacto (WhatsApp)
              </label>
              <input
                type="text"
                value={whatsappPhone}
                onChange={(e) => setWhatsappPhone(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant rounded px-3 py-2 font-mono-data text-mono-data text-on-surface focus:border-primary focus:ring-1 focus:ring-primary/50"
              />
            </div>

            <div>
              <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1 uppercase">
                Términos y Condiciones (Ticket 80mm)
              </label>
              <textarea
                value={ticketTerms}
                onChange={(e) => setTicketTerms(e.target.value)}
                rows={4}
                className="w-full bg-surface-container-lowest border border-outline-variant rounded p-3 font-body-sm text-body-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary/50 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Field Designer & Live Preview */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-surface-container border border-outline-variant rounded-xl p-5 flex flex-col gap-5">
            <div className="flex justify-between items-center border-b border-outline-variant/50 pb-3">
              <div className="flex items-center gap-2 text-primary font-title-sm font-bold">
                <Sliders className="w-5 h-5" />
                <h3>Diseñador de Campos Dinámicos por Categoría</h3>
              </div>
              <button
                onClick={handleAddCategory}
                className="px-3 py-1.5 bg-surface-container-high border border-outline-variant rounded-md text-xs font-label-caps text-on-surface hover:bg-surface-container-highest transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5 text-primary" /> Nueva Categoría
              </button>
            </div>

            {/* Category Template Selector Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {templates.map((tmpl) => (
                <button
                  key={tmpl.id}
                  onClick={() => setSelectedTemplateId(tmpl.id)}
                  className={`px-4 py-2 rounded-lg font-label-caps text-label-caps transition-colors flex items-center gap-2 whitespace-nowrap border ${
                    selectedTemplateId === tmpl.id
                      ? 'bg-secondary-container text-on-secondary-container border-primary/40 font-bold'
                      : 'bg-surface-container-low text-on-surface-variant border-outline-variant hover:bg-surface-container-highest'
                  }`}
                >
                  <Layers className="w-4 h-4 text-primary" />
                  {tmpl.category_name} ({tmpl.fields.length})
                </button>
              ))}
            </div>

            {/* List of Configured Fields */}
            <div className="space-y-3">
              <h4 className="font-label-caps text-xs text-on-surface-variant uppercase">
                Campos Configurados en "{currentTemplate.category_name}"
              </h4>

              {currentTemplate.fields.length === 0 ? (
                <p className="text-xs text-on-surface-variant/60 italic">
                  No se han definido campos para esta plantilla aún. Agrega uno debajo.
                </p>
              ) : (
                <div className="space-y-2">
                  {currentTemplate.fields.map((field) => (
                    <div
                      key={field.id}
                      className="flex justify-between items-center bg-surface-container-lowest border border-outline-variant/60 rounded p-3 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-on-surface">
                          {field.label}
                        </span>
                        <span className="font-mono-data text-primary bg-primary/10 px-2 py-0.5 rounded text-[10px]">
                          key: {field.name}
                        </span>
                        <span className="font-label-caps text-on-surface-variant bg-surface-bright px-2 py-0.5 rounded text-[10px] uppercase">
                          {field.type}
                        </span>
                        {field.required && (
                          <span className="text-error font-bold text-[10px] uppercase">
                            Obligatorio
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => handleRemoveField(field.id)}
                        className="text-on-surface-variant hover:text-error transition-colors p-1"
                        title="Eliminar campo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Form to Add New Field */}
            <div className="bg-surface-container-low border border-outline-variant rounded-lg p-4 space-y-3">
              <h4 className="font-label-caps text-xs text-primary uppercase font-bold flex items-center gap-1">
                <Plus className="w-4 h-4" /> Agregar Nuevo Campo a la Plantilla
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block font-label-caps text-[10px] text-on-surface-variant mb-1 uppercase">
                    Etiqueta Visible
                  </label>
                  <input
                    type="text"
                    value={newFieldLabel}
                    onChange={(e) => setNewFieldLabel(e.target.value)}
                    placeholder="Ej: Patrón de desbloqueo"
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded px-2.5 py-1.5 font-body-sm text-body-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary/50"
                  />
                </div>

                <div>
                  <label className="block font-label-caps text-[10px] text-on-surface-variant mb-1 uppercase">
                    Tipo de Campo
                  </label>
                  <select
                    value={newFieldType}
                    onChange={(e) => setNewFieldType(e.target.value as FieldType)}
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded px-2.5 py-1.5 font-body-sm text-body-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary/50"
                  >
                    <option value="text">Texto Corto (Text)</option>
                    <option value="number">Número (Number)</option>
                    <option value="select">Selección Desplegable (Select)</option>
                    <option value="checkbox">Casilla de Verificación (Checkbox)</option>
                    <option value="textarea">Texto Multilínea (Textarea)</option>
                  </select>
                </div>

                <div className="flex items-end pb-1 gap-2">
                  <input
                    type="checkbox"
                    id="reqCheck"
                    checked={newFieldRequired}
                    onChange={(e) => setNewFieldRequired(e.target.checked)}
                    className="rounded border-outline-variant bg-surface-container-lowest text-primary"
                  />
                  <label htmlFor="reqCheck" className="font-body-sm text-body-sm text-on-surface-variant cursor-pointer select-none">
                    Campo Obligatorio
                  </label>
                </div>
              </div>

              {newFieldType === 'select' && (
                <div>
                  <label className="block font-label-caps text-[10px] text-on-surface-variant mb-1 uppercase">
                    Opciones Desplegables (Separadas por comas)
                  </label>
                  <input
                    type="text"
                    value={newFieldOptions}
                    onChange={(e) => setNewFieldOptions(e.target.value)}
                    placeholder="Ej: Original, Genérico, Sin Batería"
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded px-2.5 py-1.5 font-body-sm text-body-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary/50"
                  />
                </div>
              )}

              <button
                onClick={handleAddField}
                className="bg-primary-container text-on-primary-container font-title-sm text-xs px-4 py-2 rounded hover:bg-primary transition-colors flex items-center gap-1 font-semibold"
              >
                <Plus className="w-4 h-4" /> Añadir Campo
              </button>
            </div>

            {/* Live Interactive Preview of Form Intake */}
            <div className="border-t border-outline-variant/50 pt-4 space-y-2">
              <h4 className="font-label-caps text-xs text-on-surface-variant uppercase">
                Previsualización en Tiempo Real (Recepción)
              </h4>

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
      </div>
    </div>
  );
}
