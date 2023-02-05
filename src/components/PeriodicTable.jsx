import styles from './PeriodicTable.module.scss'
import elements from '../data/elements'
import { SegmentedControl, FormControl, Button } from '@primer/react'
import { BookIcon } from '@primer/octicons-react'
import React from 'react'
import { Link } from 'react-router-dom'
import Cookies from 'js-cookie'

function generateTable(symbol, selectedElement, setSelectedElement) {
  var table = [
    [1, 'spacer', 2],
    [[3, 4], 'spacer', [5, 10]],
    [[11, 12], 'spacer', [13, 18]],
    [[19, 36]],
    [[37, 54]],
    [[55, 56], <Spacer label="57-71" highlight key="l0" />, [72, 86]],
    [[87, 88], <Spacer label="89-103" highlight key="l1" />, [104, 118]],
    ['spacer', [57, 71]],
    ['spacer', [89, 103]],
  ]
  var spacerKey = 0

  table = table.map(row => {
    var newRow = []
    row.forEach(cell => {
      if (typeof cell === 'number') {
        newRow.push(
          <Element
            atomicNumber={cell}
            symbol={symbol}
            active={cell === selectedElement}
            onClick={() => {
              setSelectedElement(cell)
            }}
            key={cell}
          />,
        )
      } else if (Array.isArray(cell)) {
        for (let i = cell[0]; i <= cell[1]; i++) {
          newRow.push(
            <Element
              atomicNumber={i}
              symbol={symbol}
              active={i === selectedElement}
              onClick={() => {
                setSelectedElement(i)
              }}
              key={i}
            />,
          )
        }
      } else {
        newRow.push(cell)
      }
    })

    if (newRow.length < 18 && newRow.find(cell => cell === 'spacer')) {
      newRow[newRow.findIndex(cell => cell === 'spacer')] = (l => {
        var arr = []
        for (let i = 0; i < l; i++) {
          arr.push(<Spacer key={'s' + spacerKey} />)
          spacerKey++
        }
        return arr
      })(18 - newRow.length + 1) // extra `1` is for the placeholder `'spacer'`
    }

    return newRow.flat()
  })

  return table.flat()
}

function Element({ atomicNumber, symbol, active, ...props }) {
  const element = elements[atomicNumber - 1]

  return (
    <button
      className={styles.cell + (active ? ' ' + styles.active : '')}
      {...props}
    >
      <span className={styles.atomicNumber}>{element.atomicNumber}</span>
      {symbol === 'symbol' ? (
        <span className={styles.symbol}>{element.symbol}</span>
      ) : symbol === 'name' ? (
        <span className={styles.name}>{element.name}</span>
      ) : null}
      <span className={styles.atomicMass}>{element.atomicMass}</span>
    </button>
  )
}

function Spacer({ label, className, highlight, ...props }) {
  return (
    <div
      className={
        styles.spacer +
        (className ? ' ' + className : '') +
        (highlight ? ' ' + styles.highlight : '')
      }
      {...props}
    >
      {label}
    </div>
  )
}

function ElementDisplay({ atomicNumber, className }) {
  const element = elements[atomicNumber - 1]

  function Data({ dataKey, value }) {
    return (
      <>
        <div className={styles.dataKey}>{dataKey}</div>
        <div className={styles.value}>{value}</div>
      </>
    )
  }

  return (
    <div className={styles.elementDisplay + (className ? ' ' + className : '')}>
      <div className={styles.left}>
        <div className={styles.symbol}>{element.symbol}</div>
      </div>
      <div className={styles.right}>
        <Data dataKey="序数" value={element.atomicNumber} />
        <Data dataKey="名称" value={element.name} />
        <Data dataKey="英文名称" value={element.englishName} />
        <Data dataKey="族" value={element.group} />
        <Data dataKey="周期" value={element.period} />
        <Data dataKey="相对原子质量" value={element.atomicMass} />
      </div>
    </div>
  )
}

function PeriodicTable() {
  const [selectedElement, setSelectedElement] = React.useState(
    Cookies.get('ptEl') ? parseInt(Cookies.get('ptEl'), 10) : 1,
  )
  function changeSelectedElement(val) {
    setSelectedElement(val)
    Cookies.set('ptEl', val, { expires: 14 })
  }

  const [selectedSymbol, setSelectedSymbol] = React.useState(
    Cookies.get('ptSymbol') ? Cookies.get('ptSymbol') : 'symbol',
  )
  const handleSymbolSegmentChange = selectedSymbol => {
    const s = ['symbol', 'name'][selectedSymbol]
    setSelectedSymbol(s)
    Cookies.set('ptSymbol', s, { expires: 14 })
  }

  return (
    <>
      <div className={styles.table}>
        {generateTable(selectedSymbol, selectedElement, changeSelectedElement)}
      </div>
      <div className={styles.controls}>
        <div className={styles.options}>
          <FormControl>
            <FormControl.Label>符号显示</FormControl.Label>
            <SegmentedControl
              aria-label="Symbol display"
              size="small"
              onChange={handleSymbolSegmentChange}
            >
              <SegmentedControl.Button selected={selectedSymbol === 'symbol'}>
                元素符号
              </SegmentedControl.Button>
              <SegmentedControl.Button selected={selectedSymbol === 'name'}>
                元素名称
              </SegmentedControl.Button>
            </SegmentedControl>
          </FormControl>
        </div>
        <ElementDisplay
          atomicNumber={selectedElement}
          className={styles.display}
        />
        <div className={styles.actions}>
          <Button
            leadingIcon={BookIcon}
            as={Link}
            to={elements[selectedElement - 1].symbol}
          >
            阅读文档
          </Button>
        </div>
      </div>
    </>
  )
}

export default PeriodicTable
