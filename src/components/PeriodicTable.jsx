import styles from './PeriodicTable.module.scss'
import elements from '../data/elements'
import { SegmentedControl, FormControl } from '@primer/react'
import React from 'react'

function generateTable(symbol, selectedElement, setSelectedElement) {
  var table = [
    [1, 'spacer', 2],
    [[3, 4], 'spacer', [5, 10]],
    [[11, 12], 'spacer', [13, 18]],
    [[19, 36]],
    [[37, 54]],
    [[55, 56], <Spacer label="57-71" highlight />, [72, 86]],
    [[87, 88], <Spacer label="89-103" highlight />, [104, 118]],
    ['spacer', [57, 71]],
    ['spacer', [89, 103]],
  ]

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
          arr.push(<Spacer />)
        }
        return arr
      })(18 - newRow.length + 1) // extra `1` is for the placeholder `'spacer'`
    }

    return newRow.flat()
  })

  return table
}

function Element({ atomicNumber, symbol, active, ...props }) {
  const element = elements[atomicNumber - 1]

  return (
    <button
      className={styles.cell + (active ? ' ' + styles.active : '')}
      {...props}
    >
      <span className={styles.atomicNumber}>{element.atomicNumber}</span>
      {symbol === 0 ? (
        <span className={styles.symbol}>{element.symbol}</span>
      ) : (
        <span className={styles.name}>{element.name}</span>
      )}
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

  return (
    <div className={styles.elementDisplay + (className ? ' ' + className : '')}>
      {JSON.stringify(element)}
    </div>
  )
}

function PeriodicTable() {
  const [selectedElement, setSelectedElement] = React.useState(1)

  const [selectedSymbol, setSelectedSymbol] = React.useState(0)
  const handleSymbolSegmentChange = selectedSymbol => {
    setSelectedSymbol(selectedSymbol)
  }

  return (
    <>
      <div className={styles.table}>
        {generateTable(
          selectedSymbol,
          selectedElement,
          setSelectedElement,
        ).flat()}
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
              <SegmentedControl.Button selected={selectedSymbol === 0}>
                元素符号
              </SegmentedControl.Button>
              <SegmentedControl.Button selected={selectedSymbol === 1}>
                元素名称
              </SegmentedControl.Button>
            </SegmentedControl>
          </FormControl>
        </div>
        <ElementDisplay
          atomicNumber={selectedElement}
          className={styles.display}
        />
      </div>
    </>
  )
}

export default PeriodicTable
