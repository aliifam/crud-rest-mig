import { useState, useEffect } from "react";
import "./App.css";
import List from "./List";
import axios from "axios";
import Swal from "sweetalert2";

function App() {
  const [contacts, setContacts] = useState([]);

  const [isUpdate, setIsUpdate] = useState({ id: null, status: false });

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    country: "",
    phone_number: "",
    job_title: "",
    status: true,
  });

  useEffect(() => {
    if (!sessionStorage.getItem("token")) {
      let auth = JSON.stringify({
        email: `${process.env.REACT_APP_EMAIL}`,
        password: `${process.env.REACT_APP_PASS}`,
      });
      axios
        .post("https://mitramas-test.herokuapp.com/auth/login", auth, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          sessionStorage.setItem("token", `${res.data.access_token}`);
          axios
            .get("https://mitramas-test.herokuapp.com/customers", {
              headers: { Authorization: `${sessionStorage.getItem("token")}` },
            })
            .then((res) => {
              // console.log(res.data);
              setContacts(res?.data.data ?? []);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
    axios
      .get("https://mitramas-test.herokuapp.com/customers", {
        headers: { Authorization: `${sessionStorage.getItem("token")}` },
      })
      .then((res) => {
        // console.log(res.data);
        setContacts(res?.data.data ?? []);
      }).catch((err) => {
        console.log(err)
        // eslint-disable-next-line no-restricted-globals
      })
  }, []);

  const handleChange = (e) => {
    let data = { ...formData };
    data[e.target.name] = e.target.value;
    setFormData(data);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let data = [...contacts];

    if (!formData.name || !formData.phone_number || !formData.address || formData.status === null || !formData.country || !formData.job_title) {
      Swal.fire({
        icon: 'error',
        title: 'data harus diisi semua',
        timer: 2000
      })
      return false;
    }

    if (isUpdate.status) {
      data.forEach((contact) => {
        if (contact.id === isUpdate.id) {
          contact.name = formData.name;
          contact.address = formData.address;
          contact.country = formData.country;
          contact.phone_number = formData.phone_number;
          contact.job_title = formData.job_title;
          contact.status = formData.status;
        }
      });
      axios
        .put(`https://mitramas-test.herokuapp.com/customers`, {
          id: isUpdate.id,
          name: formData.name,
          address: formData.address,
          country: formData.country,
          phone_number: formData.phone_number,
          job_title: formData.job_title,
          status: formData.status,
        }, { headers : { "Content-Type": "application/json", Authorization: `${sessionStorage.getItem('token')}` }})
        .then((res) => {
          Swal.fire({
            icon: 'success',
            title: `${res.data.message}`,
            showConfirmButton: false,
            timer: 2000
          })
        });
    } else {
      //tambah data
      // eslint-disable-next-line no-restricted-globals
      Swal.fire({
        title: 'yakin tambah data?',
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Yes',
        denyButtonText: 'No',
      }).then(res => {
        if (res.isDenied) {
          return false
        } else {
          let newData = {
            name: formData.name,
            address: formData.address,
            country: formData.country,
            phone_number: formData.phone_number,
            job_title: formData.job_title,
            status: formData.status,
          };
          data.push(newData);
          axios.post("https://mitramas-test.herokuapp.com/customers", newData, {
            headers: {"Content-Type": "application/json", Authorization: `${sessionStorage.getItem('token')}`}
            }).then((res) => {
            Swal.fire({
              icon: 'success',
              title: `${res.data.message}`,
              showConfirmButton: false,
              timer: 2000
            })
            axios
              .get("https://mitramas-test.herokuapp.com/customers", {
                headers: { Authorization: `${sessionStorage.getItem("token")}` },
              })
              .then((res) => {
                setContacts(res?.data.data ?? []);
              });
          });
        }
      })
    }
    setContacts(data);
    setFormData({
      name: "",
      address: "",
      country: "",
      phone_number: "",
      job_title: "",
      status: true,
    });
    setIsUpdate({ id: null, status: false });
  };

  const handleEdit = (id) => {
    // eslint-disable-next-line no-restricted-globals
    Swal.fire({
      title: 'yakin edit data?',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: 'Yes',
      denyButtonText: 'No',
    }).then((res) => {
      if (res.isDenied) {
        return false
      } else {
        let data = [...contacts];
        let foundData = data.find((contact) => contact.id === id);

        setFormData({ 
          name: foundData.name,
          address: foundData.address,
          country: foundData.country, 
          phone_number: foundData.phone_number,
          job_title: foundData.job_title,
          status: foundData.status
        });

        setIsUpdate({ id: id, status: true });
      }
    })
  };

  const handleDelete = (id) => {
    // eslint-disable-next-line no-restricted-globals
    Swal.fire({
      title: 'yakin hapus data?',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: 'Yes',
      denyButtonText: 'No',
    }).then((res) => {
      if (res.isDenied) {
        return false
      } else {
        let data = [...contacts];
        let filteredData = data.filter((contact) => contact.id !== id);
        axios.delete(`https://mitramas-test.herokuapp.com/customers`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${sessionStorage.getItem('token')}`
          },
          data: {
            id: id
          }
        }).then((res) => {
          Swal.fire({
            icon: 'success',
            title: `${res.data.message}`,
            showConfirmButton: false,
            timer: 2000
          })
        });
        setContacts(filteredData);
        setFormData({
          name: "",
          address: "",
          country: "",
          phone_number: "",
          job_title: "",
          status: true,
        });
      }
    })
    
  };

  return (
    <div className="App">
      <h1 className="px-3 py-3">CRUD RestAPI - MIG</h1>

      <form onSubmit={handleSubmit} className="px-3 py-4">
        <div className="form-group">
          <label htmlFor="">Name</label>
          <input
            type="text"
            className="form-control"
            value={formData.name}
            onChange={handleChange}
            name="name"
          />
        </div>
        <div className="form-group mt-3">
          <label htmlFor="">Adrress</label>
          <input
            type="text"
            className="form-control"
            onChange={handleChange}
            value={formData.address}
            name="address"
          />
        </div>
        <div className="form-group mt-3">
          <label htmlFor="">Country</label>
          <input
            type="text"
            className="form-control"
            onChange={handleChange}
            value={formData.country}
            name="country"
          />
        </div>
        <div className="form-group mt-3">
          <label htmlFor="">Phone Number</label>
          <input
            type="text"
            className="form-control"
            onChange={handleChange}
            value={formData.phone_number}
            name="phone_number"
          />
        </div>
        <div className="form-group mt-3">
          <label htmlFor="">Job Title</label>
          <input
            type="text"
            className="form-control"
            onChange={handleChange}
            value={formData.job_title}
            name="job_title"
          />
        </div>
        <div className="form-group mt-3">
          <label htmlFor="">Active Status</label>
          <select className="form-select" name="status" value={formData.status} onChange={handleChange} placeholder="select true or false">
            <option value={true}>true</option>
            <option value={false}>false</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary w-100 mt-3">
          Save
        </button>
      </form>

      <List
        editHandler={handleEdit}
        deleteHandler={handleDelete}
        data={contacts}
      />
    </div>
  );
}

export default App;
