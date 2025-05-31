type Person = {
  readonly id: number;               // ID non modificabile
  readonly name: string;            // Nome completo non modificabile
  birth_year: number;               // Anno di nascita
  death_year?: number;              // Anno di morte (opzionale)
  biography: string;                // Breve biografia
  image: string;                    // URL dell'immagine
};

type Nationality = 
  | "American"
  | "British"
  | "Australian"
  | "Israeli-American"
  | "South African"
  | "French"
  | "Indian"
  | "Israeli"
  | "Spanish"
  | "South Korean"
  | "Chinese";

type Actress = Person & {
  most_famous_movies: [string, string, string]; // Tupla con 3 film famosi
  awards: string;                              // Premi ricevuti
  nationality: Nationality;                    // Una delle nazionalità predefinite
};

function isActress(dati: unknown): dati is Actress {
  if (typeof dati !== 'object' || dati === null) return false;

  const obj = dati as {
    id: unknown;
    name: unknown;
    birth_year: unknown;
    death_year?: unknown;
    biography: unknown;
    image: unknown;
    most_famous_movies: unknown;
    awards: unknown;
    nationality: unknown;
  };

  return (
    typeof obj.id === 'number' &&
    typeof obj.name === 'string' &&
    typeof obj.birth_year === 'number' &&
    (typeof obj.death_year === 'number' || typeof obj.death_year === 'undefined') &&
    typeof obj.biography === 'string' &&
    typeof obj.image === 'string' &&
    Array.isArray(obj.most_famous_movies) &&
    obj.most_famous_movies.length === 3 &&
    obj.most_famous_movies.every((m) => typeof m === 'string') &&
    typeof obj.awards === 'string' &&
    typeof obj.nationality === 'string'
  );
}

async function getActress(id: number): Promise<Actress | null> {
  try {
    const response = await fetch(`http://localhost:3333/users/${id}`);
    const dati: unknown = await response.json();
    if (!isActress(dati)) {
      throw new Error('Formato dei dati non valido');
    }
    return dati;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Errore durante il recupero dell'attrice", error);
    } else {
      console.error('Errore sconosciuto', error);
    }
    return null;
  }
}

async function getAllActresses(): Promise<Actress[]> {
  try {
    const response = await fetch(`http://localhost:3333/users`);
    if (!response.ok) {
      throw new Error(`Errore HTTP: ${response.statusText}`);
    }
    const dati: unknown = await response.json();
    if (!Array.isArray(dati)) {
      throw new Error('Formato dei dati non valido, atteso un array');
    }
    const attriciValide: Actress[] = dati.filter(isActress);
    return attriciValide;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Errore durante il recupero delle attrici", error);
    } else {
      console.error('Errore sconosciuto', error);
    }
    return [];
  }
}

async function getActresses(ids: number[]): Promise<Actress[]> {
  try {
    const promises = ids.map(id => getActress(id));
    const actresses = await Promise.all(promises);
    return actresses.filter((a): a is Actress => a !== null);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Errore durante il recupero delle attrici", error);
    } else {
      console.error('Errore sconosciuto', error);
    }
    return [];
  }
}


async function test() {
  // Test getAllActresses
  const all = await getAllActresses();
  console.log('Tutte le attrici:', all);

  // Test getActresses con alcuni id fittizi
  const some = await getActresses([1, 2, 3]);
  console.log('Alcune attrici:', some);

  // Test getActress con un id singolo
  const one = await getActress(1);
  console.log('Singola attrice:', one);
}

test();
