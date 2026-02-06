import { useState, useEffect } from 'react';
import { generateCaseStudy, isApiKeyConfigured, getModelInfo } from './openaiService';
import { generateAndSavePDF } from './pdfService';
import { sampleCaseStudy } from './sampleCaseStudy';
import LivePreview from './LivePreview';

const LIME = '#CCFF00';

const SYSTEM_PROMPT = (playbookCount = 4) => `Du erstellst erstklassige Case Studies für sipgate AI Agents. Dein Qualitätsstandard ist extrem hoch.

REFERENZ-BEISPIEL (dieses Niveau ist der Mindeststandard):

---
TITEL: "Voice AI für Hausverwaltungen: Störungen, Zählerstände, Termine – automatisch erfasst, intelligent weitergeleitet"

METRIKEN: 87% automatisiert | 65 Std./Monat eingespart | 24/7 erreichbar

AUSGANGSSITUATION:
"Eine Hausverwaltung mit 8 Mitarbeitern betreut 2.400 Wohneinheiten in 45 Objekten. Täglich gehen 60-80 Anrufe ein – Störungsmeldungen, Zählerstandsmitteilungen, Terminanfragen, Fragen zu Nebenkostenabrechnungen.

Das Problem: Die Mitarbeiter verbringen 3-4 Stunden täglich am Telefon mit repetitiven Anfragen. Während der Heizperiode und bei Wasserrohrbrüchen explodiert das Aufkommen – genau dann, wenn schnelles Handeln gefragt wäre. Außerhalb der Geschäftszeiten landen dringende Störungsmeldungen auf dem Anrufbeantworter und werden erst am nächsten Morgen bearbeitet.

Die Konsequenz: Mieter sind frustriert über schlechte Erreichbarkeit, Eigentümer beschweren sich, und kritische Störungen werden zu spät erkannt. Ein Wasserschaden, der freitags um 18 Uhr gemeldet wird, richtet bis Montagmorgen erheblichen Schaden an."

USE CASES (branchenspezifisch, 5 Stück):
• Störungsmeldungen aller Art (Heizung, Wasser, Aufzug, Elektrik)
• Zählerstandsmitteilungen (Wasser, Heizung, Strom)
• Terminanfragen für Wohnungsübergaben und Begehungen
• Fragen zu Nebenkostenabrechnungen und Dokumenten
• Allgemeine Anfragen (Öffnungszeiten, Zuständigkeiten, Hausordnung)

PLAYBOOKS (4 Stück, mit natürlichen Fragen):

Playbook 1: Störungsmeldung
Trigger: Der Anrufer meldet ein Problem (Heizung, Wasser, Aufzug etc.)
| objekt_adresse | "Um welches Objekt handelt es sich? Bitte nennen Sie mir die Adresse." |
| wohnung | "In welcher Wohnung wohnen Sie? Bitte nennen Sie mir Ihren Namen und die Wohnungsnummer." |
| stoerungsart | "Was für eine Störung liegt vor? Handelt es sich um Heizung, Wasser, Aufzug oder etwas anderes?" |
| dringlichkeit | "Ist es ein Notfall? Tritt beispielsweise aktiv Wasser aus oder ist die Heizung bei Minusgraden komplett ausgefallen?" |
| beschreibung | "Können Sie mir das Problem genauer beschreiben? Seit wann besteht es?" |
| erreichbarkeit | "Unter welcher Nummer können wir Sie für Rückfragen erreichen? Wann wäre ein Handwerker-Termin möglich?" |
Aktion: Bei kritischen Störungen (Wasseraustritt, Heizungsausfall im Winter, Personen im Aufzug) erfolgt sofortige Weiterleitung an den Notdienst.

Playbook 2: Zählerstandsmeldung
Trigger: Der Anrufer möchte einen Zählerstand durchgeben
| objekt_adresse | "Für welche Adresse möchten Sie den Zählerstand melden?" |
| wohnung | "Wie ist Ihr Name und Ihre Wohnungsnummer?" |
| zaehlerart | "Um welchen Zähler handelt es sich? Wasser, Heizung oder Strom?" |
| zaehlernummer | "Können Sie mir die Zählernummer nennen? Diese finden Sie auf dem Zähler." |
| zaehlerstand | "Wie lautet der aktuelle Zählerstand?" |
| ablesedatum | "Wann haben Sie den Zähler abgelesen?" |

Playbook 3: Terminanfrage
Trigger: Der Anrufer möchte einen Termin vereinbaren
| terminart | "Um was für einen Termin geht es? Wohnungsübergabe, Begehung oder Beratungsgespräch?" |
| objekt_adresse | "Um welches Objekt handelt es sich?" |
| wohnung | "Wie ist Ihr Name und ggf. Ihre Wohnungsnummer?" |
| zeitraum | "Wann würde Ihnen ein Termin passen? Haben Sie bestimmte Präferenzen?" |
| kontakt | "Unter welcher Nummer oder E-Mail können wir Sie erreichen?" |

Playbook 4: Nebenkostenabrechnung
Trigger: Der Anrufer hat Fragen zur Nebenkostenabrechnung
| mieter_name | "Wie ist Ihr Name?" |
| objekt_adresse | "In welchem Objekt wohnen Sie?" |
| abrechnungsjahr | "Um welches Abrechnungsjahr geht es?" |
| anliegen_typ | "Haben Sie eine Verständnisfrage, möchten Sie Einspruch erheben, oder benötigen Sie Belege?" |
| anliegen_details | "Können Sie mir Ihr Anliegen genauer beschreiben?" |

ERGEBNISSE:
| Erreichbarkeit | Mo-Fr 8-17 Uhr | 24/7/365 |
| Anrufe, die ins Leere gehen | ~25/Tag | 0 |
| Telefonzeit pro Tag (Team) | 3-4 Stunden | 45 Minuten |
| Reaktionszeit kritische Störung (nachts/Wochenende) | Nächster Werktag | Sofort |
| Nachbearbeitung pro Anruf | 3-5 Minuten | 0 (automatisch) |

ZEITERSPARNIS (konkret aufgeschlüsselt, mit Tilde für "circa"):
• Anrufe annehmen & Standardfragen beantworten: ~40 Stunden
• Informationen erfassen & dokumentieren: ~15 Stunden
• Weiterleitung koordinieren: ~5 Stunden
• Rückrufe wegen fehlender Infos: ~5 Stunden
→ GESAMT: ~65 Stunden/Monat (entspricht fast einer vollen Arbeitswoche)

ZITAT (authentisch, konkret, nicht werblich):
"Früher war Montagmorgen der Horror – 40 Nachrichten auf dem Anrufbeantworter, die Hälfte davon Störungen vom Wochenende. Jetzt sind alle Störungen bereits erfasst, priorisiert und die dringenden Fälle wurden direkt an den Notdienst weitergeleitet. Mein Team kann sich endlich auf die Betreuung der Objekte konzentrieren."

AUTOMATIONS (6 konkrete Beispiele, verschiedene Typen):

Pre-Call (Anrufer-Identifikation & Kontext):
• Anruf eingehend → Rufnummer in CRM abgleichen → Mieterdaten & Historie dem Agent bereitstellen
• Anruf eingehend → Offene Tickets zu dieser Nummer laden → Agent kennt laufende Vorgänge

In-Call (Während des Gesprächs):
• Kritische Störung erkannt → Sofortige Weiterleitung an Notdienst-Handwerker
• Termin gewünscht → Live-Kalenderabfrage → Verfügbare Slots direkt im Gespräch anbieten

Post-Call (Nach dem Gespräch):
• Störung erfasst → Ticket in Hausverwaltungssoftware anlegen + E-Mail an Sachbearbeiter
• Zählerstand erfasst → Wert in Abrechnungssystem übertragen + Bestätigung an Mieter

WORKFLOW-BEISPIEL (dramatisch, zeigt den Unterschied):
"Beispiel: Wasserschaden Freitagabend"
19:15 – Mieter ruft an, meldet Wasseraustritt
19:15 – Agent erfasst alle Details über Playbook "Störungsmeldung"
19:16 – Agent erkennt Dringlichkeit → leitet an Notdienst weiter
19:16 – Webhook wird gesendet → Ticket wird automatisch angelegt
19:16 – Make-Workflow: SMS an Notdienst-Handwerker mit Adresse & Kontakt
19:16 – E-Mail-Zusammenfassung an Team
19:20 – Handwerker ruft Mieter zurück
20:00 – Wasserschaden behoben
Kontrast: "Ohne AI Agent: Entdeckung am Montagmorgen, erheblicher Wasserschaden."

EINGESETZTE FEATURES (für die Features-Sektion):
• FAQ & Wissensdatenbank (mit branchenspezifischem Inhalt)
• 4 Playbooks für strukturierte Prozesse
• Intelligente Anliegen-Erkennung
• Weiterleitung bei kritischen Fällen
• E-Mail-Zusammenfassungen nach jedem Anruf
• Webhook-Integration für Post-Call-Automation
• DSGVO-konforme EU-Datenhaltung

DEMO-PROMPTS (4 realistische Szenarien):
• "Ich habe einen Wasserrohrbruch in meiner Wohnung"
• "Ich möchte meinen Zählerstand durchgeben"
• "Ich brauche einen Termin für die Wohnungsübergabe"
• "Ich habe eine Frage zu meiner Nebenkostenabrechnung"
---

QUALITÄTSREGELN:
1. KONKRETE ZAHLEN: Immer spezifische Zahlen nennen (nicht "viele Anrufe" sondern "60-80 Anrufe täglich")
2. BRANCHENSPRACHE: Fachbegriffe der Branche verwenden, zeigt Verständnis
3. NATÜRLICHE FRAGEN: Playbook-Fragen wie ein echter Mensch formulieren, höflich und klar
4. EMOTIONALER HOOK: Die Konsequenz muss spürbar sein (Frustration, verlorenes Geld, Stress)
5. AUTHENTISCHES ZITAT: Konkreter Vorher/Nachher-Moment, keine Marketing-Floskeln
6. DRAMATISCHER WORKFLOW: Ein Szenario das den Unterschied plastisch zeigt
7. FELDNAMEN: snake_case, kurz, sprechend (nicht "frage_1" sondern "stoerungsart")
8. GENAU ${playbookCount} PLAYBOOKS: Erstelle exakt ${playbookCount} Playbooks mit je 5-6 Tasks
9. GENAU 5 ERGEBNIS-ZEILEN: Vorher/Nachher-Vergleich mit 5 Kennzahlen
10. GENAU 4 SAVINGS-BEREICHE: Zeitersparnis in 4 Bereiche aufteilen, Summe = totalHours

Erstelle für die angegebene Branche eine Case Study auf EXAKT diesem Qualitätsniveau.

Antworte NUR mit diesem JSON (keine Erklärungen):

{
  "title": "Voice AI für [Branche]: [Konkreter Untertitel der den Nutzen zeigt]",
  "metrics": {
    "automation": "XX%",
    "time": "XX Std.",
    "availability": "24/7"
  },
  "situation": {
    "profile": "2-3 Sätze mit KONKRETEN Zahlen (Mitarbeiter, Kunden, Objekte, Anrufe pro Tag)",
    "problem": "2-3 Sätze zum Kernproblem mit Zahlen. Was passiert in Stoßzeiten? Was nach Feierabend?",
    "consequence": "1-2 Sätze: Emotionaler + geschäftlicher Impact. Konkretes Beispiel was schiefgeht."
  },
  "useCases": ["UC1 (mit Klammer-Details)", "UC2", "UC3", "UC4", "UC5"],
  "playbooks": [
    {
      "name": "Playbook 1: [Sprechender Name]",
      "trigger": "Der Anrufer [konkreter Auslöser]",
      "tasks": [
        {"field": "feldname_snake_case", "question": "Natürliche, höfliche Frage?"}
      ],
      "action": "Bei [Bedingung] erfolgt [konkrete Aktion]."
    }
  ],
  "results": {
    "comparison": [
      {"metric": "Erreichbarkeit", "before": "Mo-Fr X-X Uhr", "after": "24/7/365"},
      {"metric": "Anrufe, die ins Leere gehen", "before": "~XX/Tag", "after": "0"},
      {"metric": "Telefonzeit pro Tag (Team)", "before": "X-X Stunden", "after": "XX Minuten"},
      {"metric": "Reaktionszeit kritische Fälle (nachts/Wochenende)", "before": "Nächster Werktag", "after": "Sofort"},
      {"metric": "Nachbearbeitung pro Anruf", "before": "X-X Minuten", "after": "0 (automatisch)"}
    ],
    "savings": [
      {"area": "Anrufe annehmen & Standardfragen beantworten", "hours": "~40"},
      {"area": "Informationen erfassen & dokumentieren", "hours": "~15"},
      {"area": "Weiterleitung koordinieren", "hours": "~5"},
      {"area": "Rückrufe wegen fehlender Infos", "hours": "~5"}
    ],
    "totalHours": "~65",
    "savingsNote": "Das entspricht fast einer vollen Arbeitswoche pro Monat",
    "quote": "Authentisches Zitat mit konkretem Vorher/Nachher-Moment, keine Werbung"
  },
  "automations": [
    {"type": "pre-call", "trigger": "Anruf eingehend", "action": "Rufnummer in CRM abgleichen, Kundendaten dem Agent bereitstellen"},
    {"type": "pre-call", "trigger": "Kunde identifiziert", "action": "Offene Tickets/Vorgänge laden, Agent kennt Kontext"},
    {"type": "in-call", "trigger": "Kritischer Fall erkannt", "action": "Sofortige Weiterleitung an Notdienst/Bereitschaft"},
    {"type": "in-call", "trigger": "Terminwunsch geäußert", "action": "Live-Kalenderabfrage, verfügbare Slots im Gespräch anbieten"},
    {"type": "post-call", "trigger": "Anliegen erfasst", "action": "Ticket/Vorgang in Branchensoftware anlegen"},
    {"type": "post-call", "trigger": "Gespräch beendet", "action": "Zusammenfassung per E-Mail an zuständigen Mitarbeiter"}
  ],
  "workflow": {
    "title": "Beispiel: [Dramatisches Szenario außerhalb Geschäftszeiten]",
    "steps": [
      {"time": "XX:XX", "desc": "Konkrete Aktion"}
    ],
    "contrast": "Ohne AI Agent: [Was stattdessen passiert wäre – konkret, mit Kosten/Zeit]"
  },
  "features": [
    "FAQ & Wissensdatenbank (branchenspezifischer Inhalt)",
    "4 Playbooks für strukturierte Prozesse",
    "Intelligente Anliegen-Erkennung",
    "Weiterleitung bei kritischen Fällen",
    "E-Mail-Zusammenfassungen nach jedem Anruf",
    "Webhook-Integration für Post-Call-Automation",
    "DSGVO-konforme EU-Datenhaltung"
  ],
  "demoPrompts": ["Realistischer Satz 1", "Satz 2", "Satz 3", "Satz 4"],
  "agentName": "Passender deutscher Vorname"
}`;

