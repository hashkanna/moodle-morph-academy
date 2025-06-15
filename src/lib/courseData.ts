export interface CourseMaterial {
  id: string;
  title: string;
  type: 'chapter' | 'exercise' | 'solution' | 'control-questions';
  week: string;
  filePath: string;
  language: 'de' | 'en';
  chapter?: number;
}

export interface WeeklyMaterials {
  weekId: string;
  weekName: string;
  dateRange: string;
  materials: CourseMaterial[];
}

// Pre-loaded course materials from the data folder
export const courseWeeks: WeeklyMaterials[] = [
  {
    weekId: 'week1',
    weekName: 'Introduction & Material Classes',
    dateRange: '23. April - 29. April',
    materials: [
      { id: 'w1-ch0', title: 'Kapitel 0 - Organisatorisches', type: 'chapter', week: 'week1', filePath: '/data/23. April - 29. April/Kapitel 0 - Organisatorisches.pdf', language: 'de' },
      { id: 'w1-ch1', title: 'Kapitel 1 - Materialklassen', type: 'chapter', week: 'week1', filePath: '/data/23. April - 29. April/Kapitel 1 - Materialklassen.pdf', language: 'de', chapter: 1 },
      { id: 'w1-ch2', title: 'Kapitel 2 - Strukturen', type: 'chapter', week: 'week1', filePath: '/data/23. April - 29. April/Kapitel 2 - Strukturen.pdf', language: 'de', chapter: 2 },
      { id: 'w1-cq1', title: 'Kontrollfragen 01', type: 'control-questions', week: 'week1', filePath: '/data/23. April - 29. April/Kontrollfragen 01.pdf', language: 'de' },
      { id: 'w1-ex1-de', title: 'Materialwissenschaften Übungsblatt 1', type: 'exercise', week: 'week1', filePath: '/data/23. April - 29. April/Materialwissenschaften Übungsblatt 1 DE.pdf', language: 'de' },
      { id: 'w1-ex1-en', title: 'Material Science Exercise Sheet 1', type: 'exercise', week: 'week1', filePath: '/data/23. April - 29. April/Material Science Exercise Sheet 1 ENG.pdf', language: 'en' },
      { id: 'w1-sol1-de', title: 'Lösung MaWi Übung 01', type: 'solution', week: 'week1', filePath: '/data/23. April - 29. April/Lösung MaWi Übung 01.pdf', language: 'de' },
      { id: 'w1-sol1-en', title: 'Solution Ma Sci Ex 01', type: 'solution', week: 'week1', filePath: '/data/23. April - 29. April/Solution Ma Sci Ex 01.pdf', language: 'en' }
    ]
  },
  {
    weekId: 'week2',
    weekName: 'Defects & Diffusion',
    dateRange: '30. April - 6. Mai',
    materials: [
      { id: 'w2-ch3', title: 'Kapitel 3 - Fehlstellen', type: 'chapter', week: 'week2', filePath: '/data/30. April - 6. Mai/Kapitel 3 - Fehlstellen.pdf', language: 'de', chapter: 3 },
      { id: 'w2-ch4', title: 'Kapitel 4 - Diffusion', type: 'chapter', week: 'week2', filePath: '/data/30. April - 6. Mai/Kapitel 4 - Diffusion.pdf', language: 'de', chapter: 4 },
      { id: 'w2-cq2', title: 'Kontrollfragen 02', type: 'control-questions', week: 'week2', filePath: '/data/30. April - 6. Mai/Kontrollfragen 02.pdf', language: 'de' },
      { id: 'w2-cq3', title: 'Kontrollfragen 03', type: 'control-questions', week: 'week2', filePath: '/data/30. April - 6. Mai/Kontrollfragen 03.pdf', language: 'de' },
      { id: 'w2-ex2-de', title: 'Materialwissenschaften Übungsblatt 2', type: 'exercise', week: 'week2', filePath: '/data/30. April - 6. Mai/Materialwissenschaften Übungsblatt 2 DE.pdf', language: 'de' },
      { id: 'w2-ex2-en', title: 'Material Science Exercise Sheet 2', type: 'exercise', week: 'week2', filePath: '/data/30. April - 6. Mai/Material Science Exercise Sheet 2 ENG.pdf', language: 'en' },
      { id: 'w2-sol2', title: 'Lösung MaWi Übung 02', type: 'solution', week: 'week2', filePath: '/data/30. April - 6. Mai/Lösung MaWi Übung 02.pdf', language: 'de' }
    ]
  },
  {
    weekId: 'week3',
    weekName: 'Elastic Behavior & Viscoelasticity',
    dateRange: '7. Mai - 13. Mai',
    materials: [
      { id: 'w3-ch5', title: 'Kapitel 5 - Elastisches Verhalten', type: 'chapter', week: 'week3', filePath: '/data/7. Mai - 13. Mai/Kapitel 5 - Elastisches Verhalten.pdf', language: 'de', chapter: 5 },
      { id: 'w3-ch6', title: 'Kapitel 6 - Viskoelastizität', type: 'chapter', week: 'week3', filePath: '/data/7. Mai - 13. Mai/Kapitel 6 - Viskoelastizität.pdf', language: 'de', chapter: 6 },
      { id: 'w3-cq4', title: 'Kontrollfragen 04', type: 'control-questions', week: 'week3', filePath: '/data/7. Mai - 13. Mai/Kontrollfragen 04.pdf', language: 'de' },
      { id: 'w3-cq5', title: 'Kontrollfragen 05', type: 'control-questions', week: 'week3', filePath: '/data/7. Mai - 13. Mai/Kontrollfragen 05.pdf', language: 'de' },
      { id: 'w3-ex3-de', title: 'Materialwissenschaften Übungsblatt 3', type: 'exercise', week: 'week3', filePath: '/data/7. Mai - 13. Mai/Materialwissenschaften Übungsblatt 3 DE.pdf', language: 'de' },
      { id: 'w3-ex3-en', title: 'Material Science Exercise Sheet 3', type: 'exercise', week: 'week3', filePath: '/data/7. Mai - 13. Mai/Material Science Exercise Sheet 3 ENG.pdf', language: 'en' },
      { id: 'w3-sol3', title: 'Lösung MaWi Übung 03', type: 'solution', week: 'week3', filePath: '/data/7. Mai - 13. Mai/Lösung MaWi Übung 03.pdf', language: 'de' },
      { id: 'w3-sol3-app', title: 'Lösung MaWi Übung 03 Anhang', type: 'solution', week: 'week3', filePath: '/data/7. Mai - 13. Mai/Lösung MaWi Übung 03 Anhang.pdf', language: 'de' },
      { id: 'w3-sol3-en', title: 'Solution Ma Sci Ex 03', type: 'solution', week: 'week3', filePath: '/data/7. Mai - 13. Mai/Solution Ma Sci Ex 03.pdf', language: 'en' },
      { id: 'w3-sol3-si', title: 'Solution Ma Sci Ex 03 SI', type: 'solution', week: 'week3', filePath: '/data/7. Mai - 13. Mai/Solution Ma Sci Ex 03 SI.pdf', language: 'en' }
    ]
  },
  {
    weekId: 'week4',
    weekName: 'Mechanical Properties',
    dateRange: '14. Mai - 20. Mai',
    materials: [
      { id: 'w4-ch7', title: 'Kapitel 7 - Mechanische Eigenschaften von Metallen', type: 'chapter', week: 'week4', filePath: '/data/14. Mai - 20. Mai/Kapitel 7 - Mechanische Eigenschaften von Metallen.pdf', language: 'de', chapter: 7 },
      { id: 'w4-ch8', title: 'Kapitel 8 - Mechanische Eigenschaften von Polymeren', type: 'chapter', week: 'week4', filePath: '/data/14. Mai - 20. Mai/Kapitel 8 - Mechanische Eigenschaften von Polymeren.pdf', language: 'de', chapter: 8 },
      { id: 'w4-cq6', title: 'Kontrollfragen 06', type: 'control-questions', week: 'week4', filePath: '/data/14. Mai - 20. Mai/Kontrollfragen 06.pdf', language: 'de' },
      { id: 'w4-cq7', title: 'Kontrollfragen 07', type: 'control-questions', week: 'week4', filePath: '/data/14. Mai - 20. Mai/Kontrollfragen 07.pdf', language: 'de' },
      { id: 'w4-ex4-de', title: 'Materialwissenschaften Übungsblatt 4', type: 'exercise', week: 'week4', filePath: '/data/14. Mai - 20. Mai/Materialwissenschaften Übungsblatt 4 DE.pdf', language: 'de' },
      { id: 'w4-ex4-en', title: 'Material Science Exercise Sheet 4', type: 'exercise', week: 'week4', filePath: '/data/14. Mai - 20. Mai/Material Science Exercise Sheet 4 ENG.pdf', language: 'en' },
      { id: 'w4-sol4', title: 'Lösung MaWi Übung 04', type: 'solution', week: 'week4', filePath: '/data/14. Mai - 20. Mai/Lösung MaWi Übung 04.pdf', language: 'de' },
      { id: 'w4-sol4-en', title: 'Solution Ma Sci Ex 04', type: 'solution', week: 'week4', filePath: '/data/14. Mai - 20. Mai/Solution Ma Sci Ex 04.pdf', language: 'en' }
    ]
  },
  {
    weekId: 'week5',
    weekName: 'Material Failure & Phase Diagrams',
    dateRange: '21. Mai - 27. Mai',
    materials: [
      { id: 'w5-ch9', title: 'Kapitel 9 - Werkstoffversagen', type: 'chapter', week: 'week5', filePath: '/data/21. Mai - 27. Mai/Kapitel 9 - Werkstoffversagen.pdf', language: 'de', chapter: 9 },
      { id: 'w5-ch10', title: 'Kapitel 10 - Phasendiagramme', type: 'chapter', week: 'week5', filePath: '/data/21. Mai - 27. Mai/Kapitel 10 - Phasendiagramme.pdf', language: 'de', chapter: 10 },
      { id: 'w5-cq8', title: 'Kontrollfragen 08', type: 'control-questions', week: 'week5', filePath: '/data/21. Mai - 27. Mai/Kontrollfragen 08.pdf', language: 'de' },
      { id: 'w5-cq9', title: 'Kontrollfragen 09', type: 'control-questions', week: 'week5', filePath: '/data/21. Mai - 27. Mai/Kontrollfragen 09.pdf', language: 'de' },
      { id: 'w5-ex5-de', title: 'Materialwissenschaften Übungsblatt 5', type: 'exercise', week: 'week5', filePath: '/data/21. Mai - 27. Mai/Materialwissenschaften Übungsblatt 5 DE.pdf', language: 'de' },
      { id: 'w5-ex5-en', title: 'Material Science Exercise Sheet 5', type: 'exercise', week: 'week5', filePath: '/data/21. Mai - 27. Mai/Material Science Exercise Sheet 5 ENG.pdf', language: 'en' },
      { id: 'w5-sol5', title: 'Lösung MaWi Übung 05', type: 'solution', week: 'week5', filePath: '/data/21. Mai - 27. Mai/Lösung MaWi Übung 05.pdf', language: 'de' }
    ]
  },
  {
    weekId: 'week6',
    weekName: 'Phase Transformations & Ceramics',
    dateRange: '28. Mai - 3. Juni',
    materials: [
      { id: 'w6-ch11', title: 'Kapitel 11 - Phasenumwandlungen', type: 'chapter', week: 'week6', filePath: '/data/28. Mai - 3. Juni/Kapitel 11 - Phasenumwandlungen.pdf', language: 'de', chapter: 11 },
      { id: 'w6-ch12', title: 'Kapitel 12 - Keramiken und Gläser', type: 'chapter', week: 'week6', filePath: '/data/28. Mai - 3. Juni/Kapitel 12 - Keramiken und Gläser.pdf', language: 'de', chapter: 12 },
      { id: 'w6-cq10', title: 'Kontrollfragen 10', type: 'control-questions', week: 'week6', filePath: '/data/28. Mai - 3. Juni/Kontrollfragen 10.pdf', language: 'de' },
      { id: 'w6-ex6-de', title: 'Materialwissenschaften Übungsblatt 6', type: 'exercise', week: 'week6', filePath: '/data/28. Mai - 3. Juni/Materialwissenschaften Übungsblatt 6 DE.pdf', language: 'de' },
      { id: 'w6-ex6-en', title: 'Material Science Exercise Sheet 6', type: 'exercise', week: 'week6', filePath: '/data/28. Mai - 3. Juni/Material Science Exercise Sheet 6 ENG.pdf', language: 'en' },
      { id: 'w6-sol6', title: 'Lösung MaWi Übung 06', type: 'solution', week: 'week6', filePath: '/data/28. Mai - 3. Juni/Lösung MaWi Übung 06.pdf', language: 'de' }
    ]
  }
];

// Helper functions
export const getAllMaterials = (): CourseMaterial[] => {
  return courseWeeks.flatMap(week => week.materials);
};

export const getMaterialsByType = (type: CourseMaterial['type']): CourseMaterial[] => {
  return getAllMaterials().filter(material => material.type === type);
};

export const getMaterialsByWeek = (weekId: string): CourseMaterial[] => {
  const week = courseWeeks.find(w => w.weekId === weekId);
  return week ? week.materials : [];
};

export const getChapterMaterials = (): CourseMaterial[] => {
  return getMaterialsByType('chapter').sort((a, b) => (a.chapter || 0) - (b.chapter || 0));
};

export const getMaterialById = (id: string): CourseMaterial | undefined => {
  return getAllMaterials().find(material => material.id === id);
};

export const getWeekByMaterialId = (materialId: string): WeeklyMaterials | undefined => {
  return courseWeeks.find(week => 
    week.materials.some(material => material.id === materialId)
  );
};