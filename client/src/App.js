import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Header from './Header';
import BoxscoreTable from './BoxscoreTable';

function App() {
  const [league, setLeague] = useState(null);
  const [tableHeaders, setTableHeaders] = useState(null);
  const [tableData, setTableData] = useState(null);
  const [tableColors, setTableColors] = useState({ awayColor: '', homeColor: '' });

  const colorMap = {
    LAA: 'rgba(186,0,33, 1)',
    SEA: 'rgba(0, 92, 92, 1)',
    OKC: 'rgba(239, 59, 36, 1)',
    MIA: 'rgba(249, 160, 27)',
  };

  useEffect(() => {
    setTableData(null);
    setLeague(getLeague());
    if (league) {
      updateBoxscoreData();
    }
  }, [league]);

  const getLeague = () => {
    const availableLeagues = ['mlb', 'nba'];
    const leagueFromUrl = window.location.pathname.slice(1);
    return availableLeagues.find((availableLeague) => availableLeague === leagueFromUrl);
  };

  const updateBoxscoreData = async () => {
    const endpoint = 'http://localhost:5000/api/v1/boxscore';
    const response = await fetch(`${endpoint}?league=${league}`);
    const responseData = await response.json();
    setTableHeaders(getTableHeaders(responseData));
    setTableData(getTableData(responseData));
    setTableColors(getTableColors(responseData));
  };

  const getTableColors = (responseData) => {
    const { away_team, home_team } = responseData;
    return {
      awayColor: colorMap[away_team.abbreviation],
      homeColor: colorMap[home_team.abbreviation],
    };
  };

  const getTableHeaders = (responseData) => {
    const regulationPeriods = league === 'mlb' ? 9 : 4;
    const currentPeriod = responseData.away_period_scores.length;
    const overtimePeriods = currentPeriod > regulationPeriods ? currentPeriod - regulationPeriods : 0;
    const headerArray = Array.from({ length: regulationPeriods + overtimePeriods }).map((period, index) => {
      if (league === 'mlb') {
        return index + 1;
      } else {
        return index < 4 ? index + 1 : 'OT';
      }
    });
    if (league === 'mlb') {
      headerArray.push('R', 'H', 'E');
    } else {
      headerArray.push('T');
    }
    return ['', ...headerArray];
  };

  const getTableData = (responseData) => {
    const { away_team, away_period_scores, away_errors, away_batter_totals, away_totals } = responseData;
    const { home_team, home_period_scores, home_errors, home_batter_totals, home_totals } = responseData;
    const awayData = [away_team.abbreviation];
    awayData.push(...away_period_scores);
    const homeData = [home_team.abbreviation];
    homeData.push(...home_period_scores);
    const regulationPeriods = league === 'mlb' ? 9 : 4;
    const currentPeriod = responseData.away_period_scores.length;
    const periodsToGo = regulationPeriods - currentPeriod;
    if (periodsToGo > 0) {
      awayData.push(...Array.from({ length: periodsToGo }).map((unstartedPeriod) => ''));
      homeData.push(...Array.from({ length: periodsToGo }).map((unstartedPeriod) => ''));
    }
    if (league === 'mlb') {
      awayData.push(away_batter_totals.runs, away_batter_totals.hits, away_errors);
      homeData.push(home_batter_totals.runs, home_batter_totals.hits, home_errors);
    }
    if (league === 'nba') {
      awayData.push(away_totals.points);
      homeData.push(home_totals.points);
    }
    const footerData = {
      homeName: home_team.last_name,
      awayName: away_team.last_name,
      status: getGameStatus(responseData.event_information.status),
    };
    return { awayData, homeData, footerData };
  };

  const getGameStatus = (rawStatus) => {
    if (rawStatus === 'completed') {
      return 'Final';
    }
    // In what format does the status come when not completed? Assuming already formatted...
    return rawStatus;
  };

  return (
    <Router>
      <Header league={league} onLeagueChange={(event, newValue) => setLeague(newValue)} />
      <Switch>
        <Route path={['/mlb', '/nba']}>
          {tableData && <BoxscoreTable league={league} headers={tableHeaders} {...tableData} {...tableColors} />}
        </Route>
        <Route path='*'>
          <p>Page not found</p>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
