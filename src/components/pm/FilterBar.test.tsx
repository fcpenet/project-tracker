import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import FilterBar from './FilterBar'

const defaultProps = {
  search: '', onSearch: vi.fn(),
  filterPriority: 'all', onFilterPriority: vi.fn(),
  filterTag: 'all', onFilterTag: vi.fn(),
  allTags: ['frontend', 'backend'],
}

describe('FilterBar', () => {
  it('renders search input', () => {
    render(<FilterBar {...defaultProps} />)
    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument()
  })

  it('calls onSearch when typing', () => {
    const onSearch = vi.fn()
    render(<FilterBar {...defaultProps} onSearch={onSearch} />)
    fireEvent.change(screen.getByPlaceholderText(/search/i), { target: { value: 'test' } })
    expect(onSearch).toHaveBeenCalledWith('test')
  })

  it('renders all tag options', () => {
    render(<FilterBar {...defaultProps} />)
    expect(screen.getByText('frontend')).toBeInTheDocument()
    expect(screen.getByText('backend')).toBeInTheDocument()
  })
})
