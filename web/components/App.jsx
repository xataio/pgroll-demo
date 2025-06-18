import React, { useState } from "react";
import useSWR, { mutate } from "swr";
import { createItem, fetcher } from "../api/api";
import styled, { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
  
  :root {
    --primary-color: #3b82f6;
    --primary-hover: #2563eb;
    --primary-light: #1e40af;
    --success-color: #10b981;
    --warning-color: #f59e0b;
    --error-color: #ef4444;
    --text-primary: #f8fafc;
    --text-secondary: #cbd5e1;
    --text-muted: #94a3b8;
    --bg-primary: #1e293b;
    --bg-secondary: #334155;
    --bg-tertiary: #0f172a;
    --border-color: #475569;
    --border-light: #64748b;
    --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.2);
    --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.3), 0 2px 4px -2px rgb(0 0 0 / 0.2);
    --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.4), 0 4px 6px -4px rgb(0 0 0 / 0.3);
    --radius-sm: 6px;
    --radius-md: 8px;
    --radius-lg: 12px;
  }
  
  * {
    box-sizing: border-box;
  }
  
  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
    line-height: 1.6;
    color: var(--text-primary);
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
    min-height: 100vh;
    margin: 0;
    padding: 20px;
  }
`;

const AppContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  background: var(--bg-primary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
`;

const Header = styled.header`
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-hover) 100%);
  color: white;
  padding: 2rem;
  text-align: center;
  
  h1 {
    margin: 0;
    font-size: 2rem;
    font-weight: 600;
    letter-spacing: -0.025em;
  }
`;

const Main = styled.main`
  padding: 2rem;
`;

const FormContainer = styled.div`
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  padding: 1.5rem;
  margin-bottom: 2rem;
  border: 1px solid var(--border-light);
`;

const FormGrid = styled.div`
  display: grid;
  gap: 1rem;
  
  @media (min-width: 480px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: var(--text-primary);
  font-size: 0.875rem;
`;

const ItemsContainer = styled.div`
  display: grid;
  gap: 1rem;
`;

const ItemCard = styled.div`
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 1.25rem;
  box-shadow: var(--shadow-sm);
  transition: all 0.2s ease-in-out;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
    border-color: var(--primary-light);
  }
`;

const ItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
`;

const ItemName = styled.h3`
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
`;

const ItemAssignee = styled.div`
  background: var(--primary-color);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-sm);
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  font-size: 0.875rem;
  font-family: inherit;
  background: var(--bg-primary);
  color: var(--text-primary);
  transition: all 0.2s ease-in-out;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px var(--primary-light);
  }
  
  &::placeholder {
    color: var(--text-muted);
  }
`;

const ButtonContainer = styled.div`
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
  margin-top: 0.5rem;
`;

const Button = styled.button`
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-hover) 100%);
  color: white;
  padding: 0.75rem 2rem;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-weight: 600;
  font-size: 0.875rem;
  font-family: inherit;
  transition: all 0.2s ease-in-out;
  box-shadow: var(--shadow-sm);

  &:hover {
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: var(--text-secondary);
  
  h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.125rem;
    font-weight: 500;
    color: var(--text-primary);
  }
  
  p {
    margin: 0;
    font-size: 0.875rem;
  }
`;

const ErrorMessage = styled.div`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #fca5a5;
  padding: 1rem;
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  margin-bottom: 1rem;
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
    <>
      <GlobalStyle />
      <AppContainer>
        <Header>
          <h1>Todo List V1</h1>
        </Header>
        <Main>
          <FormContainer>
            <form onSubmit={handleSubmit}>
              <FormGrid>
                <FormField>
                  <Label htmlFor="name">Task Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter task name..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </FormField>
                <FormField>
                  <Label htmlFor="assignee">Assignee</Label>
                  <Input
                    id="assignee"
                    placeholder="Enter assignee name..."
                    value={assignee}
                    onChange={(e) => setAssignee(e.target.value)}
                    required
                  />
                </FormField>
                <ButtonContainer>
                  <Button type="submit">Add Task</Button>
                </ButtonContainer>
              </FormGrid>
            </form>
          </FormContainer>

          {error && (
            <ErrorMessage>
              Unable to load tasks
            </ErrorMessage>
          )}

          {data && data.length === 0 && (
            <EmptyState>
              <h3>No tasks yet</h3>
              <p>Add your first task using the form above.</p>
            </EmptyState>
          )}

          {data && data.length > 0 && (
            <ItemsContainer>
              {data.map((item, i) => (
                <ItemCard key={i}>
                  <ItemHeader>
                    <ItemName>{item.name}</ItemName>
                    <ItemAssignee>{item.assignee}</ItemAssignee>
                  </ItemHeader>
                </ItemCard>
              ))}
            </ItemsContainer>
          )}
        </Main>
      </AppContainer>
    </>
  );
};

export default App;
