import { render, screen, fireEvent} from '@testing-library/react';
import { unmountComponentAtNode } from 'react-dom';
import App from './App';

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

 test('test that App component doesn\'t render dupicate Task', () => {
  render(<App />);
  const inputTask = screen.getByRole('textbox', {name: /Add New Item/i});
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const button = screen.getByRole('button', {name: /Add/i});

  fireEvent.change(inputTask, { target: { value: "Task1"}});
  fireEvent.change(inputDate, { target: { value: "05/30/2023"}});
  fireEvent.click(button);

  fireEvent.change(inputTask, { target: { value: "Task1"}});
  fireEvent.change(inputDate, { target: { value: "05/30/2023"}});
  fireEvent.click(button);

  const tasks = screen.getAllByTestId("Task1");
  expect(tasks.length).toBe(1);
 });

 
 test('test that App component doesn\'t add a task without task name', () => {
  render(<App />);

  const button = screen.getByRole('button', {name: /Add/i});
  const datePicker = screen.getByPlaceholderText("mm/dd/yyyy");

  fireEvent.change(datePicker, { target: { value: '05/30/2023' } });
  fireEvent.click(button);

  const tasks = screen.queryByText('Task 1');
  expect(tasks).toBeNull();
 });

 test('test that App component doesn\'t add a task without due date', () => {
  render(<App />);
  const input = screen.getByRole('textbox', {name: /Add New Item/i});
  const button = screen.getByRole('button', {name: /Add/i});

  fireEvent.change(input, { target: { value: 'Task 1' } });
  fireEvent.click(button);

  const tasks = screen.queryByText('Task 1');
  expect(tasks).toBeNull();
 });


 test('test that App component can be deleted thru checkbox', () => {
  render(<App />);
  const input = screen.getByRole('textbox', {name: /Add New Item/i});
  const button = screen.getByRole('button', {name: /Add/i});
  const datePicker = screen.getByPlaceholderText("mm/dd/yyyy");

  fireEvent.change(input, { target: { value: 'Task 1' } });
  fireEvent.change(datePicker, { target: { value: '05/30/2023' } });
  fireEvent.click(button);

  const checkbox = screen.getByRole('checkbox');
  fireEvent.click(checkbox);

  const tasks = screen.queryByText('Task 1');
  expect(tasks).toBeNull();
 });


 test('test that App component renders different colors for past due events', () => {
  render(<App />);

  const input = screen.getByRole('textbox', {name: /Add New Item/i});
  const button = screen.getByRole('button', {name: /Add/i});
  const datePicker = screen.getByPlaceholderText("mm/dd/yyyy");
  
  fireEvent.change(input, { target: { value: 'Task 1' } });
  fireEvent.change(datePicker, { target: { value: '05/30/2023' } });
  fireEvent.click(button);

  const task = screen.getByTestId("Task 1");
  expect(task).toHaveStyle('background-color: red');
 });
