import DataTable, { TableColumn } from 'react-data-table-component'

type DataRow = {
  title: string
  director: string
  year: string
}

const columns: TableColumn<DataRow>[] = [
  { name: 'Mã đơn' },
  {
    name: 'Danh sách sản phẩm',
    selector: (row) => row.title,
  },
  {
    name: 'Thành tiền',
    selector: (row) => row.director,
  },
  {
    name: 'Trạng thái',
    selector: (row) => row.year,
  },
  {
    name: 'Đơn vị vận chuyển',
  },
  {
    name: 'Thời gian tạo',
  },
  {
    name: 'Thao tác',
  },
]

const data = [
  { title: 'The Shawshank Redemption', director: 'Frank Darabont', year: '1994' },
  { title: 'The Godfather', director: 'Francis Ford Coppola', year: '1972' },
  { title: 'The Godfather: Part II', director: 'Francis Ford Coppola', year: '1974' },
  { title: 'The Dark Knight', director: 'Christopher Nolan', year: '2008' },
  { title: '12 Angry Men', director: 'Sidney Lumet', year: '1957' },
  { title: "Schindler's List", director: 'Steven Spielberg', year: '1993' },
  { title: 'Pulp Fiction', director: 'Quentin Tarantino', year: '1994' },
  { title: 'The Good, the Bad and the Ugly', director: 'Sergio Leone', year: '1966' },
  { title: 'Fight Club', director: 'David Fincher', year: '1999' },
  { title: 'The Lord of the Rings: The Return of the King', director: 'Peter Jackson', year: '2003' },
]

const UnpaidOrder = () => {
  return (
    <>
      <DataTable columns={columns} data={data} pagination expandableRows selectableRows />;
    </>
  )
}

export default UnpaidOrder
