import styles from './Filters.module.scss'
import { clear, noclear, greenDel } from 'shared/icons/_index'
import { useEffect, useState } from 'react'
import Search from 'shared/ui-kit/Search/Search'
import { DropdawnSearch, loadDivisions, setActiveDivisions } from '..'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { useSearchParams } from 'react-router-dom'
import { ConfirmWindow } from 'features/ConfirmWindow'
import { setBtn } from 'features/ConfirmWindow'
import classNames from 'classnames'
import { setActiveArticleUnitItem, setActiveServiceId } from 'features/Services'
import { clearSetRedClass } from 'pages/price'

const Filters = () => {
  const dispatch = useAppDispatch()
  const [region, setSearchRegion] = useState('')

  const allDivisions = useAppSelector(
    (state) => state.divisionReducer.allDivisions
  )
  const activeDivision = useAppSelector(
    (state) => state.divisionReducer.activeDivisions
  )

  const activePeriodId = useAppSelector(
    (state) => state.periodReducer.activePeriodId
  )

  const [searchParams, setSearchParams] = useSearchParams()
  const [isConfirm, setIsConfirm] = useState(false)
  const [props, setProps] = useState({
    text: '',
    onTrickClick: (clickBtn: string) => {},
  })
  let resultConfirm = '1'

  useEffect(() => {
    dispatch(
      loadDivisions({
        company_group_id: Number(searchParams.get('company_group_id')),
      })
    )
  }, [])

  const activeServiceId = useAppSelector(
    (state) => state.serviceReducer.activeServiceId
  )
  const activeArticleUnitItem = useAppSelector(
    (state) => state.serviceReducer.activeArticleUnitItem
  )

  const [dataBlock1, setDataBlock1] = useState<
    { region: string; city: string; dc: string; division_id: number }[]
  >([])

  const [arrayRegion, setArrayRegion] = useState<
    { id: number; name: string }[]
  >([])

  const [arrayCity, setArrayCity] = useState<{ id: number; name: string }[]>([])

  const [arrayDc, setArrayDc] = useState<{ id: number; name: string }[]>([])

  const allPeriod = useAppSelector((state) => state.periodReducer.allPeriod)

  useEffect(() => {
    console.log('useEffect')
    let arrayRegion: { id: number; name: string }[] = []
    let arrayCity: { id: number; name: string }[] = []
    let arrayDc: { id: number; name: string }[] = []

    allDivisions.forEach((item) => {
      let ind = arrayRegion.findIndex((item1) => {
        return item1.id === item.district_id
      })
      if (ind === -1) {
        arrayRegion.push({ id: item.district_id, name: item.district_name })
      }

      ind = arrayCity.findIndex((item1) => {
        return item1.id === item.city_id
      })
      if (ind === -1) {
        arrayCity.push({ id: item.city_id, name: item.city_name })
      }

      ind = arrayDc.findIndex((item1) => {
        return item1.id === item.division_id
      })
      if (ind === -1) {
        arrayDc.push({ id: item.city_id, name: item.division_name })
      }
    })
    setArrayRegion(arrayRegion)
    setArrayCity(arrayCity)
    setArrayDc(arrayDc)
  }, [allDivisions])

  function setDataBlock1FromallDivisions() {
    let arrayRegion1: {
      region: string
      city: string
      dc: string
      division_id: number
    }[] = []
    allDivisions.forEach((item) => {
      arrayRegion1.push({
        region: item.district_name.split(' ')[0],
        city: item.city_name,
        dc: item.division_name,
        division_id: item.division_id,
      })
    })
    setDataBlock1(arrayRegion1)
  }

  useEffect(() => {
    setDataBlock1FromallDivisions()
  }, [allDivisions])

  let dataBlock2 = [
    {
      type: 'Маркетинг',
      view: 'Лучевая диагностика',
      complex: 'Базовое обследование для любого возраста и пола',
    },
    {
      type: 'Маркетинг',
      view: 'Лучевая диагностика',
      complex: 'Базовое обследование для любого возраста и пола',
    },
    {
      type: 'Маркетинг',
      view: 'Лучевая диагностика',
      complex: 'Базовое обследование для любого возраста и пола',
    },
  ]

  async function onClickDivision(item: {
    region: string
    city: string
    dc: string
    division_id: number
  }) {
    dispatch(setActiveServiceId(-1))
    dispatch(setActiveArticleUnitItem(null))
    if (activeDivision !== null) {
      //await saveDate();
      dispatch(setActiveDivisions(item.division_id))
    } else {
      dispatch(setActiveDivisions(item.division_id))
    }
  }

  function getTimestamp() {
    const date = new Date()
    const dateOptions = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    }
    //@ts-ignore
    const formattedDate = new Intl.DateTimeFormat('en-ca', dateOptions).format(
      date
    )

    const timeOptions = {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hourCycle: 'h24',
    }
    //@ts-ignore
    const formattedTime = new Intl.DateTimeFormat('en-ca', timeOptions).format(
      date
    )
    const dateTime = `${formattedDate}T${formattedTime}Z`
    return dateTime
  }

  async function clickOnSave() {
    let period1 = allPeriod.find((item) => {
      return item.id === activePeriodId
    })

    let price = period1?.price_items.find((item) => {
      return item.price_results[0].is_last === 1
    })

    let period = {
      id: period1?.id,
      date_since: period1?.date_since,
      date_to: period1?.date_to,
      is_draft: period1?.is_draft,
      price_items: [],
      staff_id: period1?.staff_id,
      timestamp: getTimestamp(),
    }

    //@ts-ignore
    period.price_items.push(price)

    let data

    if (period.is_draft === 0) {
      data = period
    } else {
      data = period1
    }

    const response: void | Response = await fetch(
      `https://mis-ru-selling-service.numedy.com/api/v1/price_list/?company_group_id=${searchParams.get(
        'company_group_id'
      )}&price_type_id=${searchParams.get('price_type_id')}`,
      {
        method: 'post',
        body: JSON.stringify(data),
        headers: {
          'content-type': 'application/json',
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error occurred!')
        }
        dispatch(setActiveServiceId(-1))
        dispatch(setActiveArticleUnitItem(-1))
        dispatch(clearSetRedClass())

        dispatch(setActiveServiceId(-1))
        dispatch(setActiveDivisions(-1))
        dispatch(setActiveArticleUnitItem(null))

        //alert('Данные успешно сохранены')

        return response.json()
      })
      .catch((err) => {
        console.log(err)
        alert('Ошибка сохранения')
      })
  }

  const renderBlock1 = dataBlock1.map((item, index) => {
    return (
      <div
        key={index}
        className={styles.row}
        onClick={async () => {
          if (
            activeServiceId > -1 ||
            (activeArticleUnitItem !== null && activeArticleUnitItem !== -1)
          ) {
            setIsConfirm(true)
            while (true) {
              await waitForChange('Сохранить изменения?')
              if (resultConfirm === 'btn_close') {
                setIsConfirm(false)
              } else if (resultConfirm === 'btn-true') {
                clickOnSave()

                setIsConfirm(false)
                onClickDivision(item)

                dispatch(setActiveServiceId(-1))
                dispatch(setActiveArticleUnitItem(null))
              } else if (resultConfirm === 'btn-false') {
                setIsConfirm(false)
                onClickDivision(item)
                dispatch(setActiveServiceId(-1))
                dispatch(setActiveArticleUnitItem(null))
              }
              await new Promise((resolve) => setTimeout(resolve, 0))
            }
          } else {
            onClickDivision(item)
          }
        }}
      >
        <div
          style={index % 2 === 0 ? { backgroundColor: '#c0e1c6' } : {}}
          className={classNames(
            item.division_id === activeDivision ? styles.activeRow : {}
          )}
        >
          {item.region}
        </div>
        <div
          style={index % 2 === 0 ? { backgroundColor: '#c0e1c6' } : {}}
          className={classNames(
            item.division_id === activeDivision ? styles.activeRow : {}
          )}
        >
          {item.city}
        </div>
        <div
          style={index % 2 === 0 ? { backgroundColor: '#c0e1c6' } : {}}
          className={classNames(
            item.division_id === activeDivision ? styles.activeRow : {}
          )}
        >
          {item.dc}
        </div>
      </div>
    )
  })

  const renderBlock2 = dataBlock2.map((item, index) => {
    return (
      <div key={index} className={styles.row}>
        <div style={index % 2 === 0 ? { backgroundColor: '#c0e1c6' } : {}}>
          {item.type}
        </div>
        <div style={index % 2 === 0 ? { backgroundColor: '#c0e1c6' } : {}}>
          {item.view}
        </div>
        <div style={index % 2 === 0 ? { backgroundColor: '#c0e1c6' } : {}}>
          {item.complex}
        </div>
      </div>
    )
  })

  const handleRegion = (value: {
    id: number
    name: string
    order_num?: number
  }) => {
    let r = dataBlock1.filter((item) => {
      return value.name.includes(item.region)
    })
    setDataBlock1(r)
    setActiveWhisk(true)
  }

  const handleCity = (value: {
    id: number
    name: string
    order_num?: number
  }) => {
    let r = dataBlock1.filter((item) => {
      return value.name.includes(item.city)
    })
    setDataBlock1(r)
    setActiveWhisk(true)
  }

  const handleDc = (value: {
    id: number
    name: string
    order_num?: number
  }) => {
    let r = dataBlock1.filter((item) => {
      return value.name.includes(item.dc)
    })
    setDataBlock1(r)
    setActiveWhisk(true)
  }

  function waitForChange(text: string) {
    return new Promise<void>((resolve) => {
      setProps({
        text: text,

        onTrickClick: function (clickBtn: string) {
          resultConfirm = clickBtn
          resolve()
        },
      })
    })
  }

  const [keyForRenderDropdown, setKeyForRenderDropdown] = useState(1)
  const [activeWhisk, setActiveWhisk] = useState(false)

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.block1}>
          <div className={styles.header} key={keyForRenderDropdown}>
            <div style={{ width: '118px' }}>
              <DropdawnSearch
                placeholder={'Область'}
                arrayValue={arrayRegion}
                onChange={handleRegion}
              />
            </div>
            <div style={{ width: '118px' }}>
              <DropdawnSearch
                placeholder={'Город'}
                arrayValue={arrayCity}
                onChange={handleCity}
              />
            </div>
            <div
              style={{
                width: '329px',
                display: 'grid',
                gridTemplateColumns: '300px 40px',
                gap: '4px',
              }}
            >
              <DropdawnSearch
                placeholder={'Подразделение'}
                arrayValue={arrayDc}
                onChange={handleDc}
              />
              {activeWhisk ? (
                <img
                  src={clear}
                  alt=""
                  onClick={() => {
                    setKeyForRenderDropdown(
                      (keyForRenderDropdown) => keyForRenderDropdown + 1
                    )
                    setDataBlock1FromallDivisions()
                    setActiveWhisk(false)
                  }}
                />
              ) : (
                <img src={noclear} alt="" />
              )}
            </div>
            <div className={styles.nameColumns}>Область</div>
            <div className={styles.nameColumns}>Город</div>
            <div className={styles.nameColumns}>Подразделение</div>
          </div>
          <div className={styles.content}>{renderBlock1}</div>
        </div>

        <div className={styles.block2}>
          <div className={styles.header}>
            <div style={{ width: '64px' }}>
              <Search
                placeholder="Тип"
                value={region}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setSearchRegion(e.target.value)
                }}
              />
            </div>
            <div style={{ width: '138px' }}>
              <Search
                placeholder="Вид"
                value={region}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setSearchRegion(e.target.value)
                }}
              />
            </div>
            <div
              style={{
                width: '350px',
                display: 'grid',
                gridTemplateColumns: '300px 35px 20px',
              }}
            >
              <Search
                placeholder="Комплекс"
                value={region}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setSearchRegion(e.target.value)
                }}
              />
              {false ? (
                <img className={styles.clear} src={clear} alt="" />
              ) : (
                <img className={styles.clear} src={noclear} alt="" />
              )}
              <img className={styles.greenDel} src={greenDel} alt="" />
            </div>
            <div className={styles.nameColumns}>Тип</div>
            <div className={styles.nameColumns}>Вид</div>
            <div className={styles.nameColumns}>Комплекс</div>
          </div>
          <div className={styles.content}>{renderBlock2}</div>
        </div>
      </div>

      {isConfirm && <ConfirmWindow {...props} />}
    </>
  )
}

export default Filters
