import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

function DataTable({ league, headers, awayData, homeData, awayColor, homeColor, footerData }) {
  const getCellClass = (index) => {
    if (league === 'mlb') {
      return awayData.length - index < 4 ? 'total-col' : '';
    } else {
      return awayData.length - index === 1 ? 'total-col' : '';
    }
  };
  return (
    <TableContainer id='boxscore-table' component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {headers.map((header, index) => (
              <TableCell key={header} className={getCellClass(index)}>
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            {awayData.map((dataElement, index) => (
              <TableCell key={index} style={{ color: !index && awayColor }} className={getCellClass(index)}>
                {dataElement}
              </TableCell>
            ))}
          </TableRow>

          <TableRow>
            {homeData.map((dataElement, index) => (
              <TableCell key={index} style={{ color: !index && homeColor }} className={getCellClass(index)}>
                {dataElement}
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell style={{ color: awayColor }} colSpan={awayData.length / 3}>
              <Typography variant='h6'> {footerData.awayName}</Typography>
            </TableCell>
            <TableCell colSpan={awayData.length / 3}>
              <Typography variant='h6'> {footerData.status}</Typography>
            </TableCell>
            <TableCell style={{ color: homeColor }} colSpan={awayData.length / 3}>
              <Typography variant='h6'> {footerData.homeName}</Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default DataTable;
