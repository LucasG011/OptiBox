import { useEffect, useRef } from 'react'

interface SplashScreenProps {
  onComplete: () => void
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const duration = prefersReducedMotion ? 0 : 900

  useEffect(() => {
    const timer = setTimeout(() => {
      onCompleteRef.current()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-6">
        <div className="relative h-48 w-48">
          <img
            src="/box2.svg"
            alt="OptiBox 3D box"
            className={`h-full w-full text-amber-600 ${prefersReducedMotion ? '' : 'animate-spin'}`}
            aria-hidden="true"
          />
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-stone-800">
            Opti<span className="text-amber-600">Box</span>
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            Dimensões ótimas de caixa com o mínimo de papelão
          </p>
        </div>
      </div>
    </div>
  )
}