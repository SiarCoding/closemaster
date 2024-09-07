//import { CardBody, CardContainer, CardItem } from '@/components/global/3d-card'
import { HeroParallax } from '@/components/global/connect-parallax'
import { ContainerScroll } from '@/components/global/container-scroll-animation'
import { InfiniteMovingCards } from '@/components/global/infinite-moving-cards'
import { LampComponent } from '@/components/global/lamp'
import Navbar from '@/components/global/navbar'
import { CardBody, CardContainer, CardItem } from '@/components/ui/3d-card'
import { Button } from '@/components/ui/button'
import { clients, products} from '@/lib/constant'
import { CheckIcon } from 'lucide-react'
import Image from 'next/image'

export default function Home() {
  //WIP: remove fault IMAge for home page
  return (
    <main className="flex items-center justify-center flex-col">
      <Navbar />
      <section className="h-screen w-full  bg-neutral-950 rounded-md  !overflow-visible relative flex flex-col items-center  antialiased">
        <div className="absolute inset-0  h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_35%,#223_100%)]"></div>
        <div className="flex flex-col mt-[-100px] md:mt-[-50px]">
          <ContainerScroll
            titleComponent={
              <div className="flex items-center flex-col">
                <Button
                  size={'lg'}
                  className="p-8 mb-8 md:mb-0 text-2xl w-full sm:w-fit border-t-2 rounded-full border-[#4D4D4D] bg-[#1F1F1F] hover:bg-white group transition-all flex items-center justify-center gap-4 hover:shadow-xl hover:shadow-neutral-500 duration-500"
                >
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-neutral-500 to-neutral-600  md:text-center font-sans group-hover:bg-gradient-to-r group-hover:from-black goup-hover:to-black">
                    Teste 14 Tage kostenlos
                  </span>
                </Button>
                <h1 className="text-5xl md:text-8xl  bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-600 font-sans font-bold">
                  Verwandle deine Verkaufsgespräche in Abschlüsse
                </h1>
              </div>
            }
          />
        </div>
      </section>
      <InfiniteMovingCards
        className="md:mt-[18rem] mt-[150px]"
        items={clients}
        direction="right"
        speed="slow"
      />
      <section>
        <HeroParallax products={products}></HeroParallax>
      </section>
      <section className="mt-[50px]">
        <LampComponent />
        <div className="flex flex-wrap items-center justify-center flex-col md:flex-row gap-8 -mt-72">
          <CardContainer className='inter-var '>
          <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-neutral-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full md:!w-[350px] h-auto rounded-xl p-6 border">
          <CardItem
                translateZ="50"
                className="text-xl font-bold text-neutral-600 dark:text-white "
              >
                Starter
                <h2 className="text-4xl">19€/Monat</h2>
              </CardItem>
              <CardItem
                translateZ="60"
                className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
              >
                Ideal für kleine Teams oder Einzelunternehmer, die ihre ersten Vertriebsoptimierungen vornehmen möchten.
                <ul className="my-4 flex flex-col gap-2">
                  <li className="flex items-center gap-2">
                    <CheckIcon />3 Gesprächstranskription für bis zu 10 Stunden/Monat
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon />
                    KI-gestützte Gesprächszusammenfassungen GPT-4
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon />
                    1 Benutzerkonto
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon />
                    E-Mail-Support
                  </li>
                </ul>
              </CardItem>
              <div className="flex justify-between items-center mt-8">
                <CardItem
                  translateZ={20}
                  as="button"
                  className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white"
                >
                  Try now →
                </CardItem>
                <CardItem
                  translateZ={20}
                  as="button"
                  className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                >
                  Kostenlos testen
                </CardItem>
              </div>
            </CardBody>
          </CardContainer>
          <CardContainer className="inter-var ">
            <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-neutral-500/[0.1] dark:bg-black dark:border-[#E2CBFF] border-black/[0.1] w-full md:!w-[350px] h-auto rounded-xl p-6 border">
              <CardItem
                translateZ="50"
                className="text-xl font-bold text-neutral-600 dark:text-white "
              >
                Pro Plan
                <h2 className="text-4xl ">$49€/Monat</h2>
              </CardItem>
              <CardItem
                translateZ="60"
                className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
              >
                Geeignet für wachsende Vertriebsteams, die tiefergehende Analysen und Berichte benötigen.
                <ul className="my-4 flex flex-col gap-2">
                <li className="flex items-center gap-2">
                    <CheckIcon />Unbegrenzte Gesprächstranskription
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon /> Stimmungsanalyse und detaillierte Berichte GPT-4o
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon />
                    3 Benutzerkonten
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon />
                    Integration mit gängigen CRM-Systemen (Salesforce, HubSpot)
                  </li>
                </ul>
              </CardItem>
              <div className="flex justify-between items-center mt-8">
                <CardItem
                  translateZ={20}
                  as="button"
                  className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white"
                >
                  Try now →
                </CardItem>
                <CardItem
                  translateZ={20}
                  as="button"
                  className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                >
                  Jetzt Plan holen
                </CardItem>
              </div>
            </CardBody>
          </CardContainer>
          <CardContainer className="inter-var ">
            <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-neutral-500/[0.1] dark:bg-black dark:border-[#E2CBFF] border-black/[0.1] w-full md:!w-[350px] h-auto rounded-xl p-6 border">
              <CardItem
                translateZ="50"
                className="text-xl font-bold text-neutral-600 dark:text-white "
              >
                Enterprise Plan
                <h2 className="text-4xl ">$120€/Monat</h2>
              </CardItem>
              <CardItem
                translateZ="60"
                className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
              >
                Für große Teams und Unternehmen, die umfangreiche Anpassungen und tiefe Einblicke in ihre Vertriebsprozesse benötigen.
                <ul className="my-4 flex flex-col gap-2">
                <li className="flex items-center gap-2">
                    <CheckIcon />Unbegrenzte Gesprächstranskription
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon />Anpassbare Schlüsselwort- und Phrasenerkennung GPT-4o
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon />
                    Unbegrenzte Benutzerkonten
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon />
                     KI-basierte Vertriebsempfehlungen und Coaching
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon />
                    Automatisierte Follow-Up-Vorschläge
                  </li>
                </ul>
              </CardItem>
              <div className="flex justify-between items-center mt-8">
                <CardItem
                  translateZ={20}
                  as="button"
                  className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white"
                >
                  Try now →
                </CardItem>
                <CardItem
                  translateZ={20}
                  as="button"
                  className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                >
                  Jetzt Plan holen
                </CardItem>
              </div>
            </CardBody>
          </CardContainer>
        </div>
      </section>
    </main>
  )
}