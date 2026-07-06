export const MEAL_SLOTS = ['Desayuno', 'Media Mañana', 'Comida', 'Merienda', 'Cena', 'Pre-Entreno', 'Post-Entreno', 'Recena'];

export const FOOD_CATEGORIES = ['Todos','Proteína','Carbohidratos','Grasas','Frutas','Verduras','Lácteos','Suplementos','Snacks','Bebidas'];

// Values per 100g unless noted
export const FOOD_DB = [
  // ── PROTEÍNAS ──
  { emoji:'🍗', name:'Pechuga de Pollo', cal:165, p:31, c:0, f:3.6, cat:'Proteína', portion:'100g' },
  { emoji:'🍗', name:'Muslo de Pollo', cal:209, p:26, c:0, f:11, cat:'Proteína', portion:'100g' },
  { emoji:'🍗', name:'Pechuga de Pavo', cal:135, p:30, c:0, f:1, cat:'Proteína', portion:'100g' },
  { emoji:'🥩', name:'Ternera Magra', cal:150, p:26, c:0, f:5, cat:'Proteína', portion:'100g' },
  { emoji:'🥩', name:'Solomillo de Cerdo', cal:143, p:27, c:0, f:3, cat:'Proteína', portion:'100g' },
  { emoji:'🐟', name:'Salmón', cal:208, p:20, c:0, f:13, cat:'Proteína', portion:'100g' },
  { emoji:'🐟', name:'Atún Fresco', cal:130, p:28, c:0, f:1.2, cat:'Proteína', portion:'100g' },
  { emoji:'🐟', name:'Atún (lata)', cal:116, p:26, c:0, f:1, cat:'Proteína', portion:'100g (escurrido)' },
  { emoji:'🐟', name:'Merluza', cal:71, p:17, c:0, f:0.3, cat:'Proteína', portion:'100g' },
  { emoji:'🦐', name:'Langostinos', cal:99, p:24, c:0, f:0.5, cat:'Proteína', portion:'100g' },
  { emoji:'🥚', name:'Huevo Entero', cal:155, p:13, c:1.1, f:11, cat:'Proteína', portion:'100g (~2 uds)' },
  { emoji:'🥚', name:'Clara de Huevo', cal:52, p:11, c:0.7, f:0.2, cat:'Proteína', portion:'100g (~3 claras)' },
  { emoji:'🫘', name:'Tofu', cal:76, p:8, c:1.9, f:4.8, cat:'Proteína', portion:'100g' },
  { emoji:'🫘', name:'Seitan', cal:370, p:75, c:14, f:1.9, cat:'Proteína', portion:'100g' },
  { emoji:'🫘', name:'Tempeh', cal:192, p:20, c:8, f:11, cat:'Proteína', portion:'100g' },

  // ── CARBOHIDRATOS ──
  { emoji:'🍚', name:'Arroz Blanco', cal:130, p:2.7, c:28, f:0.3, cat:'Carbohidratos', portion:'100g cocido' },
  { emoji:'🍚', name:'Arroz Integral', cal:123, p:2.7, c:26, f:1, cat:'Carbohidratos', portion:'100g cocido' },
  { emoji:'🍝', name:'Pasta Cocida', cal:131, p:5, c:25, f:1.1, cat:'Carbohidratos', portion:'100g' },
  { emoji:'🍝', name:'Pasta Integral', cal:124, p:5.3, c:23, f:1.1, cat:'Carbohidratos', portion:'100g cocida' },
  { emoji:'🥔', name:'Patata', cal:77, p:2, c:17, f:0.1, cat:'Carbohidratos', portion:'100g' },
  { emoji:'🍠', name:'Boniato', cal:86, p:1.6, c:20, f:0.1, cat:'Carbohidratos', portion:'100g' },
  { emoji:'🥣', name:'Avena', cal:389, p:16.9, c:66, f:6.9, cat:'Carbohidratos', portion:'100g' },
  { emoji:'🍞', name:'Pan Integral', cal:247, p:13, c:41, f:3.4, cat:'Carbohidratos', portion:'100g' },
  { emoji:'🍞', name:'Pan Blanco', cal:265, p:9, c:49, f:3.2, cat:'Carbohidratos', portion:'100g' },
  { emoji:'🌾', name:'Quinoa', cal:120, p:4.4, c:21, f:1.9, cat:'Carbohidratos', portion:'100g cocida' },
  { emoji:'🌾', name:'Cuscús', cal:112, p:3.8, c:23, f:0.2, cat:'Carbohidratos', portion:'100g cocido' },
  { emoji:'🫘', name:'Lentejas', cal:116, p:9, c:20, f:0.4, cat:'Carbohidratos', portion:'100g cocidas' },
  { emoji:'🫘', name:'Garbanzos', cal:164, p:8.9, c:27, f:2.6, cat:'Carbohidratos', portion:'100g cocidos' },
  { emoji:'🍘', name:'Tortitas de Arroz', cal:387, p:7, c:85, f:2.8, cat:'Carbohidratos', portion:'100g' },
  { emoji:'🥣', name:'Cereales de Avena', cal:367, p:11, c:67, f:7, cat:'Carbohidratos', portion:'100g' },

  // ── GRASAS ──
  { emoji:'🫒', name:'Aceite de Oliva', cal:884, p:0, c:0, f:100, cat:'Grasas', portion:'100ml (~7 cuch.)' },
  { emoji:'🥑', name:'Aguacate', cal:160, p:2, c:9, f:15, cat:'Grasas', portion:'100g' },
  { emoji:'🥜', name:'Almendras', cal:579, p:21, c:22, f:49, cat:'Grasas', portion:'100g' },
  { emoji:'🥜', name:'Nueces', cal:654, p:15, c:14, f:65, cat:'Grasas', portion:'100g' },
  { emoji:'🥜', name:'Cacahuetes', cal:567, p:26, c:16, f:49, cat:'Grasas', portion:'100g' },
  { emoji:'🥜', name:'Crema de Cacahuete', cal:588, p:25, c:20, f:50, cat:'Grasas', portion:'100g' },
  { emoji:'🌰', name:'Semillas de Chía', cal:486, p:17, c:42, f:31, cat:'Grasas', portion:'100g' },
  { emoji:'🌰', name:'Semillas de Lino', cal:534, p:18, c:29, f:42, cat:'Grasas', portion:'100g' },
  { emoji:'🧈', name:'Mantequilla', cal:717, p:0.9, c:0.1, f:81, cat:'Grasas', portion:'100g' },
  { emoji:'🍫', name:'Chocolate Negro 85%', cal:580, p:10, c:33, f:46, cat:'Grasas', portion:'100g' },

  // ── FRUTAS ──
  { emoji:'🍌', name:'Plátano', cal:89, p:1.1, c:23, f:0.3, cat:'Frutas', portion:'1 ud (120g)' },
  { emoji:'🍎', name:'Manzana', cal:52, p:0.3, c:14, f:0.2, cat:'Frutas', portion:'1 ud (180g)' },
  { emoji:'🍊', name:'Naranja', cal:47, p:0.9, c:12, f:0.1, cat:'Frutas', portion:'1 ud (200g)' },
  { emoji:'🍓', name:'Fresas', cal:32, p:0.7, c:8, f:0.3, cat:'Frutas', portion:'100g' },
  { emoji:'🫐', name:'Arándanos', cal:57, p:0.7, c:14, f:0.3, cat:'Frutas', portion:'100g' },
  { emoji:'🥝', name:'Kiwi', cal:61, p:1.1, c:15, f:0.5, cat:'Frutas', portion:'1 ud (75g)' },
  { emoji:'🍇', name:'Uvas', cal:69, p:0.7, c:18, f:0.2, cat:'Frutas', portion:'100g' },
  { emoji:'🍍', name:'Piña', cal:50, p:0.5, c:13, f:0.1, cat:'Frutas', portion:'100g' },
  { emoji:'🍉', name:'Sandía', cal:30, p:0.6, c:8, f:0.2, cat:'Frutas', portion:'100g' },
  { emoji:'🥭', name:'Mango', cal:60, p:0.8, c:15, f:0.4, cat:'Frutas', portion:'100g' },
  { emoji:'🌴', name:'Dátiles', cal:277, p:1.8, c:75, f:0.2, cat:'Frutas', portion:'100g' },

  // ── VERDURAS ──
  { emoji:'🥦', name:'Brócoli', cal:34, p:2.8, c:7, f:0.4, cat:'Verduras', portion:'100g' },
  { emoji:'🥬', name:'Espinacas', cal:23, p:2.9, c:3.6, f:0.4, cat:'Verduras', portion:'100g' },
  { emoji:'🍅', name:'Tomate', cal:18, p:0.9, c:3.9, f:0.2, cat:'Verduras', portion:'100g' },
  { emoji:'🥒', name:'Pepino', cal:15, p:0.7, c:3.6, f:0.1, cat:'Verduras', portion:'100g' },
  { emoji:'🥕', name:'Zanahoria', cal:41, p:0.9, c:10, f:0.2, cat:'Verduras', portion:'100g' },
  { emoji:'🥒', name:'Calabacín', cal:17, p:1.2, c:3.1, f:0.3, cat:'Verduras', portion:'100g' },
  { emoji:'🌶️', name:'Pimiento Rojo', cal:31, p:1, c:6, f:0.3, cat:'Verduras', portion:'100g' },
  { emoji:'🧅', name:'Cebolla', cal:40, p:1.1, c:9, f:0.1, cat:'Verduras', portion:'100g' },
  { emoji:'🍄', name:'Champiñones', cal:22, p:3.1, c:3.3, f:0.3, cat:'Verduras', portion:'100g' },
  { emoji:'🥬', name:'Lechuga', cal:15, p:1.4, c:2.9, f:0.2, cat:'Verduras', portion:'100g' },
  { emoji:'🫘', name:'Judías Verdes', cal:31, p:1.8, c:7, f:0.1, cat:'Verduras', portion:'100g' },
  { emoji:'🌿', name:'Espárragos', cal:20, p:2.2, c:3.9, f:0.1, cat:'Verduras', portion:'100g' },

  // ── LÁCTEOS ──
  { emoji:'🥛', name:'Yogur Griego', cal:97, p:9, c:3.6, f:5, cat:'Lácteos', portion:'100g' },
  { emoji:'🥛', name:'Yogur Griego 0%', cal:59, p:10, c:3.6, f:0.7, cat:'Lácteos', portion:'100g' },
  { emoji:'🥛', name:'Leche Entera', cal:61, p:3.2, c:4.8, f:3.3, cat:'Lácteos', portion:'100ml' },
  { emoji:'🥛', name:'Leche Desnatada', cal:34, p:3.4, c:5, f:0.1, cat:'Lácteos', portion:'100ml' },
  { emoji:'🧀', name:'Queso Fresco', cal:175, p:12, c:3.5, f:13, cat:'Lácteos', portion:'100g' },
  { emoji:'🧀', name:'Requesón', cal:98, p:11, c:3.4, f:4.3, cat:'Lácteos', portion:'100g' },
  { emoji:'🧀', name:'Mozzarella', cal:280, p:28, c:3.1, f:17, cat:'Lácteos', portion:'100g' },
  { emoji:'🧀', name:'Queso Cottage', cal:98, p:11, c:3.4, f:4.3, cat:'Lácteos', portion:'100g' },
  { emoji:'🥛', name:'Skyr', cal:63, p:11, c:4, f:0.2, cat:'Lácteos', portion:'100g' },

  // ── SUPLEMENTOS ──
  { emoji:'🥤', name:'Whey Protein', cal:120, p:24, c:3, f:1.5, cat:'Suplementos', portion:'30g (cazo)' },
  { emoji:'🥤', name:'Caseína', cal:120, p:24, c:4, f:1, cat:'Suplementos', portion:'30g (cazo)' },
  { emoji:'💊', name:'Creatina', cal:0, p:0, c:0, f:0, cat:'Suplementos', portion:'5g' },
  { emoji:'💊', name:'BCAA', cal:0, p:0, c:0, f:0, cat:'Suplementos', portion:'10g' },
  { emoji:'⚡', name:'Pre-Entreno', cal:10, p:0, c:2, f:0, cat:'Suplementos', portion:'1 cazo' },
  { emoji:'🌱', name:'Proteína Vegana', cal:110, p:20, c:5, f:2, cat:'Suplementos', portion:'30g (cazo)' },
  { emoji:'🍫', name:'Barrita Proteica', cal:200, p:20, c:22, f:7, cat:'Suplementos', portion:'1 ud (60g)' },

  // ── SNACKS ──
  { emoji:'🍘', name:'Tortitas de Arroz+Crema Cacahuete', cal:120, p:4, c:14, f:6, cat:'Snacks', portion:'2 tortitas + 10g' },
  { emoji:'🫘', name:'Hummus', cal:166, p:8, c:14, f:10, cat:'Snacks', portion:'100g' },
  { emoji:'🍿', name:'Palomitas (sin aceite)', cal:387, p:13, c:78, f:4.5, cat:'Snacks', portion:'100g' },
  { emoji:'🥜', name:'Mix de Frutos Secos', cal:607, p:20, c:21, f:54, cat:'Snacks', portion:'100g' },
  { emoji:'🫘', name:'Edamame', cal:122, p:11, c:10, f:5, cat:'Snacks', portion:'100g' },

  // ── BEBIDAS ──
  { emoji:'🥛', name:'Bebida de Avena', cal:43, p:0.3, c:8, f:1, cat:'Bebidas', portion:'100ml' },
  { emoji:'🥛', name:'Bebida de Soja', cal:33, p:3.3, c:0.6, f:1.8, cat:'Bebidas', portion:'100ml' },
  { emoji:'🥛', name:'Bebida de Almendra', cal:13, p:0.4, c:0.5, f:1.1, cat:'Bebidas', portion:'100ml' },
  { emoji:'🧃', name:'Zumo de Naranja', cal:45, p:0.7, c:10, f:0.2, cat:'Bebidas', portion:'100ml' },
  { emoji:'☕', name:'Café solo', cal:2, p:0.3, c:0, f:0, cat:'Bebidas', portion:'100ml' },
  { emoji:'🍽️', name:'Bebida Isotónica', cal:26, p:0, c:6, f:0, cat:'Bebidas', portion:'100ml' },
];
