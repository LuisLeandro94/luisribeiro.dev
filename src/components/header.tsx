import { Twirl as Hamburger } from "hamburger-react";
import { useState } from "react";

function Header({ setOpen, isOpen }: { setOpen: any, isOpen: boolean }) {
    return (
        <header>
            <h1 className="marcellus">LR</h1>
            <Hamburger toggled={isOpen} toggle={setOpen} />
        </header>
    )
}

export default Header;