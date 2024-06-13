import styles from './price.module.scss'

import { useSearchParams } from 'react-router-dom'

import {
  add,
  arrowWitch,
  calendar,
  arrowTo,
  greenDel,
  greenKr,
} from '../../../shared/icons/_index'
import {
  addPeriodItem,
  setStartDateForP,
  setEndDateForP,
  updatePrice,
  setRedClass,
  clearSetRedClass,
  setResultWindowError,
} from '..'
import Period from 'features/Loader/Period/ui/Period'
import Filters from 'features/Filters/ui/Filters'
import Services from 'features/Services/ui/Services'
import classNames from 'classnames'
import DatePicker, { registerLocale } from 'react-datepicker'
import { useAppSelector, useAppDispatch } from '../../../app/hooks'
import 'react-datepicker/dist/react-datepicker.css'
import ru from 'date-fns/locale/ru'
import { useDebugValue, useEffect, useState } from 'react'
import { getTTFB } from 'web-vitals'
import { collapseTextChangeRangesAcrossMultipleVersions } from 'typescript'
import { addPrice } from 'features/Services'
import {
  setActiveServiceId,
  setActiveDivisions,
  setActiveArticleUnitItem,
  setAllPeriodId,
  setResultWindow,
  setResultWindowHeader,
  setResultWindowStr,
} from '../index'
import { loadPeriod, setActivePeriodId } from 'features/Loader'
import periodReducer from 'features/Loader/Period/model/period-reducer'
registerLocale('ru', ru)

