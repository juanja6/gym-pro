/**
 * Smart parser for AI-generated routines and diets.
 * Handles free-form text from ChatGPT, Gemini, Claude, or pasted from docs.
 */

// ── ROUTINE PARSER ──

export function parseRoutineText(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const routines = [];
  let current = null;

  for (const line of lines) {
    // Detect day/routine headers
    const dayMatch = line.match(/^(?:#{1,3}\s*)?(?:D[ií]a\s*(\d+)|Sesi[oó]n\s*(\d+))\s*[-–:.]?\s*(.*)/i) ||
                     line.match(/^(?:#{1,3}\s*)?(Lunes|Martes|Mi[eé]rcoles|Jueves|Viernes|S[aá]bado|Domingo)\s*[-–:.]?\s*(.*)/i) ||
                     line.match(/^(?:#{1,3}\s*)?(Push|Pull|Legs?|Upper|Lower|Full\s*Body|Pecho|Espalda|Pierna|Hombro|Brazo)\s*[-–:.]?\s*(.*)/i);

    if (dayMatch) {
      if (current) routines.push(current);
      const name = (dayMatch[3] || dayMatch[2] || dayMatch[1] || line).replace(/^[-–:.#\s]+/, '').trim();
      current = { name: name || `Rutina ${routines.length + 1}`, exercises: [] };
      continue;
    }

    // Detect exercises: "- Press Banca: 4x10 80kg" or "Press Banca 4 series 10 reps 80kg"
    const exMatch = parseExerciseLine(line);
    if (exMatch) {
      if (!current) {
        current = { name: 'Rutina Importada', exercises: [] };
      }
      current.exercises.push(exMatch);
    }
  }

  if (current && current.exercises.length > 0) routines.push(current);
  return routines;
}

function parseExerciseLine(line) {
  // Clean line
  let clean = line.replace(/^[-•*·▪▸>\d.)\]]+\s*/, '').trim();
  if (!clean || clean.length < 3) return null;

  // Skip headers and non-exercise lines
  if (/^(nota|descanso|calentamiento|estiramiento|cardio|observ|tip|consejo|importante)/i.test(clean)) return null;

  let name = '';
  let sets = [];
  let rest = 90;

  // Pattern 1: "Press Banca: 4x10 @ 80kg" or "Press Banca: 4x10 80kg"
  const p1 = clean.match(/^(.+?)\s*[:–-]\s*(\d+)\s*[xX×]\s*(\d+)(?:\s*[@a]\s*)?(?:\s*(\d+(?:[.,]\d+)?)\s*(?:kg|lb)?)?/);
  if (p1) {
    name = p1[1].trim();
    const nSets = parseInt(p1[2]);
    const reps = parseInt(p1[3]);
    const weight = parseFloat((p1[4] || '0').replace(',', '.'));
    sets = Array.from({ length: nSets }, () => ({ r: reps, w: weight, rpe: 7 }));
  }

  // Pattern 2: "Press Banca 4 series de 10 repeticiones con 80kg"
  if (!name) {
    const p2 = clean.match(/^(.+?)\s+(\d+)\s*(?:series|sets)\s*(?:de\s*)?(\d+)\s*(?:rep(?:eticiones|s)?)?(?:\s*(?:con|@|a)\s*(\d+(?:[.,]\d+)?)\s*(?:kg|lb)?)?/i);
    if (p2) {
      name = p2[1].trim();
      const nSets = parseInt(p2[2]);
      const reps = parseInt(p2[3]);
      const weight = parseFloat((p2[4] || '0').replace(',', '.'));
      sets = Array.from({ length: nSets }, () => ({ r: reps, w: weight, rpe: 7 }));
    }
  }

  // Pattern 3: "Press Banca: 10, 10, 8, 8 (reps) - 80kg" or with individual weights
  if (!name) {
    const p3 = clean.match(/^(.+?)\s*[:–-]\s*([\d,\s/]+)(?:\s*(?:reps?|repeticiones))?\s*(?:[-–@a]\s*(\d+(?:[.,]\d+)?)\s*(?:kg|lb)?)?/);
    if (p3) {
      const repsArr = p3[2].split(/[,/\s]+/).map(Number).filter(n => n > 0);
      if (repsArr.length >= 2) {
        name = p3[1].trim();
        const weight = parseFloat((p3[3] || '0').replace(',', '.'));
        sets = repsArr.map(r => ({ r, w: weight, rpe: 7 }));
      }
    }
  }

  // Pattern 4: Simple name with sets x reps anywhere - "4x12 Press Banca"
  if (!name) {
    const p4 = clean.match(/^(\d+)\s*[xX×]\s*(\d+)\s+(.+)/);
    if (p4) {
      name = p4[3].trim();
      const nSets = parseInt(p4[1]);
      const reps = parseInt(p4[2]);
      sets = Array.from({ length: nSets }, () => ({ r: reps, w: 0, rpe: 7 }));
    }
  }

  // Pattern 5: Just a name with no sets info — default to 3x10
  if (!name && clean.length > 3 && !/^\d/.test(clean) && !/^[(\[]/.test(clean)) {
    // Check it looks like an exercise name (at least 2 words or known pattern)
    const words = clean.split(/\s+/);
    if (words.length >= 2 || /press|curl|sent|peso|domin|fond|elev|ext|remo|plancha|zancad/i.test(clean)) {
      name = clean.replace(/\s*[-–:].*/,'').trim();
      sets = Array.from({ length: 3 }, () => ({ r: 10, w: 0, rpe: 7 }));
    }
  }

  // Extract rest time if mentioned
  const restMatch = clean.match(/descanso\s*[:=]?\s*(\d+)\s*(?:s|seg|segundos)/i);
  if (restMatch) rest = parseInt(restMatch[1]);

  if (!name || sets.length === 0) return null;

  // Clean name
  name = name.replace(/[-–:]+$/, '').replace(/\*+/g, '').trim();
  if (name.length < 2) return null;

  return { name, sets, rest };
}

// ── DIET PARSER ──

export function parseDietText(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const meals = [];
  let current = null;

  const mealNames = {
    'desayuno': 'Desayuno', 'breakfast': 'Desayuno',
    'media mañana': 'Media Mañana', 'snack mañana': 'Media Mañana', 'almuerzo': 'Almuerzo',
    'comida': 'Comida', 'lunch': 'Comida',
    'merienda': 'Merienda', 'snack': 'Merienda', 'snack tarde': 'Merienda',
    'cena': 'Cena', 'dinner': 'Cena',
    'pre-entreno': 'Pre-Entreno', 'pre entreno': 'Pre-Entreno', 'preworkout': 'Pre-Entreno',
    'post-entreno': 'Post-Entreno', 'post entreno': 'Post-Entreno', 'postworkout': 'Post-Entreno',
    'recena': 'Recena',
  };

  for (const line of lines) {
    // Detect meal headers
    let isMealHeader = false;
    const cleanLine = line.replace(/^#{1,3}\s*/, '').replace(/[*_]+/g, '').toLowerCase().trim();

    for (const [key, name] of Object.entries(mealNames)) {
      if (cleanLine.startsWith(key) || cleanLine.includes(key)) {
        if (current) meals.push(current);
        current = { name, items: [] };
        isMealHeader = true;
        break;
      }
    }
    if (isMealHeader) continue;

    // Detect food items
    const food = parseFoodLine(line);
    if (food) {
      if (!current) current = { name: 'Comida', items: [] };
      current.items.push(food);
    }
  }

  if (current && current.items.length > 0) meals.push(current);
  return meals;
}

function parseFoodLine(line) {
  let clean = line.replace(/^[-•*·▪▸>\d.)\]]+\s*/, '').trim();
  if (!clean || clean.length < 3) return null;

  // Skip headers
  if (/^(total|nota|tip|consejo|observ|macro|calor[ií]as?\s*total)/i.test(clean)) return null;

  let name = '', cal = 0, p = 0, c = 0, f = 0, qty = '';

  // Pattern 1: "100g Pechuga de pollo (165 kcal, 31g P, 0g C, 3.6g G)"
  const p1 = clean.match(/^(\d+\s*(?:g|gr|ml|u|unidad(?:es)?))\s+(.+?)(?:\s*[(\[])?\s*(\d+)\s*(?:kcal|cal)[\s,]*(\d+)\s*g?\s*(?:P|prot)[\s,]*(\d+)\s*g?\s*(?:C|carb)[\s,]*(\d+(?:[.,]\d+)?)\s*g?\s*(?:G|gras|fat)/i);
  if (p1) {
    qty = p1[1]; name = p1[2].replace(/[-–:]+$/, '').trim();
    cal = parseInt(p1[3]); p = parseInt(p1[4]); c = parseInt(p1[5]); f = parseFloat(p1[6].replace(',', '.'));
  }

  // Pattern 2: "Pechuga de pollo 100g - 165kcal | P:31 C:0 G:3.6"
  if (!name) {
    const p2 = clean.match(/^(.+?)\s+(\d+\s*(?:g|gr|ml|u))\s*[-–|:]\s*(\d+)\s*(?:kcal|cal)[\s|,]*(?:P\s*[:=]?\s*(\d+))?[\s|,]*(?:C\s*[:=]?\s*(\d+))?[\s|,]*(?:G\s*[:=]?\s*(\d+(?:[.,]\d+)?))?/i);
    if (p2) {
      name = p2[1].replace(/[-–:]+$/, '').trim(); qty = p2[2];
      cal = parseInt(p2[3]); p = parseInt(p2[4] || '0'); c = parseInt(p2[5] || '0'); f = parseFloat((p2[6] || '0').replace(',', '.'));
    }
  }

  // Pattern 3: "Pechuga de pollo (100g) - 165 kcal, 31g proteína, 0g carbos, 3.6g grasa"
  if (!name) {
    const p3 = clean.match(/^(.+?)(?:\s*\((\d+\s*(?:g|gr|ml|u))\))?\s*[-–:]\s*(\d+)\s*(?:kcal|cal)(?:.*?(\d+)\s*g?\s*(?:prot|prote[ií]na))?(?:.*?(\d+)\s*g?\s*(?:carb|hidrato))?(?:.*?(\d+(?:[.,]\d+)?)\s*g?\s*(?:gras|fat))?/i);
    if (p3) {
      name = p3[1].replace(/[-–:]+$/, '').trim(); qty = p3[2] || '';
      cal = parseInt(p3[3]); p = parseInt(p3[4] || '0'); c = parseInt(p3[5] || '0'); f = parseFloat((p3[6] || '0').replace(',', '.'));
    }
  }

  // Pattern 4: Simple "100g avena" with no macros
  if (!name) {
    const p4 = clean.match(/^(\d+\s*(?:g|gr|ml|u|unidad(?:es)?))\s+(.+)/i);
    if (p4) {
      qty = p4[1]; name = p4[2].replace(/[-–:]+$/, '').trim();
    }
  }

  // Pattern 5: Just a food name
  if (!name && clean.length > 3 && !/^\d/.test(clean)) {
    name = clean.replace(/\s*[-–:].*/,'').trim();
  }

  if (!name || name.length < 2) return null;

  // Build display name
  const displayName = qty ? `${name} (${qty})` : name;

  return { name: displayName, cal, p: Math.round(p), c: Math.round(c), f: Math.round(f) };
}

// ── FILE READERS ──

export async function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = () => reject(new Error('Error leyendo archivo'));
    reader.readAsText(file);
  });
}

export function parseCSV(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length < 2) return [];
  const headers = lines[0].toLowerCase().split(/[,;\t]/);
  return lines.slice(1).map(line => {
    const vals = line.split(/[,;\t]/);
    const obj = {};
    headers.forEach((h, i) => obj[h.trim()] = vals[i]?.trim() || '');
    return obj;
  });
}

// Convert CSV rows to routine format
export function csvToRoutine(rows) {
  const routines = [];
  let current = null;

  for (const row of rows) {
    const day = row['dia'] || row['día'] || row['day'] || row['rutina'] || row['routine'] || '';
    const exercise = row['ejercicio'] || row['exercise'] || row['nombre'] || row['name'] || '';
    const setsN = parseInt(row['series'] || row['sets'] || '3');
    const reps = parseInt(row['repeticiones'] || row['reps'] || '10');
    const weight = parseFloat(row['peso'] || row['weight'] || row['kg'] || '0');
    const rest = parseInt(row['descanso'] || row['rest'] || '90');

    if (!exercise) continue;

    if (day && (!current || current.name !== day)) {
      if (current) routines.push(current);
      current = { name: day, exercises: [] };
    }
    if (!current) current = { name: 'Rutina Importada', exercises: [] };

    current.exercises.push({
      name: exercise,
      rest,
      sets: Array.from({ length: setsN }, () => ({ r: reps, w: weight, rpe: 7 })),
    });
  }

  if (current && current.exercises.length > 0) routines.push(current);
  return routines;
}

// Convert CSV rows to diet format
export function csvToDiet(rows) {
  const meals = [];
  let current = null;

  for (const row of rows) {
    const meal = row['comida'] || row['meal'] || row['horario'] || 'Comida';
    const food = row['alimento'] || row['food'] || row['nombre'] || row['name'] || '';
    const cal = parseInt(row['calorias'] || row['kcal'] || row['cal'] || '0');
    const pr = parseInt(row['proteina'] || row['protein'] || row['p'] || '0');
    const carb = parseInt(row['carbohidratos'] || row['carbs'] || row['c'] || '0');
    const fat = parseFloat(row['grasa'] || row['fat'] || row['g'] || '0');
    const qty = row['cantidad'] || row['qty'] || row['gramos'] || '';

    if (!food) continue;

    if (!current || current.name !== meal) {
      if (current) meals.push(current);
      current = { name: meal, items: [] };
    }

    current.items.push({
      name: qty ? `${food} (${qty})` : food,
      cal, p: pr, c: carb, f: Math.round(fat),
    });
  }

  if (current && current.items.length > 0) meals.push(current);
  return meals;
}
