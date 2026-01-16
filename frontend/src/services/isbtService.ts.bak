export interface IsbtSystem {
  id: number;
  symbol: string;
  name: string;
  url?: string;
  description?: string;
  yearDiscovered?: number;
  antigenCount?: number;
  geneLocation?: string;
  clinicalSignificance?: string;
}

const FALLBACK_DATA: IsbtSystem[] = [
  {
    id: 1,
    symbol: 'ABO',
    name: 'ABO Blood Group System',
    yearDiscovered: 1900,
    antigenCount: 4,
    geneLocation: '9q34.2',
    description: 'El sistema sanguíneo más importante en transfusiones humanas. Fue descubierto por Karl Landsteiner en 1900. Los grupos principales son A, B, AB y O.',
    clinicalSignificance: 'CRÍTICA. Los anticuerpos anti-A y anti-B son naturales y causan reacciones hemolíticas inmediatas y fatales si se transfunde sangre incompatible.'
  },
  {
    id: 2,
    symbol: 'MNS',
    name: 'MNS Blood Group System',
    yearDiscovered: 1927,
    antigenCount: 50,
    geneLocation: '4q31.21',
    description: 'Un sistema complejo con muchos antígenos. Los antígenos M y N fueron los segundos descubiertos por Landsteiner y Levine.',
    clinicalSignificance: 'Moderada. Los anticuerpos anti-M y anti-N raramente causan reacciones, pero anti-S y anti-s pueden ser clínicamente significativos.'
  },
  {
    id: 3,
    symbol: 'P1PK',
    name: 'P1PK Blood Group System',
    yearDiscovered: 1927,
    antigenCount: 3,
    geneLocation: '22q13.2',
    description: 'Anteriormente conocido simplemente como el sistema P. Incluye el antígeno P1 y Pk.',
    clinicalSignificance: 'Leve a moderada. Anti-P1 es común pero raramente significativo. Anti-PP1Pk es peligroso y está asociado con abortos espontáneos.'
  },
  {
    id: 4,
    symbol: 'RH',
    name: 'Rh Blood Group System',
    yearDiscovered: 1940,
    antigenCount: 55,
    geneLocation: '1p36.11',
    description: 'El segundo sistema más importante después del ABO. Incluye el antígeno D, que determina si la sangre es "positiva" o "negativa".',
    clinicalSignificance: 'ALTA. El antígeno D es altamente inmunogénico. Causa enfermedad hemolítica del feto y del recién nacido (Eritroblastosis fetal).'
  },
  {
    id: 5,
    symbol: 'LU',
    name: 'Lutheran Blood Group System',
    yearDiscovered: 1945,
    antigenCount: 22,
    geneLocation: '19q13.2',
    description: 'Nombrado por el primer paciente (Luteran). Los antígenos están en la glicoproteína BCAM.',
    clinicalSignificance: 'Baja. Los anticuerpos suelen ser leves y raramente causan reacciones transfusionales graves.'
  },
  {
    id: 6,
    symbol: 'KEL',
    name: 'Kell Blood Group System',
    yearDiscovered: 1946,
    antigenCount: 36,
    geneLocation: '7q34',
    description: 'El antígeno K (Kell) es muy inmunogénico, solo superado por el D del sistema Rh.',
    clinicalSignificance: 'ALTA. Anti-K puede causar reacciones transfusionales severas y enfermedad hemolítica grave en recién nacidos.'
  }
];

export const isbtService = {
  getSystems: async (): Promise<IsbtSystem[]> => {
    try {
      // Intentamos la API real primero
      const response = await fetch('https://api-blooddatabase.isbtweb.org/api/systems');
      if (!response.ok) {
        throw new Error(`Error fetching ISBT data: ${response.statusText}`);
      }
      const data = await response.json();
      // Mezclamos con nuestros datos enriquecidos si coincide el ID
      return data.map((sys: any) => {
        const enriched = FALLBACK_DATA.find(f => f.id === sys.id);
        return enriched ? { ...sys, ...enriched } : sys;
      });
    } catch (error) {
      console.error('Utilizando datos locales ISBT:', error);
      // Retornamos datos locales enriquecidos
      return new Promise(resolve => setTimeout(() => resolve(FALLBACK_DATA), 800)); // Simular delay de red
    }
  }
};
