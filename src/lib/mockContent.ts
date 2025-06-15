import { CourseMaterial } from './courseData';

export interface MockQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface MockAnkiCard {
  id: string;
  front: string;
  back: string;
}

export interface MockExamQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  points: number;
}

// Material Science specific content
export const mockContentByMaterial: Record<string, {
  quizQuestions: MockQuizQuestion[];
  ankiCards: MockAnkiCard[];
  examQuestions: MockExamQuestion[];
}> = {
  // Week 1 - Introduction & Material Classes
  'w1-ch1': {
    quizQuestions: [
      {
        id: 'q1-1',
        question: 'Which of the following is NOT a primary class of engineering materials?',
        options: ['Metals', 'Ceramics', 'Composites', 'Alloys'],
        correctAnswer: 3,
        explanation: 'Alloys are a subclass of metals, not a primary material class. The four main classes are metals, ceramics, polymers, and composites.'
      },
      {
        id: 'q1-2',
        question: 'What is the defining characteristic of crystalline materials?',
        options: ['High strength', 'Ordered atomic arrangement', 'Low density', 'High conductivity'],
        correctAnswer: 1,
        explanation: 'Crystalline materials have atoms arranged in a regular, repeating pattern or lattice structure.'
      }
    ],
    ankiCards: [
      { id: 'a1-1', front: 'Materialklassen', back: 'Metalle, Keramiken, Polymere, und Verbundwerkstoffe - die vier Hauptklassen von Ingenieurwerkstoffen' },
      { id: 'a1-2', front: 'Kristalline Struktur', back: 'Regelmäßige, sich wiederholende Anordnung von Atomen in einem Gitter' },
      { id: 'a1-3', front: 'Amorphe Materialien', back: 'Materialien ohne langreichweitige Ordnung in der Atomstruktur (z.B. Gläser)' }
    ],
    examQuestions: [
      {
        id: 'e1-1',
        question: 'Explain the differences between crystalline and amorphous materials, giving examples of each.',
        options: ['Essay question - no multiple choice'],
        correctAnswer: 0,
        points: 10
      }
    ]
  },

  'w1-ch2': {
    quizQuestions: [
      {
        id: 'q2-1',
        question: 'What is the coordination number in a face-centered cubic (FCC) structure?',
        options: ['6', '8', '12', '14'],
        correctAnswer: 2,
        explanation: 'In FCC structure, each atom is surrounded by 12 nearest neighbors, giving a coordination number of 12.'
      },
      {
        id: 'q2-2',
        question: 'Which crystal structure has the highest atomic packing factor?',
        options: ['Simple cubic', 'Body-centered cubic', 'Face-centered cubic', 'Hexagonal close-packed'],
        correctAnswer: 2,
        explanation: 'Both FCC and HCP have the highest packing factor of 0.74, but FCC is listed here.'
      }
    ],
    ankiCards: [
      { id: 'a2-1', front: 'FCC Koordinationszahl', back: '12 - jedes Atom hat 12 nächste Nachbarn in der kubisch-flächenzentrierten Struktur' },
      { id: 'a2-2', front: 'Packungsdichte', back: 'Anteil des von Atomen eingenommenen Volumens am Gesamtvolumen' },
      { id: 'a2-3', front: 'Einheitszelle', back: 'Kleinste Wiederholungseinheit eines Kristallgitters' }
    ],
    examQuestions: [
      {
        id: 'e2-1',
        question: 'Calculate the atomic packing factor for a body-centered cubic structure.',
        options: ['Essay/calculation question'],
        correctAnswer: 0,
        points: 15
      }
    ]
  },

  // Week 2 - Defects & Diffusion
  'w2-ch3': {
    quizQuestions: [
      {
        id: 'q3-1',
        question: 'What type of point defect occurs when an atom is missing from its lattice site?',
        options: ['Interstitial', 'Vacancy', 'Substitutional', 'Dislocation'],
        correctAnswer: 1,
        explanation: 'A vacancy is a point defect where an atom is missing from its normal lattice position.'
      },
      {
        id: 'q3-2',
        question: 'Which factor most significantly affects the concentration of vacancies?',
        options: ['Pressure', 'Temperature', 'Electric field', 'Magnetic field'],
        correctAnswer: 1,
        explanation: 'Vacancy concentration increases exponentially with temperature according to the Arrhenius equation.'
      }
    ],
    ankiCards: [
      { id: 'a3-1', front: 'Leerstelle (Vacancy)', back: 'Punktdefekt, bei dem ein Atom an seinem normalen Gitterplatz fehlt' },
      { id: 'a3-2', front: 'Zwischengitterplatz', back: 'Punktdefekt, bei dem ein Atom an einer Position sitzt, die normalerweise leer ist' },
      { id: 'a3-3', front: 'Substitutionsdefekt', back: 'Fremdatom ersetzt ein Wirtsatom an einem normalen Gitterplatz' }
    ],
    examQuestions: [
      {
        id: 'e3-1',
        question: 'Derive the relationship between vacancy concentration and temperature.',
        options: ['Essay/derivation question'],
        correctAnswer: 0,
        points: 12
      }
    ]
  },

  'w2-ch4': {
    quizQuestions: [
      {
        id: 'q4-1',
        question: 'What is the primary driving force for diffusion?',
        options: ['Temperature gradient', 'Concentration gradient', 'Pressure gradient', 'Electric field'],
        correctAnswer: 1,
        explanation: 'Diffusion is driven by concentration gradients, following Fick\'s first law.'
      },
      {
        id: 'q4-2',
        question: 'Which diffusion mechanism is dominant in metals at moderate temperatures?',
        options: ['Interstitial', 'Vacancy', 'Grain boundary', 'Surface'],
        correctAnswer: 1,
        explanation: 'Vacancy diffusion is the primary mechanism in metals at moderate temperatures.'
      }
    ],
    ankiCards: [
      { id: 'a4-1', front: 'Ficksches Gesetz', back: 'J = -D(dC/dx) - beschreibt den Diffusionsfluss proportional zum Konzentrationsgradienten' },
      { id: 'a4-2', front: 'Diffusionskoeffizient', back: 'D = D₀ exp(-Q/RT) - temperaturabhängiger Parameter für Diffusionsgeschwindigkeit' },
      { id: 'a4-3', front: 'Aktivierungsenergie', back: 'Energiebarriere, die überwunden werden muss für Atomsprünge bei der Diffusion' }
    ],
    examQuestions: [
      {
        id: 'e4-1',
        question: 'Calculate the diffusion distance for carbon in steel at 900°C after 2 hours.',
        options: ['Calculation question'],
        correctAnswer: 0,
        points: 15
      }
    ]
  },

  // Week 3 - Elastic Behavior & Viscoelasticity
  'w3-ch5': {
    quizQuestions: [
      {
        id: 'q5-1',
        question: 'What does Young\'s modulus represent?',
        options: ['Yield strength', 'Ultimate strength', 'Stiffness', 'Hardness'],
        correctAnswer: 2,
        explanation: 'Young\'s modulus (E) is the measure of material stiffness, relating stress to strain in the elastic region.'
      },
      {
        id: 'q5-2',
        question: 'For a material with Poisson\'s ratio of 0.3, what is the shear modulus in terms of Young\'s modulus?',
        options: ['E/2.6', 'E/3.0', 'E/2.0', 'E/1.5'],
        correctAnswer: 0,
        explanation: 'G = E/[2(1+ν)] = E/[2(1+0.3)] = E/2.6'
      }
    ],
    ankiCards: [
      { id: 'a5-1', front: 'Elastizitätsmodul (E)', back: 'Steifigkeit des Materials - Verhältnis von Spannung zu Dehnung im elastischen Bereich' },
      { id: 'a5-2', front: 'Poisson-Zahl (ν)', back: 'Verhältnis von Querdehnung zu Längsdehnung bei einachsiger Belastung' },
      { id: 'a5-3', front: 'Schubmodul (G)', back: 'Widerstand gegen Scherverformung - G = E/[2(1+ν)]' }
    ],
    examQuestions: [
      {
        id: 'e5-1',
        question: 'A steel rod with E=200 GPa is subjected to 500 MPa stress. Calculate the strain and elongation for a 2m rod.',
        options: ['Calculation question'],
        correctAnswer: 0,
        points: 10
      }
    ]
  },

  'w3-ch6': {
    quizQuestions: [
      {
        id: 'q6-1',
        question: 'What characterizes viscoelastic behavior?',
        options: ['Time-independent deformation', 'Only elastic response', 'Time-dependent deformation', 'Only plastic response'],
        correctAnswer: 2,
        explanation: 'Viscoelastic materials exhibit time-dependent deformation, combining elastic and viscous responses.'
      },
      {
        id: 'q6-2',
        question: 'In a stress relaxation test, what happens to stress over time?',
        options: ['Increases', 'Decreases', 'Remains constant', 'Oscillates'],
        correctAnswer: 1,
        explanation: 'In stress relaxation, stress decreases over time while strain is held constant.'
      }
    ],
    ankiCards: [
      { id: 'a6-1', front: 'Viskoelastizität', back: 'Zeitabhängiges Verformungsverhalten - Kombination aus elastischer und viskoser Antwort' },
      { id: 'a6-2', front: 'Spannungsrelaxation', back: 'Abnahme der Spannung bei konstanter Dehnung über die Zeit' },
      { id: 'a6-3', front: 'Kriechen', back: 'Zunahme der Verformung bei konstanter Spannung über die Zeit' }
    ],
    examQuestions: [
      {
        id: 'e6-1',
        question: 'Explain the Maxwell and Kelvin-Voigt models for viscoelastic behavior.',
        options: ['Essay question'],
        correctAnswer: 0,
        points: 15
      }
    ]
  },

  // Week 4 - Mechanical Properties
  'w4-ch7': {
    quizQuestions: [
      {
        id: 'q7-1',
        question: 'What is the yield strength?',
        options: ['Maximum stress before failure', 'Stress at 0.2% plastic strain', 'Elastic limit', 'Ultimate tensile strength'],
        correctAnswer: 1,
        explanation: 'Yield strength is conventionally defined as the stress at 0.2% plastic strain (offset method).'
      },
      {
        id: 'q7-2',
        question: 'Which mechanism is primarily responsible for plastic deformation in metals?',
        options: ['Vacancy motion', 'Dislocation motion', 'Grain boundary sliding', 'Atomic diffusion'],
        correctAnswer: 1,
        explanation: 'Plastic deformation in metals occurs primarily through dislocation motion and slip.'
      }
    ],
    ankiCards: [
      { id: 'a7-1', front: 'Streckgrenze', back: 'Spannung bei 0,2% plastischer Dehnung - Übergang von elastischer zu plastischer Verformung' },
      { id: 'a7-2', front: 'Versetzung', back: 'Liniendefekt im Kristallgitter - Hauptmechanismus für plastische Verformung in Metallen' },
      { id: 'a7-3', front: 'Gleitung', back: 'Bewegung von Versetzungen entlang bestimmter Kristallebenen und -richtungen' }
    ],
    examQuestions: [
      {
        id: 'e7-1',
        question: 'Describe the relationship between grain size and yield strength (Hall-Petch relation).',
        options: ['Essay question'],
        correctAnswer: 0,
        points: 12
      }
    ]
  },

  'w4-ch8': {
    quizQuestions: [
      {
        id: 'q8-1',
        question: 'How do polymer chains affect mechanical properties?',
        options: ['No effect', 'Only molecular weight matters', 'Chain length and crosslinking affect properties', 'Only temperature matters'],
        correctAnswer: 2,
        explanation: 'Both chain length (molecular weight) and degree of crosslinking significantly affect polymer mechanical properties.'
      },
      {
        id: 'q8-2',
        question: 'What is the glass transition temperature?',
        options: ['Melting point', 'Temperature where polymer becomes brittle', 'Temperature where chain mobility changes', 'Decomposition temperature'],
        correctAnswer: 2,
        explanation: 'Glass transition temperature (Tg) is where polymer chain mobility changes dramatically, affecting mechanical properties.'
      }
    ],
    ankiCards: [
      { id: 'a8-1', front: 'Glasübergangstemperatur (Tg)', back: 'Temperatur bei der sich die Kettenbeweglichkeit in Polymeren dramatisch ändert' },
      { id: 'a8-2', front: 'Vernetzung', back: 'Chemische Bindungen zwischen Polymerketten - erhöht Steifigkeit und Festigkeit' },
      { id: 'a8-3', front: 'Molekulargewicht', back: 'Größe der Polymerketten - beeinflusst mechanische Eigenschaften stark' }
    ],
    examQuestions: [
      {
        id: 'e8-1',
        question: 'Compare the mechanical behavior of thermoplastics and thermosets.',
        options: ['Essay question'],
        correctAnswer: 0,
        points: 15
      }
    ]
  },

  // Week 5 - Material Failure & Phase Diagrams  
  'w5-ch9': {
    quizQuestions: [
      {
        id: 'q9-1',
        question: 'What characterizes brittle fracture?',
        options: ['High energy absorption', 'Significant plastic deformation', 'Little plastic deformation', 'High ductility'],
        correctAnswer: 2,
        explanation: 'Brittle fracture occurs with little or no plastic deformation and low energy absorption.'
      },
      {
        id: 'q9-2',
        question: 'What does the stress intensity factor (K) represent?',
        options: ['Crack length', 'Applied stress', 'Crack tip stress field intensity', 'Material toughness'],
        correctAnswer: 2,
        explanation: 'The stress intensity factor K characterizes the intensity of the stress field at a crack tip.'
      }
    ],
    ankiCards: [
      { id: 'a9-1', front: 'Spröder Bruch', back: 'Versagen mit geringer plastischer Verformung und niedriger Energieaufnahme' },
      { id: 'a9-2', front: 'Spannungsintensitätsfaktor', back: 'K - charakterisiert die Intensität des Spannungsfeldes an einer Rissspitze' },
      { id: 'a9-3', front: 'Bruchzähigkeit', back: 'Widerstand eines Materials gegen Rissausbreitung' }
    ],
    examQuestions: [
      {
        id: 'e9-1',
        question: 'Calculate the critical stress for crack propagation in a material with KIc = 50 MPa√m and crack length 2mm.',
        options: ['Calculation question'],
        correctAnswer: 0,
        points: 12
      }
    ]
  },

  'w5-ch10': {
    quizQuestions: [
      {
        id: 'q10-1',
        question: 'What information does a phase diagram provide?',
        options: ['Material properties', 'Phases present at given T and composition', 'Manufacturing processes', 'Cost information'],
        correctAnswer: 1,
        explanation: 'Phase diagrams show which phases are stable at different temperatures and compositions.'
      },
      {
        id: 'q10-2',
        question: 'In the Fe-C diagram, what is the eutectoid composition?',
        options: ['0.02% C', '0.77% C', '2.14% C', '4.3% C'],
        correctAnswer: 1,
        explanation: 'The eutectoid composition in the Fe-C system is 0.77% carbon, where austenite transforms to pearlite.'
      }
    ],
    ankiCards: [
      { id: 'a10-1', front: 'Phasendiagramm', back: 'Zeigt welche Phasen bei verschiedenen Temperaturen und Zusammensetzungen stabil sind' },
      { id: 'a10-2', front: 'Eutektoid', back: 'Umwandlung einer festen Phase in zwei andere feste Phasen bei konstanter Temperatur' },
      { id: 'a10-3', front: 'Perlit', back: 'Eutektoide Mikrostruktur aus alternierenden Lamellen von Ferrit und Zementit' }
    ],
    examQuestions: [
      {
        id: 'e10-1',
        question: 'Using the Fe-C diagram, determine the phases and their amounts for 0.5% C steel at 700°C.',
        options: ['Calculation with phase diagram'],
        correctAnswer: 0,
        points: 15
      }
    ]
  },

  // Week 6 - Phase Transformations & Ceramics
  'w6-ch11': {
    quizQuestions: [
      {
        id: 'q11-1',
        question: 'What is the purpose of quenching in heat treatment?',
        options: ['Increase ductility', 'Prevent phase transformation', 'Relieve stress', 'Increase grain size'],
        correctAnswer: 1,
        explanation: 'Quenching rapidly cools the material to prevent equilibrium phase transformations, often forming metastable phases.'
      },
      {
        id: 'q11-2',
        question: 'What microstructure forms when austenite is rapidly cooled in steel?',
        options: ['Pearlite', 'Ferrite', 'Martensite', 'Cementite'],
        correctAnswer: 2,
        explanation: 'Rapid cooling (quenching) of austenite forms martensite, a hard, metastable phase.'
      }
    ],
    ankiCards: [
      { id: 'a11-1', front: 'Abschrecken', back: 'Schnelle Abkühlung zur Verhinderung von Gleichgewichts-Phasenumwandlungen' },
      { id: 'a11-2', front: 'Martensit', back: 'Harte, metastabile Phase die durch schnelle Abkühlung von Austenit entsteht' },
      { id: 'a11-3', front: 'Anlassen', back: 'Wärmebehandlung zur Reduzierung von Spannungen und Verbesserung der Zähigkeit' }
    ],
    examQuestions: [
      {
        id: 'e11-1',
        question: 'Explain the TTT diagram and its use in heat treatment design.',
        options: ['Essay question'],
        correctAnswer: 0,
        points: 15
      }
    ]
  },

  'w6-ch12': {
    quizQuestions: [
      {
        id: 'q12-1',
        question: 'What is the primary bonding type in ceramic materials?',
        options: ['Metallic', 'Covalent and ionic', 'Van der Waals', 'Hydrogen'],
        correctAnswer: 1,
        explanation: 'Ceramics are primarily held together by covalent and/or ionic bonds, making them hard and brittle.'
      },
      {
        id: 'q12-2',
        question: 'Why are ceramics generally brittle?',
        options: ['Low melting point', 'High density', 'Difficulty in dislocation motion', 'Large grain size'],
        correctAnswer: 2,
        explanation: 'The strong directional bonding in ceramics makes dislocation motion difficult, leading to brittleness.'
      }
    ],
    ankiCards: [
      { id: 'a12-1', front: 'Keramische Bindung', back: 'Überwiegend kovalente und ionische Bindungen - führt zu Härte und Sprödigkeit' },
      { id: 'a12-2', front: 'Spröde Keramiken', back: 'Schwierige Versetzungsbewegung durch gerichtete Bindungen führt zu sprödem Verhalten' },
      { id: 'a12-3', front: 'Glas', back: 'Amorphe keramische Struktur ohne langreichweitige Ordnung' }
    ],
    examQuestions: [
      {
        id: 'e12-1',
        question: 'Compare the crystal structures and properties of alumina and silicon carbide.',
        options: ['Essay question'],
        correctAnswer: 0,
        points: 12
      }
    ]
  }
};

