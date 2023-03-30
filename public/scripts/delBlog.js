async function deleteBlog(bId, bHead) {
	if (confirm(`do you want to delete ${bHead}`)) {
		const headerList = {
	        "Accept": "*/*",
	        "Content-Type": "application/json"
	    }
		const rawResp = await fetch("https://radiancekitchens.com/radapi/postDelBlog", {
			method: "POST",
			headers: headerList,
			body: JSON.stringify({Id: bId})
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