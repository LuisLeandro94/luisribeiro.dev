import Typewriter from "typewriter-effect";

const About = ({ isOpen, }: { isOpen: boolean, }) => {
    return (
        <div className='about'>
            <div className={isOpen ? "move-left left-side wrapper" : "left-side wrapper"}>
                <div className='left-side-inner'>
                    <h2 className='marcellus'>I'm Luis Ribeiro</h2>
                    <Typewriter options={{
                        strings: ['I am a software engineer', 'I write code', "I make your ideas come to life"],
                        autoStart: true,
                        loop: true,
                    }} />
                    <p>I am a Frontend Developer for VFX Financial and freelance software engineer.</p>
                    <p>I develop and design unique and beautiful solutions.</p>
                </div>
            </div>
            <div className={isOpen ? "move-left right-side wrapper" : "right-side wrapper"}>
            </div>
        </div>
    );
}

export default About;