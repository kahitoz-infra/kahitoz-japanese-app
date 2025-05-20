import Image from "next/image";

export default function Navbar() {
    return(
        <nav className={'w-full fixed bottom-0 left-0'}>
            <ul className={'flex border-t-2 border-cyan-300 w-full items-center justify-between p-2'}>
                <li className={'flex flex-col items-center justify-between'}>
                    <Image src={'icons/home.svg'} alt={'home'} width={30} height={30} />
                    <p>Home</p>
                </li>
                <li className={'flex flex-col items-center justify-between'}>
                    <Image src={'icons/ai.svg'} alt={'home'} width={30} height={30} />
                    <p>Chat</p>
                </li>
                <li className={'flex flex-col items-center justify-between'}>
                    <Image src={'icons/streak.svg'} alt={'home'} width={30} height={30} />
                    <p>Streak</p>
                </li>
                <li className={'flex flex-col items-center justify-between'}>
                    <Image src={'icons/profile.svg'} alt={'home'} width={30} height={30} />
                    <p>Profile</p>
                </li>

            </ul>
        </nav>
    )
}