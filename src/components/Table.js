import React, { useContext, useEffect, useState } from 'react';
import PlanetsContext from '../context/PlanetsContext';
import Thead from './Thead';
import './Table.css';
import Tbody from './Tbody';

function Table() {
  const { data, requestApi, filters, setFilters } = useContext(PlanetsContext);
  const { filterByNumericValues } = filters;
  const [dataToFilter, setDataToFilter] = useState([]);
  const [filterNumeric, setFilterNumeric] = useState([]);
  const [inputColumn, setInputColumn] = useState('population');
  const [inputComparison, setInputComparison] = useState('maior que');
  const [inputNumber, setInputNumber] = useState(0);
  const initialFilter = { column: inputColumn,
    comparison: inputComparison,
    value: inputNumber };
  const [saveFilters, setSaveFilters] = useState(initialFilter);

  const allColumns = ['population', 'orbital_period', 'diameter',
    'rotation_period', 'surface_water'];

  const [columnsName, setColumnsName] = useState(allColumns);

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

  function handleChange({ target }) {
    setFilters(
      { ...filters,
        filterByName: {
          name: target.value,
        } },
    );
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

  useEffect(() => {
    if (filters.filterByNumericValues.length > 0) {
      const lengthFilter = filters.filterByNumericValues.length - 1;
      onClickFilter(filters.filterByNumericValues[lengthFilter]);
      filterColumns(filters.filterByNumericValues[lengthFilter]);
    }
  }, [filters.filterByNumericValues]);

  useEffect(() => {
    const newColumns = allColumns.reduce((acc, col) => {
      if (filters.filterByNumericValues.some((e) => e.column === col)) {
        return acc;
      }
      acc.push(col);
      return acc;
    }, []);
    setColumnsName(newColumns);
  }, [filters.filterByNumericValues]);

  useEffect(() => {
    const { name: inputName } = filters.filterByName;
    const filterByName = data.filter(
      (planet) => planet.name.toLowerCase().includes(inputName.toLowerCase()),
    );

    const filterByAll = filterByNumericValues.reduce((acc, filtro) => acc
      .filter((planeta) => {
        switch (filtro.comparison) {
        case 'maior que':
          return planeta[filtro.column] > Number(filtro.value);
        case 'menor que':
          return planeta[filtro.column] < Number(filtro.value);
        case 'igual a':
          return Number(planeta[filtro.column]) === Number(filtro.value);
        default:
          return true;
        }
      }), filterByName);
    setDataToFilter(filterByAll);
  }, [data, filters.filterByName, filterByNumericValues]);

  useEffect(() => {
    requestApi();
  }, [requestApi]);

  function saveNumericFilters() {
    // showFilters();
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

  function showFilters() {
    return (
      <div>
        {filterNumeric && filterNumeric.map((filter, index) => (
          <div data-testid="filter" key={ index }>
            <span>
              {' '}
              {filter.column}
              {' '}
              {filter.comparison}
              {' '}
              {filter.value}
              {' '}
            </span>
            <button
              type="button"
              onClick={ removeFilter }
              name={ filter.column }
            >
              x
            </button>
          </div>
        )) }
      </div>
    );
  }

  const removeAllFilters = () => {
    setFilterNumeric([]);
    setColumnsName(allColumns);
    setDataToFilter(data);
  };

  return (
    <main>
      <h1>Projeto Starwars</h1>
      <div className="filterName">
        <label htmlFor="filterName">
          Buscar por nome:
          <input
            type="text"
            onChange={ handleChange }
            data-testid="name-filter"
            id="filterName"
          />
        </label>
      </div>
      <div className="filters">
        <label htmlFor="column">
          Coluna
          <select
            name="column"
            id="column"
            onChange={ handleColumn }
            data-testid="column-filter"
            value={ inputColumn }
          >
            {columnsName
        && columnsName.map((element, index) => (
          <option value={ element } key={ index }>
            {element}
          </option>
        ))}
          </select>
        </label>
        <label htmlFor="comparison">
          Operador
          <select
            name="comparison"
            id="comparison"
            onChange={ handleComparison }
            data-testid="comparison-filter"
            value={ inputComparison }
          >
            <option value="maior que">maior que</option>
            <option value="menor que">menor que</option>
            <option value="igual a">igual a</option>
          </select>
        </label>
        <input
          type="number"
          onChange={ handleNumber }
          name="value"
          data-testid="value-filter"
          value={ inputNumber }
        />
        <button
          type="button"
          onClick={ saveNumericFilters }
          data-testid="button-filter"
        >
          Filtrar
        </button>
        <button
          type="button"
          data-testid="button-remove-filters"
          onClick={ removeAllFilters }
        >
          Remover Filtros
        </button>
      </div>
      { showFilters() }
      <table className="tabela">
        <Thead />
        <Tbody data={ dataToFilter } />
      </table>
    </main>
  );
}

export default Table;
