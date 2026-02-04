import { useState } from 'react';

const LIME = '#CCFF00';

export default function LivePreview({ caseStudy, onUpdate, onClose }) {
  const [editedCS, setEditedCS] = useState(caseStudy);
  const [editingField, setEditingField] = useState(null);

  const updateField = (path, value) => {
    const updated = JSON.parse(JSON.stringify(editedCS));

    // Navigate through nested path
    const keys = path.split('.');
    let current = updated;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;

    setEditedCS(updated);
    onUpdate(updated);
  };

  const EditableText = ({ value, path, className = '', multiline = false, placeholder = '' }) => {
    const isEditing = editingField === path;

    if (multiline) {
      return (
        <textarea
          value={value}
          onChange={(e) => updateField(path, e.target.value)}
          onFocus={() => setEditingField(path)}
          onBlur={() => setEditingField(null)}
          className={`${className} ${isEditing ? 'ring-2 ring-lime-400' : 'hover:ring-1 hover:ring-gray-300'} transition-all resize-none`}
          placeholder={placeholder}
          rows={value.split('\n').length || 3}
        />
      );
    }

    return (
      <input
        type="text"
        value={value}
        onChange={(e) => updateField(path, e.target.value)}
        onFocus={() => setEditingField(path)}
        onBlur={() => setEditingField(null)}
        className={`${className} ${isEditing ? 'ring-2 ring-lime-400' : 'hover:ring-1 hover:ring-gray-300'} transition-all`}
        placeholder={placeholder}
      />
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
      <div className="min-h-screen p-6">
        <div className="max-w-5xl mx-auto">

          {/* Sticky Header */}
          <div className="sticky top-0 z-10 bg-white rounded-t-2xl shadow-xl p-4 border-b-2 border-gray-200 mb-0">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">Live-Vorschau & Bearbeiten</h2>
                <p className="text-sm text-gray-600">Klicken Sie auf beliebige Texte zum Bearbeiten</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="px-6 py-2 text-gray-600 hover:text-black font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Fertig
                </button>
              </div>
            </div>
          </div>

          {/* PDF Preview - Page 1 */}
          <div className="bg-white shadow-2xl" style={{ width: '210mm', margin: '0 auto' }}>

            {/* Header */}
            <div style={{ background: `linear-gradient(135deg, ${LIME} 0%, #e6ff66 100%)` }} className="p-8 relative">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold uppercase tracking-wide">SIPGATE AI AGENTS</span>
                <span className="font-extrabold text-lg">sipgate</span>
              </div>

              <EditableText
                value={editedCS.title}
                path="title"
                className="text-2xl font-extrabold w-full bg-transparent border-none outline-none mb-4"
                placeholder="Titel der Case Study"
              />

              <div className="flex gap-3">
                <div className="flex-1 bg-white/90 rounded-lg p-3">
                  <EditableText
                    value={editedCS.metrics.automation}
                    path="metrics.automation"
                    className="text-xl font-bold w-full text-center bg-transparent border-none outline-none"
                  />
                  <div className="text-xs text-gray-600 text-center mt-1">Automatisiert</div>
                </div>
                <div className="flex-1 bg-white/90 rounded-lg p-3">
                  <EditableText
                    value={editedCS.metrics.time}
                    path="metrics.time"
                    className="text-xl font-bold w-full text-center bg-transparent border-none outline-none"
                  />
                  <div className="text-xs text-gray-600 text-center mt-1">Eingespart/Monat</div>
                </div>
                <div className="flex-1 bg-white/90 rounded-lg p-3">
                  <EditableText
                    value={editedCS.metrics.availability}
                    path="metrics.availability"
                    className="text-xl font-bold w-full text-center bg-transparent border-none outline-none"
                  />
                  <div className="text-xs text-gray-600 text-center mt-1">Verfügbar</div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">

              {/* Ausgangssituation */}
              <div className="mb-6">
                <h2 className="text-base font-bold mb-3 pb-1 border-b-2" style={{ borderColor: LIME }}>
                  Ausgangssituation
                </h2>

                <EditableText
                  value={editedCS.situation.profile}
                  path="situation.profile"
                  multiline
                  className="text-sm text-gray-700 w-full mb-3 p-2 bg-transparent border border-transparent rounded"
                />

                <EditableText
                  value={editedCS.situation.problem}
                  path="situation.problem"
                  multiline
                  className="text-sm text-gray-700 w-full mb-3 p-2 bg-transparent border border-transparent rounded"
                />

                <div className="bg-yellow-50 border-l-4 p-3 rounded-r" style={{ borderColor: LIME }}>
                  <EditableText
                    value={editedCS.situation.consequence}
                    path="situation.consequence"
                    multiline
                    className="text-sm italic text-gray-800 w-full bg-transparent border-none outline-none"
                  />
                </div>
              </div>

              {/* Use Cases */}
              <div className="mb-6">
                <h2 className="text-base font-bold mb-3 pb-1 border-b-2" style={{ borderColor: LIME }}>
                  Die Lösung
                </h2>

                <div className="space-y-2">
                  {editedCS.useCases.map((uc, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="text-lime-600 font-bold mt-1">✓</span>
                      <EditableText
                        value={uc}
                        path={`useCases.${idx}`}
                        className="flex-1 text-sm p-1 bg-transparent border border-transparent rounded hover:border-gray-200"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Playbooks Grid */}
              <div className="mb-6">
                <h2 className="text-base font-bold mb-3 pb-1 border-b-2" style={{ borderColor: LIME }}>
                  Playbooks
                </h2>

                <div className="grid grid-cols-2 gap-4">
                  {editedCS.playbooks.map((pb, pbIdx) => (
                    <div key={pbIdx} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <EditableText
                        value={pb.name}
                        path={`playbooks.${pbIdx}.name`}
                        className="font-bold text-sm w-full mb-1 bg-transparent border-none outline-none"
                      />

                      <EditableText
                        value={pb.trigger}
                        path={`playbooks.${pbIdx}.trigger`}
                        className="text-xs text-gray-600 italic w-full mb-2 bg-transparent border-none outline-none"
                      />

                      <div className="border-t pt-2" style={{ borderColor: LIME }}>
                        <div className="space-y-1">
                          {pb.tasks.slice(0, 3).map((task, taskIdx) => (
                            <div key={taskIdx} className="text-xs">
                              <div className="font-mono text-gray-500 mb-0.5">
                                <EditableText
                                  value={task.field}
                                  path={`playbooks.${pbIdx}.tasks.${taskIdx}.field`}
                                  className="w-full bg-transparent border-none outline-none text-xs"
                                />
                              </div>
                              <EditableText
                                value={task.question}
                                path={`playbooks.${pbIdx}.tasks.${taskIdx}.question`}
                                className="w-full bg-transparent border-none outline-none text-xs"
                              />
                            </div>
                          ))}
                        </div>

                        {pb.action && (
                          <div className="mt-2 bg-green-50 p-2 rounded text-xs">
                            <EditableText
                              value={pb.action}
                              path={`playbooks.${pbIdx}.action`}
                              multiline
                              className="w-full bg-transparent border-none outline-none text-green-800"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* PDF Preview - Page 2 */}
          <div className="bg-white shadow-2xl mt-8" style={{ width: '210mm', margin: '20px auto 0' }}>
            <div className="p-8">

              {/* Ergebnisse */}
              <div className="mb-6">
                <h2 className="text-base font-bold mb-3 pb-1 border-b-2" style={{ borderColor: LIME }}>
                  Die Ergebnisse
                </h2>

                {/* Results Table */}
                <div className="mb-4">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="text-left p-2 text-xs font-semibold">Kennzahl</th>
                        <th className="text-left p-2 text-xs font-semibold">Vorher</th>
                        <th className="text-left p-2 text-xs font-semibold">Nachher</th>
                      </tr>
                    </thead>
                    <tbody>
                      {editedCS.results.comparison.map((row, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : ''}>
                          <td className="p-2 text-xs">{row.metric}</td>
                          <td className="p-2 text-xs text-gray-500">{row.before}</td>
                          <td className="p-2 text-xs text-green-600 font-bold">{row.after}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Savings */}
                <div className="flex gap-4 mb-4">
                  <div className="flex-1 bg-gray-50 rounded-lg p-4">
                    <div className="font-bold text-sm mb-2">Zeitersparnis im Detail</div>
                    {editedCS.results.savings.map((s, idx) => (
                      <div key={idx} className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600">{s.area}</span>
                        <span className="font-bold">{s.hours} Std.</span>
                      </div>
                    ))}
                  </div>
                  <div className="w-32 rounded-lg p-4 flex flex-col items-center justify-center" style={{ background: LIME }}>
                    <EditableText
                      value={editedCS.results.totalHours}
                      path="results.totalHours"
                      className="text-3xl font-bold text-center w-full bg-transparent border-none outline-none"
                    />
                    <div className="text-xs font-bold mt-1">Std./Monat</div>
                  </div>
                </div>

                {/* Quote */}
                <div className="bg-yellow-50 rounded-lg p-4 border" style={{ borderColor: LIME }}>
                  <EditableText
                    value={editedCS.results.quote}
                    path="results.quote"
                    multiline
                    className="text-sm italic text-gray-700 w-full bg-transparent border-none outline-none"
                  />
                </div>
              </div>

              {/* Workflow */}
              <div className="mb-6">
                <h2 className="text-base font-bold mb-3 pb-1 border-b-2" style={{ borderColor: LIME }}>
                  <EditableText
                    value={editedCS.workflow.title}
                    path="workflow.title"
                    className="bg-transparent border-none outline-none"
                  />
                </h2>

                <div className="bg-gray-50 rounded-lg p-4">
                  {editedCS.workflow.steps.slice(0, 5).map((step, idx) => (
                    <div key={idx} className="flex gap-3 mb-2 items-start">
                      <div className="w-2 h-2 rounded-full mt-1" style={{ background: LIME }}></div>
                      <div className="flex-1 flex gap-3">
                        <EditableText
                          value={step.time}
                          path={`workflow.steps.${idx}.time`}
                          className="w-16 text-xs font-mono bg-transparent border-none outline-none"
                        />
                        <EditableText
                          value={step.desc}
                          path={`workflow.steps.${idx}.desc`}
                          className="flex-1 text-xs bg-transparent border-none outline-none"
                        />
                      </div>
                    </div>
                  ))}

                  <div className="mt-3 pt-3 border-t border-dashed">
                    <EditableText
                      value={editedCS.workflow.contrast}
                      path="workflow.contrast"
                      multiline
                      className="text-xs text-red-600 italic w-full bg-transparent border-none outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="mb-6">
                <h2 className="text-base font-bold mb-3 pb-1 border-b-2" style={{ borderColor: LIME }}>
                  Features
                </h2>

                <div className="flex flex-wrap gap-2">
                  {editedCS.features.map((feature, idx) => (
                    <div key={idx} className="bg-green-50 border border-green-200 rounded px-2 py-1">
                      <EditableText
                        value={feature}
                        path={`features.${idx}`}
                        className="text-xs text-green-800 bg-transparent border-none outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="text-center mt-8 pt-6 border-t border-gray-200">
                <div className="text-xs text-gray-500">
                  sipgate AI Agents · DSGVO-konform · Made in Germany
                </div>
              </div>

            </div>
          </div>

          {/* Bottom Padding */}
          <div className="h-20"></div>

        </div>
      </div>
    </div>
  );
}
