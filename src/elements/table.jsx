import { Table } from 'antd';
import { getMockData, MOCK_DATA_OPTIONS } from '../mockData';

export const definition = {
  type: 'Table',
  label: 'Таблица',
  defaultProps: {
    mockDataId: 'users',
  },
  defaultWidth: 500,
  defaultHeight: 250,
  properties: [
    { name: 'mockDataId', label: 'Макет данных', type: 'select', options: MOCK_DATA_OPTIONS },
  ],
};

export default function TableElement({ element }) {
  const mockDataId = element?.props?.mockDataId || 'users';
  const mock = getMockData(mockDataId);

  return (
    <div style={{ width: '100%', padding: 4 }}>
      <Table
        columns={mock.columns}
        dataSource={mock.data}
        size="small"
        pagination={false}
        bordered
      />
    </div>
  );
}
