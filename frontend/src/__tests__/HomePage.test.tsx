import React from "react";
import { render, screen, fireEvent, waitForElement } from "@testing-library/react";
import '@testing-library/jest-dom'
import { MemoryRouter } from 'react-router-dom'; // Import MemoryRouter

import HomePage from '../components/HomePage'
import NavHome from '../components/NavHome'


test('mayfly title reads mayfly', () => {
  render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>
  )
  const title = screen.getByTestId('mayfly-title')
  expect(title).toBeInTheDocument()
})

