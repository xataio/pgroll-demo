import React, { useState } from "react";
import useSWR, { mutate } from "swr";
import { createItem, fetcher } from "../api/api";
import styled from "styled-components";

const AppContainer = styled.div`
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
`;

const FormContainer = styled.div`
  display: grid;
  gap: 10px;
  text-align: left;
`;

const TableContainer = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

const TableHeader = styled.th`
  padding: 10px;
  text-align: left;
  border-bottom: 2px solid #ddd;
`;

const TableCell = styled.td`
  padding: 10px;
  border-bottom: 1px solid #ddd;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const App = () => {
  const [name, setName] = useState("");
  const [assignee, setAssignee] = useState("");
  const { data, error } = useSWR("items", fetcher, { refreshInterval: 1000 });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createItem({ name, assignee });
    mutate("items");
    setName("");
    setAssignee("");
  };

  console.log(`API_URL is ${process.env.API_URL}`);

  return (
    <AppContainer>
      <header>
        <h1>Todo List V1</h1>
      </header>
      <main>
        <FormContainer>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name">Name:</label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="assignee">Assignee:</label>
              <Input
                id="assignee"
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
              />
            </div>
            <Button type="submit">Add Item</Button>
          </form>
        </FormContainer>
        {error && <p>Error fetching data</p>}
        {data && (
          <TableContainer>
            <thead>
              <tr>
                <TableHeader>Name</TableHeader>
                <TableHeader>Assignee</TableHeader>
              </tr>
            </thead>
            <tbody>
              {data.map((item, i) => (
                <tr key={i}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.assignee}</TableCell>
                </tr>
              ))}
            </tbody>
          </TableContainer>
        )}
      </main>
    </AppContainer>
  );
};

export default App;
