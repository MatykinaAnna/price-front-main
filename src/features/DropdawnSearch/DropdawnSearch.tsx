import { useEffect, useState, useRef } from 'react'
import styles from './DropdawnSearch.module.scss'

import { dropdawnArrow } from 'shared/icons/_index'

interface Props {
  placeholder: string
  arrayValue: {
    id: number
    name: string
    order_num?: number
  }[]
  onChange: (value: any) => void
}

const DropdawnSearch = (props: Props) => {
  const ref = useRef<null | HTMLParagraphElement>(null)
  //   const [isOpen, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [searchResults, setSearchResults] = useState<
    {
      id: number
      name: string
      order_num?: number
    }[]
  >(props.arrayValue)
  const [openList, setOpenList] = useState(false)

  useEffect(() => {
    if (inputValue !== '') {
      setOpenList(true)
      const results = props.arrayValue.filter((item) => {
        return item.name.includes(inputValue)
      })
      setSearchResults(results)
    } else {
      setSearchResults(props.arrayValue)
    }
  }, [inputValue, props.arrayValue])

  useEffect(() => {
    const onBodyClick = (e: Event) => {
      if (ref.current && ref.current.contains(e.target as HTMLElement)) {
        return
      }
      setOpenList(false)
    }

    document.body.addEventListener('click', onBodyClick)

    return () => {
      document.body.removeEventListener('click', onBodyClick)
    }
  }, [])

  const handleChange = (item: {
    id: number
    name: string
    order_num?: number
  }) => {
    props.onChange(item) // callback-функция
  }

  function clickValueItem(item: {
    id: number
    name: string
    order_num?: number
  }) {
    setOpenList(false)
    //@ts-ignore
    handleChange(item)
    setInputValue(item.name)
  }

  const valueRender = searchResults.map((item, index) => {
    return (
      <div
        key={index}
        className={styles.valueItem}
        onClick={() => clickValueItem(item)}
      >
        {item.name}
      </div>
    )
  })

  return (
    <div className={styles.main} ref={ref}>
      <div className={styles.wrapper}>
        <input
          type="text"
          placeholder={props.placeholder}
          className={inputValue === '' ? styles.placeholder : styles.text}
          value={inputValue}
          onChange={(event) => {
            setInputValue(event.target.value)
          }}
        ></input>
        <img
          className={styles.btn_arrow}
          src={dropdawnArrow}
          width={7}
          height={7}
          alt=""
          onClick={() => {
            setOpenList(!openList)
          }}
        />
      </div>
      {openList && <div className={styles.value}>{valueRender}</div>}
    </div>
  )
}

export default DropdawnSearch
