// @ts-nocheck

import { useEffect, useRef, useState } from 'react'
import styles from './Dropdown.module.scss'
import classNames from 'classnames'
import { drop } from 'shared/icons/_index'
import { dropdownOption } from 'shared/interfaces'

interface Props {
  options: Array<dropdownOption>
  activeOption: number | null
  setActiveOption: Function
  string: string
  title: string
}

export const Dropdown = ({
  options,
  activeOption,
  setActiveOption,
  string,
  title,
}: Props) => {
  const ref = useRef<null | HTMLParagraphElement>(null)
  const [isOpen, setOpen] = useState(false)

  const onOptionClick = (option: object) => {
    setActiveOption(option)
    setOpen(false)
  }

  const getActiveOption = (id: number) => {
    if (id !== null && id !== undefined) {
      return options.find((el) => el.id === id) !== undefined
        ? options?.find((el) => el.id === id)
        : options[0]
    } else {
      return false
      //return options[0]
    }
  }

  useEffect(() => {
    const onBodyClick = (e: Event) => {
      if (ref.current && ref.current.contains(e.target as HTMLElement)) {
        return
      }
      setOpen(false)
    }

    document.body.addEventListener('click', onBodyClick)

    return () => {
      document.body.removeEventListener('click', onBodyClick)
    }
  }, [])

  return (
    <div
      className={classNames(
        styles.container,
        options.length > 0 ? null : styles.disabled
      )}
      ref={ref}
    >
      <div
        className={styles.input}
        onClick={() => setOpen(!isOpen)}
        data-testid="dropdown"
      >
        <div
          className={classNames(
            styles.value,
            activeOption !== undefined ? styles.selected : null
          )}
        >
          {getActiveOption(activeOption)
            ? getActiveOption(activeOption)[string as keyof dropdownOption]
            : title}
        </div>
        <div className={styles.arrow}>
          <img src={drop} alt="" />
        </div>
      </div>

      {isOpen && (
        <div className={styles.options} data-testid="drop-list">
          {options.length > 0
            ? options.map((element: object, index: number) => (
                <div
                  key={index}
                  className={styles.options_item}
                  data-testid="item-lang"
                  onClick={() => onOptionClick(element)}
                >
                  <div>{element[string as keyof object]}</div>
                </div>
              ))
            : null}
        </div>
      )}
    </div>
  )
}
