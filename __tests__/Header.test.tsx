import { render, screen } from '@testing-library/react'
import Header from '../app/components/Header'

describe('Header', () => {
  it('renders the title', () => {
    render(<Header />)
    expect(screen.getByText('Quran')).toBeInTheDocument()
  })
})