export default function CaseStudyBuilder() {
  const [step, setStep] = useState('input');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [caseStudy, setCaseStudy] = useState(null);
  const [apiKeySet, setApiKeySet] = useState(false);
  const [modelInfo, setModelInfo] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const [industry, setIndustry] = useState('');
  const [companySize, setCompanySize] = useState('');
  const [callVolume, setCallVolume] = useState('');
  const [specificUseCase, setSpecificUseCase] = useState('');
  const [salesPerson, setSalesPerson] = useState('');
  const [playbookCount, setPlaybookCount] = useState(4);

  useEffect(() => {
    setApiKeySet(isApiKeyConfigured());
    setModelInfo(getModelInfo());
  }, []);

  const generateHTML = (cs, logoDataUrl = null) => {
    const playbookSlug = cs.playbooks[0]?.name?.split(':')[1]?.trim().toLowerCase().replace(/\s+/g, '_').replace(/[äöüß]/g, m => ({ä:'ae',ö:'oe',ü:'ue',ß:'ss'}[m])) || 'anfrage';
    const webhookExample = JSON.stringify({
      call_id: "abc-123-def",
      timestamp: new Date().toISOString().split('T')[0] + "T19:15:00Z",
      duration_seconds: 180,
      playbook: playbookSlug,
      data: Object.fromEntries(cs.playbooks[0]?.tasks?.slice(0, 4).map(t => [t.field, "..."]) || []),
      tags: ["beispiel"],
      weiterleitung: "keine"
    }, null, 2);

    return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Case Study – ${industry}</title>
  <style>
    /* Print-optimiert für genau 2 A4-Seiten ohne Artefakte */
    @page {
      size: A4 portrait;
      margin: 15mm 12mm;
    }
    @media print {
      * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        color-adjust: exact !important;
      }
      body {
        margin: 0 !important;
        padding: 0 !important;
        width: 210mm;
      }
      .page {
        page-break-after: always !important;
        page-break-before: auto !important;
        page-break-inside: avoid !important;
        margin: 0 !important;
        padding: 12mm !important;
        min-height: auto !important;
        max-height: none !important;
        height: auto !important;
      }
      .page:last-child {
        page-break-after: auto !important;
      }
      .page-1 {
        /* Erste Seite - Header + Situation + Playbooks */
      }
      .page-2 {
        /* Zweite Seite - Alles andere */
        page-break-before: always !important;
      }
      .section {
        page-break-inside: avoid;
      }
      .playbook {
        page-break-inside: avoid;
      }
      .no-print { display: none !important; }
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
      font-size: 9px;
      line-height: 1.35;
      color: #1a1a1a;
      background: #fff;
    }
    .page {
      width: 210mm;
      padding: 12mm;
      position: relative;
      box-sizing: border-box;
    }
    @media screen {
      .page {
        min-height: 277mm;
        max-height: 277mm;
        margin: 20px auto;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        background: white;
        overflow: visible;
      }
      body {
        background: #e0e0e0;
        padding: 20px;
      }
    }
    .header { background: linear-gradient(135deg, ${LIME} 0%, #e6ff66 100%); border-radius: 10px; padding: 16px 20px; margin-bottom: 12px; position: relative; overflow: hidden; }
    .header::before { content: ''; position: absolute; top: -50%; right: -20%; width: 150px; height: 150px; background: rgba(255,255,255,0.15); border-radius: 50%; }
    .header-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; position: relative; }
    .header-label { font-size: 8px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; opacity: 0.8; }
    .header-logo { font-weight: 800; font-size: 14px; letter-spacing: -0.5px; }
    h1 { font-size: 16px; font-weight: 700; line-height: 1.25; position: relative; }
    .metrics { display: flex; gap: 8px; margin-top: 12px; }
    .metric { background: rgba(255,255,255,0.9); backdrop-filter: blur(10px); padding: 8px 12px; border-radius: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
    .metric-value { font-size: 15px; font-weight: 800; color: #111; }
    .metric-label { font-size: 7px; color: #444; margin-top: 1px; }
    h2 { font-size: 11px; font-weight: 700; color: #111; margin: 12px 0 8px 0; padding-bottom: 4px; border-bottom: 2px solid ${LIME}; display: inline-block; }
    .situation p { font-size: 9px; color: #333; margin-bottom: 6px; }
    .consequence { background: linear-gradient(90deg, ${LIME}22, transparent); border-left: 3px solid ${LIME}; padding: 8px 12px; margin: 8px 0; font-style: italic; color: #444; border-radius: 0 6px 6px 0; font-size: 9px; }
    .use-cases { display: flex; flex-wrap: wrap; gap: 5px; margin: 8px 0; }
    .use-case { background: #f7f7f7; border: 1px solid #e5e5e5; padding: 4px 10px; border-radius: 16px; font-size: 8px; display: flex; align-items: center; gap: 4px; }
    .use-case::before { content: '✓'; color: #22c55e; font-weight: 700; font-size: 9px; }
    .playbooks-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(80mm, 1fr));
      gap: 8px;
      margin: 8px 0;
    }
    .playbook {
      background: #fafafa;
      border: 1px solid #eee;
      border-radius: 8px;
      padding: 10px 12px;
      page-break-inside: avoid;
      overflow: hidden;
    }
    .playbook-header { margin-bottom: 6px; }
    .playbook-name { font-size: 9px; font-weight: 700; color: #111; display: block; }
    .playbook-trigger { font-size: 7px; color: #666; margin-top: 2px; display: block; }
    .playbook table { width: 100%; border-collapse: collapse; margin-top: 6px; }
    .playbook th { text-align: left; font-size: 7px; font-weight: 600; color: #666; text-transform: uppercase; letter-spacing: 0.3px; padding: 4px 6px; background: #f0f0f0; }
    .playbook td { padding: 4px 6px; border-bottom: 1px solid #eee; font-size: 8px; }
    .playbook td:first-child { font-family: 'SF Mono', 'Consolas', monospace; font-size: 7px; color: #888; width: 30%; }
    .playbook-action { margin-top: 6px; padding: 6px 8px; background: linear-gradient(90deg, #22c55e15, transparent); border-left: 2px solid #22c55e; border-radius: 0 4px 4px 0; font-size: 7px; color: #166534; }
    .results-grid { display: flex; gap: 10px; margin: 10px 0; }
    .results-table { flex: 1.2; }
    .results-table table { width: 100%; border-collapse: collapse; }
    .results-table th { font-size: 7px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.3px; padding: 6px 8px; background: #f5f5f5; text-align: left; border-bottom: 2px solid #ddd; }
    .results-table td { padding: 5px 8px; border-bottom: 1px solid #eee; font-size: 8px; }
    .results-table .before { color: #999; }
    .results-table .after { color: #22c55e; font-weight: 700; }
    .savings-container { flex: 0.8; display: flex; gap: 6px; }
    .savings-list { flex: 1; background: #f8f8f8; border-radius: 6px; padding: 8px 10px; }
    .savings-list h4 { font-size: 8px; font-weight: 700; margin-bottom: 6px; color: #333; }
    .savings-row { display: flex; justify-content: space-between; font-size: 7px; padding: 2px 0; border-bottom: 1px dashed #e0e0e0; }
    .savings-row:last-child { border: none; }
    .savings-total { width: 70px; background: ${LIME}; border-radius: 6px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
    .savings-value { font-size: 18px; font-weight: 800; line-height: 1; }
    .savings-label { font-size: 7px; font-weight: 600; margin-top: 2px; }
    .savings-note { font-size: 7px; color: #666; font-style: italic; margin-top: 6px; }
    .quote { background: #f9f9f9; border-radius: 8px; padding: 10px 14px; margin: 10px 0; position: relative; }
    .quote::before { content: '"'; font-size: 36px; font-family: Georgia, serif; color: ${LIME}; position: absolute; top: 2px; left: 10px; line-height: 1; }
    .quote p { font-style: italic; color: #444; font-size: 8px; padding-left: 24px; }
    .integration h2 { margin-top: 0; }
    .webhook { background: #1a1a2e; border-radius: 6px; padding: 10px 12px; margin: 8px 0; overflow: hidden; }
    .webhook-label { font-size: 7px; color: #888; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px; }
    .webhook pre { font-family: 'SF Mono', 'Consolas', monospace; font-size: 7px; color: #a5f3a5; line-height: 1.35; margin: 0; }
    .automations-grid { display: flex; gap: 8px; margin: 10px 0; page-break-inside: avoid; }
    .automation-group { flex: 1; background: #f8f8f8; border-radius: 6px; padding: 8px; }
    .automation-group-label { font-size: 8px; font-weight: 700; color: #333; margin-bottom: 6px; padding-bottom: 4px; border-bottom: 2px solid ${LIME}; }
    .automation { background: #fff; border-radius: 4px; padding: 6px 8px; margin-bottom: 4px; border-left: 2px solid ${LIME}; }
    .automation:last-child { margin-bottom: 0; }
    .automation-trigger { font-size: 7.5px; font-weight: 600; color: #333; }
    .automation-action { font-size: 7px; color: #666; margin-top: 1px; }
    .workflow { background: #f8f8f8; border-radius: 8px; padding: 10px 12px; margin: 10px 0; }
    .workflow h4 { font-size: 9px; font-weight: 700; margin-bottom: 8px; color: #111; }
    .workflow-steps { position: relative; padding-left: 16px; }
    .workflow-steps::before { content: ''; position: absolute; left: 4px; top: 4px; bottom: 4px; width: 2px; background: linear-gradient(to bottom, ${LIME}, #22c55e); border-radius: 2px; }
    .workflow-step { display: flex; align-items: flex-start; margin: 4px 0; position: relative; }
    .workflow-step::before { content: ''; position: absolute; left: -14px; top: 3px; width: 6px; height: 6px; background: ${LIME}; border: 1px solid #fff; border-radius: 50%; box-shadow: 0 0 0 1px ${LIME}44; }
    .workflow-time { font-family: 'SF Mono', monospace; font-size: 7px; color: #888; width: 40px; flex-shrink: 0; }
    .workflow-desc { font-size: 8px; color: #333; }
    .workflow-contrast { margin-top: 8px; padding-top: 8px; border-top: 1px dashed #ddd; font-size: 8px; color: #dc2626; font-style: italic; }
    .features { margin: 10px 0; }
    .features-grid { display: flex; flex-wrap: wrap; gap: 5px; }
    .feature { background: #f0f9f0; border: 1px solid #d0e8d0; padding: 3px 8px; border-radius: 4px; font-size: 7px; color: #166534; }
    .feature::before { content: '✅ '; }
    .bottom-grid { display: flex; gap: 10px; margin-top: 12px; }
    .demo { flex: 1; background: linear-gradient(135deg, ${LIME} 0%, #e6ff66 100%); border-radius: 10px; padding: 12px 14px; position: relative; overflow: hidden; }
    .demo::before { content: ''; position: absolute; bottom: -30%; right: -10%; width: 80px; height: 80px; background: rgba(255,255,255,0.2); border-radius: 50%; }
    .demo h4 { font-size: 10px; font-weight: 700; margin-bottom: 6px; }
    .demo-phone { font-size: 14px; font-weight: 800; margin-bottom: 8px; }
    .demo-prompts { font-size: 8px; }
    .demo-prompt { margin: 3px 0; padding-left: 10px; position: relative; }
    .demo-prompt::before { content: '•'; position: absolute; left: 0; }
    .cta { flex: 1; background: #111; color: #fff; border-radius: 10px; padding: 12px 14px; display: flex; flex-direction: column; justify-content: center; text-align: center; }
    .cta h4 { font-size: 11px; font-weight: 700; margin-bottom: 4px; }
    .cta p { font-size: 8px; color: #aaa; margin-bottom: 10px; }
    .cta-button { display: inline-block; background: ${LIME}; color: #111; padding: 8px 20px; border-radius: 5px; text-decoration: none; font-weight: 700; font-size: 9px; }
    .footer { text-align: center; margin-top: 10px; padding-top: 8px; border-top: 1px solid #eee; }
    .footer-contact { font-size: 8px; margin-bottom: 3px; }
    .footer-info { font-size: 7px; color: #888; }
    @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
  </style>
</head>
<body>
  <div class="page page-1">
    <div class="header section">
      <div class="header-top">
        <span class="header-label">sipgate AI Agents</span>
        ${logoDataUrl
          ? `<img src="${logoDataUrl}" alt="sipgate" class="header-logo-img" style="height: 20px; width: auto;">`
          : `<span class="header-logo">sipgate</span>`
        }
      </div>
      <h1>${cs.title}</h1>
      <div class="metrics">
        <div class="metric"><div class="metric-value">${cs.metrics.automation}</div><div class="metric-label">der Anrufe automatisiert</div></div>
        <div class="metric"><div class="metric-value">${cs.metrics.time}</div><div class="metric-label">pro Monat eingespart</div></div>
        <div class="metric"><div class="metric-value">${cs.metrics.availability}</div><div class="metric-label">erreichbar</div></div>
      </div>
    </div>
    <section class="situation section">
      <h2>Ausgangssituation</h2>
      <p>${cs.situation.profile}</p>
      <p>${cs.situation.problem}</p>
      <div class="consequence">${cs.situation.consequence}</div>
    </section>
    <section class="solution-section section">
      <h2>Die Lösung mit sipgate AI Agents</h2>
      <div class="use-cases">${cs.useCases.map(uc => `<span class="use-case">${uc}</span>`).join('')}</div>
    </section>
    <section class="playbooks-section section">
      <h2>Playbooks</h2>
      <div class="playbooks-grid">
      ${cs.playbooks.map(pb => `
        <div class="playbook">
          <div class="playbook-header">
            <span class="playbook-name">${pb.name}</span>
            <span class="playbook-trigger">${pb.trigger}</span>
          </div>
          <table>
            <tr><th>Feld</th><th>Frage</th></tr>
            ${pb.tasks.slice(0, 5).map(t => `<tr><td>${t.field}</td><td>${t.question}</td></tr>`).join('')}
          </table>
          ${pb.action ? `<div class="playbook-action">⚡ ${pb.action}</div>` : ''}
        </div>`).join('')}
      </div>
    </section>
  </div>
  <div class="page page-2">
    <section class="results-section section">
      <h2>Die Ergebnisse</h2>
      <div class="results-grid">
        <div class="results-table">
          <table>
            <tr><th>Kennzahl</th><th>Vorher</th><th>Nachher</th></tr>
            ${cs.results.comparison.map(r => `<tr><td>${r.metric}</td><td class="before">${r.before}</td><td class="after">${r.after}</td></tr>`).join('')}
          </table>
        </div>
        <div class="savings-container">
          <div class="savings-list">
            <h4>Zeitersparnis im Detail</h4>
            ${cs.results.savings.map(s => `<div class="savings-row"><span>${s.area}</span><span>${s.hours} Std.</span></div>`).join('')}
          </div>
          <div class="savings-total">
            <div class="savings-value">${cs.results.totalHours}</div>
            <div class="savings-label">Std./Monat</div>
          </div>
        </div>
      </div>
      ${cs.results.savingsNote ? `<div class="savings-note">*${cs.results.savingsNote}</div>` : ''}
      <div class="quote"><p>${cs.results.quote}</p></div>
    </section>
    <section class="integration section">
      <h2>Integration & Automatisierung</h2>
      <div class="webhook">
        <div class="webhook-label">Webhook-Payload Beispiel (nach ${cs.playbooks[0]?.name?.split(':')[1]?.trim() || 'Anruf'})</div>
        <pre>${webhookExample}</pre>
      </div>
      <div class="automations-header"><h2>Automatisierungen</h2></div>
      <div class="automations-grid">
        <div class="automation-group">
          <div class="automation-group-label">🔍 Pre-Call</div>
          ${cs.automations.filter(a => a.type === 'pre-call').map(a => `<div class="automation"><div class="automation-trigger">${a.trigger}</div><div class="automation-action">→ ${a.action}</div></div>`).join('')}
        </div>
        <div class="automation-group">
          <div class="automation-group-label">📞 In-Call</div>
          ${cs.automations.filter(a => a.type === 'in-call').map(a => `<div class="automation"><div class="automation-trigger">${a.trigger}</div><div class="automation-action">→ ${a.action}</div></div>`).join('')}
        </div>
        <div class="automation-group">
          <div class="automation-group-label">✅ Post-Call</div>
          ${cs.automations.filter(a => a.type === 'post-call').map(a => `<div class="automation"><div class="automation-trigger">${a.trigger}</div><div class="automation-action">→ ${a.action}</div></div>`).join('')}
        </div>
      </div>
    </section>
    <section class="workflow-section section">
      <h2>Workflow-Beispiel</h2>
      <div class="workflow">
        <h4>${cs.workflow.title}</h4>
        <div class="workflow-steps">
          ${cs.workflow.steps.map(s => `<div class="workflow-step"><span class="workflow-time">${s.time}</span><span class="workflow-desc">${s.desc}</span></div>`).join('')}
        </div>
        <div class="workflow-contrast">⚠️ ${cs.workflow.contrast}</div>
      </div>
    </section>
    <section class="features-section section">
      <h2>Eingesetzte Features</h2>
      <div class="features-grid">
        ${(cs.features || []).map(f => `<span class="feature">${f}</span>`).join('')}
      </div>
    </section>
    <div class="footer">
      <div class="footer-info">sipgate AI Agents · DSGVO-konform · Made in Germany</div>
    </div>
  </div>
</body>
</html>`;
  };

  const generateMarkdown = (cs) => {
    const playbookSlug = cs.playbooks[0]?.name?.split(':')[1]?.trim().toLowerCase().replace(/\s+/g, '_').replace(/[äöüß]/g, m => ({ä:'ae',ö:'oe',ü:'ue',ß:'ss'}[m])) || 'anfrage';
    const webhookExample = JSON.stringify({
      call_id: "abc-123-def",
      timestamp: new Date().toISOString().split('T')[0] + "T19:15:00Z",
      duration_seconds: 180,
      playbook: playbookSlug,
      data: Object.fromEntries(cs.playbooks[0]?.tasks?.slice(0, 4).map(t => [t.field, "..."]) || []),
      tags: ["beispiel"],
      weiterleitung: "keine"
    }, null, 2);

    return `# ${cs.title}

---

**${cs.metrics.automation}** der Anrufe automatisiert | **${cs.metrics.time}** pro Monat eingespart | **${cs.metrics.availability}** erreichbar

---

## Ausgangssituation

${cs.situation.profile}

${cs.situation.problem}

> 💡 ${cs.situation.consequence}

---

## Die Lösung mit sipgate AI Agents

### Eingesetzte Use Cases

Der AI Agent übernimmt den First-Level-Support und erkennt automatisch, um welches Anliegen es sich handelt:

${cs.useCases.map(uc => `- **${uc.split(' (')[0]}**${uc.includes('(') ? ' (' + uc.split('(')[1] : ''}`).join('\n')}

---

${cs.playbooks.map(pb => `### ${pb.name}

**Trigger:** ${pb.trigger}

| Aufgabe (Titel) | Frage an den Anrufer |
|-----------------|----------------------|
${pb.tasks.map(t => `| \`${t.field}\` | ${t.question} |`).join('\n')}

${pb.action ? `**Intelligente Weiterleitung:** ${pb.action}` : ''}

---
`).join('\n')}

### Intelligente Erkennung

Der Agent erkennt anhand des Gesprächs automatisch, welches Playbook relevant ist. Der Übergang ist nahtlos – der Anrufer muss keine Menüauswahl treffen.

---

## Die Ergebnisse

### Vorher/Nachher im Vergleich

| Kennzahl | Vorher | Nachher |
|----------|--------|---------|
${cs.results.comparison.map(r => `| ${r.metric} | ${r.before} | **${r.after}** |`).join('\n')}

### Zeitersparnis im Detail

| Bereich | Zeitersparnis pro Monat |
|---------|-------------------------|
${cs.results.savings.map(s => `| ${s.area} | ${s.hours} Stunden |`).join('\n')}
| **Gesamt** | **${cs.results.totalHours} Stunden** |

*${cs.results.savingsNote || 'Das entspricht signifikanter Entlastung für das Team.'}*

### Stimme aus der Praxis

> "${cs.results.quote}"

---

## Integrationspotenzial: Drittsysteme & Automatisierung

### Webhook-Integration

Nach jedem Gespräch sendet sipgate AI Agents eine strukturierte Daten-Payload per Webhook. Die Felder entsprechen exakt den Aufgaben-Titeln aus den Playbooks:

**Beispiel-Payload nach ${cs.playbooks[0]?.name?.split(':')[1]?.trim() || 'einem Anruf'}:**

\`\`\`json
${webhookExample}
\`\`\`

### Automatisierungen

Mit Tools wie Make, Zapier oder n8n lassen sich automatische Prozesse in allen Phasen des Anrufs auslösen:

#### 🔍 Pre-Call (Anrufer-Identifikation & Kontext)

| Trigger | Automatische Aktion |
|---------|---------------------|
${cs.automations.filter(a => a.type === 'pre-call').map(a => `| ${a.trigger} | ${a.action} |`).join('\n')}

#### 📞 In-Call (Während des Gesprächs)

| Trigger | Automatische Aktion |
|---------|---------------------|
${cs.automations.filter(a => a.type === 'in-call').map(a => `| ${a.trigger} | ${a.action} |`).join('\n')}

#### ✅ Post-Call (Nach dem Gespräch)

| Trigger | Automatische Aktion |
|---------|---------------------|
${cs.automations.filter(a => a.type === 'post-call').map(a => `| ${a.trigger} | ${a.action} |`).join('\n')}

### ${cs.workflow.title}

| Uhrzeit | Was passiert |
|---------|--------------|
${cs.workflow.steps.map(s => `| ${s.time} | ${s.desc} |`).join('\n')}

> ⚠️ **${cs.workflow.contrast}**

---

## Eingesetzte Features

${(cs.features || []).map(f => `✅ ${f}`).join('\n')}

---

*sipgate AI Agents | DSGVO-konform | Made in Germany*
`;
  };

  const generateAgentConfig = (cs) => {
    return {
      agent: {
        name: cs.agentName,
        greeting: `Guten Tag, Sie sprechen mit ${cs.agentName}. Wie kann ich Ihnen helfen?`,
        language: "de-DE"
      },
      playbooks: cs.playbooks.map(pb => ({
        name: pb.name.split(':')[1]?.trim() || pb.name,
        trigger: pb.trigger,
        tasks: pb.tasks.map(t => ({
          field: t.field,
          question: t.question,
          required: true
        })),
        action: pb.action || null
      })),
      useCases: cs.useCases,
      automations: {
        preCall: cs.automations.filter(a => a.type === 'pre-call').map(a => ({ trigger: a.trigger, action: a.action })),
        inCall: cs.automations.filter(a => a.type === 'in-call').map(a => ({ trigger: a.trigger, action: a.action })),
        postCall: cs.automations.filter(a => a.type === 'post-call').map(a => ({ trigger: a.trigger, action: a.action }))
      },
      faq: {
        enabled: true,
        topics: cs.useCases.map(uc => ({
          topic: uc.split(' (')[0],
          details: uc.includes('(') ? uc.split('(')[1].replace(')', '') : null,
          enabled: true
        }))
      },
      features: cs.features || [],
      demoPrompts: cs.demoPrompts
    };
  };

  const generate = async () => {
    setLoading(true);
    setError(null);

    const userPrompt = `Erstelle jetzt eine Case Study für:

• Branche: ${industry}
• Unternehmensgröße: ${companySize}
• Anrufvolumen: ${callVolume} pro Tag
${specificUseCase ? `• Bekannter Use Case: ${specificUseCase}` : ''}
• Anzahl Playbooks: ${playbookCount}

WICHTIG:
- Erstelle EXAKT ${playbookCount} Playbooks mit je 5-6 Tasks
- Erstelle EXAKT 5 Vergleichszeilen in results.comparison
- Erstelle EXAKT 4 Einträge in results.savings (die Summe muss totalHours ergeben)
- Verwende Tilde (~) bei den Stunden-Angaben
- Die Playbook-Feldnamen müssen konsistent im snake_case sein

Liefere höchste Qualität. Antworte NUR mit dem JSON.`;

    try {
      const result = await generateCaseStudy(SYSTEM_PROMPT(playbookCount), userPrompt);

      if (result.success) {
        setCaseStudy(result.data);
        setStep('result');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Unerwarteter Fehler: ' + err.message);
    }

    setLoading(false);
  };

  const downloadFile = (content, filename, type) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrintPDF = async () => {
    if (!caseStudy) return;

    // Lade das Logo als Data-URL
    let logoDataUrl = null;
    try {
      const response = await fetch('/180227_sipgate_wort-bild-marke_schwarz_RGB.png');
      const blob = await response.blob();
      logoDataUrl = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.warn('Logo konnte nicht geladen werden, verwende Text-Fallback');
    }

    // Erstelle ein neues Fenster mit dem HTML
    const printWindow = window.open('', '_blank');
    const htmlContent = generateHTML(caseStudy, logoDataUrl);

    printWindow.document.write(htmlContent);
    printWindow.document.close();

    // Warte bis Inhalte geladen sind, dann öffne Print-Dialog
    printWindow.onload = () => {
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    };
  };

  if (!apiKeySet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 flex items-center justify-center">
        <div className="max-w-lg w-full">
          <div style={{ background: `linear-gradient(135deg, ${LIME} 0%, #e6ff66 100%)` }} className="rounded-2xl p-8 mb-6 shadow-lg">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-semibold uppercase tracking-wide opacity-70">sipgate AI Agents</span>
              <span className="font-extrabold text-xl">sipgate</span>
            </div>
            <h1 className="text-3xl font-extrabold mb-2">⚠️ API-Key erforderlich</h1>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg space-y-4">
            <p className="text-gray-700">Um den Case Study Builder zu nutzen, benötigen Sie einen OpenAI API-Key.</p>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <h3 className="font-bold text-blue-900 mb-2">So richten Sie den API-Key ein:</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
                <li>Besuchen Sie <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="underline font-semibold">platform.openai.com/api-keys</a></li>
                <li>Erstellen Sie einen neuen API-Key</li>
                <li>Erstellen Sie eine <code className="bg-blue-100 px-2 py-1 rounded">.env</code> Datei im Projektverzeichnis</li>
                <li>Fügen Sie hinzu: <code className="bg-blue-100 px-2 py-1 rounded">VITE_OPENAI_API_KEY=ihr_key</code></li>
                <li>Starten Sie die Anwendung neu</li>
              </ol>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
              <p className="text-sm text-yellow-800">
                <strong>Hinweis:</strong> Für Produktivumgebungen sollte der API-Key über ein Backend verwaltet werden, nicht im Browser.
              </p>
            </div>

            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
              <h3 className="font-bold text-green-900 mb-2">💡 PDF-Export direkt testen</h3>
              <p className="text-sm text-green-800 mb-3">Möchten Sie den PDF-Export ohne API-Key testen? Ich habe eine fertige Beispiel-Case Study für Sie vorbereitet!</p>
              <button
                onClick={() => {
                  setCaseStudy(sampleCaseStudy);
                  setIndustry('Autohaus');
                  setSalesPerson('Max Mustermann');
                  setStep('result');
                }}
                className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
              >
                Beispiel-Case Study laden →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'input') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-lg mx-auto">
          <div style={{ background: `linear-gradient(135deg, ${LIME} 0%, #e6ff66 100%)` }} className="rounded-2xl p-8 mb-6 shadow-lg">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-semibold uppercase tracking-wide opacity-70">sipgate AI Agents</span>
              <span className="font-extrabold text-xl">sipgate</span>
            </div>
            <h1 className="text-3xl font-extrabold mb-2">Case Study Builder</h1>
            <p className="text-gray-700">Branchenspezifische Case Studies in Premium-Qualität</p>
            {modelInfo && (
              <div className="mt-4 text-xs bg-white/30 rounded-lg px-3 py-2">
                <span className="font-semibold">Powered by {modelInfo.name}</span> — Das leistungsstärkste Modell
              </div>
            )}
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg space-y-5">
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Branche *</label>
              <input type="text" placeholder="z.B. Autohaus, Zahnarztpraxis, Steuerberater..." className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-lime-400 transition-colors" value={industry} onChange={(e) => setIndustry(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">Größe *</label>
                <input type="text" placeholder="z.B. 25 Mitarbeiter" className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-lime-400 transition-colors" value={companySize} onChange={(e) => setCompanySize(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">Anrufe/Tag *</label>
                <input type="text" placeholder="z.B. 80" className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-lime-400 transition-colors" value={callVolume} onChange={(e) => setCallVolume(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Bekannter Use Case <span className="font-normal text-gray-400">(optional)</span></label>
              <input type="text" placeholder="z.B. Terminvereinbarung, Störungsmeldung..." className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-lime-400 transition-colors" value={specificUseCase} onChange={(e) => setSpecificUseCase(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">Anzahl Playbooks</label>
                <select
                  value={playbookCount}
                  onChange={(e) => setPlaybookCount(parseInt(e.target.value))}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-lime-400 transition-colors bg-white"
                >
                  <option value={2}>2 Playbooks</option>
                  <option value={3}>3 Playbooks</option>
                  <option value={4}>4 Playbooks (Standard)</option>
                  <option value={5}>5 Playbooks</option>
                  <option value={6}>6 Playbooks</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">Ihr Name <span className="font-normal text-gray-400">(optional)</span></label>
                <input type="text" placeholder="Für den Kontakt im Dokument" className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-lime-400 transition-colors" value={salesPerson} onChange={(e) => setSalesPerson(e.target.value)} />
              </div>
            </div>
            {error && <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm">{error}</div>}
            <button onClick={generate} disabled={loading || !industry || !companySize || !callVolume} className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors">
              {loading ? '⏳ Generiere mit GPT-4 Turbo...' : 'Case Study erstellen →'}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">oder</span>
              </div>
            </div>

            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
              <h3 className="font-bold text-green-900 mb-2 flex items-center gap-2">
                <span>💡</span>
                <span>PDF-Export direkt testen</span>
              </h3>
              <p className="text-sm text-green-800 mb-3">Möchten Sie den PDF-Export ohne eigene Eingabe testen? Laden Sie eine fertige Beispiel-Case Study!</p>
              <button
                onClick={() => {
                  setCaseStudy(sampleCaseStudy);
                  setIndustry('Autohaus');
                  setSalesPerson('Max Mustermann');
                  setStep('result');
                }}
                className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors shadow-sm"
              >
                Beispiel-Case Study laden (Autohaus) →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'result' && caseStudy) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-lg mx-auto">
          <div style={{ background: `linear-gradient(135deg, ${LIME} 0%, #e6ff66 100%)` }} className="rounded-2xl p-6 mb-6 shadow-lg">
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-semibold uppercase tracking-wide opacity-70">sipgate AI Agents</span>
              <span className="font-extrabold text-lg">sipgate</span>
            </div>
            <h1 className="text-2xl font-extrabold mb-1">✓ Case Study erstellt</h1>
            <p className="text-gray-700 font-medium">{industry}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg space-y-4">
            <div className="pb-4 border-b">
              <h2 className="font-bold text-lg mb-2">✏️ Inhalte bearbeiten</h2>
              <p className="text-sm text-gray-500 mb-3">Passen Sie Texte, Metriken und Details vor dem Export an</p>
              <button
                onClick={() => setShowPreview(true)}
                style={{ background: LIME }}
                className="w-full text-black py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-sm"
              >
                Vorschau & Bearbeiten →
              </button>
            </div>

            <div className="pb-4 border-b">
              <h2 className="font-bold text-lg mb-2">📄 Als PDF speichern</h2>
              <p className="text-sm text-gray-500 mb-3">Öffnet Print-Dialog → "Als PDF speichern" wählen</p>
              <button onClick={handlePrintPDF} className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors">
                🖨️ Drucken / Als PDF speichern
              </button>
            </div>
            <div className="pb-4 border-b">
              <h2 className="font-bold text-lg mb-2">🌐 HTML für Print</h2>
              <p className="text-sm text-gray-500 mb-3">HTML-Version zum Drucken oder Weiterverarbeiten</p>
              <button onClick={async () => {
                let logoDataUrl = null;
                try {
                  const response = await fetch('/180227_sipgate_wort-bild-marke_schwarz_RGB.png');
                  const blob = await response.blob();
                  logoDataUrl = await new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.readAsDataURL(blob);
                  });
                } catch (error) {
                  console.warn('Logo konnte nicht geladen werden');
                }
                downloadFile(generateHTML(caseStudy, logoDataUrl), `case-study-${industry.toLowerCase().replace(/[^a-z0-9]/g, '-')}.html`, 'text/html;charset=utf-8');
              }} className="w-full bg-gray-100 text-black py-3 rounded-xl font-semibold hover:bg-gray-200 border-2 border-gray-200 transition-colors">HTML herunterladen</button>
            </div>
            <div className="pb-4 border-b">
              <h2 className="font-bold text-lg mb-2">📝 Markdown</h2>
              <p className="text-sm text-gray-500 mb-3">Vollständiger Inhalt für andere Design-Tools</p>
              <button onClick={() => downloadFile(generateMarkdown(caseStudy), `case-study-${industry.toLowerCase().replace(/[^a-z0-9]/g, '-')}.md`, 'text/markdown;charset=utf-8')} className="w-full bg-gray-100 text-black py-3 rounded-xl font-semibold hover:bg-gray-200 border-2 border-gray-200 transition-colors">Markdown herunterladen</button>
            </div>
            <div className="pb-4 border-b">
              <h2 className="font-bold text-lg mb-2">🤖 Agent-Konfiguration</h2>
              <p className="text-sm text-gray-500 mb-3">JSON mit Playbooks, Use Cases & FAQ für den Demo-Agent</p>
              <button onClick={() => downloadFile(JSON.stringify(generateAgentConfig(caseStudy), null, 2), `agent-config-${industry.toLowerCase().replace(/[^a-z0-9]/g, '-')}.json`, 'application/json')} className="w-full bg-gray-100 text-black py-3 rounded-xl font-semibold hover:bg-gray-200 border-2 border-gray-200 transition-colors">JSON herunterladen</button>
            </div>
            <button onClick={() => { setStep('input'); setCaseStudy(null); }} className="w-full py-3 text-gray-500 hover:text-black font-medium transition-colors">← Neue Case Study</button>
          </div>
          <div className="mt-6 bg-white rounded-2xl p-5 shadow-lg">
            <h3 className="font-bold mb-3">Vorschau</h3>
            <div className="text-sm space-y-2 text-gray-600">
              <p><span className="font-semibold text-black">Agent:</span> {caseStudy.agentName}</p>
              <p><span className="font-semibold text-black">Playbooks:</span> {caseStudy.playbooks.length}</p>
              <p><span className="font-semibold text-black">Use Cases:</span> {caseStudy.useCases.length}</p>
              <p><span className="font-semibold text-black">Zeitersparnis:</span> {caseStudy.results.totalHours} Std./Monat</p>
              <p><span className="font-semibold text-black">Automatisierungen:</span> {caseStudy.automations.length}</p>
            </div>
          </div>
        </div>

        {/* Live Preview Modal */}
        {showPreview && (
          <LivePreview
            caseStudy={caseStudy}
            onUpdate={(updatedCS) => setCaseStudy(updatedCS)}
            onClose={() => setShowPreview(false)}
          />
        )}
      </div>
    );
  }

  return null;
}
