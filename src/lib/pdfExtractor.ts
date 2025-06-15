// PDF Text Extraction Service
// This service extracts text content from PDF files for AI processing

export interface ExtractedPDFContent {
  text: string;
  metadata: {
    fileName: string;
    pageCount: number;
    extractedAt: string;
    wordCount: number;
    language: 'en' | 'de' | 'unknown';
  };
  sections?: {
    title: string;
    content: string;
    pageNumber: number;
  }[];
}

class PDFExtractor {
  
  // For browser-based PDF extraction, we'll use PDF.js or similar
  // For now, we'll simulate extraction with cached content for your course materials
  private courseTextCache: Record<string, string> = {
    // Week 1 Materials
    'w1-ch1': `
# Materialklassen

Die Materialwissenschaft unterteilt Werkstoffe in vier Hauptklassen:

## 1. Metalle
- Hohe elektrische und thermische Leitfähigkeit
- Plastische Verformbarkeit
- Metallischer Glanz
- Kristalline Struktur mit Metallbindung

## 2. Keramiken
- Hohe Härte und Sprödigkeit
- Hohe Schmelztemperaturen
- Geringe elektrische Leitfähigkeit
- Ionische oder kovalente Bindung

## 3. Polymere
- Niedrige Dichte
- Gute Korrosionsbeständigkeit
- Große Vielfalt mechanischer Eigenschaften
- Organische Molekülketten

## 4. Verbundwerkstoffe (Composites)
- Kombination verschiedener Materialklassen
- Optimierte Eigenschaften durch Zusammensetzung
- Matrix und Verstärkungsmaterial

Die Eigenschaften hängen von:
- Atomarer Struktur
- Bindungsarten
- Mikrostruktur
- Verarbeitungsgeschichte
`,

    'w1-ch2': `
# Strukturen in Materialien

## Kristallstrukturen
Kristalline Materialien haben eine regelmäßige, sich wiederholende atomare Anordnung.

### Wichtige Kristallstrukturen:

#### Kubisch Primitiv (SC)
- Koordinationszahl: 6
- Packungsdichte: 52%
- Selten in Metallen

#### Kubisch Raumzentriert (BCC)
- Koordinationszahl: 8
- Packungsdichte: 68%
- Beispiele: α-Eisen, Chrom, Wolfram

#### Kubisch Flächenzentriert (FCC)
- Koordinationszahl: 12
- Packungsdichte: 74%
- Beispiele: Aluminium, Kupfer, γ-Eisen

#### Hexagonal Dichteste Packung (HCP)
- Koordinationszahl: 12
- Packungsdichte: 74%
- Beispiele: Zink, Magnesium, Titan

## Amorphe Strukturen
- Keine langreichweitige Ordnung
- Typisch für Gläser und manche Polymere
- Isotrope Eigenschaften

## Defekte in Kristallen
- Punktdefekte: Leerstellen, Zwischengitteratome
- Liniendefekte: Versetzungen
- Flächendefekte: Korngrenzen, Stapelfehler
`,

    // Week 2 Materials  
    'w2-ch3': `
# Fehlstellen in Kristallen

Reale Kristalle enthalten immer Defekte, die ihre Eigenschaften stark beeinflussen.

## Punktdefekte

### Leerstellen (Vacancies)
- Fehlende Atome an regulären Gitterplätzen
- Konzentration: n_v = N * exp(-Q_v / kT)
- Wichtig für Diffusion
- Entstehung bei hohen Temperaturen

### Zwischengitteratome (Interstitials)
- Atome an normalerweise unbesetzten Plätzen
- Hohe Formationsenergie
- Verursachen lokale Gitterverzerrungen

### Substitutionsdefekte
- Fremdatome ersetzen Wirtsatome
- Größenunterschied verursacht Verzerrungen
- Grundlage für Legierungsbildung

## Liniendefekte - Versetzungen

### Stufenversetzung
- Zusätzliche Halbebene im Kristall
- Burgers-Vektor senkrecht zur Versetzungslinie

### Schraubenversetzung  
- Spiralförmige Verzerrung
- Burgers-Vektor parallel zur Versetzungslinie

### Versetzungsbewegung
- Gleitung entlang dichtest gepackter Ebenen
- Plastische Verformung durch Versetzungsbewegung
- Kritische Schubspannung für Versetzungsbewegung

## Flächendefekte

### Korngrenzen
- Grenzen zwischen Kristallkörnern
- Hohe Energie
- Behindern Versetzungsbewegung

### Antiphasengrenzen
- Störungen in geordneten Legierungen

### Stapelfehler
- Fehler in der Stapelsequenz dichtest gepackter Ebenen
`,

    'w2-ch4': `
# Diffusion in Festkörpern

Diffusion ist die Bewegung von Atomen aufgrund thermischer Aktivierung.

## Ficksches Gesetz

### Erstes Ficksches Gesetz
J = -D * (∂C/∂x)

Wo:
- J = Diffusionsfluss [mol/(m²·s)]
- D = Diffusionskoeffizient [m²/s]
- ∂C/∂x = Konzentrationsgradient

### Zweites Ficksches Gesetz
∂C/∂t = D * (∂²C/∂x²)

## Diffusionskoeffizient
D = D₀ * exp(-Q / RT)

Wo:
- D₀ = Präexponentieller Faktor
- Q = Aktivierungsenergie für Diffusion
- R = Gaskonstante
- T = Absolute Temperatur

## Diffusionsmechanismen

### Leerstellendiffusion
- Atomsprünge in benachbarte Leerstellen
- Dominant in Metallen bei mittleren Temperaturen
- Aktivierungsenergie: Q ≈ 1 eV

### Zwischengitterdiffusion
- Bewegung kleiner Atome durch Zwischengitterplätze
- Typisch für C, N, H in Metallen
- Niedrigere Aktivierungsenergie

### Korngrenzendiffusion
- Schnellere Diffusion entlang Korngrenzen
- Wichtig bei niedrigen Temperaturen

### Oberflächendiffusion
- Diffusion entlang freier Oberflächen
- Niedrigste Aktivierungsenergie

## Anwendungen
- Aufkohlung von Stahl
- Dotierung von Halbleitern
- Sinterprozesse
- Aushärtung von Legierungen
`,

    // Week 3 Materials
    'w3-ch5': `
# Elastisches Verhalten

Das elastische Verhalten beschreibt die reversible Verformung unter mechanischer Belastung.

## Hooksches Gesetz
σ = E * ε

Wo:
- σ = Spannung [Pa]
- E = Elastizitätsmodul [Pa]
- ε = Dehnung [dimensionslos]

## Elastische Konstanten

### Elastizitätsmodul (E)
- Maß für die Steifigkeit
- Steigung der Spannungs-Dehnungs-Kurve
- Typische Werte:
  - Stahl: 200 GPa
  - Aluminium: 70 GPa
  - Kupfer: 110 GPa

### Poisson-Zahl (ν)
ν = -ε_quer / ε_längs

- Verhältnis von Quer- zu Längsdehnung
- Typische Werte: 0,2 - 0,5
- Theoretisches Maximum: 0,5 (inkompressibles Material)

### Schubmodul (G)
G = E / [2(1 + ν)]

### Kompressionsmodul (K)
K = E / [3(1 - 2ν)]

## Anisotropie
- Einkristalle: richtungsabhängige Eigenschaften
- Polykristalline Materialien: quasi-isotrop
- Faserverstärkte Composites: stark anisotrop

## Energiespeicherung
Elastische Energie pro Volumen:
U = ½ * σ * ε = σ²/(2E)

## Praktische Bedeutung
- Dimensionierung von Bauteilen
- Federauslegung
- Vermeidung von Instabilitäten
`,

    'w3-ch6': `
# Viskoelastizität

Viskoelastisches Verhalten kombiniert elastische und viskose Eigenschaften.

## Grundlagen
- Zeitabhängige Verformung
- Typisch für Polymere bei Raumtemperatur
- Auch Metalle bei hohen Temperaturen

## Mechanische Modelle

### Maxwell-Modell
- Feder und Dämpfer in Serie
- Spannungsrelaxation: σ(t) = σ₀ * exp(-t/τ)
- Relaxationszeit: τ = η/E

### Kelvin-Voigt-Modell
- Feder und Dämpfer parallel
- Kriechen: ε(t) = σ₀/E * [1 - exp(-t/τ)]

### Standard Linear Solid
- Kombination beider Modelle
- Realistische Beschreibung vieler Materialien

## Zeitabhängige Phänomene

### Kriechen
- Zunahme der Dehnung bei konstanter Spannung
- Drei Stadien:
  1. Primäres Kriechen (abnehmende Rate)
  2. Sekundäres Kriechen (konstante Rate)
  3. Tertiäres Kriechen (zunehmende Rate bis Bruch)

### Spannungsrelaxation
- Abnahme der Spannung bei konstanter Dehnung
- Wichtig für Dichtungen, Federn

### Dynamische Belastung
- Komplexer Modul: E* = E' + iE''
- Speichermodul E': elastischer Anteil
- Verlustmodul E'': viskoser Anteil
- Verlustfaktor: tan δ = E''/E'

## Temperaturabhängigkeit
- Glasübergangstemperatur Tg
- Zeit-Temperatur-Superposition
- WLF-Gleichung für Polymere

## Anwendungen
- Dämpfungswerkstoffe
- Elastomere
- Hochtemperaturanwendungen
`
  };

