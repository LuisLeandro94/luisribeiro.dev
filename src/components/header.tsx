import { Twirl as Hamburger } from "hamburger-react";
import { useState } from "react";

function Header({ setOpen, isOpen }: { setOpen: any, isOpen: boolean }) {
    return (
        <header>
            <a href="#" className="marcellus">LR</a>
            <Hamburger toggled={isOpen} toggle={setOpen} />
        </header>
    )
}

export default Header;