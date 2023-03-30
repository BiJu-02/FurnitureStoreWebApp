module.exports = () => {
	const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	const charactersLength = characters.length;
	let res = "";
	for (let i=0; i<64; i++) {
		res += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return res;
}