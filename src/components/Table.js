import React, { useContext, useEffect, useState } from 'react';
import PlanetsContext from '../context/PlanetsContext';

function Table() {
  const { data, requestApi, filters, setFilters } = useContext(PlanetsContext);
  const [dataToFilter, setDataToFilter] = useState([]);
  const [filterNumeric, setFilterNumeric] = useState([]);
  const [inputColumn, setInputColumn] = useState('population');
  const [inputComparison, setInputComparison] = useState('maior que');
  const [inputNumber, setInputNumber] = useState(0);
  const initialFilter = {
    column: inputColumn,
    comparison: inputComparison,
    value: inputNumber };
  const [saveFilters, setSaveFilters] = useState(initialFilter);
  console.log(inputColumn, inputComparison, inputNumber);

  const [columnsName, setColumnsName] = useState(
    ['population',
      'orbital_period',
      'diameter',
      'rotation_period', 'surface_water'],
  );

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
    function filterName(nome) { // busca por nome
      const filterByName = data.filter(
        (planet) => planet.name.toLowerCase().includes(nome.toLowerCase()),
      );
      setDataToFilter(filterByName);
    }
    filterName(filters.filterByName.name);
  }, [data, filters.filterByName.name]);

  useEffect(() => {
    requestApi();
  }, [requestApi]);

  function removeFilter({ target: { name } }) {
    setDataToFilter(data);
    setFilterNumeric(filterNumeric.filter((element) => element.column !== name));
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

  function saveNumericFilters() {
    // setFilters({ ...filters,
    //   filterByNumericValues: [...filters.filterByNumericValues, saveFilters] });
    // if (filterNumeric.length === 0) {
    //   setFilterNumeric([saveFilters]);
    // } else {
    //   console.log(saveFilters);
    //   setFilterNumeric([...filterNumeric, ...saveFilters]);
    // }
    // showFilters();
    const numericFilter = {
      column: inputColumn,
      comparison: inputComparison,
      value: inputNumber,
    };
    setFilters({ ...filters,
      filterByNumericValues: [...filters.filterByNumericValues, numericFilter] });

    setFilterNumeric([...filterNumeric, numericFilter]);
    console.log('column', inputColumn);
    console.log('comparison', inputComparison);
    console.log('value', inputNumber);
    console.log(numericFilter);
  }

  return (
    <main>
      <input type="text" onChange={ handleChange } data-testid="name-filter" />
      <select
        name="column"
        // onChange={ ({ target }) => setInputColumn(target.value) }
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
      <select
        name="comparison"
        // onChange={ ({ target }) => setInputComparison(target.value) }
        onChange={ handleComparison }
        data-testid="comparison-filter"
        value={ inputComparison }
      >
        <option value="maior que">maior que</option>
        <option value="menor que">menor que</option>
        <option value="igual a">igual a</option>
      </select>
      <input
        type="number"
        // onChange={ ({ target }) => setInputNumber(target.value) }
        onChange={ handleNumber }
        name="value"
        data-testid="value-filter"
        value={ inputNumber }
      />
      <button
        type="button"
        onClick={ saveNumericFilters }
        // onClick={ testeFilter }
        data-testid="button-filter"
      >
        Filtrar
      </button>
      { showFilters() }
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Rotation Period</th>
            <th>Orbital Period</th>
            <th>Diameter</th>
            <th>Climate</th>
            <th>Gravity</th>
            <th>Terrain</th>
            <th>Surface Water</th>
            <th>Population</th>
            <th>Films</th>
            <th>Created</th>
            <th>Edited</th>
            <th>URL</th>
          </tr>
        </thead>
        <tbody>
          {dataToFilter.map((planet) => (
            <tr key={ planet.name }>
              <td data-testid="planet-name">{ planet.name }</td>
              <td>{ planet.rotation_period }</td>
              <td>{ planet.orbital_period }</td>
              <td>{ planet.diameter }</td>
              <td>{ planet.climate }</td>
              <td>{ planet.gravity }</td>
              <td>{ planet.terrain }</td>
              <td>{ planet.surface_water }</td>
              <td>{ planet.population }</td>
              <td>{ planet.films.map((element) => element) }</td>
              <td>{ planet.created }</td>
              <td>{ planet.edited }</td>
              <td>{ planet.url }</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

export default Table;
