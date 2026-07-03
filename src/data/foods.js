export const MEAL_SLOTS = ['Desayuno', 'Media Mañana', 'Comida', 'Merienda', 'Cena', 'Pre-Entreno', 'Post-Entreno', 'Recena'];

export const FOOD_CATEGORIES = ['Todos','Proteína','Carbohidratos','Grasas','Frutas','Verduras','Lácteos','Suplementos','Snacks','Bebidas'];

// Values per 100g unless noted
export const FOOD_DB = [
  // ── PROTEÍNAS ──
  { name:'Pechuga de Pollo', cal:165, p:31, c:0, f:3.6, cat:'Proteína', portion:'100g' },
  { name:'Muslo de Pollo', cal:209, p:26, c:0, f:11, cat:'Proteína', portion:'100g' },
  { name:'Pechuga de Pavo', cal:135, p:30, c:0, f:1, cat:'Proteína', portion:'100g' },
  { name:'Ternera Magra', cal:150, p:26, c:0, f:5, cat:'Proteína', portion:'100g' },
  { name:'Solomillo de Cerdo', cal:143, p:27, c:0, f:3, cat:'Proteína', portion:'100g' },
  { name:'Salmón', cal:208, p:20, c:0, f:13, cat:'Proteína', portion:'100g' },
  { name:'Atún Fresco', cal:130, p:28, c:0, f:1.2, cat:'Proteína', portion:'100g' },
  { name:'Atún (lata)', cal:116, p:26, c:0, f:1, cat:'Proteína', portion:'100g (escurrido)' },
  { name:'Merluza', cal:71, p:17, c:0, f:0.3, cat:'Proteína', portion:'100g' },
  { name:'Langostinos', cal:99, p:24, c:0, f:0.5, cat:'Proteína', portion:'100g' },
  { name:'Huevo Entero', cal:155, p:13, c:1.1, f:11, cat:'Proteína', portion:'100g (~2 uds)' },
  { name:'Clara de Huevo', cal:52, p:11, c:0.7, f:0.2, cat:'Proteína', portion:'100g (~3 claras)' },
  { name:'Tofu', cal:76, p:8, c:1.9, f:4.8, cat:'Proteína', portion:'100g' },
  { name:'Seitan', cal:370, p:75, c:14, f:1.9, cat:'Proteína', portion:'100g' },
  { name:'Tempeh', cal:192, p:20, c:8, f:11, cat:'Proteína', portion:'100g' },

  // ── CARBOHIDRATOS ──
  { name:'Arroz Blanco', cal:130, p:2.7, c:28, f:0.3, cat:'Carbohidratos', portion:'100g cocido' },
  { name:'Arroz Integral', cal:123, p:2.7, c:26, f:1, cat:'Carbohidratos', portion:'100g cocido' },
  { name:'Pasta Cocida', cal:131, p:5, c:25, f:1.1, cat:'Carbohidratos', portion:'100g' },
  { name:'Pasta Integral', cal:124, p:5.3, c:23, f:1.1, cat:'Carbohidratos', portion:'100g cocida' },
  { name:'Patata', cal:77, p:2, c:17, f:0.1, cat:'Carbohidratos', portion:'100g' },
  { name:'Boniato', cal:86, p:1.6, c:20, f:0.1, cat:'Carbohidratos', portion:'100g' },
  { name:'Avena', cal:389, p:16.9, c:66, f:6.9, cat:'Carbohidratos', portion:'100g' },
  { name:'Pan Integral', cal:247, p:13, c:41, f:3.4, cat:'Carbohidratos', portion:'100g' },
  { name:'Pan Blanco', cal:265, p:9, c:49, f:3.2, cat:'Carbohidratos', portion:'100g' },
  { name:'Quinoa', cal:120, p:4.4, c:21, f:1.9, cat:'Carbohidratos', portion:'100g cocida' },
  { name:'Cuscús', cal:112, p:3.8, c:23, f:0.2, cat:'Carbohidratos', portion:'100g cocido' },
  { name:'Lentejas', cal:116, p:9, c:20, f:0.4, cat:'Carbohidratos', portion:'100g cocidas' },
  { name:'Garbanzos', cal:164, p:8.9, c:27, f:2.6, cat:'Carbohidratos', portion:'100g cocidos' },
  { name:'Tortitas de Arroz', cal:387, p:7, c:85, f:2.8, cat:'Carbohidratos', portion:'100g' },
  { name:'Cereales de Avena', cal:367, p:11, c:67, f:7, cat:'Carbohidratos', portion:'100g' },

  // ── GRASAS ──
  { name:'Aceite de Oliva', cal:884, p:0, c:0, f:100, cat:'Grasas', portion:'100ml (~7 cuch.)' },
  { name:'Aguacate', cal:160, p:2, c:9, f:15, cat:'Grasas', portion:'100g' },
  { name:'Almendras', cal:579, p:21, c:22, f:49, cat:'Grasas', portion:'100g' },
  { name:'Nueces', cal:654, p:15, c:14, f:65, cat:'Grasas', portion:'100g' },
  { name:'Cacahuetes', cal:567, p:26, c:16, f:49, cat:'Grasas', portion:'100g' },
  { name:'Crema de Cacahuete', cal:588, p:25, c:20, f:50, cat:'Grasas', portion:'100g' },
  { name:'Semillas de Chía', cal:486, p:17, c:42, f:31, cat:'Grasas', portion:'100g' },
  { name:'Semillas de Lino', cal:534, p:18, c:29, f:42, cat:'Grasas', portion:'100g' },
  { name:'Mantequilla', cal:717, p:0.9, c:0.1, f:81, cat:'Grasas', portion:'100g' },
  { name:'Chocolate Negro 85%', cal:580, p:10, c:33, f:46, cat:'Grasas', portion:'100g' },

  // ── FRUTAS ──
  { name:'Plátano', cal:89, p:1.1, c:23, f:0.3, cat:'Frutas', portion:'1 ud (120g)' },
  { name:'Manzana', cal:52, p:0.3, c:14, f:0.2, cat:'Frutas', portion:'1 ud (180g)' },
  { name:'Naranja', cal:47, p:0.9, c:12, f:0.1, cat:'Frutas', portion:'1 ud (200g)' },
  { name:'Fresas', cal:32, p:0.7, c:8, f:0.3, cat:'Frutas', portion:'100g' },
  { name:'Arándanos', cal:57, p:0.7, c:14, f:0.3, cat:'Frutas', portion:'100g' },
  { name:'Kiwi', cal:61, p:1.1, c:15, f:0.5, cat:'Frutas', portion:'1 ud (75g)' },
  { name:'Uvas', cal:69, p:0.7, c:18, f:0.2, cat:'Frutas', portion:'100g' },
  { name:'Piña', cal:50, p:0.5, c:13, f:0.1, cat:'Frutas', portion:'100g' },
  { name:'Sandía', cal:30, p:0.6, c:8, f:0.2, cat:'Frutas', portion:'100g' },
  { name:'Mango', cal:60, p:0.8, c:15, f:0.4, cat:'Frutas', portion:'100g' },
  { name:'Dátiles', cal:277, p:1.8, c:75, f:0.2, cat:'Frutas', portion:'100g' },

  // ── VERDURAS ──
  { name:'Brócoli', cal:34, p:2.8, c:7, f:0.4, cat:'Verduras', portion:'100g' },
  { name:'Espinacas', cal:23, p:2.9, c:3.6, f:0.4, cat:'Verduras', portion:'100g' },
  { name:'Tomate', cal:18, p:0.9, c:3.9, f:0.2, cat:'Verduras', portion:'100g' },
  { name:'Pepino', cal:15, p:0.7, c:3.6, f:0.1, cat:'Verduras', portion:'100g' },
  { name:'Zanahoria', cal:41, p:0.9, c:10, f:0.2, cat:'Verduras', portion:'100g' },
  { name:'Calabacín', cal:17, p:1.2, c:3.1, f:0.3, cat:'Verduras', portion:'100g' },
  { name:'Pimiento Rojo', cal:31, p:1, c:6, f:0.3, cat:'Verduras', portion:'100g' },
  { name:'Cebolla', cal:40, p:1.1, c:9, f:0.1, cat:'Verduras', portion:'100g' },
  { name:'Champiñones', cal:22, p:3.1, c:3.3, f:0.3, cat:'Verduras', portion:'100g' },
  { name:'Lechuga', cal:15, p:1.4, c:2.9, f:0.2, cat:'Verduras', portion:'100g' },
  { name:'Judías Verdes', cal:31, p:1.8, c:7, f:0.1, cat:'Verduras', portion:'100g' },
  { name:'Espárragos', cal:20, p:2.2, c:3.9, f:0.1, cat:'Verduras', portion:'100g' },

  // ── LÁCTEOS ──
  { name:'Yogur Griego', cal:97, p:9, c:3.6, f:5, cat:'Lácteos', portion:'100g' },
  { name:'Yogur Griego 0%', cal:59, p:10, c:3.6, f:0.7, cat:'Lácteos', portion:'100g' },
  { name:'Leche Entera', cal:61, p:3.2, c:4.8, f:3.3, cat:'Lácteos', portion:'100ml' },
  { name:'Leche Desnatada', cal:34, p:3.4, c:5, f:0.1, cat:'Lácteos', portion:'100ml' },
  { name:'Queso Fresco', cal:175, p:12, c:3.5, f:13, cat:'Lácteos', portion:'100g' },
  { name:'Requesón', cal:98, p:11, c:3.4, f:4.3, cat:'Lácteos', portion:'100g' },
  { name:'Mozzarella', cal:280, p:28, c:3.1, f:17, cat:'Lácteos', portion:'100g' },
  { name:'Queso Cottage', cal:98, p:11, c:3.4, f:4.3, cat:'Lácteos', portion:'100g' },
  { name:'Skyr', cal:63, p:11, c:4, f:0.2, cat:'Lácteos', portion:'100g' },

  // ── SUPLEMENTOS ──
  { name:'Whey Protein', cal:120, p:24, c:3, f:1.5, cat:'Suplementos', portion:'30g (cazo)' },
  { name:'Caseína', cal:120, p:24, c:4, f:1, cat:'Suplementos', portion:'30g (cazo)' },
  { name:'Creatina', cal:0, p:0, c:0, f:0, cat:'Suplementos', portion:'5g' },
  { name:'BCAA', cal:0, p:0, c:0, f:0, cat:'Suplementos', portion:'10g' },
  { name:'Pre-Entreno', cal:10, p:0, c:2, f:0, cat:'Suplementos', portion:'1 cazo' },
  { name:'Proteína Vegana', cal:110, p:20, c:5, f:2, cat:'Suplementos', portion:'30g (cazo)' },
  { name:'Barrita Proteica', cal:200, p:20, c:22, f:7, cat:'Suplementos', portion:'1 ud (60g)' },

  // ── SNACKS ──
  { name:'Tortitas de Arroz+Crema Cacahuete', cal:120, p:4, c:14, f:6, cat:'Snacks', portion:'2 tortitas + 10g' },
  { name:'Hummus', cal:166, p:8, c:14, f:10, cat:'Snacks', portion:'100g' },
  { name:'Palomitas (sin aceite)', cal:387, p:13, c:78, f:4.5, cat:'Snacks', portion:'100g' },
  { name:'Mix de Frutos Secos', cal:607, p:20, c:21, f:54, cat:'Snacks', portion:'100g' },
  { name:'Edamame', cal:122, p:11, c:10, f:5, cat:'Snacks', portion:'100g' },

  // ── BEBIDAS ──
  { name:'Bebida de Avena', cal:43, p:0.3, c:8, f:1, cat:'Bebidas', portion:'100ml' },
  { name:'Bebida de Soja', cal:33, p:3.3, c:0.6, f:1.8, cat:'Bebidas', portion:'100ml' },
  { name:'Bebida de Almendra', cal:13, p:0.4, c:0.5, f:1.1, cat:'Bebidas', portion:'100ml' },
  { name:'Zumo de Naranja', cal:45, p:0.7, c:10, f:0.2, cat:'Bebidas', portion:'100ml' },
  { name:'Café solo', cal:2, p:0.3, c:0, f:0, cat:'Bebidas', portion:'100ml' },
  { name:'Bebida Isotónica', cal:26, p:0, c:6, f:0, cat:'Bebidas', portion:'100ml' },
];
