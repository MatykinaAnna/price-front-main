import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { Dropdown } from './index'
import userEvent from '@testing-library/user-event'

test('открытие выпадающего списка', async () => {
  const options = [
    { id: 1, string: 'opt 1' },
    { id: 2, string: 'opt 2' },
  ]

  const { container } = render(
    <Dropdown
      options={options}
      activeOption={1}
      setActiveOption={() => {}}
      string={'string'}
    />
  )

  userEvent.click(screen.getByTestId('dropdown'))
  //expect(container).toMatchSnapshot()
  expect(await screen.findByTestId('drop-list')).toBeInTheDocument()
})
