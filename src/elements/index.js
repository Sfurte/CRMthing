import ButtonElement, { definition as buttonDef } from './button';
import CardElement, { definition as cardDef } from './card';
import InputElement, { definition as inputDef } from './input';
import TextElement, { definition as textDef } from './text';
import TableElement, { definition as tableDef } from './table';
import GridElement, { definition as gridDef } from './grid';
import ImageElement, { definition as imageDef } from './image';

export const ELEMENTS = {
  Button: ButtonElement,
  Card: CardElement,
  Input: InputElement,
  Text: TextElement,
  Table: TableElement,
  Grid: GridElement,
  Image: ImageElement,
};

export const ELEMENT_DEFINITIONS = [
  buttonDef,
  cardDef,
  inputDef,
  textDef,
  tableDef,
  gridDef,
  imageDef,
];