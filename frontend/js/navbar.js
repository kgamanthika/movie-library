document.addEventListener("DOMContentLoaded", () => {
    initializeNavbar();
});


function initializeNavbar() {

    const menuToggle =
        document.getElementById("menuToggle");

    const mobileNavigation =
        document.getElementById("mobileNavigation");


    // Stop if elements don't exist
    if (!menuToggle || !mobileNavigation) {
        return;
    }


    menuToggle.addEventListener("click", () => {

        const isOpen =
            mobileNavigation.classList.toggle("active");


        menuToggle.setAttribute(
            "aria-expanded",
            String(isOpen)
        );


        menuToggle.setAttribute(
            "aria-label",
            isOpen
                ? "Close navigation menu"
                : "Open navigation menu"
        );

    });


    // Close menu after clicking a navigation link

    const navigationLinks =
        mobileNavigation.querySelectorAll("a");


    navigationLinks.forEach(link => {

        link.addEventListener("click", () => {

            mobileNavigation.classList.remove("active");

            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

            menuToggle.setAttribute(
                "aria-label",
                "Open navigation menu"
            );

        });

    });

}