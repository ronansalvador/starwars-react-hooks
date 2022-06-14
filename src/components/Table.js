import React, { useContext, useEffect } from 'react';
import PlanetsContext from '../context/PlanetsContext';
import SearchName from './SearchName';
import Thead from './Thead';
import './Table.css';
import Tbody from './Tbody';
import trash from '../image/trash-solid.svg';

function Table() {
  const { data, requestApi, filters, setFilters, dataToFilter,
    setDataToFilter, filterNumeric, setFilterNumeric, inputColumn,
    inputComparison, inputNumber, orderColumn, setOrderColumn,
    inputSort, setInputSort, allColumns, columnsName, setColumnsName, onClickFilter,
    handleColumn, handleComparison, handleNumber, filterColumns,
    planetsData, setPlanetsData, saveNumericFilters,
    removeFilter } = useContext(PlanetsContext);
  const { filterByNumericValues, order } = filters;

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

  function showFilters() {
    return (
      <div>
        {filterNumeric && filterNumeric.map((filter, index) => (
          <div data-testid="filter" key={ index } className="numeric-filters">
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
              <input type="image" src={ trash } alt="excluir" />
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

  const orderPlanets = () => {
    setFilters({ ...filters,
      order: {
        column: orderColumn,
        sort: inputSort,
      } });
  };

  useEffect(() => {
    const unknownData = data
      .filter((planet) => planet[order.column] === 'unknown');
    const planets = data.filter((planet) => planet[order.column] !== 'unknown');
    setPlanetsData({
      unknownData,
      planets,
    });
  }, [order, data]);

  useEffect(() => {
    let sortedList = [];
    const { unknownData, planets } = planetsData;

    if (order.sort === 'ASC') {
      sortedList = planets
        .sort((a, b) => Number(a[order.column]) - Number(b[order.column]));
      return setDataToFilter([...sortedList, ...unknownData]);
    }
    if (order.sort === 'DESC') {
      sortedList = planets
        .sort((a, b) => Number(b[order.column]) - Number(a[order.column]));
      return setDataToFilter([...sortedList, ...unknownData]);
    }
  }, [order, planetsData]);

  return (
    <main>
      <h1>Projeto Starwars</h1>
      <SearchName filters />
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
        <label htmlFor="orderColumns">
          Ordenar
          <select
            id="orderColumns"
            data-testid="column-sort"
            value={ orderColumn }
            onChange={ ({ target }) => setOrderColumn(target.value) }
          >
            { allColumns.map((column, index) => (
              <option value={ column } key={ index }>
                {column}
              </option>
            ))}
          </select>
        </label>
        <div className="radio-sort">
          <label htmlFor="asc">
            <input
              type="radio"
              name="sort"
              id="asc"
              value="ASC"
              data-testid="column-sort-input-asc"
              onClick={ ({ target }) => setInputSort(target.value) }
            />
            Ascendente
          </label>
          <label htmlFor="desc">
            <input
              type="radio"
              name="sort"
              id="desc"
              value="DESC"
              data-testid="column-sort-input-desc"
              onClick={ ({ target }) => setInputSort(target.value) }
            />
            Descendente
          </label>
        </div>
        <button
          type="button"
          data-testid="column-sort-button"
          onClick={ orderPlanets }
        >
          Ordernar
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
