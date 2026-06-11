import type { Directive } from 'vue'

// v-drag-scroll: clicar e arrastar no fundo do container rola o conteúdo
// (pan). Ignora elementos interativos (cards, botões, inputs…) para não
// atrapalhar clique/drag deles, e só ativa após um pequeno limiar de movimento.
const INTERACTIVE =
  'button, a, input, textarea, select, label, [draggable="true"], [role="button"], ' +
  '.el-card, .el-select, .el-input, .el-checkbox, .el-radio, .el-button, .el-tag'

export const dragScroll: Directive<HTMLElement> = {
  mounted(el) {
    let down = false
    let moved = false
    let sx = 0
    let sy = 0
    let sl = 0
    let st = 0

    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return
      if ((e.target as HTMLElement).closest(INTERACTIVE)) return
      down = true
      moved = false
      sx = e.clientX
      sy = e.clientY
      sl = el.scrollLeft
      st = el.scrollTop
    }

    const onMove = (e: PointerEvent) => {
      if (!down) return
      const dx = e.clientX - sx
      const dy = e.clientY - sy
      if (!moved) {
        if (Math.abs(dx) < 5 && Math.abs(dy) < 5) return
        moved = true
        document.body.style.cursor = 'grabbing'
        document.body.style.userSelect = 'none'
      }
      el.scrollLeft = sl - dx
      el.scrollTop = st - dy
    }

    const onUp = () => {
      if (!down) return
      down = false
      if (moved) {
        document.body.style.cursor = ''
        document.body.style.userSelect = ''
      }
    }

    el.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    ;(el as unknown as { __ds: () => void }).__ds = () => {
      el.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
  },
  unmounted(el) {
    ;(el as unknown as { __ds?: () => void }).__ds?.()
  },
}