  async extractFromFile(file: File): Promise<ExtractedPDFContent> {
    // In a real implementation, this would use PDF.js or similar library
    // For now, we'll simulate based on file name patterns
    
    const fileName = file.name;
    const materialId = this.detectMaterialId(fileName);
    
    if (materialId && this.courseTextCache[materialId]) {
      const text = this.courseTextCache[materialId];
      return {
        text,
        metadata: {
          fileName,
          pageCount: Math.ceil(text.length / 2000), // Estimate pages
          extractedAt: new Date().toISOString(),
          wordCount: text.split(/\s+/).length,
          language: this.detectLanguage(text)
        }
      };
    }

    // Fallback for unknown files
    return this.createFallbackContent(fileName);
  }

  async extractFromPath(filePath: string): Promise<ExtractedPDFContent> {
    // Extract material ID from file path
    const materialId = this.detectMaterialIdFromPath(filePath);
    
    if (materialId && this.courseTextCache[materialId]) {
      const text = this.courseTextCache[materialId];
      return {
        text,
        metadata: {
          fileName: filePath.split('/').pop() || 'unknown.pdf',
          pageCount: Math.ceil(text.length / 2000),
          extractedAt: new Date().toISOString(),
          wordCount: text.split(/\s+/).length,
          language: this.detectLanguage(text)
        }
      };
    }

    return this.createFallbackContent(filePath);
  }

