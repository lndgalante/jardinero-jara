import { nanoid } from "nanoid";
import { FaWhatsapp, FaPlay, FaStop } from "react-icons/fa";
import { ReactNode, useRef, useEffect, useState } from "react";
import { GiBamboo, GiCycle, GiGardeningShears, GiGrass, GiHighGrass, GiPlantWatering } from "react-icons/gi";

import { Button, Badge, Callout, Link, IconButton, Tooltip } from "@radix-ui/themes";
import { ReactCompareSlider, ReactCompareSliderImage, useReactCompareSliderRef } from "react-compare-slider";

// images
import canterosPodadosAfter from "/canteros-podados.png";
import canterosPodadosBefore from "/canteros-s_podar.png";
import parraPodadaAfter from "/parra-podada.png";
import parraPodadaBefore from "/parra-s_podar.png";
import veredaLimpiaAfter from "/vereda-limpia.png";
import veredaLimpiaBefore from "/vereda-sucia.png";

import bignoniaPodadaAfter from "/Bignonia-podada-1.png";
import bignoniaPodadaBefore from "/Bignonia-s_podar-1.png";
import vetiverPodadoAfter from "/vetiver-podado.png";
import vetiverPodadoBefore from "/vetiver-s_podar.png";
import bignoniaPodadaAfter2 from "/Bignonia-podad-2.png";
import bignoniaPodadaBefore2 from "/Bignonia-s_podar-2.png";

const imagePairs = [[canterosPodadosAfter, canterosPodadosBefore], [parraPodadaAfter, parraPodadaBefore], [veredaLimpiaAfter, veredaLimpiaBefore],
[bignoniaPodadaAfter, bignoniaPodadaBefore],
[vetiverPodadoAfter, vetiverPodadoBefore],
[bignoniaPodadaAfter2, bignoniaPodadaBefore2]];



// components
function CompareSliderImageWrapper({ time, children }: { time: "before" | "after"; children: ReactNode }) {
  return (
    <div className="relative h-full">
      <Badge
        color={time === "before" ? "tomato" : "green"}
        className="absolute left-2 top-2"
        size="2"
        variant="surface"
      >
        {time === "before" ? "Antes" : "Después"}
      </Badge>
      {children}
    </div>
  );
}

// utils
function generateWhatsAppLink() {
  const phone = "543442604355";
  const message = "Hola 👋, te quería consultar por los servicios de jardinería 🪴";

  return `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`;
}

// constants
const services = [
  { label: "Cortes de césped", icon: <GiHighGrass className="h-6 w-6" /> },
  { label: "Podas", icon: <GiGardeningShears className="h-6 w-6" /> },
  { label: "Limpieza de yuyos", icon: <GiGrass className="h-6 w-6" /> },
  { label: "Diseño de espacios verdes", icon: <GiBamboo className="h-6 w-6" /> },
  { label: "Mantenimiento de jardines", icon: <GiCycle className="h-6 w-6" /> },
  { label: "Asesoramiento para tus plantas", icon: <GiPlantWatering className="h-6 w-6" /> },
].map((service) => ({ ...service, id: nanoid() }));

const whatsappLink = generateWhatsAppLink();

export default function MyApp() {
  // react state hooks
  const [isAnimating, setIsAnimating] = useState(true);
  const [currentPairIndex, setCurrentPairIndex] = useState(0);

  // react ref hooks
  const animationCompletedRef = useRef<boolean>(false);
  const requestRef = useRef<number | null | undefined>();
  const startRef = useRef<number | null | undefined>(null);

  // react slider
  const reactCompareSliderRef = useReactCompareSliderRef();

  // handler
  function handleToggleAnimation(): void {
    setIsAnimating(!isAnimating);
  }

  // effects

  useEffect(() => {
    const duration = 8000;
    const startPosition = 100;
    const endPosition = 0;

    const animate: FrameRequestCallback = (timestamp) => {
      if (!startRef.current) {
        startRef.current = timestamp;
      }

      const elapsed = timestamp - startRef.current;
      const progress = elapsed / duration;

      if (progress >= 1) {
        // If a full cycle is completed
        animationCompletedRef.current = true;
        // setIsAnimating(false); // Stop the animation
        startRef.current = null; // Reset the start timestamp for the next cycle

        // Update to the next set of images
        setCurrentPairIndex((prevIndex) => (prevIndex + 1) % imagePairs.length);
      } else {
        const position = startPosition + (endPosition - startPosition) * Math.sin(progress * Math.PI);
        reactCompareSliderRef.current?.setPosition(position);
        requestRef.current = requestAnimationFrame(animate);
      }
    };

    if (isAnimating) {
      requestRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isAnimating, currentPairIndex]);

  // constants
  const imagePair = [imagePairs[currentPairIndex][0], imagePairs[currentPairIndex][1]]

  return (
    <main className="flex min-h-screen w-full items-center bg-[#004643] p-2 md:h-screen">
      <section className="container m-auto flex max-h-[720px] flex-col gap-4 lg:flex-row max-w-4xl" >
        <aside className="flex w-full flex-col justify-between gap-4 rounded-md bg-[#f0fdf4] p-3 lg:max-w-xs lg:gap-0">
          <header className="text-center">
            <h1 className="mb-1 text-5xl font-display">Jardinero Jara</h1>
            <h2 className="text-balance text-xs uppercase">Cuidado y Mantenimiento de Espacios Verdes</h2>
          </header>

          <div className="flex flex-col gap-2">
            {services.map((service) => (
              <Callout.Root key={service.id} variant="surface" size="1">
                <Callout.Icon>{service.icon}</Callout.Icon>
                <Callout.Text>{service.label}</Callout.Text>
              </Callout.Root>
            ))}
          </div>

          <Link href={whatsappLink} rel="noopener noreferrer" target="_blank" className="w-full">
            <Button size="4" className="w-full !cursor-pointer">
              <FaWhatsapp className="h-6 w-6" /> Contactar
            </Button>
          </Link>
        </aside>

        <article className="group relative rounded-md bg-[#f0fdf4] p-3">
          <ReactCompareSlider
            ref={reactCompareSliderRef}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "0.375rem",
            }}
            disabled={isAnimating}
            itemOne={
              <CompareSliderImageWrapper time="before">
                <ReactCompareSliderImage src={imagePair[1]} alt="Después" className="rounded-md" />
              </CompareSliderImageWrapper>
            }
            itemTwo={
              <CompareSliderImageWrapper time="after">
                <ReactCompareSliderImage src={imagePair[0]} alt="Antes" className="rounded-md" />
              </CompareSliderImageWrapper>
            }
          />

          {isAnimating ? null : (
            <div className="absolute bottom-4 left-0 right-0 text-center opacity-0 transition group-hover:opacity-100">
              <span className="bg-black p-1 text-xs text-white opacity-80">Movete con el slider</span>
            </div>
          )}

          <Tooltip
            content={
              isAnimating
                ? "Dale stop para moverte con el slider y ver el antes y después"
                : "Dale play para animar automáticamente el antes y después"
            }
          >
            <IconButton
              className="absolute bottom-5 right-5 !cursor-pointer"
              onClick={handleToggleAnimation}
              variant="surface"
              size="1"
            >
              {isAnimating ? <FaStop className="h-3 w-3" /> : <FaPlay className="h-3 w-3" />}
            </IconButton>
          </Tooltip>
        </article>
      </section>
    </main>
  );
}