const Price = () => {
  const dispatch = useAppDispatch()

  const activeServiceId = useAppSelector(
    (state) => state.serviceReducer.activeServiceId
  )

  const resultWindow = useAppSelector(
    (state) => state.periodReducer.resultWindow
  )
  const resultWindowHeader = useAppSelector(
    (state) => state.periodReducer.resultWindowHeader
  )
  const resultWindowStr = useAppSelector(
    (state) => state.periodReducer.resultWindowStr
  )
  const resultWindowError = useAppSelector(
    (state) => state.periodReducer.resultWindowError
  )

  const allPeriod = useAppSelector((state) => state.periodReducer.allPeriod)

  const [activeWindow, setActiveWindow] = useState(false)

  const [activeWindowPublich, setActiveWindowPublich] = useState(false)

  const [newPrice, setNewPrice] = useState<string>()

  const allPriceItems = useAppSelector(
    (state) => state.serviceReducer.allPriceItem
  )

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

  const [searchParams, setSearchParams] = useSearchParams()

  const activeArticleUnitItem = useAppSelector(
    (state) => state.serviceReducer.activeArticleUnitItem
  )

  async function clickBtnOk() {
    console.log('clickBtnOk')

    let price = {
      id: activePeriodId,
      date_since: allPeriod.find((item) => {
        return item.id === activePeriodId
      })?.date_since,
      staff_id: searchParams.get('staff_id'),
      timestamp: getTimestamp(),
    }

    const response: void | Response = await fetch(
      `https://mis-ru-selling-service.numedy.com/api/v1/price_list/publish/?company_group_id=${searchParams.get(
        'company_group_id'
      )}&price_type_id=${searchParams.get('price_type_id')}`,
      {
        method: 'post',
        body: JSON.stringify(price),
        headers: {
          'content-type': 'application/json',
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error occurred!')
        }
        dispatch(setActiveDivisions(-1))
        dispatch(setActiveServiceId(-1))
        dispatch(setActiveArticleUnitItem(-1))

        dispatch(
          loadPeriod({
            company_group_id: Number(searchParams.get('company_group_id')),
            price_type_id: Number(searchParams.get('price_type_id')),
          })
        )

        dispatch(setResultWindow(true))
        dispatch(setResultWindowHeader('Прайс-лист успешно опубликован'))
        dispatch(setResultWindowStr('Успешно'))

        setTimeout(() => {
          dispatch(setResultWindow(false))
        }, 3000)

        return response.json()
      })
      .catch((err) => {
        console.log(err)
        //alert('Ошибка публикации')
        dispatch(setResultWindow(true))
        dispatch(setResultWindowHeader('Ошибка публикации'))
        dispatch(setResultWindowStr(''))
        dispatch(setResultWindowError(true))

        setTimeout(() => {
          dispatch(setResultWindow(false))
          dispatch(setResultWindowError(false))
        }, 3000)
      })
      .then((data) => {
        console.log(data)
      })
  }

  const activePeriodId = useAppSelector(
    (state) => state.periodReducer.activePeriodId
  )

  const activeDivisionId = useAppSelector(
    (state) => state.divisionReducer.activeDivisions
  )

  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()

  useEffect(() => {
    console.log(startDate)
  }, [startDate])

  async function clickAddBtn() {
    let price = {
      id: null,
      date_since:
        startDate?.toString() === undefined
          ? null
          : startDate?.toISOString().substring(0, 10),
      is_draft: 1,
      staff_id: 1,
      timestamp: getTimestamp(),
      price_items: [],
      date_to:
        endDate?.toString() === undefined
          ? null
          : endDate?.toISOString().substring(0, 10),
      price_list_item: -1,
    }

    dispatch(addPeriodItem(price))
  }

  async function clickOnSave() {
    console.log('clickOnSave')

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

        dispatch(setResultWindow(true))
        dispatch(setResultWindowHeader('Прайс-лист успешно сохранен'))
        dispatch(setResultWindowStr('Успешно'))

        setTimeout(() => {
          dispatch(setResultWindow(false))
        }, 3000)

        return response.json()
      })
      .then((data) => {
        console.log(data)

        if (data !== undefined) {
          dispatch(setActivePeriodId(data.id))
          dispatch(setAllPeriodId(data.id))
        }
      })
      .catch((err) => {
        console.log(err)
        dispatch(setResultWindow(true))
        dispatch(setResultWindowHeader('Ошибка сохранения'))
        dispatch(setResultWindowError(true))
        dispatch(setResultWindowStr(''))

        setTimeout(() => {
          dispatch(setResultWindow(false))
          dispatch(setResultWindowError(false))
        }, 3000)
      })
  }

  function activeCopyPrice() {
    if (allPeriod.length < 2) {
      return true
    }
    let p = allPeriod.find((item) => {
      return item.id === activePeriodId
    })
    if (p !== undefined) {
      if (p.is_draft === 1) {
        return false
      } else {
        return true
      }
    } else return true
  }

  function disabledOK() {
    if (allPeriod.length === 0) {
      return true
    } else {
      if (
        allPeriod[allPeriod.length - 1].is_draft === 0 ||
        allPeriod[allPeriod.length - 1].date_since === String(null) ||
        allPeriod[allPeriod.length - 1].date_since === null
      ) {
        console.log(allPeriod[allPeriod.length - 1].date_since)
        return true
      } else {
        return false
      }
    }
  }
  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <div className={styles.block1}>
            <span className={styles.headerName}>Прайс-лист</span>
            <button
              className={styles.add_btn}
              disabled={Boolean(
                allPeriod.length !== 0 &&
                  allPeriod[allPeriod.length - 1].is_draft === 1
              )}
              onClick={clickAddBtn}
            >
              <img src={add} alt="" />
            </button>
          </div>
          <button
            disabled={disabledOK()}
            className={styles.btnOk}
            onClick={(e) => {
              //clickBtnOk()
              setActiveWindowPublich(true)
            }}
          >
            <div className={styles.img}></div>
            <span>OK</span>
          </button>
          <img src={arrowWitch} alt="" />
          <label
            className={classNames(
              styles.datepicker_container
              // isStartDateActive === true ? null : styles.disabled,
              // isStartDateActive === false && isStartDateActive !== null
              //   ? styles.hidden
              //   : null
            )}
          >
            <DatePicker
              dateFormat="dd.MM.yyyy"
              selected={startDate}
              onChange={(date) => {
                if (date !== null) {
                  setStartDate(date)
                  let d = new Date(date)
                  d.setDate(d.getDate() + 1)
                  let s = d.toISOString()
                  dispatch(setStartDateForP(s))
                }
              }}
              locale="ru"
            />
            <div className={styles.datepicker_ico}>
              <img src={calendar} alt="" />
            </div>
          </label>
          <img src={arrowTo} alt="" />
          <label
            className={classNames(
              styles.datepicker_container
              // isEndDateActive === true ? null : styles.disabled,
              // isEndDateActive === false && isEndDateActive !== null
              //   ? styles.hidden
              //   : null
            )}
          >
            <DatePicker
              dateFormat="dd.MM.yyyy"
              selected={endDate}
              onChange={(date) => {
                // if (date !== null) {
                //   setEndDate(date)
                //   dispatch(setEndDateForP(date.toISOString()))
                // }
              }}
              locale="ru"
            />
            <div className={styles.datepicker_ico}>
              <img src={calendar} alt="" />
            </div>
          </label>

          <button
            disabled={activeCopyPrice()}
            className={styles.copyPrice}
            onClick={() => {
              console.log('copyPrice')
              allPeriod[allPeriod.length - 2].price_items.forEach((item) => {
                console.log(item)

                let ind = allPeriod[allPeriod.length - 1].price_items.findIndex(
                  (item1) => {
                    return (
                      item1.article_unit_item_id === item.article_unit_item_id
                    )
                  }
                )
                if (ind === -1) {
                  console.log(
                    `добавить элемент для ${item.article_unit_item_id}`
                  )
                  let el: {
                    article_unit_item_id: number
                    price_list_result: number | null
                    price_results: {
                      value: number
                      staff_id: number
                      is_last: number
                      complex_item_id: number | null
                      division_id: number
                    }[]
                  } = {
                    article_unit_item_id: item.article_unit_item_id,
                    price_list_result: activePeriodId,
                    price_results: [],
                  }
                  let price_results_item = item.price_results.find((item) => {
                    return item.division_id === activeDivisionId
                  })
                  if (price_results_item !== undefined) {
                    el.price_results.push({
                      value: price_results_item?.value,
                      staff_id: price_results_item?.staff_id,
                      is_last: price_results_item?.is_last,
                      complex_item_id: price_results_item?.complex_item_id,
                      division_id: price_results_item?.division_id,
                    })
                  }
                  console.log(el)
                  dispatch(addPrice(el))
                } else {
                  let priceDorD = allPeriod[allPeriod.length - 1].price_items[
                    ind
                  ].price_results.find((item1) => {
                    return item1.division_id === activeDivisionId
                  })
                  if (priceDorD === undefined) {
                    console.log(
                      `отсюда перетянуть нужную цену в ${item.article_unit_item_id} `
                    )
                    console.log(
                      allPeriod[allPeriod.length - 1].price_items[ind]
                    )
                  }
                }
              })
            }}
          >
            <div className={styles.img}></div>
            <span>Копировать цены</span>
          </button>

          <button
            className={styles.correctPrice}
            disabled={activeServiceId === -1}
            onClick={() => {
              setActiveWindow(true)
            }}
          >
            <div className={styles.img}></div>
            <span>Корректировка цены позиции</span>
          </button>

          <button className={styles.correctedPrice}>
            <span>Скорректированнные позиции</span>
          </button>

          <div className={styles.currency}>Валюта: ₽</div>

          <button
            onClick={(e) => {
              let result = clickOnSave()
            }}
            className={classNames(styles.saveBtn)}
            disabled={activeDivisionId === null || activeDivisionId === -1}
          ></button>

          <div className={styles.btnClose}>
            <img src={greenDel} alt="greenDel" />
          </div>
        </div>

        <div className={styles.body}>
          <div>
            <Period />
          </div>
          <div>
            <Filters />
          </div>
          <div>
            <Services />
          </div>
        </div>
      </div>

      <>
        {activeWindow && (
          <>
            <div className={classNames(styles.background)}></div>
            <div className={classNames(styles.window)}>
              <div className={classNames(styles.body1)}>
                <div className={classNames(styles.header)}>
                  <div className={classNames(styles.header_text)}>
                    Корректировка цены позиции
                  </div>
                  <button
                    onClick={(e) => {
                      setActiveWindow(false)

                      dispatch(
                        updatePrice({
                          id: Number(activePeriodId),
                          article_unit_item_id: activeServiceId,
                          division_id: Number(activeDivisionId),
                          value: Number(newPrice),
                          staff_id: String(searchParams.get('staff_id')),
                          is_last: 1,
                          complex_item_id: null,
                        })
                      )

                      dispatch(
                        setRedClass({
                          articleId: activeServiceId,
                          periodId: Number(activePeriodId),
                        })
                      )
                    }}
                    className={classNames(styles.saveBtn)}
                    disabled={false}
                  ></button>
                  <button
                    className={classNames(styles.btn_close)}
                    data-testid="btn_close"
                    onClick={() => {
                      setActiveWindow(false)
                    }}
                  >
                    <img src={greenKr} alt="btn_close" width={20} height={20} />
                  </button>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    height: '20px',
                    boxSizing: 'border-box',
                    marginTop: '2px',
                  }}
                >
                  <div
                    style={{
                      width: '456px',
                      background: '#cccccc',
                      boxSizing: 'border-box',
                      textAlign: 'center',
                      paddingTop: '2px',
                      fontWeight: 'bold',
                    }}
                  >
                    Услуга
                  </div>
                  <div
                    style={{
                      width: '80px',
                      background: '#cccccc',
                      boxSizing: 'border-box',
                      textAlign: 'center',
                      paddingTop: '2px',
                      fontWeight: 'bold',
                    }}
                  >
                    Было
                  </div>
                  <div
                    style={{
                      width: '80px',
                      background: '#cccccc',
                      boxSizing: 'border-box',
                      textAlign: 'center',
                      paddingTop: '2px',
                      fontWeight: 'bold',
                    }}
                  >
                    Стало
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    height: '20px',
                    boxSizing: 'border-box',
                    marginTop: '2px',
                  }}
                >
                  <div
                    style={{
                      width: '456px',
                      boxSizing: 'border-box',
                      paddingTop: '2px',
                      paddingLeft: '4px',
                    }}
                  >
                    {
                      allPriceItems.find((item) => {
                        console.log(item.article_unit_item_id, activeServiceId)
                        return item.article_unit_item_id === activeServiceId
                      })?.product_item_name
                    }
                  </div>
                  <div
                    style={{
                      width: '80px',
                      boxSizing: 'border-box',
                      textAlign: 'center',
                      paddingTop: '2px',
                      paddingLeft: '4px',
                    }}
                  >
                    {
                      allPeriod
                        .find((item) => {
                          return item.id === activePeriodId
                        })
                        ?.price_items.find((item1) => {
                          return (
                            item1.article_unit_item_id === activeServiceId &&
                            item1.price_results[0].is_last === 1
                          )
                        })?.price_results[0].value
                    }
                  </div>
                  <div
                    style={{
                      width: '80px',
                      boxSizing: 'border-box',
                      textAlign: 'center',
                      paddingTop: '2px',
                      fontWeight: 'bold',
                    }}
                  >
                    <input
                      type="number"
                      value={newPrice}
                      onChange={(e) => {
                        setNewPrice(e.target.value)
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </>

      <>
        {activeWindowPublich && (
          <>
            <div className={classNames(styles.background)}></div>
            <div className={classNames(styles.window1)}>
              <div className={classNames(styles.body2)}>
                <div className={classNames(styles.header)}>
                  <div className={classNames(styles.header_text)}>
                    Внимание!
                  </div>
                  <button
                    className={classNames(styles.btn_close)}
                    data-testid="btn_close"
                    onClick={() => {
                      setActiveWindowPublich(false)
                    }}
                  >
                    <img src={greenKr} alt="btn_close" width={20} height={20} />
                  </button>
                </div>
                <div style={{ textAlign: 'center', paddingTop: '4px' }}>
                  {`Запустить прайс-лист с ${
                    allPeriod.find((item) => {
                      return item.id === activePeriodId
                    })?.date_since
                  }?`}
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-around',
                  }}
                >
                  <button
                    className={styles.btnClass}
                    onClick={() => {
                      clickBtnOk()
                      setActiveWindowPublich(false)
                    }}
                  >
                    Да
                  </button>
                  <button
                    className={styles.btnClass}
                    onClick={() => {
                      setActiveWindowPublich(false)
                    }}
                  >
                    Нет
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </>
      <>
        {resultWindow && (
          <div className={styles.resultSaveWindow}>
            <div
              className={classNames(
                resultWindowError
                  ? styles.headerWindowError
                  : styles.headerWindow
              )}
            >
              {resultWindowHeader}
            </div>

            <div>{resultWindowStr}</div>
          </div>
        )}
      </>
    </>
  )
}

export default Price