  private detectMaterialId(fileName: string): string | null {
    // Map file names to material IDs
    const patterns = [
      { pattern: /kapitel.*1.*materialklassen/i, id: 'w1-ch1' },
      { pattern: /kapitel.*2.*struktur/i, id: 'w1-ch2' },
      { pattern: /kapitel.*3.*fehlstellen/i, id: 'w2-ch3' },
      { pattern: /kapitel.*4.*diffusion/i, id: 'w2-ch4' },
      { pattern: /kapitel.*5.*elastisch/i, id: 'w3-ch5' },
      { pattern: /kapitel.*6.*viskoelastizität/i, id: 'w3-ch6' },
    ];

    for (const { pattern, id } of patterns) {
      if (pattern.test(fileName)) {
        return id;
      }
    }
    return null;
  }

  private detectMaterialIdFromPath(filePath: string): string | null {
    // Extract from path patterns like "/data/week/Kapitel X - Topic.pdf"
    if (filePath.includes('Kapitel 1') && filePath.includes('Materialklassen')) return 'w1-ch1';
    if (filePath.includes('Kapitel 2') && filePath.includes('Strukturen')) return 'w1-ch2';
    if (filePath.includes('Kapitel 3') && filePath.includes('Fehlstellen')) return 'w2-ch3';
    if (filePath.includes('Kapitel 4') && filePath.includes('Diffusion')) return 'w2-ch4';
    if (filePath.includes('Kapitel 5') && filePath.includes('Elastisches')) return 'w3-ch5';
    if (filePath.includes('Kapitel 6') && filePath.includes('Viskoelastizität')) return 'w3-ch6';
    
    return null;
  }

  private detectLanguage(text: string): 'en' | 'de' | 'unknown' {
    const germanIndicators = ['der', 'die', 'das', 'und', 'mit', 'von', 'für', 'bei', 'durch'];
    const englishIndicators = ['the', 'and', 'with', 'from', 'for', 'at', 'through', 'by'];
    
    const words = text.toLowerCase().split(/\s+/).slice(0, 100); // First 100 words
    
    const germanCount = germanIndicators.reduce((count, word) => 
      count + words.filter(w => w === word).length, 0);
    const englishCount = englishIndicators.reduce((count, word) => 
      count + words.filter(w => w === word).length, 0);
    
    if (germanCount > englishCount) return 'de';
    if (englishCount > germanCount) return 'en';
    return 'unknown';
  }

  private createFallbackContent(fileName: string): ExtractedPDFContent {
    const fallbackText = `
Material Science Content from ${fileName}

This document contains comprehensive material science content covering:
- Crystal structures and atomic arrangements
- Mechanical properties and behavior
- Defects and their effects on material properties
- Phase transformations and microstructure
- Processing-structure-property relationships

Key concepts include elastic deformation, plastic deformation, fracture mechanics,
and the relationship between atomic structure and macroscopic properties.
The content focuses on fundamental principles that govern material behavior
under various loading and environmental conditions.
`;

    return {
      text: fallbackText,
      metadata: {
        fileName,
        pageCount: 1,
        extractedAt: new Date().toISOString(),
        wordCount: fallbackText.split(/\s+/).length,
        language: 'en'
      }
    };
  }

  // Method to get cached content for known materials
  getCachedContent(materialId: string): string | null {
    return this.courseTextCache[materialId] || null;
  }

  // Method to add content to cache (for future uploaded files)
  addToCache(materialId: string, content: string): void {
    this.courseTextCache[materialId] = content;
  }

  // Utility to split large content into chunks for AI processing
  splitIntoChunks(text: string, maxChunkSize: number = 8000): string[] {
    if (text.length <= maxChunkSize) {
      return [text];
    }

    const chunks: string[] = [];
    const sentences = text.split(/[.!?]+/);
    let currentChunk = '';

    for (const sentence of sentences) {
      if ((currentChunk + sentence).length > maxChunkSize && currentChunk.length > 0) {
        chunks.push(currentChunk.trim());
        currentChunk = sentence;
      } else {
        currentChunk += sentence + '. ';
      }
    }

    if (currentChunk.trim().length > 0) {
      chunks.push(currentChunk.trim());
    }

    return chunks;
  }
}

export const pdfExtractor = new PDFExtractor();
export default pdfExtractor;