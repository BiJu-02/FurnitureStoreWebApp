async function deleteKW(type, subType, idx) {
	if (!type || !subType || !idx) {
		alert("does not exist");
		return;
	}
	if (confirm(`confirm deletion`)) {
		const headerList = {
	        "Accept": "*/*",
	        "Content-Type": "application/json"
	    }
		const rawResp = await fetch("https://radiancekitchens.com/radapi/postDelKW", {
			method: "POST",
			headers: headerList,
			body: JSON.stringify({
				kwtype: type,
				kwsubtype: subType,
				kwidx: idx
			})
		});
		const resp = await rawResp.json();
		console.log(resp);
		if (resp.err) {
			console.log("errored");
			return;
		}
		window.location.reload();
	} else {}
}