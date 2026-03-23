import { useState, useEffect } from "react";

// Nuevo Custom Hook para el efecto de escritura
export function useTypingEffect(text: string, speed: number = 50, isHovered: boolean = false) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    // Si no está en hover, limpiamos el texto
    if (!isHovered) {
      setDisplayedText("");
      return;
    }

    let i = 0;
    setDisplayedText(""); // Reiniciar antes de empezar

    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(text.substring(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, isHovered]);

  return displayedText;
}