// Fallback content for uploaded materials or unrecognized materials
export const defaultMockContent = {
  quizQuestions: [
    {
      id: 'default-1',
      question: 'Based on the uploaded material, which concept is most fundamental?',
      options: ['Concept A', 'Concept B', 'Concept C', 'Concept D'],
      correctAnswer: 0,
      explanation: 'This question would be generated based on your uploaded material content.'
    },
    {
      id: 'default-2',
      question: 'What is the key principle discussed in this material?',
      options: ['Principle 1', 'Principle 2', 'Principle 3', 'Principle 4'],
      correctAnswer: 1,
      explanation: 'This explanation would be derived from your specific material.'
    }
  ],
  ankiCards: [
    { id: 'default-a1', front: 'Key Term from Material', back: 'Definition extracted from your uploaded content' },
    { id: 'default-a2', front: 'Important Concept', back: 'Explanation based on your material' },
    { id: 'default-a3', front: 'Critical Formula', back: 'Mathematical relationship from your content' }
  ],
  examQuestions: [
    {
      id: 'default-e1',
      question: 'Comprehensive question based on your uploaded material.',
      options: ['Essay/calculation based on your content'],
      correctAnswer: 0,
      points: 15
    }
  ]
};

export function getMockContentForMaterial(materialId: string) {
  return mockContentByMaterial[materialId] || defaultMockContent;
}