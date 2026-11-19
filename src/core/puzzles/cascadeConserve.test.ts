import { describe, expect, it } from 'vitest';
import {
  firstWrong,
  flowToggle,
  initCascade,
  toggle,
  unfedCells,
  type CascadeCell,
  type CascadeConfig,
  type CascadeState,
  type CascadeTask,
} from './cascade';

const add = (a: number, b: number): CascadeTask => ({ op: 'add', operands: [a, b] });
const sub = (a: number, b: number): CascadeTask => ({ op: 'sub', operands: [a, b] });
const res = (column: number): CascadeCell => ({ row: 'result', column });
const car = (column: number): CascadeCell => ({ row: 'carry', column });

/** Postupně přepne buňky; vrátí stav a jestli se poslední dotek odmítl. */
function touch(cfg: CascadeConfig, ...cells: CascadeCell[]): { st: CascadeState; refused: boolean } {
  let st = initCascade(cfg);
  let refused = false;
  for (const cell of cells) {
    const r = toggle(cfg, st, cell);
    refused = r.events.some((e) => e.type === 'refuse');
    st = r.state;
  }
  return { st, refused };
}

describe('Zachování světla: krystal se nerozsvítí naprázdno', () => {
  const none = (task: CascadeTask): CascadeConfig => ({ width: 2, bits: 1, carries: 'none', conserve: true, tasks: [task] });
  const manual = (task: CascadeTask, width = 3): CascadeConfig => ({ width, carries: 'manual', conserve: true, tasks: [task] });

  it('Jedna a jedna, 1 + 0: krystal s váhou 2 nemá odkud dostat světlo', () => {
    expect(touch(none(add(1, 0)), res(1)).refused).toBe(true);
    expect(touch(none(add(1, 0)), res(0)).refused).toBe(false);
  });

  it('Jedna a jedna, 1 + 1: dvojice přeteče doleva jako jedno světlo, dolů se vejde jen jedno', () => {
    const cfg = none(add(1, 1));
    expect(touch(cfg, res(1)).refused).toBe(false);
    // Obě světla už přetekla doleva: dolů nezbylo nic.
    expect(touch(cfg, res(1), res(0)).refused).toBe(true);
    // Jedno světlo sjelo dolů: na dvojici, která by přetekla, už nezbývá.
    expect(touch(cfg, res(0), res(1)).refused).toBe(true);
  });

  it('s krystaly přenosu: dvě světla odtečou do přenosu, výsledek bere jen ze svého sloupce', () => {
    const cfg = manual(add(1, 1));
    expect(touch(cfg, res(1)).refused).toBe(true);
    expect(touch(cfg, car(1), res(1)).refused).toBe(false);
    expect(touch(cfg, car(1), res(0)).refused).toBe(true);
    expect(touch(cfg, res(0), car(1)).refused).toBe(true);
    // Tři světla ve sloupci: dvě nahoru, jedno dolů.
    const three = manual(add(0b011, 0b001));
    expect(touch(three, car(1), car(2), res(1)).refused).toBe(true);
    expect(touch(three, car(1), car(2), res(2)).refused).toBe(false);
  });

  it('odmítnutý dotek nic nemění a nesmaže označení chyby', () => {
    const cfg = manual(add(1, 1));
    const st = { ...initCascade(cfg), wrong: res(0) };
    const r = toggle(cfg, st, res(1));
    expect(r.state).toBe(st);
    expect(r.events).toEqual([{ type: 'refuse', cell: res(1) }]);
  });

  it('zhasnutý přenos vezme světlo i krystalům, které z něj svítily, a to po celém řetězu', () => {
    const cfg = manual(add(0b0111, 0b0001), 4);
    const { st } = touch(cfg, car(1), car(2), car(3), res(3));
    expect(st.carries).toBe(0b1110);
    const r = toggle(cfg, st, car(1));
    expect(r.state.carries).toBe(0);
    expect(r.state.result).toBe(0);
    expect(r.events).toEqual([{ type: 'toggle', cell: car(1), on: false, dropped: [car(2), car(3), res(3)] }]);
  });

  it('zhasnutý výsledek nikomu světlo nebere', () => {
    const cfg = manual(add(1, 1));
    const { st } = touch(cfg, car(1), res(1));
    expect(toggle(cfg, st, res(1)).events).toEqual([{ type: 'toggle', cell: res(1), on: false }]);
  });

  it('přepad dostane dvojici jen z nejlevějšího sloupce', () => {
    const cfg: CascadeConfig = { width: 2, carries: 'manual', overflow: true, conserve: true, tasks: [add(0b10, 0b10)] };
    expect(touch(cfg, car(2)).refused).toBe(false);
    expect(touch({ ...cfg, tasks: [add(0b10, 0b00)] }, car(2)).refused).toBe(true);
  });

  it('přenos o dvě místa potřebuje čtyři světla', () => {
    const cfg: CascadeConfig = { width: 4, bits: 2, carries: 'manual', farCarries: true, conserve: true, tasks: [{ op: 'add', operands: [1, 1, 1] }] };
    expect(touch(cfg, { row: 'far', column: 2 }).refused).toBe(true);
    expect(touch(cfg, car(1), res(0)).refused).toBe(false);
  });

  it('bez zachování světla jde rozsvítit cokoli', () => {
    const cfg: CascadeConfig = { width: 3, carries: 'manual', tasks: [add(1, 0)] };
    expect(touch(cfg, res(2), car(2)).refused).toBe(false);
    expect(flowToggle(cfg, cfg.tasks[0], initCascade(cfg), res(2)).refused).toBe(false);
  });
});

describe('Zachování světla při odčítání: soused půjčí jedno světlo, vpravo z něj jsou dvě', () => {
  it('2 − 1: výsledek vpravo se rozsvítí až s výpůjčkou, výpůjčka si vezme jediné světlo sloupce', () => {
    const cfg: CascadeConfig = { width: 2, carries: 'manual', conserve: true, tasks: [sub(0b10, 0b01)] };
    expect(touch(cfg, res(0)).refused).toBe(true);
    expect(touch(cfg, car(1), res(0)).refused).toBe(false);
    expect(touch(cfg, car(1), res(1)).refused).toBe(true);
  });

  it('řetěz výpůjček se staví zleva: půjčit může jen sloupec, který má z čeho', () => {
    const cfg: CascadeConfig = { width: 4, carries: 'manual', conserve: true, tasks: [sub(0b1000, 0b0001)] };
    expect(touch(cfg, car(1)).refused).toBe(true);
    expect(touch(cfg, car(3), car(2), car(1), res(0), res(1), res(2)).refused).toBe(false);
  });

  it('nápověda u řetězu ukáže nejdřív sloupec, který má z čeho půjčit', () => {
    const cfg: CascadeConfig = { width: 4, carries: 'manual', conserve: true, tasks: [sub(0b1000, 0b0001)] };
    expect(firstWrong(cfg, initCascade(cfg))).toEqual(car(3));
    // Bez zachování světla zůstává pořadí zprava.
    expect(firstWrong({ ...cfg, conserve: false }, initCascade(cfg))).toEqual(res(0));
  });

  it('ukázková úloha má výpůjčky předem na místě a všechny mají z čeho půjčit', () => {
    const cfg: CascadeConfig = { width: 4, carries: 'manual', conserve: true, demo: 0, tasks: [sub(0b0110, 0b0011)] };
    const st = initCascade(cfg);
    expect(st.carries).not.toBe(0);
    expect(unfedCells(cfg, cfg.tasks[0], st)).toEqual([]);
  });
});
