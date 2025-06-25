/*!
* Start Bootstrap - Grayscale v7.0.6 (https://startbootstrap.com/theme/grayscale)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-grayscale/blob/master/LICENSE)
*/
//
// Scripts
// 

window.addEventListener('DOMContentLoaded', event => {

    // Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink')
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
        }

    };

    // Shrink the navbar 
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            rootMargin: '0px 0px -40%',
        });
    }

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

});

// Moje funkcje:

// Fetch API do obsługi galerii:
function project_show(file_name) {
    // Ścieżka bez localhost, aby działało na każdym serwerze, bez potrzeby ustawiania konkretnego:
    let path = "data/" + file_name + ".txt"
    
    // Można użyć tego (wstawić odpowiedni adres):
    /*let path = "http://localhost:63342/projekt/data/" + file_name + ".txt"*/
    fetch(path)
        .then(respnse => {
            return respnse.text();
        })
        .then(dane => {
            document.getElementById("project_categories").innerHTML = dane;
        })
    document.getElementById("project_categories").scrollIntoView({behavior: "smooth"});

}

// Magazyn danych:

var order_counter = localStorage.length;

function save_to_storage() {
    let order = {};
    order.name = document.getElementById("inputName").value;
    order.email = document.getElementById("inputEmail").value;
    let temp_phone = document.getElementById("phoneNumber").value;
    if (temp_phone.length > 0) {
        order.phone = temp_phone;
    } else {
        order.phone = "nie podano";
    }
    order.category = photo_cat;
    order.time = time_cat;
    order.use_p = use;

    localStorage.setItem(order_counter.toString(), JSON.stringify(order));
    order_counter++;
}

function show_storage_object(order_object) {
    return "<div class=\"text-white\"><br>Imię: " + order_object.name + "<br>Adres e-mail: " + order_object.email + "<br>Numer telefonu: " + order_object.phone + "<br>Kategoria: " + order_object.category + "<br>"+ order_object.time + "<br>Zdjęcia na użytek " + order_object.use_p + "</div>";
}

function show_storage() {
    let tresc = "";

    if (localStorage.length === 0) {
        tresc = "<h2 class=\"text-white mb-5\">Brak zamówień</h2><button class=\"btn btn-primary\" onClick=\"return_toForm()\">Wróć</button>";
    } else {
        tresc += "<h2 class=\"text-white mb-5\">Twoje zamówienia:</h2>";

        for (let i = 0; i < localStorage.length; i++) {
            tresc += "<div class=\"mt-5 mb-2\"><h3 class=\"text-white mb-1 mt-4\">Zamówienie " + (i + 1) + ":</h3>" + show_storage_object(JSON.parse(localStorage.getItem(i.toString()))) + "</div>"
        }

        tresc += "<div class='mt-5'><button class=\"btn btn-primary me-2\" onClick=\"reset_storage()\">Usuń zapisane</button><button class=\"btn btn-primary\" onClick=\"return_toForm()\">Wróć</button></div>"
    }

    document.getElementById("zgloszenia").innerHTML = tresc;
}

function return_toForm() {

    fetch("/data/return.txt")
        .then(respnse => {
            return respnse.text();
        })
        .then(dane => {
            document.getElementById("zgloszenia").innerHTML = dane;
        })
}

function reset_storage() {
    localStorage.clear()
    order_counter = 0;
}

// Walidacja formularza:

var photo_cat = "";
var time_cat = "";
var use = "";

function check_field(field_id, patternRegEx) {
    return patternRegEx.test(document.getElementById(field_id).value);
}

function check_select(select_id) {
    let object = document.getElementById(select_id);
    photo_cat = object[object.selectedIndex].value;
    return object.selectedIndex !== 0;
}

function check_radio(radio_name) {
    let object = document.getElementsByName(radio_name);
    for (let i = 0; i < object.length; i++) {
        if (object[i].checked) {
            use = object[i].value;
            return true;
        }
    }
    return false;
}

function check_checkbox(checkbox_id) {
    let object = document.getElementsByName(checkbox_id);
    let ok = false;
    if (object[0].checked && object[1].checked) {
        ok = true;
        time_cat = "Zdjęcia w dzień i w nocy";
    } else {
        if (object[0].checked) {
            time_cat = "Zdjęcia w dzień";
            ok = true;
        } else if (object[1].checked) {
            time_cat = "Zdjęcia w nocy";
            ok = true;
        }
    }
    return ok;
}

function check_form() {
    let nameRegex = /^[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+$/;
    let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let phoneRegex = /^(\+48\s?)?(\d{3}[\s-]?\d{3}[\s-]?\d{3})$/;

    let ok = true;
    if (!check_field("inputName", nameRegex)) {
        ok = false;
        document.getElementById("nameError").innerHTML = "Wprowadź poprawne imię";
        $("#nameError").addClass("bg-light");
    } else {
        document.getElementById("nameError").innerHTML = ""
        $("#nameError").removeClass("bg-light");

    }

    if (!check_field("inputEmail", emailRegex)) {
        ok = false;
        document.getElementById("emailError").innerHTML = "Wprowadź poprawny adres e-mail";
        $("#emailError").addClass("bg-light");
    } else {
        document.getElementById("emailError").innerHTML = "";
        $("#emailError").removeClass("bg-light");

    }

    if (document.getElementById("phoneNumber").value.length > 0) {
        if (!check_field("phoneNumber", phoneRegex)) {
            ok = false;
            document.getElementById("phoneError").innerHTML = "Wprowadź poprawny numer telefonu (akceptowane różne formaty)";
            $("#phoneError").addClass("bg-light");
        } else {
            document.getElementById("phoneError").innerHTML = "";
            $("#phoneError").removeClass("bg-light");

        }
    } else {
        document.getElementById("phoneError").innerHTML = "";
        $("#phoneError").removeClass("bg-light");
    }

    if (!check_checkbox("checkbox_daynight")) {
        ok = false;
        document.getElementById("boxError").innerHTML = "Wybierz opcje z powyższych";
        $("#boxError").addClass("bg-light");
    } else {
        document.getElementById("boxError").innerHTML = "";
        $("#boxError").removeClass("bg-light");

    }

    if (!check_select("inputCat")) {
        ok = false;
        document.getElementById("catError").innerHTML = "Wybierz kategorię"
        $("#catError").addClass("bg-light");
    } else {
        document.getElementById("catError").innerHTML = "";
        $("#catError").removeClass("bg-light");
    }

    if (!check_radio("radio")) {
        ok = false;
        document.getElementById("radioError").innerHTML = "Wybierz jedno z powyższych"
        $("#radioError").addClass("bg-light");
    } else {
        document.getElementById("radioError").innerHTML = "";
        $("#radioError").removeClass("bg-light");
    }


    if (ok) {
        let info = "Twój formularz:\n\nImię: " + document.getElementById("inputName").value + "\nAdres e-mail: " + document.getElementById("inputEmail").value;

        if (document.getElementById("phoneNumber").value.length > 0) info += "\nNumer telefonu:  " + document.getElementById("phoneNumber").value;

        info += "\nKategoria: " + photo_cat + "\n" + time_cat + "\nZdjęcia na użytek " + use;
        save_to_storage();
        return (window.confirm(info));
    } else return false;


}

