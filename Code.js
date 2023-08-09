import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Modal, Form ,Table } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

const API = "http://localhost:3500/products";

const App = () => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({
    name: "",
    description: "",
    image: "",
    price: 0,
  });

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

 

  useEffect(() => {
    fetchData();
  }, []);


  const fetchData = async () => {
    try {
      const response = await axios.get(API);
      setProducts(response.data);
    } 
    catch (error) {
      console.error( error);
    }
  };

  const handleAddEdit = async (event) => {
    event.preventDefault();
    try {
      if (selectedProduct.id) {
        // Editing an existing product
        await axios.put(`${API}/${selectedProduct.id}`, selectedProduct);
      } else {
        // Adding a new product
        await axios.post(API, selectedProduct);
      }
      fetchData();
      // handleClose();
    } catch (error) {
      console.error( error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      fetchData();
    } catch (error) {
      console.error( error);
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    handleShow();
  };

  return (
    <div className="container-fluid mt-5">
      <Button variant="success" onClick={() => handleShow()}>
        Add Product
      </Button>
      <Table className="table mt-4" striped borderd hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Image</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.description}</td>
              <td>{product.image}</td>
              <td>{product.price}</td>
              <td>
                <Button variant="warning"   onClick={() => handleEdit(product)}>
                  Edit
                </Button>{" "}
                <Button variant="danger"  onClick={() => handleDelete(product.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedProduct.id ? "Edit Product" : "Add Product"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddEdit}>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={selectedProduct.name}
                onChange={(e) => setSelectedProduct({ ...selectedProduct, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                value={selectedProduct.description}
                onChange={(e) =>
                  setSelectedProduct({ ...selectedProduct, description: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formImage">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="text"
                value={selectedProduct.image}
                onChange={(e) => setSelectedProduct({ ...selectedProduct, image: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formPrice">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                value={selectedProduct.price}
                onChange={(e) => setSelectedProduct({ ...selectedProduct, price: e.target.value })}
              />
            </Form.Group>
            <Button variant="primary" type="submit" className='bg-success text-black ml-10 mt-2'>
              Add 
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default App;
