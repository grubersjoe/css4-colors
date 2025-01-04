import {
  FloatingArrow,
  FloatingPortal,
  arrow,
  autoUpdate,
  flip,
  offset,
  shift,
  useClientPoint,
  useDismiss,
  useFloating,
  useHover,
  useInteractions,
} from '@floating-ui/react'
import toHex from 'colornames'
import { useRef, useState } from 'react'

import ColorPicker from './ColorPicker.tsx'

type ColorSpaceSet = 'all' | 'minimal'

const colorSpaces = {
  rectangular: [
    'srgb',
    'srgb-linear',
    'lab',
    'oklab',
    'xyz',
    'xyz-d50',
    'xyz-d65',
  ],
  polar: ['hsl', 'hwb', 'lch', 'oklch'],
}

const colorSpaceSets: Record<ColorSpaceSet, typeof colorSpaces> = {
  all: colorSpaces,
  minimal: {
    rectangular: ['srgb'],
    polar: ['hsl', 'oklch'],
  },
}

const GradientGrid = () => {
  const [colorSpaceSet, setColorSpaceSet] = useState<ColorSpaceSet>('all')

  const [startColor, setStartColor] = useState(toHex('blue'))
  const [endColor, setEndColor] = useState(toHex('yellow'))

  const [tooltipOpen, setTooltipOpen] = useState(false)
  const [hoverPosition, setHoverPosition] = useState(0)

  const arrowRef = useRef(null)
  const { refs, floatingStyles, context } = useFloating({
    open: tooltipOpen,
    onOpenChange: setTooltipOpen,
    placement: 'bottom',
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(10),
      flip(),
      shift(),
      arrow({
        element: arrowRef,
      }),
    ],
  })

  const { getReferenceProps, getFloatingProps } = useInteractions([
    useHover(context, { move: true }),
    useDismiss(context),
    useClientPoint(context, { axis: 'x' }),
  ])

  const spaces = colorSpaceSets[colorSpaceSet]

  return (
    <>
      <h1>CSS4 gradients</h1>
      <p>All gradients use the the same start and end color.</p>
      <div className="grid grid-cols-[auto_1fr] gap-4 text-sm text-right font-mono">
        <div className="grid gap-1 auto-rows-[40px] items-center">
          {spaces.rectangular.map((space) => (
            <div key={space}>
              <span className="px-1 py-0.5 rounded  bg-yellow-100">
                {space}
              </span>
            </div>
          ))}
          {spaces.polar.map((space) => (
            <div key={space}>
              <span className="px-1 py-0.5 rounded bg-blue-100">{space}</span>
            </div>
          ))}
        </div>

        <div
          className="grid gap-1 auto-rows-[40px]"
          ref={refs.setReference}
          {...getReferenceProps()}
          onMouseMove={(event) => {
            if (refs.domReference.current) {
              const bounds = refs.domReference.current.getBoundingClientRect()
              setHoverPosition((event.clientX - bounds.x) / bounds.width)
            }
          }}
        >
          {spaces.rectangular.concat(spaces.polar).map((space) => (
            <div
              key={space}
              style={{
                background: `linear-gradient(to right in ${space}, ${startColor}, ${endColor})`,
              }}
            />
          ))}

          <FloatingPortal>
            {tooltipOpen && (
              <div
                className="px-2 py-1 bg-gray-700 text-white text-sm rounded max-w-max;"
                ref={refs.setFloating}
                style={floatingStyles}
                {...getFloatingProps()}
              >
                {Math.round(hoverPosition * 100)}%
                <FloatingArrow
                  ref={arrowRef}
                  context={context}
                  className="fill-gray-700"
                />
              </div>
            )}
          </FloatingPortal>
        </div>
      </div>

      <div className="my-4 flex justify-end gap-4 text-sm font-mono">
        <span className="px-1 py-0.5 rounded  bg-yellow-100">
          rectangular color space
        </span>

        <span className="px-1 py-0.5 rounded  bg-blue-100">
          polar color space
        </span>
      </div>

      <div className="mt-8 flex gap-6">
        <fieldset>
          <legend>Color spaces</legend>
          <select
            value={colorSpaceSet}
            onChange={(event) => {
              setColorSpaceSet(event.target.value as ColorSpaceSet)
            }}
          >
            <option value="all">all</option>
            <option value="minimal">minimal</option>
          </select>
        </fieldset>

        <fieldset>
          <legend>Color picker</legend>
          <ColorPicker
            label="start"
            initial={startColor}
            onChange={(event) => {
              setStartColor(event.target.value)
            }}
          />

          <ColorPicker
            label="end"
            initial={endColor}
            onChange={(event) => {
              setEndColor(event.target.value)
            }}
          />
        </fieldset>

        <fieldset>
          <legend>Presets</legend>
          <button
            type="button"
            onClick={() => {
              setStartColor(toHex('blue'))
              setEndColor(toHex('yellow'))
            }}
          >
            blue to yellow
          </button>
          <button
            type="button"
            onClick={() => {
              setStartColor('#10a0ad')
              setEndColor('#ff3d94')
            }}
          >
            teal to pink
          </button>
          <button
            className="btn"
            type="button"
            onClick={() => {
              setStartColor(toHex('white'))
              setEndColor(toHex('black'))
            }}
          >
            white to black
          </button>
        </fieldset>
      </div>
    </>
  )
}

export default GradientGrid
