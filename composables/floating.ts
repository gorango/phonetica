import type { ComputePositionConfig, ComputePositionReturn, ElementRects, Middleware, MiddlewareData, Placement, ReferenceElement, SideObject } from '@floating-ui/core'
import type { Ref, ToRefs } from 'vue'
import { arrow as arrowCore, autoUpdate, computePosition } from '@floating-ui/dom'
import { isRef, ref, watch } from 'vue'

type Data = Omit<ComputePositionReturn, 'x' | 'y'> & {
  x: number | null
  y: number | null
}

type Opts = Omit<Partial<ComputePositionConfig>, 'platform'>

type UseFloatingReturn = ToRefs<Data> & {
  update: () => void
  referenceRef: Ref<ReferenceElement | null>
  floatingRef: Ref<HTMLElement | null>
}

export function useFloating({
  middleware,
  placement = 'bottom-end',
  strategy = 'absolute',
}: Opts = {}): UseFloatingReturn {
  const isMounted = useMounted()
  const referenceRef: Ref<ReferenceElement | null> = ref(null)
  const floatingRef: Ref<HTMLElement | null> = ref(null)
  const x: Ref<number> = ref(0)
  const y: Ref<number> = ref(0)
  const _strategy = ref(strategy)
  const _placement = ref<Placement>(placement)
  const middlewareData = ref<MiddlewareData>({})

  const update = () => {
    if (!referenceRef.value || !floatingRef.value)
      return

    computePosition(referenceRef.value, floatingRef.value, { middleware, placement, strategy })
      .then((data) => {
        x.value = data.x
        y.value = data.y
        _placement.value = data.placement
        _strategy.value = data.strategy
        middlewareData.value = data.middlewareData
      })
  }

  let floatingUiCleanup: Function
  watch(isMounted, () => nextTick(() => {
    floatingUiCleanup = autoUpdate(referenceRef.value, floatingRef.value as HTMLElement, update)
  }))
  onBeforeUnmount(() => floatingUiCleanup?.())

  return {
    x,
    y,
    strategy: _strategy,
    placement: _placement,
    middlewareData,
    update,
    referenceRef,
    floatingRef,
  }
}

export function arrow(options: {
  element: Ref<HTMLElement | null> | HTMLElement
  padding?: number | SideObject
}): Middleware {
  const { element, padding } = options

  return {
    name: 'arrow',
    options,
    fn(args) {
      if (isRef(element)) {
        if (element.value != null)
          return arrowCore({ element: element.value, padding }).fn(args)

        return {}
      }
      else if (element) {
        return arrowCore({ element, padding }).fn(args)
      }

      return {}
    },
  }
}

export function sameWidth(floatingEl: Ref<HTMLElement | null >): Middleware {
  return {
    name: 'sameWidth',
    fn: ({ rects, x, y }: { rects: ElementRects; x: number; y: number }) => {
      if (floatingEl.value)
        floatingEl.value.style.minWidth = `${rects.reference.width}px`
      return { x, y }
    },
  }
}

export default useFloating
