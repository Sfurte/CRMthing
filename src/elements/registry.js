import ButtonElement, { definition as buttonDef } from './button';
import CardElement, { definition as cardDef } from './card';
import InputElement, { definition as inputDef } from './input';
import TextElement, { definition as textDef } from './text';
import TableElement, { definition as tableDef } from './table';
import GridElement, { definition as gridDef } from './grid';
import RadioElement, { definition as radioDef } from './radio';

// Карта компонентов для рендеринга на доске
export const ELEMENTS = {
  Button: ButtonElement,
  Card: CardElement,
  Input: InputElement,
  Text: TextElement,
  Table: TableElement,
  Grid: GridElement,
  Radio: RadioElement,
};

// Список определений для меню (сайдбара)
export const ELEMENT_DEFINITIONS = [
  buttonDef,
  cardDef,
  inputDef,
  textDef,
  tableDef,
  gridDef,
  radioDef,
];

// Для совместимости со старым кодом
export const elementDefinitions = ELEMENT_DEFINITIONS;