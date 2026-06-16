import ButtonElement, { definition as buttonDef } from './button';
import CardElement, { definition as cardDef } from './card';
import ContainerElement, { definition as containerDef } from './container';
import InputElement, { definition as inputDef } from './input';
import TextElement, { definition as textDef } from './text';
import TableElement, { definition as tableDef } from './table';
import GridElement, { definition as gridDef } from './grid';
import ImageElement, { definition as imageDef } from './image';
import ChartElement, { definition as chartDef } from './chart';
import RadioElement, { definition as radioDef } from './radio';
import CheckboxElement, { definition as checkboxDef } from './checkbox';

const withSize = (def, w, h) => ({
  ...def,
  defaultWidth: w,
  defaultHeight: h,
});

export const ELEMENTS = {
  Button: ButtonElement,
  Card: CardElement,
  Container: ContainerElement,
  Input: InputElement,
  Text: TextElement,
  Table: TableElement,
  Grid: GridElement,
  Image: ImageElement,
  Chart: ChartElement,
  Radio: RadioElement,
  Checkbox: CheckboxElement,
};

export const ELEMENT_DEFINITIONS = [
  withSize(buttonDef, 150, 40),
  withSize(cardDef, 250, 150),
  withSize(containerDef, 300, 200),
  withSize(inputDef, 200, 80),
  withSize(textDef, 150, 30),
  withSize(tableDef, 400, 250),
  withSize(gridDef, 400, 200),
  withSize(imageDef, 300, 200),
  withSize(chartDef, 400, 300),
  withSize(radioDef, 400, 300),
  withSize(checkboxDef, 250, 200),
];
