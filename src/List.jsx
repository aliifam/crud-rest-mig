import { useState } from "react";

function List({ data, editHandler, deleteHandler }) {

  const [filteredResults, setFilteredResults] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [filterInput, setFilterInput] = useState('')
  const [sortInput, setSortInput] = useState('')

  const options = [
    {value: '', text: '--Choose an option--'},
    {value: 'true', text: 'status true'},
    {value: 'false', text: 'status false'},
  ];

  const options2 = [
    {value: '', text: '--Choose an option--'},
    {value: 'ascending', text: 'ascending (A-Z)'},
    {value: 'descending', text: 'descending (Z-A)'},
  ];

  const [selected, setSelected] = useState(options[0].value);
  const [selected2, setSelected2] = useState(options2[0].value);

  const handleFilter = event => {
    console.log(event.target.value);
    setSelected(event.target.value);
    filterItems(event.target.value);
  };

  const handleSort = event => {
    console.log(event.target.value);
    setSelected2(event.target.value);
    sortItems(event.target.value);
  };
  

  const searchItems = (searchValue) => {
    setSearchInput(searchValue)
    if (searchInput !== '') {
        const filteredData = data.filter((item) => {
            return Object.values(item).join('').toLowerCase().includes(searchInput.toLowerCase())
        })
        setFilteredResults(filteredData)
    }
    else{
        setFilteredResults(data)
    }
  }

  const filterItems = (filterValue) => {
    setFilterInput(filterValue)
    if (filterValue !== '') {
      const filteredData = data.filter((item) => {
          return Object.values(`${item.status}`).join('').toLowerCase().includes(filterValue)
      })
      setFilteredResults(filteredData)
  }
  else{
      setFilteredResults(data)
    }
  }


  const sortItems = (sortValue) => {
    setSortInput(sortValue)
    if (sortValue === 'ascending') {
      let wak = data
      const filteredData = wak.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
      setFilteredResults(filteredData)
    }else if (sortValue === 'descending') {
      let wak = data
      const filteredData = wak.sort((a,b) => (a.name < b.name) ? 1 : ((b.name < a.name) ? -1 : 0))
      setFilteredResults(filteredData)
    } else {
      setFilteredResults(data)
    }
  }

  return (
    <>
    <div className="form-group mt-3">
      <label htmlFor="">Search Items</label>
      <input className="form-control" onChange={(e) => searchItems(e.target.value)} placeholder="Search item data"></input>
    </div>
    <div className="form-group mt-3">
        <label htmlFor="">Sort Items</label>
        <select className="form-select" name="status" value={selected2} onChange={handleSort}>
          {options2.map(option => (
            <option key={option.value} value={option.value}>
              {option.text}
            </option>
          ))}
        </select>
    </div>
    <div className="form-group mt-3">
        <label htmlFor="">Filter Items</label>
        <select className="form-select" value={selected} name="status"  onChange={handleFilter}>
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.text}
            </option>
          ))}
        </select>
    </div>
    <br />
    <div className="list-group">
      {searchInput.length > 1 || filterInput || sortInput ? (
            filteredResults.map((contact) => {
                return (
                  <div className="list-group-item list-group-item-action">
                  <div className="d-flex w-100 justify-content-between">
                    <h5 className="mb-1">{contact.name}</h5>
                    <div>
                      <button
                        className="btn btn-sm btn-link"
                        onClick={() => editHandler(contact.id)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-link"
                        onClick={() => deleteHandler(contact.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="mb-1">{contact.telp}</p>
                  <p className="mb-1">{contact.address}</p>
                  <p className="mb-1">{contact.country}</p>
                  <p className="mb-1">{contact.phone_number}</p>
                  <p className="mb-1">{contact.job_title}</p>
                  <p className="mb-1">{`${contact.status}`}</p>
                </div>
                )
            })
        ) : (
            data.map((contact) => {
                return (
                  <div className="list-group-item list-group-item-action">
                    <div className="d-flex w-100 justify-content-between">
                      <h5 className="mb-1">{contact.name}</h5>
                      <div>
                        <button
                          className="btn btn-sm btn-link"
                          onClick={() => editHandler(contact.id)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-link"
                          onClick={() => deleteHandler(contact.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <p className="mb-1">{contact.telp}</p>
                    <p className="mb-1">{contact.address}</p>
                    <p className="mb-1">{contact.country}</p>
                    <p className="mb-1">{contact.phone_number}</p>
                    <p className="mb-1">{contact.job_title}</p>
                    <p className="mb-1">{`${contact.status}`}</p>
                  </div>
                )
            })
        )}
    </div>
    </>
  );
}

export default List;
