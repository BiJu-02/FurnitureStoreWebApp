function preventBack() {
    window.history.forward(); 
}
  
setTimeout("preventBack()", 0);
  
window.onunload = function () { null };


async function submitLoginInfo() {

	const paswd = document.getElementById("password").value;
	const bodyContent = JSON.stringify({
		pass: paswd,
		remember: document.getElementById("remember").checked
	});
	try {
		const headerList = {
			"Accept": "*/*",
			"Content-Type": "application/json"
		}
		const rawResp = await fetch("https://radiancekitchens.com/radapi/postLoginInfo", {
			method: "POST",
			body: bodyContent,
			headers: headerList
		});

		const resp = await rawResp.json();
		console.log(resp.data);

		if (resp.data == "passed") {
			window.location = "https://radiancekitchens.com/radapi/adminHome";
		} else {
			alert("wrong password");
		}

	} catch (err) {
		console.log(err);
	}
}