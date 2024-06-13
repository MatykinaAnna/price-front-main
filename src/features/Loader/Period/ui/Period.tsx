import { useEffect, useState } from 'react'
import styles from './Period.module.scss'
import { useSearchParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { loadPeriod, setActivePeriodId } from '../../index'
import { setInfForPriceRes } from '../index'
import classNames from 'classnames'

const Period = () => {
  const dispatch = useAppDispatch()

  const [dataPeriod, setDataPeriod] = useState<
    { with: string; to: string; id: number | null }[]
  >([])
  const allPeriod = useAppSelector((state) => state.periodReducer.allPeriod)
  const activePeriodId = useAppSelector(
    (state) => state.periodReducer.activePeriodId
  )

  const [searchParams, setSearchParams] = useSearchParams()

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

  useEffect(() => {
    function toStrig(v: string | null | undefined) {
      if (typeof v === 'string') {
        return v
      } else {
        return ''
      }
    }
    if (activePeriodId !== null) {
      dispatch(
        setInfForPriceRes({
          id: activePeriodId,
          date_since: toStrig(
            allPeriod.find((item) => {
              return item.id === activePeriodId
            })?.date_since
          ),
          is_draft: 1,
          staff_id: toStrig(searchParams.get('staff_id')),
          timestamp: getTimestamp(),
        })
      )
    }
  }, [activePeriodId])

  useEffect(() => {
    dispatch(
      loadPeriod({
        company_group_id: Number(searchParams.get('company_group_id')),
        price_type_id: Number(searchParams.get('price_type_id')),
      })
    )
  }, [])

  useEffect(() => {
    let arrayOfPeriod = allPeriod.map((item) => {
      if (item.is_draft === 1) {
        dispatch(setActivePeriodId(item.id))
      }

      return {
        with: String(item.date_since),
        to: String(item.date_to),
        id: item.id,
      }
    })
    setDataPeriod(arrayOfPeriod.reverse())
  }, [allPeriod])

  function onClickPeriod(period: {
    with: string
    to: string
    id: number | null
  }) {
    dispatch(setActivePeriodId(period.id))
  }

  useEffect(() => {
    if (allPeriod.length > 0) {
      let p = {
        with: String(allPeriod[allPeriod.length - 1].date_since),
        to: String(allPeriod[allPeriod.length - 1].date_to),
        id: allPeriod[allPeriod.length - 1].id,
      }
      onClickPeriod(p)
    }
  }, [allPeriod])

  const renderPeriod = dataPeriod.map((item, index) => {
    return (
      <div key={index} className={classNames(styles.row)}>
        <div style={index % 2 === 0 ? { backgroundColor: '#c0e1c6' } : {}}>
          {item.with !== 'null' && item.with}
        </div>
        <div style={index % 2 === 0 ? { backgroundColor: '#c0e1c6' } : {}}>
          {item.to !== 'null' && item.to}
        </div>
      </div>
    )
  })

  return (
    <div className={styles.table}>
      <div className={styles.header}>Период действия</div>
      <div className={styles.body}>{renderPeriod}</div>
    </div>
  )
}

export default Period
