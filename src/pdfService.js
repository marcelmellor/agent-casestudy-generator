import { jsPDF } from 'jspdf';
import { loadSipgateLogo } from './logoData';

const LIME = '#CCFF00';
const LIME_RGB = [204, 255, 0];
const DARK_GRAY = [40, 40, 40];
const MEDIUM_GRAY = [100, 100, 100];
const LIGHT_GRAY = [220, 220, 220];

// Design-Konstanten
const MARGIN = 20;
const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
const CONTENT_WIDTH = PAGE_WIDTH - (MARGIN * 2);

// Logo Cache
let cachedLogoData = null;

/**
 * Generiert ein hochwertiges PDF aus der Case Study
 */
export const generatePDF = async (caseStudy, industry, salesPerson = '', logoData = null) => {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true
  });

  pdf.setFont('helvetica');

  // Seite 1: Header, Situation, Use Cases, Playbooks
  await renderPage1(pdf, caseStudy, logoData);

  // Seite 2: Ergebnisse, Automationen, Features, CTA
  pdf.addPage();
  renderPage2(pdf, caseStudy, salesPerson);

  return pdf;
};

/**
 * SEITE 1: Header, Ausgangssituation, Use Cases, Playbooks
 */
const renderPage1 = async (pdf, cs, logoData) => {
  let y = 15;

  // === HEADER mit Lime-Gradient ===
  pdf.setFillColor(...LIME_RGB);
  pdf.rect(0, 0, PAGE_WIDTH, 65, 'F');

  // Dunkler Akzent unten
  pdf.setFillColor(180, 220, 0);
  pdf.rect(0, 60, PAGE_WIDTH, 5, 'F');

  // Logo/Brand oben links
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 0, 0);
  pdf.text('SIPGATE AI AGENTS', MARGIN, y);

  // sipgate Logo rechts - PNG wenn vorhanden, sonst Text
  if (logoData) {
    try {
      // Logo als Bild einfügen
      // Berechne Größe: max 30mm breit, Höhe proportional
      const logoWidth = 30;
      const logoHeight = 8; // Geschätzt basierend auf Seitenverhältnis
      const logoX = PAGE_WIDTH - MARGIN - logoWidth;
      const logoY = y - 4;

      pdf.addImage(logoData, 'PNG', logoX, logoY, logoWidth, logoHeight);
    } catch (error) {
      console.error('Logo konnte nicht ins PDF eingefügt werden:', error);
      // Fallback zu Text
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('sipgate', PAGE_WIDTH - MARGIN, y, { align: 'right' });
    }
  } else {
    // Fallback: Text-Logo
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('sipgate', PAGE_WIDTH - MARGIN, y, { align: 'right' });
  }

  y += 10;

  // Titel - groß und prominent
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 0, 0);
  const titleLines = pdf.splitTextToSize(cs.title, CONTENT_WIDTH - 10);
  titleLines.forEach((line, idx) => {
    pdf.text(line, MARGIN, y + (idx * 8));
  });

  y += titleLines.length * 8 + 8;

  // Metriken-Boxen - Horizontale Anordnung
  const metricBoxWidth = (CONTENT_WIDTH - 8) / 3;
  const metrics = [
    { value: cs.metrics.automation, label: 'Automatisiert' },
    { value: cs.metrics.time, label: 'Eingespart/Monat' },
    { value: cs.metrics.availability, label: 'Verfügbar' }
  ];

  metrics.forEach((metric, idx) => {
    const x = MARGIN + (idx * (metricBoxWidth + 4));

    // Weißer Box-Hintergrund
    pdf.setFillColor(255, 255, 255);
    pdf.roundedRect(x, y, metricBoxWidth, 14, 2, 2, 'F');

    // Wert
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    pdf.text(metric.value, x + metricBoxWidth / 2, y + 7, { align: 'center' });

    // Label
    pdf.setFontSize(7);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(...MEDIUM_GRAY);
    pdf.text(metric.label, x + metricBoxWidth / 2, y + 11, { align: 'center' });
  });

  y = 80; // Nach Header beginnen

  // === AUSGANGSSITUATION ===
  y = renderSection(pdf, 'Ausgangssituation', y);

  // Profile Text
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(...DARK_GRAY);
  const profileLines = pdf.splitTextToSize(cs.situation.profile, CONTENT_WIDTH);
  profileLines.forEach((line, idx) => {
    pdf.text(line, MARGIN, y + (idx * 5));
  });
  y += profileLines.length * 5 + 3;

  // Problem Text
  const problemLines = pdf.splitTextToSize(cs.situation.problem, CONTENT_WIDTH);
  problemLines.forEach((line, idx) => {
    pdf.text(line, MARGIN, y + (idx * 5));
  });
  y += problemLines.length * 5 + 5;

  // Consequence Box - Hervorgehoben
  pdf.setFillColor(250, 250, 210);
  pdf.setDrawColor(...LIME_RGB);
  pdf.setLineWidth(1);
  const consequenceLines = pdf.splitTextToSize(cs.situation.consequence, CONTENT_WIDTH - 8);
  const boxHeight = consequenceLines.length * 5 + 6;
  pdf.roundedRect(MARGIN, y, CONTENT_WIDTH, boxHeight, 2, 2, 'FD');

  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'bolditalic');
  pdf.setTextColor(80, 80, 0);
  consequenceLines.forEach((line, idx) => {
    pdf.text(line, MARGIN + 4, y + 5 + (idx * 5));
  });
  y += boxHeight + 8;

  // === USE CASES ===
  y = renderSection(pdf, 'Die Lösung', y);

  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(...DARK_GRAY);

  cs.useCases.forEach((uc, idx) => {
    // Bullet mit Lime
    pdf.setFillColor(...LIME_RGB);
    pdf.circle(MARGIN + 2, y - 1.5, 1.5, 'F');

    // Text
    const ucLines = pdf.splitTextToSize(uc, CONTENT_WIDTH - 8);
    ucLines.forEach((line, lineIdx) => {
      pdf.text(line, MARGIN + 6, y + (lineIdx * 4));
    });
    y += ucLines.length * 4 + 1;
  });

  y += 6;

  // === PLAYBOOKS GRID (2x2) ===
  y = renderSection(pdf, 'Playbooks', y);

  const playbookWidth = (CONTENT_WIDTH - 6) / 2;
  const playbookHeight = 52;

  cs.playbooks.forEach((pb, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const x = MARGIN + (col * (playbookWidth + 6));
    const pbY = y + (row * (playbookHeight + 6));

    if (pbY > PAGE_HEIGHT - 30 && row > 0) return; // Überspringen wenn zu weit unten

    // Playbook Box
    pdf.setFillColor(248, 248, 248);
    pdf.setDrawColor(...LIGHT_GRAY);
    pdf.setLineWidth(0.3);
    pdf.roundedRect(x, pbY, playbookWidth, playbookHeight, 2, 2, 'FD');

    // Playbook Name
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...DARK_GRAY);
    const nameLines = pdf.splitTextToSize(pb.name, playbookWidth - 6);
    pdf.text(nameLines[0], x + 3, pbY + 5);

    // Trigger
    pdf.setFontSize(7);
    pdf.setFont('helvetica', 'italic');
    pdf.setTextColor(...MEDIUM_GRAY);
    const triggerLines = pdf.splitTextToSize(pb.trigger, playbookWidth - 6);
    pdf.text(triggerLines[0], x + 3, pbY + 9);

    // Trennlinie
    pdf.setDrawColor(...LIME_RGB);
    pdf.setLineWidth(0.5);
    pdf.line(x + 3, pbY + 11, x + playbookWidth - 3, pbY + 11);

    // Tasks - Kompakt
    let taskY = pbY + 15;
    pdf.setFontSize(7);

    pb.tasks.slice(0, 5).forEach((task) => {
      // Field Name - monospace-style
      pdf.setFont('courier', 'normal');
      pdf.setTextColor(120, 120, 120);
      const fieldName = task.field.substring(0, 18);
      pdf.text(fieldName, x + 3, taskY);

      // Question - rechts daneben, verkürzt
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(...DARK_GRAY);
      const questionShort = task.question.substring(0, 35) + (task.question.length > 35 ? '...' : '');
      const qLines = pdf.splitTextToSize(questionShort, playbookWidth - 26);
      pdf.text(qLines[0], x + 21, taskY);

      taskY += 5;
    });

    // Action - wenn vorhanden
    if (pb.action && taskY < pbY + playbookHeight - 8) {
      pdf.setFillColor(220, 250, 220);
      pdf.roundedRect(x + 2, taskY, playbookWidth - 4, 7, 1, 1, 'F');

      pdf.setFontSize(6.5);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 100, 0);
      const actionLines = pdf.splitTextToSize('⚡ ' + pb.action, playbookWidth - 8);
      pdf.text(actionLines[0], x + 4, taskY + 4.5);
    }
  });
};

