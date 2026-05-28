import { Table } from 'antd';

const columns = [
  { title: 'Имя', dataIndex: 'name', key: 'name' },
  { title: 'Возраст', dataIndex: 'age', key: 'age' },
  { title: 'Город', dataIndex: 'city', key: 'city' },
];

const dataSource = [
  { key: '1', name: 'Иван', age: 28, city: 'Москва' },
  { key: '2', name: 'Анна', age: 34, city: 'СПб' },
  { key: '3', name: 'Пётр', age: 22, city: 'Казань' },
];

export const definition = {
  type: 'Table',
  label: 'Таблица',
};

export default function TableElement() {
  return (
    <div style={{ width: 400, padding: 4 }}>
      <Table
        columns={columns}
        dataSource={dataSource}
        size="small"
        pagination={false}
        bordered
      />
    </div>
  );
}
