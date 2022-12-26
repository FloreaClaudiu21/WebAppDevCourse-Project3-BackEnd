let forms = document.getElementsByTagName("form");
for (let index = 0; index < forms.length; index++) {
	let form = forms[index];
	form.onkeydown = function (e) {
		let key = e.charCode || e.keyCode || 0;
		if (key == 13) {
			e.preventDefault();
		}
	};
}

const delete_profile_img = () => {
	let respond = confirm("Are you sure you wanna delete your profile image?");
	if (respond) {
		fetch("/myaccount?deleteimg=true", { method: "POST" });
	}
	return;
};

const change_profile_img = () => {
	const imgel = document.getElementById("form_file");
	let imageFiles = imgel.files;
	const imageFilesLength = imageFiles.length;
	if (imageFilesLength > 0) {
		const imageSrc = URL.createObjectURL(imageFiles[0]);
		const imagePreviewElement = document.querySelector("#profile_img");
		imagePreviewElement.src = imageSrc;
		imagePreviewElement.style.display = "block";
	}
	return;
};
// SCROLL UPDATE PROGRESS BAR
const header = document.querySelector("#hero");
const p_bar = document.querySelector(".p_bar");
const main = document.querySelector(".mainpage__wrapper");
window.onscroll = () => {
	const height = main.scrollHeight - header.clientHeight;
	const top = window.scrollY - window.screenTop - header.clientHeight;
	let progress = Math.round((top / height) * 100);
	if (progress < 0) {
		progress = 0;
	} else if (progress > 95) {
		progress = 100;
	}
	p_bar.setAttribute("style", `width: ${progress}%`);
};
// SCROLL DETECT BAND BOX
const observer = new IntersectionObserver(onIntersection, {
	root: null,
	rootMargin: "-350px",
	threshold: 0,
});
let new_entry;
function onIntersection(entries, opts) {
	entries.forEach((entry) => {
		const cl = entry.target;
		if (entry.isIntersecting) {
			new_entry = cl;
		}
	});
	if (new_entry === undefined) {
		return;
	}
	const nav = document.querySelector(".horizontal__wrapper");
	if (new_entry.id.includes("hero")) {
		nav.classList.add("horizontal_hide");
	} else if (new_entry.id.includes("whats")) {
		nav.classList.remove("horizontal_hide");
	}
	const links = document.querySelectorAll(".nav_link");
	for (let i = 0; i < links.length; i++) {
		const kid = links[i];
		const href = kid.getAttribute("href");
		if (
			!href.includes(new_entry.id) &&
			kid.classList.contains("show_box_name")
		) {
			kid.classList.remove("show_box_name");
			kid.parentElement.style.backgroundColor = "";
		}
		if (
			href.includes(new_entry.id) &&
			!kid.classList.contains("show_box_name")
		) {
			kid.classList.add("show_box_name");
			kid.parentElement.style.backgroundColor = kid.style.color;
		}
	}
}
const el = document.getElementsByClassName("rock_band");
for (let i = 0; i < el.length; i++) {
	observer.observe(el[i]);
}
observer.observe(document.querySelector(".hero__wrapper"));
observer.observe(document.querySelector(".rock_info"));
observer.observe(document.querySelector(".feedback__wrapper"));

const open_navigation = () => {
	let nav_el = document.querySelector(".mobilenav__wrapper");
	let menu_el = document.querySelector(".mobilenav_container");
	/////////////////////////////////////////////////////////////
	nav_el.classList.add("mobilenav__wrapper-open");
	setTimeout(() => {
		menu_el.classList.add("mobilenav_container-open");
	}, 100);
	return;
};
const close_navigation = () => {
	let nav_el = document.querySelector(".mobilenav__wrapper");
	let bg_btn = document.getElementById("menuburger");
	let menu_el = document.querySelector(".mobilenav_container");
	menu_el.classList.remove("mobilenav_container-open");
	setTimeout(() => {
		nav_el.classList.remove("mobilenav__wrapper-open");
		bg_btn.classList.remove("burger-opened");
	}, 500);
	return;
};

const moblinenav_links = document.querySelectorAll(".mobnav_link");
moblinenav_links.forEach(el => el.addEventListener("click", close_navigation));