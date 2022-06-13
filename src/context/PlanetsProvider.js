import React, { useState } from 'react';
import PropTypes from 'prop-types';
import PlanetsContext from './PlanetsContext';
import response from '../testData';

function PlanetsProvider({ children }) {
  const [data, setData] = useState([]);

  const [filters, setFilters] = useState(
    {
      filterByName: {
        name: '',
      },
      filterByNumericValues: [],
      order: {
        column: '', sort: '',
      },
    },
  );

  const { filterByNumericValues } = filters;

  const [dataToFilter, setDataToFilter] = useState([]);
  const [filterNumeric, setFilterNumeric] = useState([]);
  const [inputColumn, setInputColumn] = useState('population');
  const [inputComparison, setInputComparison] = useState('maior que');
  const [inputNumber, setInputNumber] = useState(0);
  const [orderColumn, setOrderColumn] = useState('population');
  const [inputSort, setInputSort] = useState('');
  const initialFilter = { column: inputColumn,
    comparison: inputComparison,
    value: inputNumber };
  const [saveFilters, setSaveFilters] = useState(initialFilter);

  const allColumns = ['population', 'orbital_period', 'diameter',
    'rotation_period', 'surface_water'];

  const [columnsName, setColumnsName] = useState(allColumns);

  const [planetsData, setPlanetsData] = useState({
    unknownData: [],
    planets: [],
  });

  function requestApi() {
    fetch('https://swapi-trybe.herokuapp.com/api/planets/')
      .then((result) => result.json());
    //   .then((result) => setData(result.results));
    setData(response.results.sort((a, b) => a.name.localeCompare(b.name)));
    // setData(response.results);
  }

  function onClickFilter({ column, comparison, value }) {
    if (comparison === 'maior que') {
      setDataToFilter(dataToFilter
        .filter((planet) => Number(planet[column]) > Number(value)));
    }
    if (comparison === 'menor que') {
      setDataToFilter(dataToFilter
        .filter((planet) => Number(planet[column]) < Number(value)));
    }
    if (comparison === 'igual a') {
      setDataToFilter(dataToFilter
        .filter((planet) => Number(planet[column]) === Number(value)));
    }
  }

  function handleColumn({ target: { name, value } }) {
    setInputColumn(value);
    setSaveFilters({ ...saveFilters, [name]: value });
  }

  function handleComparison({ target: { name, value } }) {
    setInputComparison(value);
    setSaveFilters({ ...saveFilters, [name]: value });
  }

  function handleNumber({ target: { name, value } }) {
    setInputNumber(value);
    setSaveFilters({ ...saveFilters, [name]: value });
  }

  function filterColumns({ column }) {
    setColumnsName(columnsName.filter((element) => element !== column));
  }

  function saveNumericFilters() {
    const numericFilter = {
      column: inputColumn,
      comparison: inputComparison,
      value: inputNumber,
    };
    setFilters({ ...filters,
      filterByNumericValues: [...filters.filterByNumericValues, numericFilter] });
    setFilterNumeric([...filterNumeric, numericFilter]);
  }

  function removeFilter({ target: { name } }) {
    setFilterNumeric(filterNumeric.filter((element) => element.column !== name));
    setFilters({ ...filters,
      filterByNumericValues: filterByNumericValues
        .filter((element) => element.column !== name) });
  }

  const contextValue = {
    data,
    setData,
    requestApi,
    filters,
    setFilters,
    dataToFilter,
    setDataToFilter,
    filterNumeric,
    setFilterNumeric,
    inputColumn,
    inputComparison,
    inputNumber,
    orderColumn,
    setOrderColumn,
    inputSort,
    setInputSort,
    allColumns,
    columnsName,
    setColumnsName,
    onClickFilter,
    handleColumn,
    handleComparison,
    handleNumber,
    filterColumns,
    planetsData,
    setPlanetsData,
    saveNumericFilters,
    removeFilter,
  };

  return (
    <PlanetsContext.Provider
      value={ contextValue }
    >
      {children}
    </PlanetsContext.Provider>
  );
}

PlanetsProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};
export default PlanetsProvider;
