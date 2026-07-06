import React, { useState } from 'react';
import { Card, Badge, Btn, Modal, Ring } from '../components/common';
import { FOOD_DB, MEAL_SLOTS, FOOD_CATEGORIES } from '../data/foods';
import { Search, Plus, Trash2, Droplets, ChevronLeft, Upload, Calculator } from 'lucide-react';
import ImportModal from '../components/ImportModal';
import GoalCalculator from '../components/GoalCalculator';

export default function DietScreen({ state, actions }) {
  const { profile, mealsData, waterLog } = state;
  const { saveMeals, addWater } = actions;
  const [addModal, setAddModal] = useState(null);
  const [foodSearch, setFoodSearch] = useState('');
  const [foodQty, setFoodQty] = useState('100');
  const [selFood, setSelFood] = useState(null);
  const [showImport, setShowImport] = useState(false);
  const [showCalc, setShowCalc] = useState(false);
  const [foodCat, setFoodCat] = useState('Todos');

  const todayKey = new Date().toISOString().split('T')[0];
  const todayMeals = (mealsData[todayKey] || { meals: [] }).meals || [];
  const calc = (field) => todayMeals.reduce((s, m) => s + (m.items || []).reduce((a, i) => a + i[field], 0), 0);
  const todayCal = calc('cal'), todayP = calc('p'), todayC = calc('c'), todayF = calc('f');
  const todayWater = waterLog[todayKey] || 0;

  const addFoodToMeal = (slot, food, qty) => {
    const mult = parseFloat(qty) / 100;
    const item = {
      name: `${food.name} (${qty}g)`,
      cal: Math.round(food.cal * mult), p: Math.round(food.p * mult),
      c: Math.round(food.c * mult), f: Math.round(food.f * mult),
    };
    const existing = mealsData[todayKey] ? JSON.parse(JSON.stringify(mealsData[todayKey])) : { meals: [] };
    let mealIdx = existing.meals.findIndex(m => m.name === slot);
    if (mealIdx === -1) {
      existing.meals.push({ name: slot, items: [] });
      mealIdx = existing.meals.length - 1;
    }
    existing.meals[mealIdx].items.push(item);
    saveMeals({ ...mealsData, [todayKey]: existing });
    setAddModal(null); setSelFood(null); setFoodSearch(''); setFoodQty('100');
  };

  const removeFoodItem = (mealIdx, itemIdx) => {
    const existing = JSON.parse(JSON.stringify(mealsData[todayKey]));
    existing.meals[mealIdx].items.splice(itemIdx, 1);
    existing.meals = existing.meals.filter(m => m.items.length > 0);
    saveMeals({ ...mealsData, [todayKey]: existing });
  };

  const filteredFoods = FOOD_DB.filter(f =>
    (foodCat === 'Todos' || f.cat === foodCat) &&
    (!foodSearch || f.name.toLowerCase().includes(foodSearch.toLowerCase()))
  );

  return (
    <div className="screen">
      <div className="row-between mb-md">
        <h1 className="title" style={{ marginBottom: 0 }}>Nutrición</h1>
        <Btn small onClick={() => setShowCalc(true)}>
          <Calculator size={14} /> Objetivos
        </Btn>
      </div>

      {/* Calorie Ring */}
      <Card style={{ textAlign: 'center' }}>
        <div className="row" style={{ justifyContent: 'center', gap: 32 }}>
          <div style={{ textAlign: 'center' }}>
            <div className="text-dim text-sm">Consumido</div>
            <div style={{ fontSize: 22, fontWeight: 800 }}>{todayCal}</div>
          </div>
          <Ring percent={(todayCal / profile.calTarget) * 100} color="var(--accent)" size={100} strokeWidth={8}>
            <span style={{ fontSize: 22, fontWeight: 800, color: 'var(--accent)' }}>{Math.max(0, profile.calTarget - todayCal)}</span>
            <span style={{ fontSize: 9, color: 'var(--text-dim)' }}>restantes</span>
          </Ring>
          <div style={{ textAlign: 'center' }}>
            <div className="text-dim text-sm">Objetivo</div>
            <div style={{ fontSize: 22, fontWeight: 800 }}>{profile.calTarget}</div>
          </div>
        </div>
      </Card>

      {/* Macros */}
      <Card>
        <div className="label mb-md">Macronutrientes</div>
        {[
          { l: 'Proteína', v: todayP, t: profile.pTarget, c: 'var(--blue)' },
          { l: 'Carbohidratos', v: todayC, t: profile.cTarget, c: 'var(--orange)' },
          { l: 'Grasas', v: todayF, t: profile.fTarget, c: 'var(--red)' },
        ].map(m => (
          <div key={m.l} style={{ marginBottom: 10 }}>
            <div className="row-between" style={{ marginBottom: 3 }}>
              <span style={{ fontSize: 12, fontWeight: 600 }}>{m.l}</span>
              <span className="text-dim text-sm">{m.v}/{m.t}g</span>
            </div>
            <div className="progress-bg">
              <div className="progress-fill" style={{ width: `${Math.min((m.v / m.t) * 100, 100)}%`, background: m.c }} />
            </div>
          </div>
        ))}
      </Card>

      {/* Water */}
      <Card>
        <div className="row-between mb-sm">
          <div className="row" style={{ gap: 8 }}>
            <Droplets size={18} color="var(--blue)" />
            <span className="label">Agua</span>
          </div>
          <span style={{ color: 'var(--blue)', fontSize: 12, fontWeight: 600 }}>{todayWater.toFixed(1)} / {profile.waterTarget} L</span>
        </div>
        <div className="progress-bg" style={{ marginBottom: 8 }}>
          <div className="progress-fill" style={{ width: `${Math.min((todayWater / profile.waterTarget) * 100, 100)}%`, background: 'var(--blue)' }} />
        </div>
        <div className="row" style={{ gap: 6 }}>
          {[0.25, 0.33, 0.5].map(a => (
            <button key={a} onClick={() => addWater(a)}
              style={{ flex: 1, padding: '7px 0', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: 12, fontWeight: 600 }}>
              +{Math.round(a * 1000)}ml
            </button>
          ))}
        </div>
      </Card>

      {/* Meal Slots */}
      {/* Import + Meal Slots */}
      <div className="row-between mb-md">
        <span className="label">Comidas de Hoy</span>
        <Btn small secondary onClick={() => setShowImport(true)}>
          <Upload size={14} /> Importar Dieta
        </Btn>
      </div>
      {MEAL_SLOTS.map(slot => {
        const meal = todayMeals.find(m => m.name === slot);
        const mealIdx = todayMeals.findIndex(m => m.name === slot);
        const mealCal = meal ? (meal.items || []).reduce((s, i) => s + i.cal, 0) : 0;
        return (
          <Card key={slot}>
            <div className="row-between">
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{slot}</div>
                {meal && <div style={{ color: 'var(--accent)', fontSize: 12, fontWeight: 600, marginTop: 2 }}>{mealCal} kcal</div>}
              </div>
              <button onClick={() => setAddModal(slot)}
                style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Plus size={16} color="var(--accent)" />
              </button>
            </div>
            {meal && (meal.items || []).map((item, i) => (
              <div key={i} className="food-item">
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13 }}>{item.name}</div>
                  <div className="food-macros">
                    <span>{item.cal} kcal</span>
                    <span style={{ color: 'var(--blue)' }}>P:{item.p}g</span>
                    <span style={{ color: 'var(--orange)' }}>C:{item.c}g</span>
                    <span style={{ color: 'var(--red)' }}>G:{item.f}g</span>
                  </div>
                </div>
                <button onClick={() => removeFoodItem(mealIdx, i)} style={{ background: 'none', padding: 4 }}>
                  <Trash2 size={14} color="var(--text-muted)" />
                </button>
              </div>
            ))}
          </Card>
        );
      })}

      {/* Add Food Modal */}
      <Modal visible={!!addModal} onClose={() => { setAddModal(null); setSelFood(null); setFoodSearch(''); }} title={`Añadir a ${addModal}`}>
        {!selFood ? (
          <>
            <div className="search-box">
              <Search size={16} />
              <input value={foodSearch} onChange={e => setFoodSearch(e.target.value)} placeholder="Buscar alimento..." />
            </div>
            <div className="chips-row">
              {FOOD_CATEGORIES.map(cat => (
                <button key={cat} className={`chip ${foodCat === cat ? 'active' : ''}`} onClick={() => setFoodCat(cat)}>{cat}</button>
              ))}
            </div>
            <div style={{ maxHeight: '50vh', overflow: 'auto' }}>
              {filteredFoods.map((f, i) => (
                <button key={i} onClick={() => setSelFood(f)}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '12px 0', borderBottom: '1px solid var(--border)', background: 'none', color: 'var(--text)', textAlign: 'left' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{f.name}</div>
                    <div className="text-dim text-sm" style={{ marginTop: 2 }}>{f.portion} · {f.cal} kcal</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: 'var(--blue)', fontSize: 10 }}>P:{f.p}g</div>
                    <div style={{ color: 'var(--orange)', fontSize: 10 }}>C:{f.c}g</div>
                  </div>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <button className="row mb-md" onClick={() => setSelFood(null)} style={{ background: 'none', color: 'var(--text-dim)', gap: 4, fontSize: 13 }}>
              <ChevronLeft size={16} /> Volver a búsqueda
            </button>

            {/* Food emoji + name */}
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <span style={{ fontSize: 48 }}>{selFood.emoji || '🍽️'}</span>
              <div style={{ fontSize: 18, fontWeight: 700, marginTop: 8 }}>{selFood.name}</div>
              <div className="text-dim text-sm">{selFood.portion}</div>
            </div>

            {/* Quantity input */}
            <div className="label mb-sm">Cantidad (gramos)</div>
            <input type="number" value={foodQty} onChange={e => setFoodQty(e.target.value)} style={{ marginBottom: 16, fontSize: 18, textAlign: 'center', padding: 14 }} />

            {/* Macro preview */}
            {(() => {
              const m = parseFloat(foodQty) / 100;
              return (
                <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                  {[
                    { l: 'KCAL', v: Math.round(selFood.cal * m), c: 'var(--accent)' },
                    { l: 'PROT', v: Math.round(selFood.p * m), c: 'var(--blue)' },
                    { l: 'CARB', v: Math.round(selFood.c * m), c: 'var(--orange)' },
                    { l: 'GRASA', v: Math.round(selFood.f * m), c: 'var(--red)' },
                  ].map(x => (
                    <div key={x.l} style={{ flex: 1, textAlign: 'center', padding: 10, background: 'var(--bg)', borderRadius: 10, border: '1px solid var(--border)' }}>
                      <div style={{ fontSize: 20, fontWeight: 800, color: x.c }}>{x.v}</div>
                      <div className="text-dim" style={{ fontSize: 10, marginTop: 2 }}>{x.l}</div>
                    </div>
                  ))}
                </div>
              );
            })()}

            {/* BIG centered buttons */}
            <Btn onClick={() => addFoodToMeal(addModal, selFood, foodQty)} className="w-full" style={{ padding: 16, fontSize: 16, marginBottom: 10 }}>
              <Plus size={18} /> Añadir a {addModal}
            </Btn>
            <Btn secondary onClick={() => setSelFood(null)} className="w-full" style={{ padding: 14 }}>
              Volver a búsqueda
            </Btn>
          </>
        )}
      </Modal>

      <ImportModal
        visible={showImport}
        onClose={() => setShowImport(false)}
        type="diet"
        onImport={(imported) => {
          const todayKey = new Date().toISOString().split('T')[0];
          const existing = mealsData[todayKey] ? JSON.parse(JSON.stringify(mealsData[todayKey])) : { meals: [] };
          for (const meal of imported) {
            let mealIdx = existing.meals.findIndex(m => m.name === meal.name);
            if (mealIdx === -1) {
              existing.meals.push({ name: meal.name, items: [] });
              mealIdx = existing.meals.length - 1;
            }
            existing.meals[mealIdx].items.push(...meal.items);
          }
          saveMeals({ ...mealsData, [todayKey]: existing });
        }}
      />

      <GoalCalculator
        visible={showCalc}
        onClose={() => setShowCalc(false)}
        profile={profile}
        onSave={actions.saveProfile}
      />
    </div>
  );
}
