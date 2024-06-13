import styles from './Services.module.scss'
import { useSearchParams } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../../../app/hooks'
import {
  clear,
  noclear,
  activeRowLeft,
  activeRowRight,
  greyRowLeft,
  greyRowRight,
} from 'shared/icons/_index'
import Search from 'shared/ui-kit/Search/Search'
import { useEffect, useState } from 'react'
import {
  DropdawnSearch,
  loadPriceItems,
  loadPriceResults,
  loadCategory,
  clearAllPriceResultItem,
  setInfForPriceRes,
  addPriceItems,
  updatePriceValue,
  setActiveServiceId,
  setActiveArticleUnitItem,
  setPrice,
  addPrice,
  clearAllPeriodPriceItems,
} from '..'
import { spawn } from 'child_process'
import classNames from 'classnames'

const Services = () => {
  const dispatch = useAppDispatch()

  const [searchParams, setSearchParams] = useSearchParams()

  const allPriceItems = useAppSelector(
    (state) => state.serviceReducer.allPriceItem
  )

  const activePeriodId = useAppSelector(
    (state) => state.periodReducer.activePeriodId
  )

  const [activePriceResult, setActivePriceResult] = useState<
    number | undefined
  >(-1)

  const activeServiceId = useAppSelector(
    (state) => state.serviceReducer.activeServiceId
  )

  const redClass = useAppSelector((state) => state.serviceReducer.redClass)

  const allDivisions = useAppSelector(
    (state) => state.divisionReducer.allDivisions
  )
  const loadCategoryFulfilled = useAppSelector(
    (state) => state.serviceReducer.loadCategoryFulfilled
  )
  const [loadPriceResult, setLoadPriceResult] = useState(false)
  const allPeriod = useAppSelector((state) => state.periodReducer.allPeriod)

  const allCategory = useAppSelector(
    (state) => state.serviceReducer.allCategory
  )

  const activeArticleUnitItem = useAppSelector(
    (state) => state.serviceReducer.activeArticleUnitItem
  )

  const activeDivisionId = useAppSelector(
    (state) => state.divisionReducer.activeDivisions
  )

  const allPriceResultItem = useAppSelector(
    (state) => state.serviceReducer.allPriceResultItem
  )

  const price_result = useAppSelector(
    (state) => state.serviceReducer.price_result
  )

  const [pricesForRender, setPrices] = useState<
    {
      period: number
      price: { service: number; price: number; priceId?: number }[]
    }[]
  >([])

  useEffect(() => {
    setLoadPriceResult(false)
    setPrices([])
    if (activeDivisionId !== null) {
      dispatch(
        loadPriceItems({
          company_group_id: Number(searchParams.get('company_group_id')),
          price_type_id: Number(searchParams.get('price_type_id')),
          language_id: Number(searchParams.get('language_id')),
        })
      )
      dispatch(loadCategory())
    }
  }, [activeDivisionId])

  const [dataServices, setDataServices] = useState<
    {
      name: string
      id: number
    }[]
  >([])

  useEffect(() => {
    setDataServicesFromAllPriceItems()
  }, [allPriceItems])

  function setDataServicesFromAllPriceItems() {
    let arrayPriceItems: { name: string; id: number }[] = []
    allPriceItems.forEach((item) => {
      arrayPriceItems.push({
        name: item.product_item_name,
        id: item.article_unit_item_id,
      })
    })
    setDataServices(arrayPriceItems)
    setArrayService(arrayPriceItems)
  }

  const [indexOfPeriod, setIndexOfPeriod] = useState(0)

  const [dataDate, setDataDate] = useState<
    { with: string; to: string; id: number }[]
  >(() => {
    let arrayOfPeriod: { with: string; to: string; id: number }[] = []
    for (let i = indexOfPeriod; i < indexOfPeriod + 4; i++) {
      arrayOfPeriod.push({
        with: '',
        to: '',
        id: -1,
      })
    }
    return arrayOfPeriod
  })

  useEffect(() => {
    if (allPriceItems.length > 0) {
      dispatch(clearAllPeriodPriceItems())
      for (let i = 0; i < allPeriod.length; i++) {
        dispatch(
          loadPriceResults({
            division_id: Number(activeDivisionId),
            price_list_result_id: Number(allPeriod[i].id),
          })
        )
      }
      setTimeout(() => {
        setLoadPriceResult(true)
      }, 400)
    }
    //setDataRezult
  }, [allPriceItems])

  useEffect(() => {
    if (allPeriod !== undefined) {
      setIndexOfPeriod(allPeriod.length - 1)
    }
  }, [allPeriod])

  useEffect(() => {
    if (allPriceResultItem.length !== 0) {
      for (let i = 0; i < allPriceResultItem.length; i++) {
        let price_item: {
          article_unit_item_id: number
          id: number
          price_list_result: number
          price_results: {
            value: number
            staff_id: number
            is_last: number
            complex_item_id: number | null
            division_id: number
          }[]
        } = {
          article_unit_item_id: -1,
          price_results: [],
          id: -1,
          price_list_result: -1,
        }

        let price = allPriceItems.find((item1) => {
          return item1.id === allPriceResultItem[i].price_item
        })
        price_item.article_unit_item_id = Number(price?.article_unit_item_id)
        price_item.id = Number(price?.id)
        price_item.price_list_result = Number(
          allPriceResultItem[i].price_list_result
        )
        price_item.price_results.push({
          value: allPriceResultItem[i].value,
          staff_id: allPriceResultItem[i].staff_id,
          is_last: allPriceResultItem[i].is_last,
          complex_item_id: allPriceResultItem[i].complex_item_id,
          division_id: allPriceResultItem[i].division,
        })
        dispatch(addPrice(price_item))
      }
    }
  }, [allPriceResultItem])

  useEffect(() => {
    let arrayOfPeriod: { with: string; to: string; id: number }[] = []

    if (indexOfPeriod === allPeriod.length - 1) {
      for (let i = indexOfPeriod; i > indexOfPeriod - 4; i--) {
        if (allPeriod[i] !== undefined) {
          arrayOfPeriod.push({
            with:
              allPeriod[i].date_since !== null
                ? String(allPeriod[i].date_since)
                : '',
            to:
              allPeriod[i].date_to !== null ? String(allPeriod[i].date_to) : '',
            id: Number(allPeriod[i].id),
          })
        } else {
          arrayOfPeriod.push({
            with: '',
            to: '',
            id: -1,
          })
        }
      }
      setDataDate(arrayOfPeriod)
    } else {
      arrayOfPeriod.push(dataDate[0])
      for (let i = indexOfPeriod - 1; i > indexOfPeriod - 4; i--) {
        if (allPeriod[i] !== undefined) {
          arrayOfPeriod.push({
            with:
              allPeriod[i].date_since !== null
                ? String(allPeriod[i].date_since)
                : '',
            to:
              allPeriod[i].date_to !== null ? String(allPeriod[i].date_to) : '',
            id: Number(allPeriod[i].id),
          })
        } else {
          arrayOfPeriod.push({
            with: '',
            to: '',
            id: -1,
          })
        }
      }
      setDataDate(arrayOfPeriod)
    }
  }, [allPeriod, indexOfPeriod])

  const [arrayCategory, setArrayCategory] = useState<
    { id: number; name: string }[]
  >([])

  useEffect(() => {
    if (allCategory.length !== 0) {
      let r: { id: number; name: string }[] = []
      allCategory.forEach((item) => {
        let s = item.name.indexOf('(')
        let f = item.name.indexOf(')')
        r.push({ id: item.id, name: item.name.slice(s + 1, f) })
      })
      setArrayCategory(r)
    }
  }, [allCategory])

  const handleCategory = (value: {
    id: number
    name: string
    order_num?: number
  }) => {
    let r = dataServices.filter((item) => {
      return item.name.includes(value.name)
    })
    setDataServices(r)
    setActiveWhisk(true)
  }

  const [arrayService, setArrayService] = useState<
    {
      name: string
      id: number
    }[]
  >([])

  const handleService = (value: {
    id: number
    name: string
    order_num?: number
  }) => {
    let r = dataServices.filter((item) => {
      return item.name.includes(value.name)
    })
    setDataServices(r)
    setActiveWhisk(true)
  }

  const [dataRezult, setDataRezult] = useState([])

  function activeCorrectPrice() {
    let p = allPeriod.find((item) => {
      return item.id === activePeriodId
    })
    if (p !== undefined) {
      if (p.is_draft === 1) {
        return true
      } else {
        return false
      }
    } else return false
  }

  const renderServices = dataServices.map((item, index) => {
    return (
      <div
        onClick={() => {
          if (!activeCorrectPrice()) {
            dispatch(setActiveServiceId(item.id))
          }
        }}
        key={index}
        className={classNames(
          styles.serviceRow,
          activeServiceId === item.id ? styles.activeServiceRow : ''
        )}
        style={index % 2 === 0 ? { backgroundColor: '#c0e1c6' } : {}}
      >
        {item.name}
      </div>
    )
  })

  function getPriceForServAndPeriod(
    activeArticleUnitItem: number,
    periodId: number
  ) {
    let value = undefined
    try {
      value = allPeriod
        .find((item) => {
          return Number(item.id) === Number(periodId)
        })
        ?.price_items.find((item1) => {
          return (
            item1.article_unit_item_id === activeArticleUnitItem &&
            item1.price_results[0].is_last === 1
          )
        })?.price_results[0].value
    } catch (error) {
      console.log(
        allPeriod
          .find((item) => {
            return Number(item.id) === Number(periodId)
          })
          ?.price_items.find((item1) => {
            return item1.article_unit_item_id === activeArticleUnitItem
          })
      )
    }

    if (value === undefined) {
      return ''
    } else {
      return String(value)
    }
  }

  const [keyForRenderDropdown, setKeyForRenderDropdown] = useState(1)
  const [activeWhisk, setActiveWhisk] = useState(false)

  return (
    <div className={styles.wrapper}>
      <div className={styles.services}>
        <div className={styles.filters} key={keyForRenderDropdown}>
          <DropdawnSearch
            placeholder={'Категория'}
            arrayValue={arrayCategory}
            onChange={handleCategory}
          />
          <DropdawnSearch
            placeholder={'Услуга'}
            arrayValue={arrayService}
            onChange={handleService}
          />
          {activeWhisk ? (
            <img
              src={clear}
              alt=""
              onClick={() => {
                setKeyForRenderDropdown(
                  (keyForRenderDropdown) => keyForRenderDropdown + 1
                )
                setDataServicesFromAllPriceItems()
                setActiveWhisk(false)
              }}
            />
          ) : (
            <img src={noclear} alt="" />
          )}
        </div>
        <div className={styles.servicesList}>
          <div className={styles.nameColumns}>Услуги</div>
          <div className={styles.result}>ИТОГО ПО КОМПЛЕКСУ:</div>
          {loadCategoryFulfilled && loadPriceResult && (
            <div className={styles.allServices}>{renderServices}</div>
          )}
        </div>
      </div>
      <div
        className={styles.arrowLeft}
        onClick={() => {
          if (indexOfPeriod + 1 <= allPeriod.length - 1) {
            setIndexOfPeriod(indexOfPeriod + 1)
          }
        }}
      >
        {indexOfPeriod + 1 > allPeriod.length - 1 ? (
          <img src={greyRowLeft} alt="" className={styles.imgArrow} />
        ) : (
          <img src={activeRowLeft} alt="" className={styles.imgArrow} />
        )}
      </div>
      <div className={styles.prices}>
        <div className={styles.header}>
          <div className={styles.date}>
            <div>{dataDate[0].with}</div>
            <div>{dataDate[0].to}</div>
          </div>
          <div className={styles.date}>
            <div>{dataDate[1].with}</div>
            <div>{dataDate[1].to}</div>
          </div>
          <div className={styles.date}>
            <div>{dataDate[2].with}</div>
            <div>{dataDate[2].to}</div>
          </div>
          <div className={styles.date}>
            <div>{dataDate[3].with}</div>
            <div>{dataDate[3].to}</div>
          </div>
          <div className={styles.rezult}>{dataRezult[0]}</div>
          <div className={styles.rezult}>{dataRezult[1]}</div>
          <div className={styles.rezult}>{dataRezult[2]}</div>
          <div className={styles.rezult}>{dataRezult[3]}</div>
        </div>
        {loadCategoryFulfilled && loadPriceResult && (
          <div className={styles.body}>
            <div
              className={
                Number(dataDate[0].id) === Number(activePeriodId)
                  ? classNames(styles.priceColl)
                  : ''
              }
            >
              {dataServices.map((item, index) => {
                return (
                  <>
                    <div
                      onClick={() => {
                        if (
                          Number(dataDate[0].id) === Number(activePeriodId) &&
                          allPeriod.find((item) => item.id === activePeriodId)
                            ?.is_draft === 1
                        ) {
                          dispatch(setActiveArticleUnitItem(item.id))
                        }
                      }}
                      style={
                        index % 2 === 0 ? { backgroundColor: '#c0e1c6' } : {}
                      }
                    >
                      {Number(activeArticleUnitItem) !== Number(item.id) ||
                      Number(activePeriodId) !== Number(dataDate[0].id) ? (
                        <span
                          style={
                            redClass.findIndex((item1) => {
                              return (
                                item1.articleId === item.id &&
                                item1.periodId === dataDate[0].id
                              )
                            }) !== -1
                              ? { color: 'red' }
                              : {}
                          }
                        >
                          {getPriceForServAndPeriod(
                            Number(item.id),
                            Number(dataDate[0].id)
                          )}
                        </span>
                      ) : (
                        <input
                          type="number"
                          onChange={(e) => {
                            dispatch(
                              setPrice({
                                id: activePeriodId,
                                article_unit_item_id: item.id,
                                price_results: {
                                  value: Number(e.target.value),
                                  staff_id: Number(
                                    searchParams.get('staff_id')
                                  ),
                                  is_last: 1,
                                  complex_item_id: null,
                                  division_id: Number(activeDivisionId),
                                },
                              })
                            )
                          }}
                        />
                      )}
                    </div>
                  </>
                )
              })}
            </div>

            <div
              className={
                Number(dataDate[1].id) === Number(activePeriodId)
                  ? classNames(styles.priceColl)
                  : ''
              }
            >
              {dataServices.map((item, index) => {
                return (
                  <>
                    <div
                      onClick={() => {
                        if (
                          Number(dataDate[1].id) === Number(activePeriodId) &&
                          allPeriod.find((item) => item.id === activePeriodId)
                            ?.is_draft === 1
                        ) {
                          dispatch(setActiveArticleUnitItem(item.id))
                        }
                      }}
                      style={
                        index % 2 === 0 ? { backgroundColor: '#c0e1c6' } : {}
                      }
                    >
                      {Number(activeArticleUnitItem) !== Number(item.id) ||
                      Number(activePeriodId) !== Number(dataDate[1].id) ? (
                        <span
                          style={
                            redClass.findIndex((item1) => {
                              return (
                                item1.articleId === item.id &&
                                item1.periodId === dataDate[1].id
                              )
                            }) !== -1
                              ? { color: 'red' }
                              : {}
                          }
                        >
                          {getPriceForServAndPeriod(
                            Number(item.id),
                            Number(dataDate[1].id)
                          )}
                        </span>
                      ) : (
                        <input
                          type="number"
                          onChange={(e) => {
                            dispatch(
                              setPrice({
                                id: activePeriodId,
                                article_unit_item_id: item.id,
                                price_results: {
                                  value: Number(e.target.value),
                                  staff_id: Number(
                                    searchParams.get('staff_id')
                                  ),
                                  is_last: 0,
                                  complex_item_id: null,
                                  division_id: Number(activeDivisionId),
                                },
                              })
                            )
                          }}
                        />
                      )}
                    </div>
                  </>
                )
              })}
            </div>

            <div
              className={
                Number(dataDate[2].id) === Number(activePeriodId)
                  ? classNames(styles.priceColl)
                  : ''
              }
            >
              {dataServices.map((item, index) => {
                return (
                  <>
                    <div
                      onClick={() => {
                        if (
                          Number(dataDate[2].id) === Number(activePeriodId) &&
                          allPeriod.find((item) => item.id === activePeriodId)
                            ?.is_draft === 1
                        ) {
                          dispatch(setActiveArticleUnitItem(item.id))
                        }
                      }}
                      style={
                        index % 2 === 0 ? { backgroundColor: '#c0e1c6' } : {}
                      }
                    >
                      {Number(activeArticleUnitItem) !== Number(item.id) ||
                      Number(activePeriodId) !== Number(dataDate[2].id) ? (
                        <span
                          style={
                            redClass.findIndex((item1) => {
                              return (
                                item1.articleId === item.id &&
                                item1.periodId === dataDate[2].id
                              )
                            }) !== -1
                              ? { color: 'red' }
                              : {}
                          }
                        >
                          {getPriceForServAndPeriod(
                            Number(item.id),
                            Number(dataDate[2].id)
                          )}
                        </span>
                      ) : (
                        <input
                          type="number"
                          onChange={(e) => {
                            dispatch(
                              setPrice({
                                id: activePeriodId,
                                article_unit_item_id: item.id,
                                price_results: {
                                  value: Number(e.target.value),
                                  staff_id: Number(
                                    searchParams.get('staff_id')
                                  ),
                                  is_last: 0,
                                  complex_item_id: null,
                                  division_id: Number(activeDivisionId),
                                },
                              })
                            )
                          }}
                        />
                      )}
                    </div>
                  </>
                )
              })}
            </div>

            <div
              className={
                Number(dataDate[3].id) === Number(activePeriodId)
                  ? classNames(styles.priceColl)
                  : ''
              }
            >
              {dataServices.map((item, index) => {
                return (
                  <>
                    <div
                      onClick={() => {
                        if (
                          Number(dataDate[3].id) === Number(activePeriodId) &&
                          allPeriod.find((item) => item.id === activePeriodId)
                            ?.is_draft === 1
                        ) {
                          dispatch(setActiveArticleUnitItem(item.id))
                        }
                      }}
                      style={
                        index % 2 === 0 ? { backgroundColor: '#c0e1c6' } : {}
                      }
                    >
                      {Number(activeArticleUnitItem) !== Number(item.id) ||
                      Number(activePeriodId) !== Number(dataDate[3].id) ? (
                        <span
                          style={
                            redClass.findIndex((item1) => {
                              return (
                                item1.articleId === item.id &&
                                item1.periodId === dataDate[3].id
                              )
                            }) !== -1
                              ? { color: 'red' }
                              : {}
                          }
                        >
                          {getPriceForServAndPeriod(
                            Number(item.id),
                            Number(dataDate[3].id)
                          )}
                        </span>
                      ) : (
                        <input
                          type="number"
                          onChange={(e) => {
                            dispatch(
                              setPrice({
                                id: activePeriodId,
                                article_unit_item_id: item.id,
                                price_results: {
                                  value: Number(e.target.value),
                                  staff_id: Number(
                                    searchParams.get('staff_id')
                                  ),
                                  is_last: 0,
                                  complex_item_id: null,
                                  division_id: Number(activeDivisionId),
                                },
                              })
                            )
                          }}
                        />
                      )}
                    </div>
                  </>
                )
              })}
            </div>
          </div>
        )}
      </div>
      <div
        className={styles.arrowRight}
        onClick={() => {
          if (indexOfPeriod - 1 !== -1 && allPeriod.length > 4) {
            setIndexOfPeriod(indexOfPeriod - 1)
          }
        }}
      >
        {indexOfPeriod - 1 === -1 || allPeriod.length <= 4 ? (
          <img src={greyRowRight} alt="" className={styles.imgArrow} />
        ) : (
          <img src={activeRowRight} alt="" className={styles.imgArrow} />
        )}
      </div>
    </div>
  )
}

export default Services
