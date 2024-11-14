import { FaGithub, FaLinkedin } from "react-icons/fa";

function Sidebar({ isOpen }: { isOpen: boolean }) {
    return (
        <section className={isOpen ? "sidebar move-left" : "sidebar"}>
            <a href="https://www.github.com/luisleandro94" target="_blank" rel="noreferrer noopener">
                <FaGithub className="icon" />
            </a>
            <a href="https://www.linkedin.com/in/luisleandro94" target="_blank" rel="noreferrer noopener">
                <FaLinkedin className="icon" />
            </a>
            <span className="spacer" />
            <p>Socials</p>
        </section>
    )
}

export default Sidebar;