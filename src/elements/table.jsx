import { Table } from 'antd';
import { TableOutlined } from '@ant-design/icons';

export const definition = {
  type: 'Table',
  label: 'Таблица',
  icon: TableOutlined,
  defaultProps: {
    size: 'middle',
    bordered: true,
    showHeader: true,
    striped: false,
    loading: false,
    pagination: false,
    pageSize: 5,
    scrollX: false,
    columnCount: 3,
    rowCount: 3,
  },
  properties: [
    { name: 'size', label: 'Размер', type: 'select', options: ['large', 'middle', 'small'] },
    { name: 'bordered', label: 'Рамка', type: 'checkbox' },
    { name: 'showHeader', label: 'Показывать заголовок', type: 'checkbox' },
    { name: 'striped', label: 'Полосатая (zebra)', type: 'checkbox' },
    { name: 'loading', label: 'Загрузка', type: 'checkbox' },
    { name: 'pagination', label: 'Пагинация', type: 'checkbox' },
    { name: 'pageSize', label: 'Строк на страницу', type: 'number', min: 5, max: 100, step: 5 },
    { name: 'scrollX', label: 'Горизонтальная прокрутка', type: 'checkbox' },
    { name: 'columnCount', label: 'Количество столбцов', type: 'number', min: 1, max: 10 },
    { name: 'rowCount', label: 'Количество строк', type: 'number', min: 0, max: 50 },
  ],
};

export default function TableElement({ element, isSelected }) {
  const {
    size = 'middle',
    bordered = true,
    showHeader = true,
    striped = false,
    loading = false,
    pagination = true,
    pageSize = 5,
    scrollX = false,
    columnCount = 3,
    rowCount = 3,
  } = element.props || {};

  // Генерация пустых колонок
  const generateColumns = () => {
    return Array.from({ length: columnCount }, (_, i) => ({
      title: `Колонка ${i + 1}`,
      dataIndex: `col${i + 1}`,
      key: `col${i + 1}`,
      width: 120,
      render: (text) => <span style={{ color: '#888', fontSize: 12 }}>{text || '—'}</span>,
    }));
  };

  // Генерация пустых строк
  const generateDataSource = () => {
    return Array.from({ length: rowCount }, (_, rowIndex) => {
      const row = { key: `row-${rowIndex + 1}` };
      for (let i = 0; i < columnCount; i++) {
        row[`col${i + 1}`] = ''; // Пустое значение
      }
      return row;
    });
  };

  const columns = generateColumns();
  const dataSource = generateDataSource();

  const tableProps = {
    columns,
    dataSource,
    size,
    bordered,
    showHeader,
    loading,
    pagination: pagination ? { pageSize, simple: true } : false,
    scroll: scrollX ? { x: true } : undefined,
    style: {
      pointerEvents: isSelected ? 'none' : 'auto',
      minWidth: 300,
      background: '#fff',
    },
  };

  if (striped) {
    tableProps.rowClassName = (record, index) => (index % 2 === 1 ? 'table-striped-row' : '');
  }

  return (
    <div style={{ width: '100%', maxWidth: '100%' }}>
      <Table {...tableProps} />
      <style>{`
        .table-striped-row {
          background-color: #fafafa;
        }
        .table-striped-row:hover {
          background-color: #f5f5f5 !important;
        }
        .ant-table-cell {
          font-size: 12px;
        }
        .ant-table-thead > tr > th {
          background: #f5f5f5;
          font-weight: 500;
          color: #666;
        }
      `}</style>
    </div>
  );
}