/**
 * SEITE 2: Ergebnisse, Automationen, Workflow, Features
 */
const renderPage2 = (pdf, cs, salesPerson) => {
  let y = MARGIN;

  // === ERGEBNISSE ===
  y = renderSection(pdf, 'Die Ergebnisse', y);

  // Vorher/Nachher Tabelle
  const tableStartY = y;
  const col1Width = 70;
  const col2Width = 45;
  const col3Width = 55;

  // Header
  pdf.setFillColor(240, 240, 240);
  pdf.rect(MARGIN, y, col1Width + col2Width + col3Width, 8, 'F');

  pdf.setFontSize(7);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...MEDIUM_GRAY);
  pdf.text('KENNZAHL', MARGIN + 2, y + 5);
  pdf.text('VORHER', MARGIN + col1Width + 2, y + 5);
  pdf.text('NACHHER', MARGIN + col1Width + col2Width + 2, y + 5);

  y += 8;

  // Zeilen
  pdf.setFontSize(8);
  cs.results.comparison.forEach((row, idx) => {
    // Zebra-Streifen
    if (idx % 2 === 0) {
      pdf.setFillColor(252, 252, 252);
      pdf.rect(MARGIN, y - 1, col1Width + col2Width + col3Width, 7, 'F');
    }

    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(...DARK_GRAY);
    pdf.text(row.metric, MARGIN + 2, y + 4);

    pdf.setTextColor(...MEDIUM_GRAY);
    pdf.text(row.before, MARGIN + col1Width + 2, y + 4);

    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(34, 197, 94);
    pdf.text(row.after, MARGIN + col1Width + col2Width + 2, y + 4);

    y += 7;
  });

  y += 8;

  // Savings Box + Total
  pdf.setFillColor(250, 250, 250);
  pdf.roundedRect(MARGIN, y, CONTENT_WIDTH - 40, 30, 2, 2, 'F');

  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...DARK_GRAY);
  pdf.text('Zeitersparnis im Detail', MARGIN + 3, y + 5);

  // Savings Items
  let savY = y + 10;
  pdf.setFontSize(7);
  pdf.setFont('helvetica', 'normal');
  cs.results.savings.forEach((s) => {
    pdf.setTextColor(...MEDIUM_GRAY);
    const areaText = s.area.substring(0, 45) + (s.area.length > 45 ? '...' : '');
    pdf.text(areaText, MARGIN + 3, savY);

    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...DARK_GRAY);
    pdf.text(s.hours + ' Std.', MARGIN + CONTENT_WIDTH - 43, savY, { align: 'right' });

    pdf.setFont('helvetica', 'normal');
    savY += 4.5;
  });

  // Total Box rechts
  pdf.setFillColor(...LIME_RGB);
  pdf.roundedRect(MARGIN + CONTENT_WIDTH - 35, y, 35, 30, 2, 2, 'F');

  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 0, 0);
  pdf.text(cs.results.totalHours, MARGIN + CONTENT_WIDTH - 17.5, y + 14, { align: 'center' });

  pdf.setFontSize(7);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Std./Monat', MARGIN + CONTENT_WIDTH - 17.5, y + 20, { align: 'center' });

  y += 35;

  // Quote Box
  pdf.setFillColor(255, 255, 240);
  pdf.setDrawColor(...LIME_RGB);
  pdf.setLineWidth(0.5);
  const quoteLines = pdf.splitTextToSize('"' + cs.results.quote + '"', CONTENT_WIDTH - 8);
  const quoteHeight = quoteLines.length * 4.5 + 6;
  pdf.roundedRect(MARGIN, y, CONTENT_WIDTH, quoteHeight, 2, 2, 'FD');

  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'italic');
  pdf.setTextColor(60, 60, 60);
  quoteLines.forEach((line, idx) => {
    pdf.text(line, MARGIN + 4, y + 5 + (idx * 4.5));
  });

  y += quoteHeight + 10;

  // === AUTOMATISIERUNGEN ===
  y = renderSection(pdf, 'Automatisierungen', y);

  const autoTypes = [
    { type: 'pre-call', icon: '🔍', label: 'Pre-Call' },
    { type: 'in-call', icon: '📞', label: 'In-Call' },
    { type: 'post-call', icon: '✅', label: 'Post-Call' }
  ];

  const autoBoxWidth = (CONTENT_WIDTH - 8) / 3;

  autoTypes.forEach((typeInfo, idx) => {
    const x = MARGIN + (idx * (autoBoxWidth + 4));
    const filtered = cs.automations.filter(a => a.type === typeInfo.type);

    pdf.setFillColor(248, 248, 248);
    pdf.roundedRect(x, y, autoBoxWidth, 35, 2, 2, 'F');

    // Header
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(...DARK_GRAY);
    pdf.text(typeInfo.icon + ' ' + typeInfo.label, x + 3, y + 5);

    // Items
    let autoY = y + 10;
    pdf.setFontSize(6);

    filtered.slice(0, 2).forEach((a) => {
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(...DARK_GRAY);
      const triggerLines = pdf.splitTextToSize(a.trigger, autoBoxWidth - 6);
      triggerLines.slice(0, 1).forEach(line => {
        pdf.text(line, x + 3, autoY);
        autoY += 3;
      });

      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(...MEDIUM_GRAY);
      const actionLines = pdf.splitTextToSize('→ ' + a.action, autoBoxWidth - 6);
      actionLines.slice(0, 2).forEach(line => {
        pdf.text(line, x + 3, autoY);
        autoY += 3;
      });

      autoY += 2;
    });
  });

  y += 40;

  // === WORKFLOW ===
  const workflowTitleLines = pdf.splitTextToSize(cs.workflow.title, CONTENT_WIDTH - 10);
  y = renderSection(pdf, workflowTitleLines[0], y);

  const workflowHeight = cs.workflow.steps.length * 4.5 + 10;
  pdf.setFillColor(250, 250, 250);
  pdf.roundedRect(MARGIN, y, CONTENT_WIDTH, workflowHeight, 2, 2, 'F');

  let wfY = y + 5;
  cs.workflow.steps.slice(0, 5).forEach((step) => {
    // Timeline dot
    pdf.setFillColor(...LIME_RGB);
    pdf.circle(MARGIN + 3, wfY - 1, 1, 'F');

    // Time
    pdf.setFontSize(6.5);
    pdf.setFont('courier', 'bold');
    pdf.setTextColor(...MEDIUM_GRAY);
    pdf.text(step.time, MARGIN + 6, wfY);

    // Description
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(...DARK_GRAY);
    const descLines = pdf.splitTextToSize(step.desc, CONTENT_WIDTH - 20);
    pdf.text(descLines[0], MARGIN + 17, wfY);

    wfY += 4.5;
  });

  y += workflowHeight + 3;

  // === FEATURES ===
  y = renderSection(pdf, 'Features', y);

  pdf.setFontSize(7);
  pdf.setFont('helvetica', 'normal');

  let featureX = MARGIN;
  let featureY = y;

  cs.features.forEach((f) => {
    const fWidth = pdf.getStringUnitWidth(f) * 7 / pdf.internal.scaleFactor + 4;

    if (featureX + fWidth > PAGE_WIDTH - MARGIN) {
      featureX = MARGIN;
      featureY += 5;
    }

    pdf.setFillColor(240, 250, 240);
    pdf.setDrawColor(200, 230, 200);
    pdf.setLineWidth(0.2);
    pdf.roundedRect(featureX, featureY - 3, fWidth, 4, 1, 1, 'FD');

    pdf.setTextColor(0, 120, 0);
    pdf.text(f, featureX + 2, featureY);

    featureX += fWidth + 2;
  });

  // === FOOTER ===
  const footerY = PAGE_HEIGHT - 15;

  // Simple footer with branding only
  pdf.setFontSize(7);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(150, 150, 150);
  pdf.text('sipgate AI Agents • DSGVO-konform • Made in Germany', PAGE_WIDTH / 2, footerY, { align: 'center' });
};

/**
 * Rendert eine Section-Überschrift
 */
const renderSection = (pdf, title, y) => {
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...DARK_GRAY);
  pdf.text(title, MARGIN, y);

  // Lime Unterstrich
  pdf.setDrawColor(...LIME_RGB);
  pdf.setLineWidth(1);
  pdf.line(MARGIN, y + 1, MARGIN + 40, y + 1);

  return y + 7;
};

/**
 * Speichert das PDF
 */
export const savePDF = (pdf, filename) => {
  pdf.save(filename);
};

/**
 * Erstellt und speichert ein PDF direkt
 */
export const generateAndSavePDF = async (caseStudy, industry, salesPerson = '') => {
  // Logo laden wenn noch nicht gecached
  if (!cachedLogoData) {
    cachedLogoData = await loadSipgateLogo();
  }

  const pdf = await generatePDF(caseStudy, industry, salesPerson, cachedLogoData);
  const filename = `case-study-${industry.toLowerCase().replace(/[^a-z0-9]/g, '-')}.pdf`;
  savePDF(pdf, filename);
};
