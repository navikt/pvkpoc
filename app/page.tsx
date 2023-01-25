import Link from "next/link";

export default function Home() {
  return (
    <div className="flex w-screen h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-limegreen-700">
      <Link href="/pvk" 
        className="chill
                   transition
                   h-96 w-96
                   flex items-center justify-center
                   border-4
                   bg-transparent hover:bg-surface-inverted focus:bg-surface-inverted focus-visible:bg-surface-inverted
                   border-transparent hover:border-border-action focus:border-border-action focus-visible:border-border-action">
        <p className="text-5xl font-bold
                      text-transparent
                      bg-gradient-to-t bg-clip-text
                      from-orange-600 via-blue-700 to-blue-300 tracking-normal">
          pvk/poc
        </p>
      </Link>
    </div>
  )
}
