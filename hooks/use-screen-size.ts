"use client"

import { useState, useEffect } from "react"

export type ScreenSize = "sm" | "md" | "lg" | "xl" | "2xl"

export function useScreenSize() {
  const [screenSize, setScreenSize] = useState<ScreenSize>("lg")

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth
      if (width < 768) {
        setScreenSize("sm")
      } else if (width < 1024) {
        setScreenSize("md")
      } else if (width < 1280) {
        setScreenSize("lg")
      } else if (width < 1536) {
        setScreenSize("xl")
      } else {
        setScreenSize("2xl")
      }
    }

    // Verificar el tamaño inicial
    checkScreenSize()

    // Escuchar cambios de tamaño
    window.addEventListener("resize", checkScreenSize)

    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

  return screenSize
}

export function useIsSmallScreen() {
  const screenSize = useScreenSize()
  return screenSize === "sm" || screenSize === "md"
}

export function useIsMediumScreen() {
  const screenSize = useScreenSize()
  return screenSize === "lg"
}
