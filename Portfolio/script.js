
  emailjs.init("zHH8BZEj4l9U6nHo5");

  let form = document.getElementById("contactForm");
  let status = document.getElementById("status");

  form.addEventListener("submit", function(event) {

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

    .then(function() {

      status.innerHTML = "Message Sent Successfully!";
      status.style.color = "lightgreen";

      form.reset();

    })

    .catch(function() {

      status.innerHTML = "Failed To Send Message!";
      status.style.color = "red";

    });

  });
