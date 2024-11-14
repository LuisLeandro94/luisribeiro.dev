function NavigationMenu({ isOpen }: { isOpen: boolean }) {
    return (
        <div className={isOpen ? "show drawer marcellus" : "drawer marcellus"}>
            <a href="#">ABOUT</a>
            <a href="#">WORK</a>
            <a href="#">CONTACTS</a>
        </div>
    )
}

export default NavigationMenu;