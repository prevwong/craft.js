import { useEffect } from 'react'

export const useEffectOnce = (effect) => {
  useEffect(effect, [])
}
