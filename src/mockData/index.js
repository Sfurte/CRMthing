export const datasets = [
  {
    id: 'users',
    label: 'Пользователи',
    columns: [
      { title: 'Имя', dataIndex: 'name', key: 'name' },
      { title: 'Email', dataIndex: 'email', key: 'email' },
      { title: 'Город', dataIndex: 'city', key: 'city' },
    ],
    data: [
      { key: '1', name: 'Иван Иванов', email: 'ivan@mail.com', city: 'Москва' },
      { key: '2', name: 'Анна Петрова', email: 'anna@mail.com', city: 'Санкт-Петербург' },
      { key: '3', name: 'Пётр Сидоров', email: 'petr@mail.com', city: 'Казань' },
      { key: '4', name: 'Мария Смирнова', email: 'maria@mail.com', city: 'Екатеринбург' },
    ],
  },
  {
    id: 'products',
    label: 'Товары',
    columns: [
      { title: 'Название', dataIndex: 'name', key: 'name' },
      { title: 'Категория', dataIndex: 'category', key: 'category' },
      { title: 'Цена', dataIndex: 'price', key: 'price' },
      { title: 'Остаток', dataIndex: 'stock', key: 'stock' },
    ],
    data: [
      { key: '1', name: 'Ноутбук', category: 'Электроника', price: '75000 ₽', stock: 12 },
      { key: '2', name: 'Клавиатура', category: 'Электроника', price: '3500 ₽', stock: 45 },
      { key: '3', name: 'Кофеварка', category: 'Бытовая техника', price: '12000 ₽', stock: 8 },
      { key: '4', name: 'Наушники', category: 'Электроника', price: '5500 ₽', stock: 23 },
    ],
  },
  {
    id: 'orders',
    label: 'Заказы',
    columns: [
      { title: '№ заказа', dataIndex: 'id', key: 'id' },
      { title: 'Клиент', dataIndex: 'client', key: 'client' },
      { title: 'Сумма', dataIndex: 'amount', key: 'amount' },
      { title: 'Статус', dataIndex: 'status', key: 'status' },
    ],
    data: [
      { key: '1', id: 'ORD-001', client: 'Иван Иванов', amount: '75000 ₽', status: 'Доставлен' },
      { key: '2', id: 'ORD-002', client: 'Анна Петрова', amount: '12000 ₽', status: 'В пути' },
      { key: '3', id: 'ORD-003', client: 'Пётр Сидоров', amount: '3500 ₽', status: 'Обработка' },
      { key: '4', id: 'ORD-004', client: 'Мария Смирнова', amount: '18500 ₽', status: 'Доставлен' },
    ],
  },
];

export const MOCK_DATA_OPTIONS = datasets.map((d) => ({
  value: d.id,
  label: d.label,
}));

export function getMockData(id) {
  return datasets.find((d) => d.id === id) || datasets[0];
}
