import { TrainingPhase } from '../types';

export const MAX_TEST_WEEKS = [4, 10, 16, 20];

export const isMaxTestDay = (week: number, day: number): boolean => {
  return MAX_TEST_WEEKS.includes(week) && day === 3;
};

export const PHASES: TrainingPhase[] = [
  {
    id: 1,
    name: 'Faza 1: Osnove i Forma',
    description: 'Fokus na pravilnu formu i neuromuskularnu adaptaciju.',
    weeks: [1, 2, 3, 4],
    focus: 'Hipertrofija / Forma',
    restTimeSeconds: 90,
  },
  {
    id: 2,
    name: 'Faza 2: Akumulacija Volumena',
    description: 'Grease the Groove (GtG) i piramidalni setovi.',
    weeks: [5, 6, 7, 8, 9, 10],
    focus: 'Volumen',
    restTimeSeconds: 120,
  },
  {
    id: 3,
    name: 'Faza 3: Gustoća Treninga',
    description: 'Smanjenje odmora i EMOM setovi.',
    weeks: [11, 12, 13, 14, 15, 16],
    focus: 'Izdržljivost',
    restTimeSeconds: 45,
  },
  {
    id: 4,
    name: 'Faza 4: Peaking & Tapering',
    description: 'Visoki intenzitet, dugi odmori, priprema za test.',
    weeks: [17, 18, 19, 20],
    focus: 'Snaga / Test',
    restTimeSeconds: 180,
  },
];

export const determineStartWeek = (maxReps: number): { phase: number; week: number } => {
  if (maxReps < 10) return { phase: 1, week: 1 };
  if (maxReps < 20) return { phase: 1, week: 3 };
  if (maxReps < 30) return { phase: 2, week: 5 };
  if (maxReps < 40) return { phase: 2, week: 8 };
  return { phase: 3, week: 11 };
};

export const getDailyWorkout = (phaseId: number, week: number, day: number, maxReps: number) => {
  if (isMaxTestDay(week, day)) {
    return {
      title: `🏁 VELIKI TEST: NOVI REKORD`,
      sets: [],
      description: 'Danas ne radimo serije. Cilj je samo jedan: maksimalan broj sklekova u jednoj seriji do otkaza. Ovo određuje tvoj napredak u sljedeću fazu.',
      type: 'Test'
    };
  }

  const baseReps = Math.floor(maxReps * 0.6);

  switch (phaseId) {
    case 1:
      return {
        title: `Tjedan ${week} - Dan ${day}: Osnove`,
        sets: [baseReps, baseReps, baseReps - 1, baseReps - 2],
        description: 'Izvodite setove s 2-3 ponavljanja rezerve (RIR). Fokus na spori negativ (2 sekunde).',
        type: 'Standard'
      };
    case 2:
      if (day === 2) {
         return {
            title: `Tjedan ${week} - Dan ${day}: Grease the Groove`,
            sets: Array(8).fill(Math.floor(maxReps * 0.4)),
            description: 'Submaksimalni setovi raspoređeni kroz cijeli dan. Svakih sat vremena napravite jedan set.',
            type: 'GtG'
         }
      }
      return {
        title: `Tjedan ${week} - Dan ${day}: Piramida`,
        sets: [Math.floor(baseReps * 0.5), Math.floor(baseReps * 0.75), baseReps, Math.floor(baseReps * 0.75), Math.floor(baseReps * 0.5)],
        description: 'Piramidalni trening. Kratke pauze između nižih setova.',
        type: 'Pyramid'
      };
    case 3:
      return {
        title: `Tjedan ${week} - Dan ${day}: EMOM Gustoća`,
        sets: Array(10).fill(Math.floor(maxReps * 0.3)),
        description: 'Every Minute on the Minute. Svaku minutu napravite zadani broj ponavljanja. Ostatak minute je odmor.',
        type: 'EMOM'
      };
    case 4:
      return {
        title: `Tjedan ${week} - Dan ${day}: Peaking`,
        sets: [Math.floor(maxReps * 0.8), Math.floor(maxReps * 0.9), Math.floor(maxReps * 0.5)],
        description: 'Visoki intenzitet. Dugi odmori (3+ minute) kako bi se osigurao potpuni oporavak.',
        type: 'Peaking'
      };
    default:
      return {
        title: 'Odmor',
        sets: [],
        description: 'Danas je dan za odmor i oporavak.',
        type: 'Rest'
      };
  }
};