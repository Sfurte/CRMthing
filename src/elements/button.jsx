import { Button } from 'antd';
import { InteractionOutlined } from '@ant-design/icons';

export const definition = {
  type: 'Button',
  label: 'Кнопка',
  icon: InteractionOutlined,
  defaultProps: {
    text: 'Нажми меня',
    type: 'primary',
    size: 'middle',
    variant: 'solid',
    color: 'primary',
    shape: 'default',
    block: false,
    disabled: false,
    loading: false,
    danger: false,
    ghost: false,
    icon: null,
    iconPlacement: 'start',
  },
  properties: [
    { name: 'text', label: 'Текст', type: 'text' },
    { name: 'type', label: 'Тип', type: 'select', options: ['primary', 'default', 'dashed', 'text', 'link'] },
    { name: 'variant', label: 'Вариант', type: 'select', options: ['solid', 'outlined', 'dashed', 'filled', 'text', 'link'] },
    { name: 'color', label: 'Цвет', type: 'select', options: ['primary', 'default', 'danger', 'blue', 'purple', 'cyan', 'green', 'magenta', 'pink', 'red', 'orange', 'yellow', 'volcano', 'geekblue', 'lime', 'gold'] },
    { name: 'size', label: 'Размер', type: 'select', options: ['large', 'middle', 'small'] },
    { name: 'shape', label: 'Форма', type: 'select', options: ['default', 'circle', 'round'] },
    { name: 'block', label: 'На всю ширину', type: 'checkbox' },
    { name: 'disabled', label: 'Отключена', type: 'checkbox' },
    { name: 'loading', label: 'Загрузка', type: 'checkbox' },
    { name: 'danger', label: 'Опасная', type: 'checkbox' },
    { name: 'ghost', label: 'Прозрачная', type: 'checkbox' },
    { name: 'iconPlacement', label: 'Позиция иконки', type: 'select', options: ['start', 'end'] },
  ],
};

export default function ButtonElement({ element, isSelected }) {
  const {
    text = 'Нажми меня',
    type = 'primary',
    size = 'middle',
    variant = 'solid',
    color = 'primary',
    shape = 'default',
    block = false,
    disabled = false,
    loading = false,
    danger = false,
    ghost = false,
    icon = null,
    iconPlacement = 'start',
  } = element.props || {};

  const ButtonIcon = icon && typeof icon === 'string' 
    ? () => <span>{icon}</span> 
    : (icon || null);

  return (
    <Button
      type={type}
      size={size}
      variant={variant}
      color={color}
      shape={shape}
      block={block}
      disabled={disabled || isSelected}
      loading={loading}
      danger={danger}
      ghost={ghost}
      icon={ButtonIcon ? <ButtonIcon /> : undefined}
      iconPlacement={iconPlacement}
      style={{
        pointerEvents: isSelected ? 'none' : 'auto',
        cursor: isSelected ? 'default' : 'pointer',
      }}
      onClick={(e) => e?.stopPropagation?.()}
    >
      {text}
    </Button>
  );
}