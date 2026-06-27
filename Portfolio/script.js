
emailjs.init("zHH8BZEj4l9U6nHo5");

let form = document.getElementById("contactForm");
let status = document.getElementById("status");

form.addEventListener("submit", function (event) {

    event.preventDefault();

    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let subject = document.getElementById("subject").value;
    let message = document.getElementById("message").value;

    let data = {
        from_name: name,
        from_email: email,
        subject: subject,
        message: message
    };

    emailjs.send("service_0zg3tib", "template_ls12nl5", data)

        .then(function () {

            status.innerHTML = "Message Sent Successfully!";
            status.style.color = "lightgreen";

            form.reset();
            window.location.href = "index.html";

        })

        .catch(function () {

            status.innerHTML = "Failed To Send Message!";
            status.style.color = "red";

        });

});
document.addEventListener('DOMContentLoaded', function () {

    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const mobileNav = document.getElementById('mobileNav');

    if (hamburgerBtn && mobileNav) {

        hamburgerBtn.addEventListener('click', function (e) {
            e.stopPropagation();

            const isOpen = mobileNav.classList.toggle('open');

            this.classList.toggle('active');
        });

        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function () {
                mobileNav.classList.remove('open');
                hamburgerBtn.classList.remove('active');
            });
        });

        document.addEventListener('click', function (event) {
            if (!mobileNav.contains(event.target) && !hamburgerBtn.contains(event.target)) {
                mobileNav.classList.remove('open');
                hamburgerBtn.classList.remove('active');
            }
        });
    }
});