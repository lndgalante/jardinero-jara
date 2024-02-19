

import { nanoid } from "nanoid";
import { FaWhatsapp } from "react-icons/fa";
import { ReactNode, useRef, useEffect, useState } from "react";
import { GiBamboo, GiCycle, GiGardeningShears, GiGrass, GiHighGrass, GiPauseButton, GiPlantWatering, GiPlayButton } from "react-icons/gi";

import { Button, Badge, Callout, Link, IconButton, Tooltip } from "@radix-ui/themes";
import { ReactCompareSlider, ReactCompareSliderImage, useReactCompareSliderRef } from "react-compare-slider";

// images
import sampleOneAfter from './assets/sample-1-after.webp'
import sampleOneBefore from './assets/sample-1-before.webp'

function CompareSliderImageWrapper({ time, children }: { time: 'before' | 'after', children: ReactNode }) {
  return (
    <div className="relative h-full">
      <Badge color={time === 'before' ? 'tomato' : 'green'} className="absolute top-2 left-2" size="2" variant="surface">
        {time === 'before' ? 'Antes' : 'Después'}
      </Badge>
      {children}
    </div>
  );
}

// constants
const services = [
  { label: 'Cortes de césped', icon: <GiHighGrass className="w-6 h-6" /> },
  { label: 'Podas', icon: <GiGardeningShears className="w-6 h-6" /> },
  { label: 'Limpieza de yuyos', icon: <GiGrass className="w-6 h-6" /> },
  { label: 'Diseño de espacios verdes', icon: <GiBamboo className="w-6 h-6" /> },
  { label: 'Mantenimiento de jardines', icon: <GiCycle className="w-6 h-6" /> },
  { label: 'Asesoramiento para tus plantas', icon: <GiPlantWatering className="w-6 h-6" /> },
].map(service => ({ ...service, id: nanoid() }))

// utils
function generateWhatsAppLink() {
  const phone = '543442604355'
  const message = 'Hola 👋, te quería consultar por los servicios de jardinería 🪴'

  return `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`

}

const whatsappLink = generateWhatsAppLink()

export default function MyApp() {
  const requestRef = useRef<number | null | undefined>();
  const startRef = useRef<number | null | undefined>(null);
  const [isAnimating, setIsAnimating] = useState(true);

  const reactCompareSliderRef = useReactCompareSliderRef();

  const toggleAnimation = () => {
    setIsAnimating(!isAnimating)
  };

  useEffect(() => {
    const duration = 8000;
    const startPosition = 100;
    const endPosition = 0;

    const animate: FrameRequestCallback = (timestamp) => {
      if (!isAnimating) {
        startRef.current = null;
        return;
      }

      if (startRef.current === null) {
        startRef.current = timestamp;
      }

      const progress = (timestamp - (startRef.current ?? 0)) / duration;
      const position = startPosition + (endPosition - startPosition) * Math.sin(progress * Math.PI);

      reactCompareSliderRef.current?.setPosition(position);

      if (progress < 1) {
        requestRef.current = requestAnimationFrame(animate);
      } else {
        startRef.current = null;
        requestRef.current = requestAnimationFrame(animate);
      }
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isAnimating]);

  return (
    <main className="min-h-screen md:h-screen w-full p-2 bg-green-950 flex items-center">
      <section className="container flex flex-col lg:flex-row gap-4 m-auto max-h-[720px]">
        <aside className="w-full lg:max-w-xs gap-4 lg:gap-0 flex flex-col justify-between bg-green-50 p-3 rounded-md">
          <header className="text-center">
            <h1 className="text-4xl mb-1">Jardinero Jara</h1>
            <h2 className="text-sm uppercase text-balance">Cuidado y Mantenimiento de Espacios Verdes</h2>
          </header>

          <div className="flex flex-col gap-2">
            {services.map(service => (
              <Callout.Root key={service.id} variant="surface" size="1">
                <Callout.Icon>
                  {service.icon}
                </Callout.Icon>
                <Callout.Text>
                  {service.label}
                </Callout.Text>
              </Callout.Root>
            ))}
          </div>

          <Link href={whatsappLink} rel="noopener noreferrer" target="_blank" className="w-full" >
            <Button size="4" className="w-full !cursor-pointer">
              <FaWhatsapp className="w-6 h-6" /> Contactar
            </Button>
          </Link>
        </aside>

        <article className="bg-green-50 p-3 rounded-md relative">
          <ReactCompareSlider
            ref={reactCompareSliderRef}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '0.375rem',
            }}
            disabled={isAnimating}
            itemOne={
              <CompareSliderImageWrapper time="before">
                <ReactCompareSliderImage src={sampleOneBefore} alt="Antes" className="rounded-md" />
              </CompareSliderImageWrapper>
            }
            itemTwo={
              <CompareSliderImageWrapper time="after">
                <ReactCompareSliderImage src={sampleOneAfter} alt="Después" className="rounded-md" />
              </CompareSliderImageWrapper>
            }
          />

          <Tooltip content={isAnimating ? 'Dale stop para moverte con el slider y ver el antes y después' : 'Dale play para animar automáticamente el antes y después'}>
            <IconButton className="absolute bottom-6 right-6 !cursor-pointer" onClick={toggleAnimation} variant="surface">
              {isAnimating ? <GiPauseButton className="w-4 h-4" /> : <GiPlayButton className="w-4 h-4" />}
            </IconButton>
          </Tooltip>
        </article>
      </section>
    </main>
  );
}
