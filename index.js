const express = require('express');
const cors = require('cors');
const { searchRouter } = require('./routes');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const argv = yargs(hideBin(process.argv)).argv;

const app = express();
const port = argv.port || 3000;

app.use(cors());

app.get('/deezer/*', async (req, res) => {
	try {
		const deezerApiUrl = `https://api.deezer.com${req.path.replace('/deezer', '')}`;
		const queryParams = new URLSearchParams(req.query).toString();
		const response = await fetch(`${deezerApiUrl}?${queryParams}`);
		const data = await response.json();
		res.json(data);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

app.get('/oauth', async (req, res) => {
	if (req.query.code.trim().length > 0) {
		const response = await fetch('https://connect.deezer.com/oauth/access_token.php?app_id=618944&secret=35a5f3077061e414bfac3b06ec1c31d6&output=json&code=' + req.query.code).then(res => res.text());
		if (response != "wrong code")
			res.json(JSON.parse(response));
		else res.json({ error: response });
	}
	else
		res.json({ error: "There is no grant code in your request" });
})

app.use('/search', searchRouter);

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
