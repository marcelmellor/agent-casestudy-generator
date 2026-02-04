// Beispiel Case Study für Testzwecke
export const sampleCaseStudy = {
  "title": "Voice AI für Autohäuser: Probefahrten, Werkstatttermine, Anfragen – rund um die Uhr automatisiert",
  "metrics": {
    "automation": "82%",
    "time": "58 Std.",
    "availability": "24/7"
  },
  "situation": {
    "profile": "Ein mittelständisches Autohaus mit 35 Mitarbeitern betreut 4 Marken und verkauft jährlich rund 800 Neu- und Gebrauchtwagen. Täglich gehen 70-90 Anrufe ein – Anfragen zu Fahrzeugen, Probefahrtwünsche, Werkstatttermine, Fragen zu Finanzierungen und Inzahlungnahmen.",
    "problem": "Die Mitarbeiter im Verkauf und Service verbringen 4-5 Stunden täglich am Telefon mit Routineanfragen. Bei Aktionswochen und vor Feiertagen vervielfacht sich das Anrufaufkommen. Außerhalb der Öffnungszeiten – abends und am Wochenende – gehen potenzielle Kunden verloren, die sich spontan für ein Fahrzeug interessieren oder einen dringenden Werkstatttermin benötigen.",
    "consequence": "Interessenten werden nicht erreicht und kaufen bei der Konkurrenz. Ein Kunde, der Sonntagabend wegen eines defekten Fahrzeugs anruft und Montagfrüh zur Arbeit muss, landet beim Wettbewerber, der bereits am Montagmorgen einen Werkstattwagen bereitstellt."
  },
  "useCases": [
    "Probefahrt-Terminvereinbarung (für Neu- und Gebrauchtwagen)",
    "Werkstatttermine buchen (Service, Inspektion, Reparatur)",
    "Fahrzeuganfragen (Verfügbarkeit, Ausstattung, Preise)",
    "Finanzierungs- und Leasinganfragen",
    "Allgemeine Fragen (Öffnungszeiten, Standort, Ansprechpartner)"
  ],
  "playbooks": [
    {
      "name": "Playbook 1: Probefahrt-Termin",
      "trigger": "Der Anrufer möchte eine Probefahrt vereinbaren",
      "tasks": [
        {
          "field": "fahrzeugmodell",
          "question": "Für welches Fahrzeugmodell interessieren Sie sich? Haben Sie bereits ein bestimmtes Modell im Auge?"
        },
        {
          "field": "kunde_name",
          "question": "Wie ist Ihr Name?"
        },
        {
          "field": "kontakt",
          "question": "Unter welcher Telefonnummer oder E-Mail können wir Sie am besten erreichen?"
        },
        {
          "field": "terminwunsch",
          "question": "Wann würde Ihnen eine Probefahrt passen? Haben Sie bestimmte Wochentage oder Uhrzeiten, die Ihnen gut passen würden?"
        },
        {
          "field": "fuehrerschein",
          "question": "Besitzen Sie einen gültigen Führerschein?"
        },
        {
          "field": "anmerkungen",
          "question": "Gibt es noch etwas, das wir für die Probefahrt wissen sollten?"
        }
      ],
      "action": "Bei verfügbarem Termin erfolgt automatische Kalenderprüfung und Bestätigungsmail. Bei Engpässen wird der Verkaufsberater informiert."
    },
    {
      "name": "Playbook 2: Werkstatttermin",
      "trigger": "Der Anrufer möchte einen Werkstatttermin vereinbaren",
      "tasks": [
        {
          "field": "kunde_name",
          "question": "Wie ist Ihr Name?"
        },
        {
          "field": "fahrzeug",
          "question": "Um welches Fahrzeug geht es? Marke, Modell und wenn möglich das Kennzeichen?"
        },
        {
          "field": "anliegen",
          "question": "Worum geht es? Ist es eine Inspektion, Reparatur oder ein anderes Anliegen?"
        },
        {
          "field": "dringlichkeit",
          "question": "Wie dringend ist es? Können Sie noch fahren oder benötigen Sie einen Abschleppdienst?"
        },
        {
          "field": "terminwunsch",
          "question": "Wann würde Ihnen ein Termin passen?"
        },
        {
          "field": "kontakt",
          "question": "Unter welcher Nummer können wir Sie erreichen?"
        }
      ],
      "action": "Bei Notfällen (Panne, nicht fahrbereites Auto) erfolgt sofortige Weiterleitung an den Werkstattleiter oder Bereitschaftsdienst."
    },
    {
      "name": "Playbook 3: Fahrzeuganfrage",
      "trigger": "Der Anrufer fragt nach einem bestimmten Fahrzeug",
      "tasks": [
        {
          "field": "fahrzeugmodell",
          "question": "Nach welchem Fahrzeugmodell suchen Sie?"
        },
        {
          "field": "neugebraucht",
          "question": "Interessieren Sie sich für einen Neuwagen oder Gebrauchtwagen?"
        },
        {
          "field": "ausstattung",
          "question": "Haben Sie bestimmte Ausstattungswünsche? Zum Beispiel Automatik, Diesel, bestimmte Farbe?"
        },
        {
          "field": "kunde_name",
          "question": "Wie ist Ihr Name?"
        },
        {
          "field": "kontakt",
          "question": "Wie können wir Sie am besten kontaktieren? Telefon oder E-Mail?"
        },
        {
          "field": "zeitrahmen",
          "question": "Bis wann möchten Sie das Fahrzeug idealerweise haben?"
        }
      ],
      "action": "Bei vorrätigem Fahrzeug wird automatisch ein Exposé per E-Mail versendet. Bei Sonderanfragen erfolgt Weiterleitung an den Verkaufsberater."
    },
    {
      "name": "Playbook 4: Finanzierungsanfrage",
      "trigger": "Der Anrufer hat Fragen zur Finanzierung oder zum Leasing",
      "tasks": [
        {
          "field": "kunde_name",
          "question": "Wie ist Ihr Name?"
        },
        {
          "field": "fahrzeugmodell",
          "question": "Für welches Fahrzeug interessieren Sie sich?"
        },
        {
          "field": "finanzierungsart",
          "question": "Bevorzugen Sie Finanzierung, Leasing oder sind Sie noch unentschieden?"
        },
        {
          "field": "kaufpreis",
          "question": "In welcher Preisklasse bewegen Sie sich ungefähr?"
        },
        {
          "field": "kontakt",
          "question": "Unter welcher Nummer oder E-Mail können wir Sie erreichen?"
        }
      ],
      "action": "Der Finanzierungsberater erhält eine Zusammenfassung und meldet sich innerhalb von 24 Stunden mit einem unverbindlichen Angebot."
    }
  ],
  "results": {
    "comparison": [
      {
        "metric": "Erreichbarkeit",
        "before": "Mo-Fr 8-18 Uhr, Sa 9-14 Uhr",
        "after": "24/7/365"
      },
      {
        "metric": "Verpasste Anrufe (außerhalb Öffnungszeiten)",
        "before": "~30/Woche",
        "after": "0"
      },
      {
        "metric": "Telefonzeit pro Tag (Team)",
        "before": "4-5 Stunden",
        "after": "55 Minuten"
      },
      {
        "metric": "Reaktionszeit Werkstatt-Notfall (nachts/Wochenende)",
        "before": "Nächster Werktag",
        "after": "Sofort"
      },
      {
        "metric": "Nachbearbeitung pro Anruf",
        "before": "4-6 Minuten",
        "after": "0 (automatisch)"
      }
    ],
    "savings": [
      {
        "area": "Anrufe annehmen & Standardfragen beantworten",
        "hours": "~35"
      },
      {
        "area": "Termine erfassen & in Kalender eintragen",
        "hours": "~12"
      },
      {
        "area": "Kundeninformationen dokumentieren",
        "hours": "~8"
      },
      {
        "area": "Rückrufe bei verpassten Anrufen",
        "hours": "~3"
      }
    ],
    "totalHours": "~58",
    "savingsNote": "Das entspricht mehr als einer vollen Arbeitswoche pro Monat",
    "quote": "Früher haben wir nach einem verkaufsoffenen Sonntag Montag und Dienstag nur telefoniert – Interessenten zurückrufen, Termine nachfassen. Jetzt sind alle Probefahrten bereits gebucht, die Werkstatttermine eingetragen, und wir können uns auf die Beratung konzentrieren. Ein Kunde, der Sonntagabend angerufen hat, hatte Montagmorgen bereits seine Probefahrt."
  },
  "automations": [
    {
      "type": "pre-call",
      "trigger": "Anruf eingehend",
      "action": "Rufnummer in DMS abgleichen, Kundenhistorie und offene Vorgänge laden"
    },
    {
      "type": "pre-call",
      "trigger": "Kunde identifiziert",
      "action": "Letzte Werkstattbesuche und Fahrzeugdaten dem Agent bereitstellen"
    },
    {
      "type": "in-call",
      "trigger": "Werkstatt-Notfall erkannt",
      "action": "Sofortige Weiterleitung an Werkstattleiter oder Pannendienst"
    },
    {
      "type": "in-call",
      "trigger": "Probefahrt gewünscht",
      "action": "Live-Kalenderabfrage, verfügbare Slots und Fahrzeuge direkt anbieten"
    },
    {
      "type": "post-call",
      "trigger": "Termin vereinbart",
      "action": "Automatischer Kalendereintrag in DMS + Bestätigungsmail an Kunde"
    },
    {
      "type": "post-call",
      "trigger": "Fahrzeuganfrage erfasst",
      "action": "Exposé per E-Mail versenden + Lead in CRM anlegen + Benachrichtigung an Verkäufer"
    }
  ],
  "workflow": {
    "title": "Beispiel: Probefahrt-Anfrage Sonntagabend",
    "steps": [
      {
        "time": "20:15",
        "desc": "Interessent ruft an, möchte Probefahrt für neuen SUV"
      },
      {
        "time": "20:16",
        "desc": "Agent erfasst alle Details über Playbook 'Probefahrt-Termin'"
      },
      {
        "time": "20:17",
        "desc": "Live-Kalenderabfrage: Agent schlägt Montag 14 Uhr oder Dienstag 10 Uhr vor"
      },
      {
        "time": "20:17",
        "desc": "Kunde wählt Montag 14 Uhr – Termin wird automatisch gebucht"
      },
      {
        "time": "20:18",
        "desc": "Webhook sendet Daten an DMS + Kalendereintrag erstellt"
      },
      {
        "time": "20:18",
        "desc": "Kunde erhält Bestätigungsmail mit Termin-Details und Anfahrt"
      },
      {
        "time": "20:19",
        "desc": "Verkaufsberater erhält Vormerkung im System für Montag 14 Uhr"
      },
      {
        "time": "14:00",
        "desc": "Kunde erscheint pünktlich zur Probefahrt – alles vorbereitet"
      }
    ],
    "contrast": "Ohne AI Agent: Kunde ruft Sonntagabend an, landet auf der Mailbox. Montag Vormittag versucht der Verkäufer zurückzurufen – Kunde ist bereits beim Wettbewerber zur Probefahrt."
  },
  "features": [
    "FAQ & Wissensdatenbank (Fahrzeugmodelle, Ausstattungen, Öffnungszeiten)",
    "4 Playbooks für strukturierte Prozesse",
    "Intelligente Anliegen-Erkennung",
    "Weiterleitung bei Notfällen und VIP-Kunden",
    "E-Mail-Zusammenfassungen nach jedem Anruf",
    "Webhook-Integration für DMS/CRM-Anbindung",
    "DSGVO-konforme EU-Datenhaltung"
  ],
  "demoPrompts": [
    "Ich würde gerne eine Probefahrt mit dem neuen Modell machen",
    "Mein Auto macht komische Geräusche, ich brauche einen Werkstatttermin",
    "Haben Sie den SUV in Blau mit Automatik vorrätig?",
    "Ich interessiere mich für eine Finanzierung"
  ],
  "agentName": "Sandra"
};
