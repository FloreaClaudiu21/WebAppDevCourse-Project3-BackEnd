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
