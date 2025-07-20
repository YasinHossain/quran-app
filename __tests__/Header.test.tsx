import { render, screen } from '@testing-library/react'
import Header from '@/app/components/common/Header'

describe('Header', () => {
  it('renders the title', () => {
    render(<Header />)
    expect(screen.getByText('Quran')).toBeInTheDocument()
  })
})
