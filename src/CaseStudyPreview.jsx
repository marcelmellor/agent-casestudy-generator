import { useState } from 'react';

const LIME = '#CCFF00';

export default function CaseStudyPreview({ caseStudy, onUpdate, onClose }) {
  const [editedCS, setEditedCS] = useState(caseStudy);
  const [activeSection, setActiveSection] = useState('header');

  const updateField = (section, field, value) => {
    const updated = { ...editedCS };

    if (section === 'metrics') {
      updated.metrics[field] = value;
    } else if (section === 'situation') {
      updated.situation[field] = value;
    } else if (section === 'results') {
      if (field === 'quote' || field === 'totalHours' || field === 'savingsNote') {
        updated.results[field] = value;
      }
    } else if (section === 'workflow') {
      updated.workflow[field] = value;
    } else {
      updated[field] = value;
    }

    setEditedCS(updated);
  };

  const updateArrayItem = (section, index, value) => {
    const updated = { ...editedCS };
    updated[section][index] = value;
    setEditedCS(updated);
  };

  const updatePlaybook = (index, field, value) => {
    const updated = { ...editedCS };
    updated.playbooks[index][field] = value;
    setEditedCS(updated);
  };

  const updatePlaybookTask = (playbookIndex, taskIndex, field, value) => {
    const updated = { ...editedCS };
    updated.playbooks[playbookIndex].tasks[taskIndex][field] = value;
    setEditedCS(updated);
  };

  const sections = [
    { id: 'header', label: 'Titel & Metriken' },
    { id: 'situation', label: 'Ausgangssituation' },
    { id: 'usecases', label: 'Use Cases' },
    { id: 'playbooks', label: 'Playbooks' },
    { id: 'results', label: 'Ergebnisse' },
    { id: 'workflow', label: 'Workflow' },
    { id: 'features', label: 'Features' }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
      <div className="min-h-screen p-6 flex items-start justify-center">
        <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full my-8">

          {/* Header */}
          <div style={{ background: `linear-gradient(135deg, ${LIME} 0%, #e6ff66 100%)` }} className="rounded-t-2xl p-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-extrabold">Case Study bearbeiten</h2>
                <p className="text-sm text-gray-700 mt-1">Passen Sie die Inhalte an, bevor Sie das PDF exportieren</p>
              </div>
              <button onClick={onClose} className="text-2xl hover:bg-black/10 w-10 h-10 rounded-full transition-colors">×</button>
            </div>
          </div>

          {/* Navigation */}
          <div className="border-b border-gray-200 px-6 pt-4">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {sections.map(section => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`px-4 py-2 rounded-t-lg font-semibold text-sm whitespace-nowrap transition-colors ${
                    activeSection === section.id
                      ? 'bg-gray-100 text-black'
                      : 'text-gray-500 hover:text-black hover:bg-gray-50'
                  }`}
                >
                  {section.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[600px] overflow-y-auto">

            {/* HEADER Section */}
            {activeSection === 'header' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Titel</label>
                  <input
                    type="text"
                    value={editedCS.title}
                    onChange={(e) => updateField('title', null, e.target.value)}
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-lime-400"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">Automatisierung</label>
                    <input
                      type="text"
                      value={editedCS.metrics.automation}
                      onChange={(e) => updateField('metrics', 'automation', e.target.value)}
                      className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-lime-400"
                      placeholder="z.B. 82%"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">Zeitersparnis</label>
                    <input
                      type="text"
                      value={editedCS.metrics.time}
                      onChange={(e) => updateField('metrics', 'time', e.target.value)}
                      className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-lime-400"
                      placeholder="z.B. 58 Std."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">Verfügbarkeit</label>
                    <input
                      type="text"
                      value={editedCS.metrics.availability}
                      onChange={(e) => updateField('metrics', 'availability', e.target.value)}
                      className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-lime-400"
                      placeholder="z.B. 24/7"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Agent Name</label>
                  <input
                    type="text"
                    value={editedCS.agentName}
                    onChange={(e) => updateField('agentName', null, e.target.value)}
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-lime-400"
                    placeholder="z.B. Sandra"
                  />
                </div>
              </div>
            )}

            {/* SITUATION Section */}
            {activeSection === 'situation' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Profil (Unternehmensbeschreibung)</label>
                  <textarea
                    value={editedCS.situation.profile}
                    onChange={(e) => updateField('situation', 'profile', e.target.value)}
                    rows={3}
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-lime-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Problem</label>
                  <textarea
                    value={editedCS.situation.problem}
                    onChange={(e) => updateField('situation', 'problem', e.target.value)}
                    rows={3}
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-lime-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Konsequenz (Hervorgehoben)</label>
                  <textarea
                    value={editedCS.situation.consequence}
                    onChange={(e) => updateField('situation', 'consequence', e.target.value)}
                    rows={2}
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-lime-400"
                  />
                </div>
              </div>
            )}

            {/* USE CASES Section */}
            {activeSection === 'usecases' && (
              <div className="space-y-3">
                <p className="text-sm text-gray-600 mb-3">Bearbeiten Sie die Use Cases (5 Stück empfohlen)</p>
                {editedCS.useCases.map((uc, idx) => (
                  <div key={idx}>
                    <label className="block text-xs font-semibold mb-1 text-gray-500">Use Case {idx + 1}</label>
                    <input
                      type="text"
                      value={uc}
                      onChange={(e) => updateArrayItem('useCases', idx, e.target.value)}
                      className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-lime-400"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* PLAYBOOKS Section */}
            {activeSection === 'playbooks' && (
              <div className="space-y-6">
                {editedCS.playbooks.map((pb, pbIdx) => (
                  <div key={pbIdx} className="border-2 border-gray-200 rounded-xl p-4">
                    <h3 className="font-bold text-lg mb-3">Playbook {pbIdx + 1}</h3>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold mb-1 text-gray-500">Name</label>
                        <input
                          type="text"
                          value={pb.name}
                          onChange={(e) => updatePlaybook(pbIdx, 'name', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-lime-400"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold mb-1 text-gray-500">Trigger</label>
                        <input
                          type="text"
                          value={pb.trigger}
                          onChange={(e) => updatePlaybook(pbIdx, 'trigger', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-lime-400"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold mb-2 text-gray-500">Tasks (Erste 3 angezeigt)</label>
                        {pb.tasks.slice(0, 3).map((task, taskIdx) => (
                          <div key={taskIdx} className="grid grid-cols-2 gap-2 mb-2">
                            <input
                              type="text"
                              value={task.field}
                              onChange={(e) => updatePlaybookTask(pbIdx, taskIdx, 'field', e.target.value)}
                              className="p-2 border border-gray-300 rounded text-xs font-mono"
                              placeholder="feldname"
                            />
                            <input
                              type="text"
                              value={task.question}
                              onChange={(e) => updatePlaybookTask(pbIdx, taskIdx, 'question', e.target.value)}
                              className="p-2 border border-gray-300 rounded text-xs"
                              placeholder="Frage"
                            />
                          </div>
                        ))}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold mb-1 text-gray-500">Action (optional)</label>
                        <input
                          type="text"
                          value={pb.action || ''}
                          onChange={(e) => updatePlaybook(pbIdx, 'action', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-lime-400"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* RESULTS Section */}
            {activeSection === 'results' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Gesamt-Zeitersparnis</label>
                  <input
                    type="text"
                    value={editedCS.results.totalHours}
                    onChange={(e) => updateField('results', 'totalHours', e.target.value)}
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-lime-400"
                    placeholder="z.B. ~58"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Zitat</label>
                  <textarea
                    value={editedCS.results.quote}
                    onChange={(e) => updateField('results', 'quote', e.target.value)}
                    rows={3}
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-lime-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Hinweis zur Zeitersparnis</label>
                  <input
                    type="text"
                    value={editedCS.results.savingsNote || ''}
                    onChange={(e) => updateField('results', 'savingsNote', e.target.value)}
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-lime-400"
                    placeholder="z.B. Das entspricht mehr als einer vollen Arbeitswoche"
                  />
                </div>
              </div>
            )}

            {/* WORKFLOW Section */}
            {activeSection === 'workflow' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Workflow Titel</label>
                  <input
                    type="text"
                    value={editedCS.workflow.title}
                    onChange={(e) => updateField('workflow', 'title', e.target.value)}
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-lime-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Kontrast (Was ohne AI Agent passiert wäre)</label>
                  <textarea
                    value={editedCS.workflow.contrast}
                    onChange={(e) => updateField('workflow', 'contrast', e.target.value)}
                    rows={2}
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-lime-400"
                  />
                </div>
              </div>
            )}

            {/* FEATURES Section */}
            {activeSection === 'features' && (
              <div className="space-y-3">
                <p className="text-sm text-gray-600 mb-3">Features (Liste der eingesetzten Funktionen)</p>
                {editedCS.features.map((feature, idx) => (
                  <div key={idx}>
                    <label className="block text-xs font-semibold mb-1 text-gray-500">Feature {idx + 1}</label>
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => updateArrayItem('features', idx, e.target.value)}
                      className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-lime-400"
                    />
                  </div>
                ))}
              </div>
            )}

          </div>

          {/* Footer Actions */}
          <div className="border-t border-gray-200 p-6 flex justify-between items-center bg-gray-50 rounded-b-2xl">
            <button
              onClick={onClose}
              className="px-6 py-3 text-gray-600 hover:text-black font-semibold transition-colors"
            >
              Abbrechen
            </button>
            <button
              onClick={() => {
                onUpdate(editedCS);
                onClose();
              }}
              style={{ background: LIME }}
              className="px-8 py-3 text-black font-bold rounded-xl hover:opacity-90 transition-opacity shadow-lg"
            >
              Änderungen übernehmen →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
